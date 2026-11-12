import { useCallback, useState } from 'react'
import type { ReactNode } from 'react'
import { apiFetch } from '@umituz/web-hono/client'
import { usePageTitle } from '@umituz/web-dashboard'
import { Button } from '@umituz/web-design-system'
import { ConfirmButton } from '@umituz/web-design-system/molecules'
import { MonitorSmartphone } from 'lucide-react'
import type { SessionRow } from '@/data/chatTypes'
import { store, useCollection } from '@/data/store'
import { useT } from '@/i18n'
import { formatDateTime, useTimeAgo } from '@/lib/format'

export default function SessionsPage(): ReactNode {
  const t = useT()
  const formatAgo = useTimeAgo()
  const sessions = useCollection('sessions')
  const [busy, setBusy] = useState(false)
  usePageTitle(t('nav.items.sessions'))

  const others = sessions.filter((row) => !row.current)
  const current = sessions.find((row) => row.current)

  const revoke = useCallback(async (id: string) => {
    try {
      await apiFetch(`/api/sessions/${id}`, { method: 'DELETE' })
      await store.refresh(['sessions', 'activity'])
    } catch {
      return
    }
  }, [])

  const revokeOthers = useCallback(async () => {
    setBusy(true)
    try {
      await Promise.allSettled(others.map((row) => revoke(row.id)))
    } finally {
      setBusy(false)
    }
  }, [others, revoke])

  return (
    <div className="udb-fill-page overflow-y-auto">
      <div className="mx-auto w-full max-w-3xl space-y-6">
        <div className="flex items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">{t('sessions.title')}</h1>
            <p className="mt-1 text-sm text-muted-foreground">{t('sessions.subtitle')}</p>
          </div>
          {others.length > 0 && (
            <Button variant="outline" onClick={() => void revokeOthers()} disabled={busy}>
              {t('sessions.revokeAll')}
            </Button>
          )}
        </div>

        {sessions.length === 0 && (
          <p className="rounded-xl border border-dashed border-border p-8 text-center text-sm text-muted-foreground">
            {t('sessions.empty')}
          </p>
        )}

        {current && (
          <div className="rounded-xl border border-primary/40 bg-primary/5 p-5">
            <div className="flex items-start justify-between gap-4">
              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <p className="font-medium">{current.device}</p>
                  <span className="shrink-0 rounded-full bg-primary/10 px-2 py-0.5 text-[11px] text-primary">
                    {t('sessions.current')}
                  </span>
                </div>
                <p className="mt-1 font-mono text-xs text-muted-foreground">{current.ipAddress || '—'}</p>
                <p className="mt-2 text-xs text-muted-foreground">
                  {t('sessions.signedIn', { when: formatAgo(current.createdAt) })}
                </p>
              </div>
            </div>
          </div>
        )}

        {others.length > 0 && (
          <div className="space-y-3">
            <h2 className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              {t('sessions.othersTitle')}
            </h2>
            {others.map((row: SessionRow) => (
              <div key={row.id} className="flex items-start justify-between gap-4 rounded-xl border border-border bg-card p-5">
                <div className="min-w-0">
                  <p className="font-medium">{row.device}</p>
                  <p className="mt-1 font-mono text-xs text-muted-foreground">{row.ipAddress || '—'}</p>
                  <p className="mt-2 text-xs text-muted-foreground">
                    {t('sessions.lastActive', { when: formatAgo(row.updatedAt) })}
                  </p>
                  <p className="mt-0.5 text-xs text-muted-foreground">
                    {t('sessions.expires', { when: formatDateTime(row.expiresAt) })}
                  </p>
                </div>
                <ConfirmButton
                  size="sm"
                  variant="ghost"
                  confirmText={t('sessions.revokeConfirm')}
                  onConfirm={() => void revoke(row.id)}
                >
                  {t('sessions.revoke')}
                </ConfirmButton>
              </div>
            ))}
          </div>
        )}

        <div className="rounded-xl border border-border bg-card p-5">
          <div className="flex items-center gap-2 text-sm font-semibold">
            <MonitorSmartphone size={15} aria-hidden="true" />
            {t('sessions.hintTitle')}
          </div>
          <p className="mt-1 text-sm text-muted-foreground">{t('sessions.hint')}</p>
        </div>
      </div>
    </div>
  )
}
