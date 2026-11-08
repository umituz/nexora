import { describe, expect, it } from 'vitest'
import type { ChatMessage } from '@shared/ai/contracts'
import { buildContext, estimateMessageTokens, estimateTokens } from './context-manager'

describe('estimateTokens', () => {
  it('divides character count by 4 and rounds up', () => {
    expect(estimateTokens('abcd')).toBe(1)
    expect(estimateTokens('abcde')).toBe(2)
    expect(estimateTokens('')).toBe(0)
  })
})

describe('estimateMessageTokens', () => {
  it('adds a per-message overhead', () => {
    expect(estimateMessageTokens({ role: 'user', content: 'abcd' })).toBe(9)
  })
})

describe('buildContext', () => {
  const budget = { contextWindow: 1000, maxOutputTokens: 200 }

  it('prepends the system message', () => {
    const result = buildContext([{ role: 'user', content: 'hi' }], 'system prompt', budget)
    expect(result[0]).toEqual({ role: 'system', content: 'system prompt' })
  })

  it('keeps the newest message even when the budget is tight', () => {
    const long = 'x'.repeat(4000)
    const result = buildContext([{ role: 'user', content: long }], 'sys', budget)
    expect(result).toHaveLength(2)
    expect(result[1]).toEqual({ role: 'user', content: long })
  })

  it('drops the oldest messages that exceed the budget and trims the resulting assistant orphan', () => {
    const history: ChatMessage[] = [
      { role: 'user', content: 'x'.repeat(2400) },
      { role: 'assistant', content: 'short reply' },
      { role: 'user', content: 'another question' },
    ]
    const result = buildContext(history, 'sys', budget)
    expect(result.map((m) => m.role)).toEqual(['system', 'user'])
  })

  it('trims leading assistant orphans', () => {
    const history: ChatMessage[] = [
      { role: 'assistant', content: 'orphan reply' },
      { role: 'user', content: 'hello' },
    ]
    const result = buildContext(history, 'sys', budget)
    expect(result.map((m) => m.role)).toEqual(['system', 'user'])
  })
})
