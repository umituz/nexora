import type { ReactNode } from 'react'
import { Wrench } from 'lucide-react'
import type { PublicToolCall } from '@shared/ai/contracts'
import { Button } from '@umituz/web-design-system'
import { useT } from '@/i18n'

interface ToolCallCardProps {
  toolCall: PublicToolCall
  onResolve?: (id: string, approved: boolean) => void
  disabled?: boolean
}

const STATUS_KEY: Record<PublicToolCall['status'], string> = {
  pending: 'chat.toolCalls.pending',
  approved: 'chat.toolCalls.approved',
  rejected: 'chat.toolCalls.rejected',
  succeeded: 'chat.toolCalls.succeeded',
  failed: 'chat.toolCalls.failed',
}

function describeArgs(toolCall: PublicToolCall): string {
  if (toolCall.toolKey === 'save_memory' && typeof toolCall.args.content === 'string') {
    return toolCall.args.content
  }
  if (toolCall.toolKey === 'generate_image' && typeof toolCall.args.prompt === 'string') {
    return toolCall.args.prompt
  }
  if (toolCall.toolKey === 'web_search' && typeof toolCall.args.query === 'string') {
    return toolCall.args.query
  }
  return JSON.stringify(toolCall.args)
}

function describeResult(toolCall: PublicToolCall): string | null {
  if (toolCall.status === 'rejected') return null
  if (toolCall.status === 'failed') return toolCall.error
  if (toolCall.status === 'succeeded' && toolCall.result) {
    if (toolCall.toolKey === 'generate_image' && typeof toolCall.result.imageUrl === 'string') {
      return toolCall.result.imageUrl
    }
    if (toolCall.toolKey === 'web_search' && Array.isArray(toolCall.result.results)) {
      const urls = toolCall.result.results
        .slice(0, 3)
        .map((row) => (typeof row?.url === 'string' ? row.url : ''))
        .filter(Boolean)
      return urls.length > 0 ? urls.join('\n') : null
    }
    return JSON.stringify(toolCall.result)
  }
  return null
}

export function ToolCallCard({ toolCall, onResolve, disabled = false }: ToolCallCardProps): ReactNode {
  const t = useT()
  const detail = describeResult(toolCall)

  return (
    <div className="rounded-xl border border-border bg-muted/40 p-3" data-testid="tool-call-card">
      <div className="flex items-center gap-2 text-xs font-medium">
        <Wrench size={13} className="text-primary" aria-hidden="true" />
        <span>{toolCall.toolName}</span>
        <span className="text-muted-foreground">·</span>
        <span
          className={`${
            toolCall.status === 'failed'
              ? 'text-destructive'
              : toolCall.status === 'succeeded'
                ? 'text-emerald-600 dark:text-emerald-400'
                : 'text-muted-foreground'
          }`}
        >
          {t(STATUS_KEY[toolCall.status])}
        </span>
      </div>
      <p className="mt-1.5 whitespace-pre-line break-words text-xs text-muted-foreground">{describeArgs(toolCall)}</p>
      {detail && <p className="mt-1 break-all text-[11px] text-muted-foreground">{detail}</p>}
      {toolCall.status === 'pending' && onResolve && (
        <div className="mt-2.5 flex gap-2">
          <Button size="sm" disabled={disabled} onClick={() => onResolve(toolCall.id, true)}>
            {t('chat.toolCalls.approve')}
          </Button>
          <Button size="sm" variant="outline" disabled={disabled} onClick={() => onResolve(toolCall.id, false)}>
            {t('chat.toolCalls.reject')}
          </Button>
        </div>
      )}
    </div>
  )
}
