import { afterEach, describe, expect, it, vi } from 'vitest'
import { streamChat } from './sse'

function sseResponse(frames: string[]): Response {
  const stream = new ReadableStream<Uint8Array>({
    start(controller) {
      const encoder = new TextEncoder()
      for (const frame of frames) controller.enqueue(encoder.encode(frame))
      controller.close()
    },
  })
  return new Response(stream, { status: 200 })
}

afterEach(() => {
  vi.unstubAllGlobals()
})

describe('streamChat', () => {
  it('dispatches SSE events to callbacks', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue(
        sseResponse([
          'event: delta\ndata: {"type":"delta","channel":"reasoning","text":"hmm"}\n\n',
          'event: delta\ndata: {"type":"delta","channel":"answer","text":"Hi"}\n\n',
          'event: usage\ndata: {"type":"usage","usage":{"inputTokens":3,"outputTokens":2}}\n\n',
          'event: done\ndata: {"type":"done","messageId":"msg_1"}\n\n',
        ]),
      ),
    )

    const deltas: string[] = []
    let done: string | undefined
    await streamChat(
      'conv_1',
      { content: 'hello' },
      {
        onDelta: (channel, text) => deltas.push(`${channel}:${text}`),
        onUsage: () => undefined,
        onDone: (messageId) => {
          done = messageId
        },
      },
    ).promise

    expect(deltas).toEqual(['reasoning:hmm', 'answer:Hi'])
    expect(done).toBe('msg_1')

    const [path, init] = vi.mocked(fetch).mock.calls[0] as [string, RequestInit]
    expect(path).toBe('/api/conversations/conv_1/stream')
    expect(init.method).toBe('POST')
    expect(JSON.parse(init.body as string)).toEqual({ content: 'hello' })
  })

  it('sends regenerate mode without content', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue(
        sseResponse(['event: done\ndata: {"type":"done","messageId":"msg_2"}\n\n']),
      ),
    )

    let done: string | undefined
    await streamChat('conv_1', { mode: 'regenerate' }, {
      onDelta: () => undefined,
      onDone: (messageId) => {
        done = messageId
      },
    }).promise

    expect(done).toBe('msg_2')
    const [, init] = vi.mocked(fetch).mock.calls[0] as [string, RequestInit]
    expect(JSON.parse(init.body as string)).toEqual({ mode: 'regenerate' })
  })

  it('reports non-OK responses through onError', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue(new Response(JSON.stringify({ error: 'Provider Groq is not configured', code: 'missing_key' }), { status: 503 })),
    )

    let failure: { code: string; message: string } | undefined
    await streamChat('conv_1', { content: 'hello' }, {
      onDelta: () => undefined,
      onError: (code, message) => {
        failure = { code, message }
      },
    }).promise

    expect(failure?.code).toBe('missing_key')
    expect(failure?.message).toContain('not configured')
  })

  it('surfaces aborts as rejections the caller can catch', async () => {
    const controller = new AbortController()
    vi.stubGlobal(
      'fetch',
      vi.fn().mockImplementation((_path: string, _init: RequestInit) => {
        controller.abort()
        return Promise.reject(new DOMException('Aborted', 'AbortError'))
      }),
    )

    const handle = streamChat('conv_1', { content: 'hello' }, { onDelta: () => undefined })
    await expect(handle.promise).rejects.toThrow()
  })
})
