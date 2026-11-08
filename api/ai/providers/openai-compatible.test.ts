import { afterEach, describe, expect, it, vi } from 'vitest'
import { createOpenAiCompatibleAdapter } from './openai-compatible'
import { AiError } from '../errors'

function sseResponse(frames: string[], init?: ResponseInit): Response {
  const stream = new ReadableStream<Uint8Array>({
    start(controller) {
      const encoder = new TextEncoder()
      for (const frame of frames) controller.enqueue(encoder.encode(frame))
      controller.close()
    },
  })
  return new Response(stream, { status: 200, ...init })
}

function chunk(payload: Record<string, unknown>): string {
  return `data: ${JSON.stringify(payload)}\n\n`
}

const baseRequest = {
  externalModelId: 'openai/gpt-oss-120b',
  messages: [{ role: 'user' as const, content: 'hello' }],
  temperature: 0.7,
  maxOutputTokens: 1024,
  topP: 1,
}

afterEach(() => {
  vi.unstubAllGlobals()
})

describe('createOpenAiCompatibleAdapter', () => {
  it('streams answer deltas, reasoning deltas and usage', async () => {
    const fetchMock = vi.fn().mockResolvedValue(
      sseResponse([
        chunk({ choices: [{ delta: { reasoning: 'thinking' } }] }),
        chunk({ choices: [{ delta: { content: 'Hi' } }] }),
        chunk({ choices: [{ delta: { content: ' there' } }] }),
        chunk({
          choices: [{ delta: {} }],
          usage: { prompt_tokens: 12, completion_tokens: 5, completion_tokens_details: { reasoning_tokens: 2 } },
        }),
        'data: [DONE]\n\n',
      ]),
    )
    vi.stubGlobal('fetch', fetchMock)

    const adapter = createOpenAiCompatibleAdapter({ baseUrl: 'https://api.example.com/v1', apiKey: 'k', timeoutMs: 5000 })
    const events = []
    for await (const event of adapter.stream(baseRequest)) events.push(event)

    expect(events).toEqual([
      { type: 'delta', channel: 'reasoning', text: 'thinking' },
      { type: 'delta', channel: 'answer', text: 'Hi' },
      { type: 'delta', channel: 'answer', text: ' there' },
      { type: 'usage', usage: { inputTokens: 12, outputTokens: 5, reasoningTokens: 2 } },
    ])

    const [, init] = fetchMock.mock.calls[0]
    expect(init.headers.Authorization).toBe('Bearer k')
    expect(init.body).toContain('"stream":true')
    expect(init.body).toContain('"max_completion_tokens":1024')
  })

  it('handles frames split across chunk boundaries', async () => {
    const encoder = new TextEncoder()
    const stream = new ReadableStream<Uint8Array>({
      start(controller) {
        controller.enqueue(encoder.encode(chunk({ choices: [{ delta: { content: 'he' } }] }).slice(0, 10)))
        controller.enqueue(encoder.encode(chunk({ choices: [{ delta: { content: 'he' } }] }).slice(10)))
        controller.enqueue(encoder.encode(chunk({ choices: [{ delta: { content: 'llo' } }] })))
        controller.close()
      },
    })
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue(new Response(stream, { status: 200 })))

    const adapter = createOpenAiCompatibleAdapter({ baseUrl: 'https://api.example.com/v1', apiKey: 'k', timeoutMs: 5000 })
    const events = []
    for await (const event of adapter.stream(baseRequest)) events.push(event)

    expect(events).toEqual([
      { type: 'delta', channel: 'answer', text: 'he' },
      { type: 'delta', channel: 'answer', text: 'llo' },
    ])
  })

  it('maps HTTP 401 to invalid_key with provider detail', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue(new Response(JSON.stringify({ error: { message: 'invalid api key' } }), { status: 401 })),
    )

    const adapter = createOpenAiCompatibleAdapter({ baseUrl: 'https://api.example.com/v1', apiKey: 'bad', timeoutMs: 5000 })
    await expect(async () => {
      for await (const _ of adapter.stream(baseRequest)) {
        void _
      }
    }).rejects.toMatchObject({ code: 'invalid_key', message: expect.stringContaining('invalid api key') })
  })

  it('maps fetch TypeError to network', async () => {
    vi.stubGlobal('fetch', vi.fn().mockRejectedValue(new TypeError('fetch failed')))
    const adapter = createOpenAiCompatibleAdapter({ baseUrl: 'https://api.example.com/v1', apiKey: 'k', timeoutMs: 5000 })

    let caught: unknown
    try {
      for await (const _ of adapter.stream(baseRequest)) {
        void _
      }
    } catch (err) {
      caught = err
    }
    expect(caught).toBeInstanceOf(AiError)
    expect((caught as AiError).code).toBe('network')
  })
})
