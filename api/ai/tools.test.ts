import { afterEach, describe, expect, it, vi } from 'vitest'
import type { Db, Env } from '../env'
import { executeToolCall, validateToolArgs } from './tools'

describe('validateToolArgs', () => {
  it('accepts a valid generate_image payload', () => {
    expect(validateToolArgs('generate_image', { prompt: 'a red panda', size: '1024x1024', quality: 'high' })).toEqual({ ok: true })
  })

  it('rejects generate_image with an unknown size', () => {
    const outcome = validateToolArgs('generate_image', { prompt: 'a red panda', size: '512x512' })
    expect(outcome.ok).toBe(false)
    if (!outcome.ok) expect(outcome.error).toContain('Invalid arguments')
  })

  it('rejects generate_image with an empty prompt', () => {
    const outcome = validateToolArgs('generate_image', { prompt: '' })
    expect(outcome.ok).toBe(false)
  })

  it('accepts a valid save_memory payload and defaults nothing', () => {
    expect(validateToolArgs('save_memory', { content: 'User prefers concise answers', pinned: true })).toEqual({ ok: true })
    expect(validateToolArgs('save_memory', { content: 'User writes TypeScript' })).toEqual({ ok: true })
  })

  it('rejects save_memory without content', () => {
    const outcome = validateToolArgs('save_memory', { pinned: true })
    expect(outcome.ok).toBe(false)
  })

  it('accepts a valid web_search payload', () => {
    expect(validateToolArgs('web_search', { query: 'neon pgvector availability', maxResults: 3, topic: 'news' })).toEqual({ ok: true })
    expect(validateToolArgs('web_search', { query: 'simple' })).toEqual({ ok: true })
  })

  it('rejects web_search with a bad topic or oversized maxResults', () => {
    expect(validateToolArgs('web_search', { query: 'q', topic: 'finance' }).ok).toBe(false)
    expect(validateToolArgs('web_search', { query: 'q', maxResults: 9 }).ok).toBe(false)
    expect(validateToolArgs('web_search', { query: '' }).ok).toBe(false)
  })

  it('rejects unknown tool keys outright', () => {
    const outcome = validateToolArgs('run_shell', { command: 'rm -rf /' })
    expect(outcome.ok).toBe(false)
    if (!outcome.ok) expect(outcome.error).toContain('Unknown tool')
  })
})

describe('executeToolCall web_search', () => {
  afterEach(() => {
    vi.unstubAllGlobals()
  })

  it('fails gracefully when no search key is configured', async () => {
    const outcome = await executeToolCall({} as Db, {} as Env, {
      userId: 'user_x',
      conversationId: 'conv_x',
      toolKey: 'web_search',
      args: { query: 'pgvector news' },
    })
    expect(outcome.ok).toBe(false)
    if (!outcome.ok) expect(outcome.error).toBe('The provider is not configured with an API key.')
  })

  it('returns normalized results through the search module', async () => {
    const fetchMock = vi.fn(async () =>
      new Response(
        JSON.stringify({
          query: 'pgvector news',
          answer: null,
          results: [{ title: 'Neon', url: 'https://neon.tech/docs/extensions/pgvector', content: 'Enable it.', score: 0.9 }],
        }),
        { status: 200, headers: { 'Content-Type': 'application/json' } },
      ),
    )
    vi.stubGlobal('fetch', fetchMock)

    const outcome = await executeToolCall({} as Db, { TAVILY_API_KEY: 'tvly-test' } as Env, {
      userId: 'user_x',
      conversationId: 'conv_x',
      toolKey: 'web_search',
      args: { query: 'pgvector news', topic: 'news' },
    })

    expect(outcome).toEqual({
      ok: true,
      result: {
        query: 'pgvector news',
        answer: null,
        responseTime: null,
        results: [{ title: 'Neon', url: 'https://neon.tech/docs/extensions/pgvector', snippet: 'Enable it.' }],
      },
    })
    expect(fetchMock).toHaveBeenCalledTimes(1)
  })
})
