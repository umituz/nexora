import { useState } from 'react'
import type { ReactNode } from 'react'
import { ChevronDown, ChevronRight, Brain } from 'lucide-react'
import { MarkdownText } from '@umituz/web-design-system'
import { useT } from '@/i18n'

export function ReasoningBlock({ reasoning, streaming }: { reasoning: string; streaming: boolean }): ReactNode {
  const [open, setOpen] = useState(false)
  const t = useT()

  if (reasoning.length === 0 && !streaming) return null

  return (
    <div className="rounded-lg border border-border bg-muted/40">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="flex w-full items-center gap-2 px-3 py-2 text-xs font-medium text-muted-foreground hover:text-foreground"
        aria-expanded={open}
      >
        <Brain size={14} aria-hidden="true" />
        <span>{streaming && reasoning.length === 0 ? t('chat.thinking') : t('chat.reasoning')}</span>
        {open ? <ChevronDown size={14} aria-hidden="true" /> : <ChevronRight size={14} aria-hidden="true" />}
      </button>
      {open && reasoning.length > 0 && (
        <div className="border-t border-border px-3 py-2 text-sm text-muted-foreground">
          <MarkdownText>{reasoning}</MarkdownText>
        </div>
      )}
    </div>
  )
}
