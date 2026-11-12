import { useCallback, useState } from 'react'
import type { ReactNode } from 'react'
import { apiFetch } from '@umituz/web-hono/client'
import { usePageTitle } from '@umituz/web-dashboard'
import { Badge, Button, CodeBlock, CopyButton, Input } from '@umituz/web-design-system'
import { ConfirmButton } from '@umituz/web-design-system/molecules'
import { KeyRound, ShieldAlert } from 'lucide-react'
import type { ApiKeyCreatedRow, ApiKeyRow } from '@/data/chatTypes'
import { store, useCollection } from '@/data/store'
import { useT } from '@/i18n'
import { useTimeAgo } from '@/lib/format'

export default function ApiKeysPage(): ReactNode {
  const t = useT()
  const formatAgo = useTimeAgo()
  const apiKeys = useCollection('apiKeys')
  const [creating, setCreating] = useState(false)
  const [name, setName] = useState('')
  const [busy, setBusy] = useState(false)
  const [created, setCreated] = useState<ApiKeyCreatedRow | null>(null)
  const [renaming, setRenaming] = useState<{ id: string; name: string } | null>(null)
  usePageTitle(t('nav.items.apiKeys'))

  const active = apiKeys.filter((row) => !row.revokedAt)
  const revoked = apiKeys.filter((row) => row.revokedAt)

  const create = useCallback(async () => {
    if (name.trim().length === 0) return
    setBusy(true)
    try {
      const row = await apiFetch<ApiKeyCreatedRow>('/api/api-keys', {
        method: 'POST',
        json: { name: name.trim() },
      })
      setCreated(row)
      setName('')
      setCreating(false)
      await store.refresh(['apiKeys', 'activity'])
    } catch {
      return
    } finally {
      setBusy(false)
    }
  }, [name])

  const rename = useCallback(async () => {
    if (!renaming || renaming.name.trim().length === 0) return
    setBusy(true)
    try {
      await apiFetch(`/api/api-keys/${renaming.id}`, { method: 'PATCH', json: { name: renaming.name.trim() } })
      setRenaming(null)
      await store.refresh(['apiKeys', 'activity'])
    } catch {
      return
    } finally {
      setBusy(false)
    }
  }, [renaming])

  const revoke = useCallback(async (id: string) => {
    try {
      await apiFetch(`/api/api-keys/${id}`, { method: 'DELETE' })
      await store.refresh(['apiKeys', 'activity'])
    } catch {
      return
    }
  }, [])

  const sample = `${window.location.origin}/api/models`

  return (
    <div className="udb-fill-page overflow-y-auto">
      <div className="mx-auto w-full max-w-3xl space-y-6">
        <div className="flex items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">{t('apiKeys.title')}</h1>
            <p className="mt-1 text-sm text-muted-foreground">{t('apiKeys.subtitle')}</p>
          </div>
          {created === null && <Button onClick={() => setCreating(true)}>{t('apiKeys.new')}</Button>}
        </div>

        {created !== null && (
          <div className="space-y-3 rounded-xl border border-primary/40 bg-primary/5 p-5">
            <div className="flex items-center gap-2 text-sm font-semibold text-primary">
              <ShieldAlert size={16} aria-hidden="true" />
              {t('apiKeys.createdTitle')}
            </div>
            <p className="text-sm text-muted-foreground">{t('apiKeys.createdHint')}</p>
            <div className="flex items-center gap-2">
              <code className="flex-1 truncate rounded-md border border-border bg-card px-3 py-2 font-mono text-xs">
                {created.key}
              </code>
              <CopyButton text={created.key} aria-label={t('common.copy')} title={t('common.copy')} />
            </div>
            <div className="flex justify-end">
              <Button variant="outline" size="sm" onClick={() => setCreated(null)}>
                {t('apiKeys.done')}
              </Button>
            </div>
          </div>
        )}

        {creating && created === null && (
          <div className="space-y-3 rounded-xl border border-border bg-card p-5">
            <h2 className="text-sm font-semibold">{t('apiKeys.createTitle')}</h2>
            <Input
              value={name}
              onChange={(event) => setName(event.target.value)}
              placeholder={t('apiKeys.namePlaceholder')}
              aria-label={t('apiKeys.nameLabel')}
              maxLength={120}
              autoFocus
            />
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setCreating(false)}>
                {t('common.cancel')}
              </Button>
              <Button onClick={() => void create()} disabled={busy || name.trim().length === 0}>
                {t('apiKeys.new')}
              </Button>
            </div>
          </div>
        )}

        {active.length === 0 && created === null && !creating && (
          <p className="rounded-xl border border-dashed border-border p-8 text-center text-sm text-muted-foreground">
            {t('apiKeys.empty')}
          </p>
        )}

        <div className="space-y-3">
          {active.map((row: ApiKeyRow) => (
            <div key={row.id} className="rounded-xl border border-border bg-card p-5">
              {renaming?.id === row.id ? (
                <div className="space-y-3">
                  <Input
                    value={renaming.name}
                    onChange={(event) => setRenaming({ id: row.id, name: event.target.value })}
                    aria-label={t('apiKeys.nameLabel')}
                    maxLength={120}
                    autoFocus
                  />
                  <div className="flex justify-end gap-2">
                    <Button variant="ghost" size="sm" onClick={() => setRenaming(null)}>
                      {t('common.cancel')}
                    </Button>
                    <Button size="sm" onClick={() => void rename()} disabled={busy}>
                      {t('common.save')}
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="flex items-start justify-between gap-4">
                  <div className="min-w-0">
                    <p className="font-medium">{row.name}</p>
                    <p className="mt-1 font-mono text-xs text-muted-foreground">
                      {row.prefix}
                      {'•'.repeat(8)}
                      {row.lastFour}
                    </p>
                    <p className="mt-2 text-xs text-muted-foreground">
                      {row.lastUsedAt
                        ? `${t('apiKeys.lastUsed')} ${formatAgo(row.lastUsedAt)}`
                        : t('apiKeys.neverUsed')}
                    </p>
                  </div>
                  <div className="flex shrink-0 gap-1">
                    <Button variant="ghost" size="sm" onClick={() => setRenaming({ id: row.id, name: row.name })}>
                      {t('agents.editAction')}
                    </Button>
                    <ConfirmButton
                      size="sm"
                      variant="ghost"
                      confirmText={t('apiKeys.revokeConfirm')}
                      onConfirm={() => void revoke(row.id)}
                    >
                      {t('apiKeys.revoke')}
                    </ConfirmButton>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>

        {revoked.length > 0 && (
          <div className="space-y-3">
            <h2 className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              {t('apiKeys.revokedSection')}
            </h2>
            {revoked.map((row: ApiKeyRow) => (
              <div
                key={row.id}
                className="flex items-center justify-between gap-4 rounded-xl border border-border bg-card p-5 opacity-60"
              >
                <div className="min-w-0">
                  <p className="font-medium line-through">{row.name}</p>
                  <p className="mt-1 font-mono text-xs text-muted-foreground">
                    {row.prefix}
                    {'•'.repeat(8)}
                    {row.lastFour}
                  </p>
                </div>
                <Badge tone="neutral">{t('apiKeys.revokedBadge')}</Badge>
              </div>
            ))}
          </div>
        )}

        <div className="rounded-xl border border-border bg-card p-5">
          <div className="flex items-center gap-2 text-sm font-semibold">
            <KeyRound size={15} aria-hidden="true" />
            {t('apiKeys.usageTitle')}
          </div>
          <p className="mt-1 text-sm text-muted-foreground">{t('apiKeys.usageHint')}</p>
          <div className="mt-3">
            <CodeBlock language="bash">{`curl -H "Authorization: Bearer nx_…" ${sample}`}</CodeBlock>
          </div>
        </div>
      </div>
    </div>
  )
}
