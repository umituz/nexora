import { useEffect, useRef } from 'react'
import type { KeyboardEvent, ReactNode } from 'react'
import { ArrowUp, Square } from 'lucide-react'
import { Button, Textarea } from '@umituz/web-design-system'
import { useT } from '@/i18n'

const MAX_CONTENT = 32_000

interface ComposerProps {
  value: string
  onChange: (value: string) => void
  onSend: () => void
  onStop: () => void
  streaming: boolean
  disabled?: boolean
}

export function Composer({ value, onChange, onSend, onStop, streaming, disabled }: ComposerProps): ReactNode {
  const t = useT()
  const ref = useRef<HTMLTextAreaElement>(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    el.style.height = 'auto'
    el.style.height = `${Math.min(el.scrollHeight, 200)}px`
  }, [value])

  const tooLong = value.length > MAX_CONTENT
  const canSend = value.trim().length > 0 && !tooLong && !streaming && !disabled

  const handleKeyDown = (event: KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault()
      if (canSend) onSend()
    }
  }

  return (
    <div className="space-y-1.5">
      <div className="flex items-end gap-2 rounded-2xl border border-border bg-card p-2 shadow-sm focus-within:border-input">
        <Textarea
          ref={ref}
          value={value}
          onChange={(event) => onChange(event.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={t('chat.placeholder')}
          disabled={disabled}
          rows={1}
          className="max-h-[200px] min-h-[40px] resize-none border-0 bg-transparent px-2 py-2 focus-visible:ring-0 focus-visible:ring-offset-0"
          aria-label={t('chat.placeholder')}
        />
        {streaming ? (
          <Button variant="outline" size="icon" onClick={onStop} aria-label={t('chat.stop')} title={t('chat.stop')}>
            <Square size={14} aria-hidden="true" />
          </Button>
        ) : (
          <Button size="icon" onClick={onSend} disabled={!canSend} aria-label={t('chat.send')} title={t('chat.send')}>
            <ArrowUp size={16} aria-hidden="true" />
          </Button>
        )}
      </div>
      {tooLong && <p className="px-2 text-xs text-destructive">{t('chat.inputTooLong')}</p>}
    </div>
  )
}
