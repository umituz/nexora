import { afterEach, describe, expect, it, vi } from 'vitest'
import { createOpenAiEmbeddingsAdapter } from './embeddings'

function jsonResponse(status: number, body: unknown): Response {
  return new Response(JSON.stringify(body), { status, headers: { 'Content-Type': 'application/json' } })
}

const CONFIG = { baseUrl: 'https://api.example.com/v1', apiKey: 'sk-test', timeoutMs: 5000 }

describe('createOpenAiEmbeddingsAdapter', () => {
  afterEach(() => {
    vi.unstubAllGlobals()
  })

  it('sends the documented wire format', async () => {
    const fetchMock = vi.fn(async () =>
      jsonResponse(200, {
        data: [
          { index: 0, embedding: [0.1, 0.2] },
          { index: 1, embedding: [0.3, 0.4] },
        ],
        usage: { prompt_tokens: 12 },
      }),
    )
    vi.stubGlobal('fetch', fetchMock)

    const adapter = createOpenAiEmbeddingsAdapter(CONFIG)
    const out = await adapter.embed({ externalModelId: 'text-embedding-3-small', input: ['a', 'b'] })

    expect(fetchMock).toHaveBeenCalledTimes(1)
    const [url, init] = fetchMock.mock.calls[0] as unknown as [string, RequestInit]
    expect(url).toBe('https://api.example.com/v1/embeddings')
    expect((init.headers as Record<string, string>).Authorization).toBe('Bearer sk-test')
    expect(JSON.parse(init.body as string)).toEqual({ model: 'text-embedding-3-small', input: ['a', 'b'] })
    expect(out).toEqual({ vectors: [[0.1, 0.2], [0.3, 0.4]], inputTokens: 12 })
  })

  it('reorders out-of-order provider responses by index', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn(async () =>
        jsonResponse(200, {
          data: [
            { index: 1, embedding: [0.9] },
            { index: 0, embedding: [0.1] },
          ],
        }),
      ),
    )

    const adapter = createOpenAiEmbeddingsAdapter(CONFIG)
    const out = await adapter.embed({ externalModelId: 'm', input: ['a', 'b'] })
    expect(out.vectors).toEqual([[0.1], [0.9]])
    expect(out.inputTokens).toBeNull()
  })

  it('fails when the provider drops an item from the batch', async () => {
    vi.stubGlobal('fetch', vi.fn(async () => jsonResponse(200, { data: [{ index: 0, embedding: [0.1] }] })))

    const adapter = createOpenAiEmbeddingsAdapter(CONFIG)
    await expect(adapter.embed({ externalModelId: 'm', input: ['a', 'b'] })).rejects.toThrow('incomplete embeddings batch')
  })

  it('maps upstream errors with provider detail', async () => {
    vi.stubGlobal('fetch', vi.fn(async () => jsonResponse(401, { error: { message: 'bad key' } })))

    const adapter = createOpenAiEmbeddingsAdapter(CONFIG)
    await expect(adapter.embed({ externalModelId: 'm', input: ['a'] })).rejects.toMatchObject({ code: 'invalid_key' })
  })

  it('wraps network faults as network errors', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn(async () => {
        throw new TypeError('fetch failed')
      }),
    )

    const adapter = createOpenAiEmbeddingsAdapter(CONFIG)
    await expect(adapter.embed({ externalModelId: 'm', input: ['a'] })).rejects.toMatchObject({ code: 'network' })
  })
})
