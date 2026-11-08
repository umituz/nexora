import { describe, expect, it } from 'vitest'
import { AiError } from './errors'
import { searchWeb } from './search'

function jsonResponse(status: number, body: unknown): Response {
  return new Response(JSON.stringify(body), { status, headers: { 'Content-Type': 'application/json' } })
}

const TAVILY_HAPPY = {
  query: 'pgvector neon',
  answer: 'pgvector is available on Neon.',
  response_time: 0.42,
  results: [
    { title: 'Neon docs', url: 'https://neon.tech/docs/extensions/pgvector', content: 'Enable the vector extension.', score: 0.99 },
    { title: 'No url entry', content: 'dropped' },
    { title: 'pgvector GitHub', url: 'https://github.com/pgvector/pgvector', content: 'Open-source vector similarity search.', score: 0.87 },
  ],
}

describe('searchWeb', () => {
  it('rejects with missing_key when no API key is configured', async () => {
    await expect(searchWeb({}, { query: 'anything' }, async () => jsonResponse(200, TAVILY_HAPPY))).rejects.toMatchObject({ code: 'missing_key' })
  })

  it('sends the documented wire format and normalizes the response', async () => {
    let capturedInit: Record<string, unknown> | null = null
    let capturedUrl = ''
    const response = await searchWeb(
      { TAVILY_API_KEY: 'tvly-test' },
      { query: 'pgvector neon', maxResults: 2, topic: 'news', includeAnswer: true },
      async (url, init) => {
        capturedUrl = url
        capturedInit = init
        return jsonResponse(200, TAVILY_HAPPY)
      },
    )

    expect(capturedUrl).toBe('https://api.tavily.com/search')
    const headers = capturedInit!.headers as Record<string, string>
    expect(headers.Authorization).toBe('Bearer tvly-test')
    expect(headers['Content-Type']).toBe('application/json')
    expect(JSON.parse(capturedInit!.body as string)).toEqual({
      query: 'pgvector neon',
      max_results: 2,
      topic: 'news',
      include_answer: true,
    })

    expect(response.query).toBe('pgvector neon')
    expect(response.answer).toBe('pgvector is available on Neon.')
    expect(response.responseTime).toBe(0.42)
    expect(response.results).toHaveLength(2)
    expect(response.results[0]).toEqual({
      title: 'Neon docs',
      url: 'https://neon.tech/docs/extensions/pgvector',
      content: 'Enable the vector extension.',
      score: 0.99,
    })
  })

  it('omits include_answer when not requested and clamps maxResults', async () => {
    let capturedBody = ''
    await searchWeb(
      { TAVILY_API_KEY: 'tvly-test' },
      { query: 'q', maxResults: 50 },
      async (_url, init) => {
        capturedBody = init.body as string
        return jsonResponse(200, { results: [] })
      },
    )
    expect(JSON.parse(capturedBody)).toEqual({ query: 'q', max_results: 5, topic: 'general' })
  })

  it('maps upstream statuses to AiError codes', async () => {
    const cases: ReadonlyArray<[number, string]> = [
      [401, 'invalid_key'],
      [429, 'rate_limited'],
      [500, 'upstream_error'],
    ]
    for (const [status, code] of cases) {
      await expect(
        searchWeb({ TAVILY_API_KEY: 'tvly-test' }, { query: 'q' }, async () => jsonResponse(status, { detail: { error: 'boom' } })),
      ).rejects.toMatchObject({ code })
    }
  })

  it('keeps the provider detail in the error message', async () => {
    const err = (await searchWeb(
      { TAVILY_API_KEY: 'tvly-test' },
      { query: 'q' },
      async () => jsonResponse(432, { detail: { error: 'plan limit exceeded' } }),
    ).catch((caught: unknown) => caught)) as AiError
    expect(err).toBeInstanceOf(AiError)
    expect(err.message).toContain('plan limit exceeded')
  })

  it('wraps network failures as network errors', async () => {
    await expect(
      searchWeb({ TAVILY_API_KEY: 'tvly-test' }, { query: 'q' }, async () => {
        throw new TypeError('fetch failed')
      }),
    ).rejects.toMatchObject({ code: 'network' })
  })

  it('tolerates a missing results array', async () => {
    const response = await searchWeb({ TAVILY_API_KEY: 'tvly-test' }, { query: 'q' }, async () => jsonResponse(200, {}))
    expect(response.results).toEqual([])
    expect(response.answer).toBeNull()
    expect(response.query).toBe('q')
  })

  it('honors a configured base URL override', async () => {
    let capturedUrl = ''
    await searchWeb(
      { TAVILY_API_KEY: 'tvly-test', TAVILY_BASE_URL: 'http://127.0.0.1:9303/' },
      { query: 'q' },
      async (url) => {
        capturedUrl = url
        return jsonResponse(200, { results: [] })
      },
    )
    expect(capturedUrl).toBe('http://127.0.0.1:9303/search')
  })
})
