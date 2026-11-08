import { describe, expect, it } from 'vitest'
import { countChanges, diffLines } from './diff'

describe('diffLines', () => {
  it('marks identical inputs as unchanged', () => {
    const lines = diffLines('a\nb\nc', 'a\nb\nc')
    expect(lines).toEqual([
      { type: 'same', text: 'a' },
      { type: 'same', text: 'b' },
      { type: 'same', text: 'c' },
    ])
  })

  it('detects a pure insertion', () => {
    const lines = diffLines('a\nc', 'a\nb\nc')
    expect(lines).toEqual([
      { type: 'same', text: 'a' },
      { type: 'add', text: 'b' },
      { type: 'same', text: 'c' },
    ])
  })

  it('detects a pure deletion', () => {
    const lines = diffLines('a\nb\nc', 'a\nc')
    expect(lines).toEqual([
      { type: 'same', text: 'a' },
      { type: 'remove', text: 'b' },
      { type: 'same', text: 'c' },
    ])
  })

  it('orders a modification as remove then add', () => {
    const lines = diffLines('const x = 1', 'const x = 2')
    expect(lines).toEqual([
      { type: 'remove', text: 'const x = 1' },
      { type: 'add', text: 'const x = 2' },
    ])
  })

  it('handles mixed edits across a file', () => {
    const before = ['import fs', '', 'export function a() {', '  return 1', '}'].join('\n')
    const after = ['import fs', 'import path', '', 'export function a() {', '  return 2', '}'].join('\n')
    const changes = countChanges(diffLines(before, after))
    expect(changes).toEqual({ added: 2, removed: 1 })
  })

  it('treats empty inputs as empty or all-added', () => {
    expect(diffLines('', '')).toEqual([{ type: 'same', text: '' }])
    const lines = diffLines('', 'new\ncontent')
    expect(lines.filter((line) => line.type === 'add')).toHaveLength(2)
  })
})

describe('countChanges', () => {
  it('counts only added and removed lines', () => {
    expect(countChanges([{ type: 'same', text: 'x' }, { type: 'add', text: 'y' }, { type: 'add', text: 'z' }, { type: 'remove', text: 'w' }])).toEqual({
      added: 2,
      removed: 1,
    })
  })
})
