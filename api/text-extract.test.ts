import { describe, expect, it } from 'vitest'
import { capText, extractText, isTextLike, TEXT_EXTRACT_PER_FILE_LIMIT } from './text-extract'

describe('isTextLike', () => {
  it('accepts text mime types and common code extensions', () => {
    expect(isTextLike('text/plain', 'notes.txt')).toBe(true)
    expect(isTextLike('application/json', 'data.json')).toBe(true)
    expect(isTextLike('application/octet-stream', 'main.ts')).toBe(true)
  })

  it('rejects binary files', () => {
    expect(isTextLike('image/png', 'photo.png')).toBe(false)
    expect(isTextLike('application/pdf', 'doc.pdf')).toBe(false)
    expect(isTextLike('application/octet-stream', 'build.exe')).toBe(false)
  })
})

describe('extractText', () => {
  it('decodes utf-8 bytes', () => {
    const encoded = new TextEncoder().encode('héllo wörld')
    expect(extractText(encoded)).toBe('héllo wörld')
  })

  it('replaces null bytes from binary content', () => {
    const bytes = new Uint8Array([97, 0, 98])
    expect(extractText(bytes)).toBe('ab')
  })
})

describe('capText', () => {
  it('keeps short text intact', () => {
    expect(capText('short', 100)).toBe('short')
  })

  it('truncates with a marker', () => {
    const result = capText('x'.repeat(TEXT_EXTRACT_PER_FILE_LIMIT + 500), TEXT_EXTRACT_PER_FILE_LIMIT)
    expect(result.length).toBeLessThanOrEqual(TEXT_EXTRACT_PER_FILE_LIMIT + 20)
    expect(result.endsWith('[truncated]')).toBe(true)
  })
})
