import type { ReactNode } from 'react'
import { FileText, X } from 'lucide-react'
import type { AttachmentRow } from '@/data/chatTypes'
import { useT } from '@/i18n'

const STATUS_KEYS = {
  pending: 'chat.attachmentPending',
  stored: 'chat.attachmentStored',
  failed: 'chat.attachmentFailed',
} as const

interface AttachmentChipsProps {
  attachments: AttachmentRow[]
  onRemove: (id: string) => void
}

export function AttachmentChips({ attachments, onRemove }: AttachmentChipsProps): ReactNode {
  const t = useT()
  if (attachments.length === 0) return null

  return (
    <div className="mb-2 flex flex-wrap gap-1.5">
      {attachments.map((row) => (
        <span
          key={row.id}
          className="inline-flex max-w-full items-center gap-1.5 rounded-full border border-border bg-muted/50 py-1 pl-2 pr-1 text-xs"
        >
          <a
            href={`/api/attachments/${row.id}/download`}
            title={t('chat.attachmentDownload')}
            className="inline-flex min-w-0 items-center gap-1.5 hover:text-foreground"
          >
            <FileText size={12} aria-hidden="true" className="shrink-0" />
            <span className="max-w-40 truncate">{row.name}</span>
          </a>
          {row.status !== 'processed' && (
            <span className="shrink-0 text-muted-foreground">{t(STATUS_KEYS[row.status])}</span>
          )}
          <button
            type="button"
            onClick={() => onRemove(row.id)}
            className="shrink-0 rounded-full p-0.5 text-muted-foreground hover:bg-muted hover:text-foreground"
            aria-label={t('chat.attachmentRemove')}
          >
            <X size={12} aria-hidden="true" />
          </button>
        </span>
      ))}
    </div>
  )
}
