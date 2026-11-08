import { afterEach, describe, expect, it, vi } from 'vitest'
import { createAnthropicAdapter } from './anthropic'

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

function frame(event: string, payload: Record<string, unknown>): string {
  return `event: ${event}\ndata: ${JSON.stringify(payload)}\n\n`
}

const baseRequest = {
  externalModelId: 'claude-haiku-5-5',
  messages: [
    { role: 'system' as const, content: 'You are Nexora.' },
    { role: 'user' as const, content: 'hello' },
  ],
  temperature: 0.7,
  maxOutputTokens: 1024,
  topP: 1,
}

afterEach(() => {
  vi.unstubAllGlobals()
})

describe('createAnthropicAdapter', () => {
  it('maps system messages to the top-level system param and omits sampling params', async () => {
    const fetchMock = vi.fn().mockResolvedValue(sseResponse([frame('message_stop', { type: 'message_stop' })]))
    vi.stubGlobal('fetch', fetchMock)

    const adapter = createAnthropicAdapter({ baseUrl: 'https://api.example.com', apiKey: 'k', timeoutMs: 5000 })
    for await (const _ of adapter.stream(baseRequest)) {
      void _
    }

    const [url, init] = fetchMock.mock.calls[0]
    expect(url).toBe('https://api.example.com/v1/messages')
    expect(init.headers['x-api-key']).toBe('k')
    expect(init.headers['anthropic-version']).toBe('2023-06-01')
    const body = JSON.parse(init.body)
    expect(body.system).toBe('You are Nexora.')
    expect(body.messages).toEqual([{ role: 'user', content: 'hello' }])
    expect(body.max_tokens).toBe(1024)
    expect(body.stream).toBe(true)
    expect(body).not.toHaveProperty('temperature')
    expect(body).not.toHaveProperty('top_p')
  })

  it('streams answer deltas, thinking deltas and usage', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue(
        sseResponse([
          frame('message_start', { type: 'message_start', message: { usage: { input_tokens: 25, output_tokens: 1 } } }),
          frame('content_block_delta', { type: 'content_block_delta', delta: { type: 'thinking_delta', thinking: 'hmm' } }),
          frame('content_block_delta', { type: 'content_block_delta', delta: { type: 'text_delta', text: 'Hi' } }),
          frame('content_block_delta', { type: 'content_block_delta', delta: { type: 'text_delta', text: ' there' } }),
          frame('message_delta', { type: 'message_delta', delta: { stop_reason: 'end_turn' }, usage: { output_tokens: 15 } }),
          frame('message_stop', { type: 'message_stop' }),
        ]),
      ),
    )

    const adapter = createAnthropicAdapter({ baseUrl: 'https://api.example.com', apiKey: 'k', timeoutMs: 5000 })
    const events = []
    for await (const event of adapter.stream(baseRequest)) events.push(event)

    expect(events).toEqual([
      { type: 'delta', channel: 'reasoning', text: 'hmm' },
      { type: 'delta', channel: 'answer', text: 'Hi' },
      { type: 'delta', channel: 'answer', text: ' there' },
      { type: 'usage', usage: { inputTokens: 25, outputTokens: 15, reasoningTokens: undefined } },
    ])
  })

  it('handles frames split across chunk boundaries', async () => {
    const encoder = new TextEncoder()
    const whole = frame('content_block_delta', { type: 'content_block_delta', delta: { type: 'text_delta', text: 'he' } })
    const stream = new ReadableStream<Uint8Array>({
      start(controller) {
        controller.enqueue(encoder.encode(whole.slice(0, 15)))
        controller.enqueue(encoder.encode(whole.slice(15)))
        controller.enqueue(encoder.encode(frame('content_block_delta', { type: 'content_block_delta', delta: { type: 'text_delta', text: 'llo' } })))
        controller.close()
      },
    })
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue(new Response(stream, { status: 200 })))

    const adapter = createAnthropicAdapter({ baseUrl: 'https://api.example.com', apiKey: 'k', timeoutMs: 5000 })
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
      vi.fn().mockResolvedValue(
        new Response(JSON.stringify({ type: 'error', error: { type: 'authentication_error', message: 'invalid x-api-key' } }), { status: 401 }),
      ),
    )

    const adapter = createAnthropicAdapter({ baseUrl: 'https://api.example.com', apiKey: 'bad', timeoutMs: 5000 })
    await expect(async () => {
      for await (const _ of adapter.stream(baseRequest)) {
        void _
      }
    }).rejects.toMatchObject({ code: 'invalid_key', message: expect.stringContaining('invalid x-api-key') })
  })

  it('maps mid-stream overloaded errors to capacity', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue(
        sseResponse([frame('error', { type: 'error', error: { type: 'overloaded_error', message: 'Overloaded' } })]),
      ),
    )

    const adapter = createAnthropicAdapter({ baseUrl: 'https://api.example.com', apiKey: 'k', timeoutMs: 5000 })
    await expect(async () => {
      for await (const _ of adapter.stream(baseRequest)) {
        void _
      }
    }).rejects.toMatchObject({ code: 'capacity' })
  })
})
