import { describe, expect, it } from 'vitest'
import { MEMORY_MAX_ITEMS, selectMemories, type MemoryLike } from './memories'

function row(content: string, overrides: Partial<MemoryLike> = {}): MemoryLike {
  return { content, pinned: false, updatedAt: new Date('2026-01-01T00:00:00Z'), ...overrides }
}

describe('selectMemories ordering', () => {
  it('puts pinned memories first regardless of recency', () => {
    const out = selectMemories([
      row('recent'),
      row('pinned-old', { pinned: true, updatedAt: new Date('2020-01-01T00:00:00Z') }),
    ])
    expect(out).toEqual(['pinned-old', 'recent'])
  })

  it('orders same-priority memories by recency, newest first', () => {
    const out = selectMemories([
      row('oldest', { updatedAt: new Date('2024-01-01T00:00:00Z') }),
      row('newest', { updatedAt: new Date('2026-06-01T00:00:00Z') }),
      row('middle', { updatedAt: new Date('2025-01-01T00:00:00Z') }),
    ])
    expect(out).toEqual(['newest', 'middle', 'oldest'])
  })

  it('skips memories whose content is only whitespace', () => {
    const out = selectMemories([row('   '), row('kept')])
    expect(out).toEqual(['kept'])
  })
})

describe('selectMemories limits', () => {
  it('caps the number of injected memories', () => {
    const rows = Array.from({ length: MEMORY_MAX_ITEMS + 5 }, (_, i) => row(`memory-${i}`))
    const out = selectMemories(rows)
    expect(out).toHaveLength(MEMORY_MAX_ITEMS)
    expect(out[0]).toBe('memory-0')
  })

  it('caps total characters and marks the truncated tail', () => {
    const rows = [
      row('a'.repeat(60)),
      row('b'.repeat(60)),
      row('c'.repeat(60)),
    ]
    const out = selectMemories(rows, MEMORY_MAX_ITEMS, 100)
    expect(out).toHaveLength(2)
    expect(out[0]).toBe('a'.repeat(60))
    expect(out[1].startsWith('b'.repeat(38))).toBe(true)
    expect(out[1].endsWith('[truncated]')).toBe(true)
  })
})
