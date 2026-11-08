import type { ReactNode } from 'react'
import { CodeBlock, MarkdownText } from '@umituz/web-design-system'
import { splitMarkdown } from '@/lib/markdown'

export function MessageContent({ content }: { content: string }): ReactNode {
  const segments = splitMarkdown(content)

  return (
    <div className="space-y-3">
      {segments.map((segment, index) =>
        segment.kind === 'code' ? (
          <CodeBlock key={`c${index}`} language={segment.language}>
            {segment.text.replace(/\n$/, '')}
          </CodeBlock>
        ) : segment.text.trim().length > 0 ? (
          <MarkdownText key={`t${index}`}>{segment.text.trim()}</MarkdownText>
        ) : null,
      )}
    </div>
  )
}
