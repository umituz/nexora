import { describe, expect, it } from 'vitest'
import { splitMarkdown } from './markdown'

describe('splitMarkdown', () => {
  it('returns a single text segment for plain prose', () => {
    expect(splitMarkdown('just text')).toEqual([{ kind: 'text', text: 'just text' }])
  })

  it('splits fenced code with its language', () => {
    const segments = splitMarkdown('before\n```ts\nconst a = 1\n```\nafter')
    expect(segments).toEqual([
      { kind: 'text', text: 'before\n' },
      { kind: 'code', text: 'const a = 1\n', language: 'ts' },
      { kind: 'text', text: '\nafter' },
    ])
  })

  it('captures an unterminated fence as code', () => {
    const segments = splitMarkdown('```python\nprint(1)')
    expect(segments).toEqual([{ kind: 'code', text: 'print(1)', language: 'python' }])
  })

  it('handles multiple consecutive fences', () => {
    const segments = splitMarkdown('```\na\n```\n```\nb\n```')
    expect(segments.filter((s) => s.kind === 'code')).toHaveLength(2)
  })
})
