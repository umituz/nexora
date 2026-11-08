import { useState } from 'react'
import type { ReactNode } from 'react'
import { apiFetch } from '@umituz/web-hono/client'
import { CodeBlock, MarkdownText } from '@umituz/web-design-system'
import { BookmarkPlus, Check } from 'lucide-react'
import { useT } from '@/i18n'
import { deriveSnippetTitle, splitMarkdown } from '@umituz/web-ai'

interface MessageContentProps {
  content: string
  conversationId?: string
}

export function MessageContent({ content, conversationId }: MessageContentProps): ReactNode {
  const t = useT()
  const [savedIndex, setSavedIndex] = useState<number | null>(null)
  const segments = splitMarkdown(content)

  const saveSnippet = async (index: number, language: string | undefined, text: string) => {
    const trimmed = text.replace(/\n$/, '')
    if (trimmed.trim().length === 0 || !conversationId) return
    try {
      await apiFetch('/api/code-artifacts', {
        method: 'POST',
        json: { title: deriveSnippetTitle(trimmed), language: language ?? 'text', content: trimmed, conversationId },
      })
      setSavedIndex(index)
    } catch {
      return
    }
  }

  return (
    <div className="space-y-3">
      {segments.map((segment, index) =>
        segment.kind === 'code' ? (
          <div key={`c${index}`} className="space-y-1">
            <CodeBlock language={segment.language}>{segment.text.replace(/\n$/, '')}</CodeBlock>
            {conversationId && (
              <button
                type="button"
                onClick={() => void saveSnippet(index, segment.language, segment.text)}
                disabled={savedIndex === index}
                className="inline-flex items-center gap-1 text-xs text-muted-foreground transition-colors hover:text-foreground disabled:opacity-70"
              >
                {savedIndex === index ? <Check size={12} aria-hidden="true" /> : <BookmarkPlus size={12} aria-hidden="true" />}
                {savedIndex === index ? t('chat.savedCode') : t('chat.saveCode')}
              </button>
            )}
          </div>
        ) : segment.text.trim().length > 0 ? (
          <MarkdownText key={`t${index}`}>{segment.text.trim()}</MarkdownText>
        ) : null,
      )}
    </div>
  )
}
