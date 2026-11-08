import { afterEach, describe, expect, it, vi } from 'vitest'
import { createOpenAiImageAdapter } from './images'

function jsonResponse(payload: unknown, status = 200): Response {
  return new Response(JSON.stringify(payload), {
    status,
    headers: { 'Content-Type': 'application/json' },
  })
}

const request = {
  externalModelId: 'gpt-image-2.5-flare',
  prompt: 'A paper crane on a windowsill at dusk',
  size: '1536x1024',
  quality: 'high',
}

afterEach(() => {
  vi.unstubAllGlobals()
})

describe('createOpenAiImageAdapter', () => {
  it('posts the documented images wire format', async () => {
    const fetchMock = vi.fn().mockResolvedValue(
      jsonResponse({ data: [{ b64_json: 'aW1hZ2U=' }], usage: { input_tokens: 12, output_tokens: 1056, total_tokens: 1068 } }),
    )
    vi.stubGlobal('fetch', fetchMock)

    const adapter = createOpenAiImageAdapter({ baseUrl: 'https://api.example.com/v1', apiKey: 'k', timeoutMs: 5000 })
    const result = await adapter.generate(request)

    const [url, init] = fetchMock.mock.calls[0]
    expect(url).toBe('https://api.example.com/v1/images/generations')
    expect(init.headers.Authorization).toBe('Bearer k')
    const body = JSON.parse(init.body)
    expect(body).toEqual({
      model: 'gpt-image-2.5-flare',
      prompt: request.prompt,
      n: 1,
      size: '1536x1024',
      quality: 'high',
    })

    expect(result.images).toEqual(['aW1hZ2U='])
    expect(result.usage).toEqual({ inputTokens: 12, outputTokens: 1056, reasoningTokens: undefined })
  })

  it('accepts responses without usage and ignores url-only images', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue(jsonResponse({ data: [{ url: 'https://cdn.example.com/x.png' }, { b64_json: 'aW1hZ2U=' }] })))

    const adapter = createOpenAiImageAdapter({ baseUrl: 'https://api.example.com/v1', apiKey: 'k', timeoutMs: 5000 })
    const result = await adapter.generate(request)

    expect(result.images).toEqual(['aW1hZ2U='])
    expect(result.usage).toBeNull()
  })

  it('throws upstream_error when no b64 payload comes back', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue(jsonResponse({ data: [] })))

    const adapter = createOpenAiImageAdapter({ baseUrl: 'https://api.example.com/v1', apiKey: 'k', timeoutMs: 5000 })
    await expect(adapter.generate(request)).rejects.toMatchObject({ code: 'upstream_error' })
  })

  it('maps provider failures through errorFromStatus', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue(jsonResponse({ error: { message: 'Incorrect API key provided' } }, 401)),
    )

    const adapter = createOpenAiImageAdapter({ baseUrl: 'https://api.example.com/v1', apiKey: 'k', timeoutMs: 5000 })
    await expect(adapter.generate(request)).rejects.toMatchObject({ code: 'invalid_key' })
  })

  it('rejects images above the storage cap', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue(jsonResponse({ data: [{ b64_json: 'a'.repeat(12_000_001) }] })),
    )

    const adapter = createOpenAiImageAdapter({ baseUrl: 'https://api.example.com/v1', apiKey: 'k', timeoutMs: 5000 })
    await expect(adapter.generate(request)).rejects.toMatchObject({ code: 'invalid_request' })
  })
})
