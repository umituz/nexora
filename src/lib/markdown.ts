export interface MarkdownSegment {
  kind: 'text' | 'code'
  text: string
  language?: string
}

const FENCE_PATTERN = /```([\w+-]*)\n?([\s\S]*?)(?:```|$)/g

export function splitMarkdown(source: string): MarkdownSegment[] {
  const segments: MarkdownSegment[] = []
  let cursor = 0
  let match: RegExpExecArray | null
  FENCE_PATTERN.lastIndex = 0

  while ((match = FENCE_PATTERN.exec(source)) !== null) {
    if (match.index > cursor) {
      segments.push({ kind: 'text', text: source.slice(cursor, match.index) })
    }
    segments.push({ kind: 'code', text: match[2] ?? '', language: match[1] || undefined })
    cursor = match.index + match[0].length
  }
  if (cursor < source.length) {
    segments.push({ kind: 'text', text: source.slice(cursor) })
  }
  return segments
}
