import type { ReactNode } from 'react'
import { AlertCircle, Check, Copy, Pencil, RotateCcw, Sparkles, User } from 'lucide-react'
import { useState } from 'react'
import type { MessageStatus, TokenUsage } from '@shared/ai/contracts'
import { useT } from '@/i18n'
import { MessageContent } from './MessageContent'
import { ReasoningBlock } from './ReasoningBlock'

export interface ChatMessageView {
  id: string
  role: 'user' | 'assistant'
  content: string
  reasoning: string
  status: MessageStatus | 'streaming'
  error: { code: string; message: string } | null
  usage: TokenUsage | null
}

interface MessageBubbleProps {
  message: ChatMessageView
  onRegenerate?: () => void
  canRegenerate?: boolean
  onEdit?: () => void
  canEdit?: boolean
}

export function MessageBubble({ message, onRegenerate, canRegenerate = false, onEdit, canEdit = false }: MessageBubbleProps): ReactNode {
  const t = useT()
  const [copied, setCopied] = useState(false)
  const isUser = message.role === 'user'

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(message.content)
      setCopied(true)
      setTimeout(() => setCopied(false), 1500)
    } catch {
      return
    }
  }

  return (
    <div className={`flex gap-3 ${isUser ? 'justify-end' : 'justify-start'}`}>
      {!isUser && (
        <span className="mt-1 inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
          <Sparkles size={14} aria-hidden="true" />
        </span>
      )}
      <div className={`max-w-[85%] space-y-2 ${isUser ? 'items-end' : ''}`}>
        {!isUser && (message.reasoning.length > 0 || message.status === 'streaming') && (
          <ReasoningBlock reasoning={message.reasoning} streaming={message.status === 'streaming'} />
        )}
        <div
          className={
            isUser
              ? 'rounded-2xl rounded-br-md bg-primary px-4 py-2.5 text-sm text-primary-foreground'
              : 'rounded-2xl rounded-bl-md border border-border bg-card px-4 py-3 text-sm'
          }
        >
          {message.content.length > 0 ? (
            <MessageContent content={message.content} />
          ) : message.status === 'streaming' ? (
            <span className="inline-block h-4 w-2 animate-pulse rounded-sm bg-muted-foreground/60" />
          ) : null}
        </div>
        {message.error && (
          <p className="flex items-center gap-1.5 text-xs text-destructive">
            <AlertCircle size={13} aria-hidden="true" />
            {message.error.message}
          </p>
        )}
        <div className={`flex items-center gap-1 text-xs text-muted-foreground ${isUser ? 'justify-end' : ''}`}>
          {message.content.length > 0 && (
            <button
              type="button"
              onClick={() => void copy()}
              className="inline-flex items-center gap-1 rounded px-1.5 py-0.5 hover:bg-muted hover:text-foreground"
            >
              {copied ? <Check size={12} aria-hidden="true" /> : <Copy size={12} aria-hidden="true" />}
            </button>
          )}
          {isUser && canEdit && message.status === 'complete' && onEdit && (
            <button
              type="button"
              onClick={onEdit}
              aria-label={t('chat.edit')}
              title={t('chat.edit')}
              className="inline-flex items-center gap-1 rounded px-1.5 py-0.5 hover:bg-muted hover:text-foreground"
            >
              <Pencil size={12} aria-hidden="true" />
            </button>
          )}
          {!isUser && canRegenerate && message.status === 'complete' && onRegenerate && (
            <button
              type="button"
              onClick={onRegenerate}
              className="inline-flex items-center gap-1 rounded px-1.5 py-0.5 hover:bg-muted hover:text-foreground"
            >
              <RotateCcw size={12} aria-hidden="true" />
            </button>
          )}
          {message.usage && message.status === 'complete' && (
            <span className="tabular-nums">
              {message.usage.inputTokens} → {message.usage.outputTokens}
            </span>
          )}
          {message.status === 'stopped' && <span>{t('chat.stopped')}</span>}
        </div>
      </div>
      {isUser && (
        <span className="mt-1 inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-muted text-muted-foreground">
          <User size={14} aria-hidden="true" />
        </span>
      )}
    </div>
  )
}
