import { afterEach, describe, expect, it, vi } from 'vitest'
import { createOpenAiAudioTranscriptionAdapter } from './audio'
import { AiError } from '../errors'

afterEach(() => {
  vi.unstubAllGlobals()
})

describe('createOpenAiAudioTranscriptionAdapter', () => {
  it('posts multipart form to the transcriptions endpoint and returns text', async () => {
    const fetchMock = vi.fn().mockResolvedValue(new Response(JSON.stringify({ text: '  hello world  ' }), { status: 200 }))
    vi.stubGlobal('fetch', fetchMock)

    const adapter = createOpenAiAudioTranscriptionAdapter({ baseUrl: 'https://api.example.com/v1', apiKey: 'k', timeoutMs: 5000 })
    const result = await adapter.transcribe({
      externalModelId: 'whisper-large-v3-turbo',
      audio: new Uint8Array([1, 2, 3]),
      mimeType: 'audio/mpeg',
      name: 'clip.mp3',
    })

    expect(result).toEqual({ text: 'hello world' })
    const [url, init] = fetchMock.mock.calls[0]
    expect(url).toBe('https://api.example.com/v1/audio/transcriptions')
    expect(init.headers.Authorization).toBe('Bearer k')
    expect(init.body).toBeInstanceOf(FormData)
    expect((init.body as FormData).get('model')).toBe('whisper-large-v3-turbo')
    expect((init.body as FormData).get('response_format')).toBe('json')
    const file = (init.body as FormData).get('file')
    expect(file).toBeInstanceOf(File)
    expect((file as File).name).toBe('clip.mp3')
    expect((file as File).type).toBe('audio/mpeg')
  })

  it('maps HTTP 401 to invalid_key with provider detail', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue(new Response(JSON.stringify({ error: { message: 'invalid api key' } }), { status: 401 })),
    )

    const adapter = createOpenAiAudioTranscriptionAdapter({ baseUrl: 'https://api.example.com/v1', apiKey: 'bad', timeoutMs: 5000 })
    await expect(
      adapter.transcribe({ externalModelId: 'whisper-large-v3-turbo', audio: new Uint8Array([1]), mimeType: 'audio/mpeg', name: 'a.mp3' }),
    ).rejects.toMatchObject({ code: 'invalid_key', message: expect.stringContaining('invalid api key') })
  })

  it('rejects empty transcriptions as upstream_error', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue(new Response(JSON.stringify({ text: '   ' }), { status: 200 })))

    const adapter = createOpenAiAudioTranscriptionAdapter({ baseUrl: 'https://api.example.com/v1', apiKey: 'k', timeoutMs: 5000 })
    const promise = adapter.transcribe({
      externalModelId: 'whisper-large-v3-turbo',
      audio: new Uint8Array([1]),
      mimeType: 'audio/mpeg',
      name: 'a.mp3',
    })
    await expect(promise).rejects.toBeInstanceOf(AiError)
    await expect(promise).rejects.toMatchObject({ code: 'upstream_error' })
  })
})
