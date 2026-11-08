import { afterEach, describe, expect, it, vi } from 'vitest'
import { createOpenAiSpeechAdapter } from './speech'

afterEach(() => {
  vi.unstubAllGlobals()
})

describe('createOpenAiSpeechAdapter', () => {
  it('posts the speech request and returns audio bytes with mime type', async () => {
    const audioBytes = new Uint8Array([82, 73, 70, 70, 1, 2, 3, 4])
    const fetchMock = vi.fn().mockResolvedValue(
      new Response(audioBytes.buffer as ArrayBuffer, { status: 200, headers: { 'Content-Type': 'audio/wav' } }),
    )
    vi.stubGlobal('fetch', fetchMock)

    const adapter = createOpenAiSpeechAdapter({ baseUrl: 'https://api.example.com/v1', apiKey: 'k', timeoutMs: 5000 })
    const result = await adapter.speak({ externalModelId: 'canopylabs/orpheus-v1-english', input: 'hello there', voice: 'tara' })

    expect(result.mimeType).toBe('audio/wav')
    expect(Array.from(result.audio)).toEqual([82, 73, 70, 70, 1, 2, 3, 4])

    const [url, init] = fetchMock.mock.calls[0]
    expect(url).toBe('https://api.example.com/v1/audio/speech')
    expect(init.headers.Authorization).toBe('Bearer k')
    expect(JSON.parse(init.body)).toEqual({
      model: 'canopylabs/orpheus-v1-english',
      input: 'hello there',
      voice: 'tara',
      response_format: 'wav',
    })
  })

  it('surfaces provider detail on a terms-acceptance rejection', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue(
        new Response(
          JSON.stringify({ error: { message: 'The model requires terms acceptance', type: 'invalid_request_error' } }),
          { status: 400, headers: { 'Content-Type': 'application/json' } },
        ),
      ),
    )

    const adapter = createOpenAiSpeechAdapter({ baseUrl: 'https://api.example.com/v1', apiKey: 'k', timeoutMs: 5000 })
    await expect(
      adapter.speak({ externalModelId: 'canopylabs/orpheus-v1-english', input: 'hi', voice: 'tara' }),
    ).rejects.toMatchObject({
      code: 'invalid_request',
      message: expect.stringContaining('terms acceptance'),
    })
  })

  it('rejects empty audio bodies as upstream_error', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue(new Response(new ArrayBuffer(0), { status: 200 })))

    const adapter = createOpenAiSpeechAdapter({ baseUrl: 'https://api.example.com/v1', apiKey: 'k', timeoutMs: 5000 })
    await expect(
      adapter.speak({ externalModelId: 'canopylabs/orpheus-v1-english', input: 'hi', voice: 'tara' }),
    ).rejects.toMatchObject({ code: 'upstream_error' })
  })
})
