import { describe, expect, it } from 'vitest'
import type { TokenUsage } from '@shared/ai/contracts'
import { AiError } from '@umituz/web-ai'
import type { ProviderEvent } from './providers'
import {
  accumulateReport,
  buildResearchMessages,
  normalizeSources,
  RESEARCH_QUERY_MAX,
  RESEARCH_QUERY_MIN,
  RESEARCH_SNIPPET_MAX_CHARS,
} from './research'
import type { WebSearchResult } from './search'

const SOURCES: WebSearchResult[] = [
  { title: 'Aurora Station opens', url: 'https://example.com/aurora', content: 'The station opens in March.', score: 0.9 },
  { title: '', url: 'https://example.com/untitled', content: 'Untitled entry.', score: null },
]

describe('normalizeSources', () => {
  it('maps search results and defaults empty titles to the URL', () => {
    expect(normalizeSources(SOURCES)).toEqual([
      { title: 'Aurora Station opens', url: 'https://example.com/aurora', snippet: 'The station opens in March.' },
      { title: 'https://example.com/untitled', url: 'https://example.com/untitled', snippet: 'Untitled entry.' },
    ])
  })

  it('drops entries without a URL and truncates long snippets', () => {
    const long = 'x'.repeat(RESEARCH_SNIPPET_MAX_CHARS + 50)
    const normalized = normalizeSources([
      ...SOURCES,
      { title: 'No url', url: '', content: 'dropped', score: null },
      { title: 'Long', url: 'https://example.com/long', content: long, score: null },
    ])
    expect(normalized).toHaveLength(3)
    expect(normalized[2].snippet.length).toBe(RESEARCH_SNIPPET_MAX_CHARS + 1)
    expect(normalized[2].snippet.endsWith('…')).toBe(true)
  })
})

describe('buildResearchMessages', () => {
  it('builds a system + user pair with numbered sources', () => {
    const messages = buildResearchMessages('When does Aurora Station open?', normalizeSources(SOURCES))
    expect(messages).toHaveLength(2)
    expect(messages[0].role).toBe('system')
    expect(messages[1].role).toBe('user')
    expect(messages[1].content).toContain('Research question: When does Aurora Station open?')
    expect(messages[1].content).toContain('[1] Aurora Station opens')
    expect(messages[1].content).toContain('https://example.com/aurora')
    expect(messages[1].content).toContain('[2] https://example.com/untitled')
  })

  it('instructs citations and the untrusted-data stance', () => {
    const [system] = buildResearchMessages('q', normalizeSources(SOURCES))
    expect(system.content).toContain('[1]')
    expect(system.content).toContain('untrusted data')
    expect(system.content).toContain('ONLY the numbered sources')
  })
})

describe('accumulateReport', () => {
  async function* eventsOf(events: ProviderEvent[]): AsyncGenerator<ProviderEvent> {
    yield* events
  }

  it('accumulates answer deltas and keeps the final usage', async () => {
    const usage: TokenUsage = { inputTokens: 10, outputTokens: 5 }
    const { report, usage: captured } = await accumulateReport(
      eventsOf([
        { type: 'delta', channel: 'reasoning', text: 'thinking' },
        { type: 'delta', channel: 'answer', text: 'Aurora opens ' },
        { type: 'delta', channel: 'answer', text: 'in March [1].' },
        { type: 'usage', usage },
      ]),
    )
    expect(report).toBe('Aurora opens in March [1].')
    expect(captured).toEqual(usage)
  })

  it('returns null usage when the provider reports none', async () => {
    const { report, usage } = await accumulateReport(eventsOf([{ type: 'delta', channel: 'answer', text: 'brief' }]))
    expect(report).toBe('brief')
    expect(usage).toBeNull()
  })

  it('rejects unexpected tool calls', async () => {
    await expect(
      accumulateReport(eventsOf([{ type: 'tool_calls', calls: [] }] as unknown as ProviderEvent[])),
    ).rejects.toBeInstanceOf(AiError)
  })
})

describe('research query bounds', () => {
  it('keeps the route validation bounds sane', () => {
    expect(RESEARCH_QUERY_MIN).toBeGreaterThanOrEqual(3)
    expect(RESEARCH_QUERY_MAX).toBeLessThanOrEqual(1000)
  })
})
