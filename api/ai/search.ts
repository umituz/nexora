import { errorFromStatus, errorFromUnknown, AiError } from './errors'

export type SearchTopic = 'general' | 'news'

export interface WebSearchResult {
  title: string
  url: string
  content: string
  score: number | null
}

export interface WebSearchResponse {
  query: string
  answer: string | null
  results: WebSearchResult[]
  responseTime: number | null
}

export interface WebSearchInput {
  query: string
  maxResults?: number
  topic?: SearchTopic
  includeAnswer?: boolean
}

export type FetchLike = (input: string, init: Record<string, unknown>) => Promise<Response>

interface TavilyResult {
  title?: unknown
  url?: unknown
  content?: unknown
  score?: unknown
}

interface TavilyResponse {
  query?: unknown
  answer?: unknown
  response_time?: unknown
  results?: unknown
}

export const SEARCH_MAX_RESULTS = 5

export function searchWeb(
  env: { TAVILY_API_KEY?: string; TAVILY_BASE_URL?: string },
  input: WebSearchInput,
  fetchImpl: FetchLike = fetch,
): Promise<WebSearchResponse> {
  const apiKey = env.TAVILY_API_KEY
  if (!apiKey) return Promise.reject(new AiError('missing_key'))

  const maxResults = Math.min(Math.max(Math.trunc(input.maxResults ?? SEARCH_MAX_RESULTS), 1), SEARCH_MAX_RESULTS)
  const topic = input.topic ?? 'general'
  const baseUrl = (env.TAVILY_BASE_URL ?? 'https://api.tavily.com').replace(/\/$/, '')

  const body: Record<string, unknown> = { query: input.query, max_results: maxResults, topic }
  if (input.includeAnswer) body.include_answer = true

  return fetchImpl(`${baseUrl}/search`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${apiKey}`, 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  })
    .then(async (res) => {
      if (!res.ok) {
        const detail = await res
          .json()
          .then((raw: unknown) => {
            const parsed = raw as { detail?: unknown }
            const detailField = parsed?.detail
            if (Array.isArray(detailField)) return 'validation failed'
            if (detailField && typeof detailField === 'object' && 'error' in detailField) {
              const errorValue = (detailField as { error: unknown }).error
              return typeof errorValue === 'string' ? errorValue : undefined
            }
            return undefined
          })
          .catch(() => undefined)
        throw errorFromStatus(res.status, detail)
      }
      return res.json() as Promise<TavilyResponse>
    })
    .then((parsed) => {
      const rawResults = Array.isArray(parsed.results) ? (parsed.results as TavilyResult[]) : []
      const results = rawResults
        .filter((row) => typeof row.url === 'string' && row.url.length > 0)
        .map((row) => ({
          title: typeof row.title === 'string' ? row.title : '',
          url: row.url as string,
          content: typeof row.content === 'string' ? row.content : '',
          score: typeof row.score === 'number' ? row.score : null,
        }))
      return {
        query: typeof parsed.query === 'string' ? parsed.query : input.query,
        answer: typeof parsed.answer === 'string' ? parsed.answer : null,
        results,
        responseTime: typeof parsed.response_time === 'number' ? parsed.response_time : null,
      }
    })
    .catch((err) => {
      throw errorFromUnknown(err)
    })
}
