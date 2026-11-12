import { useCallback, useState } from 'react'
import type { ReactNode } from 'react'
import { apiFetch } from '@umituz/web-hono/client'
import { usePageTitle } from '@umituz/web-dashboard'
import { Badge, Button, CodeBlock, CopyButton, Input, Switch } from '@umituz/web-design-system'
import { ConfirmButton } from '@umituz/web-design-system/molecules'
import type { WebhookDeliveryOutcome } from '@shared/ai/contracts'
import type { WebhookCreatedRow, WebhookDeliveryRow, WebhookRow } from '@/data/chatTypes'
import { store, useCollection } from '@/data/store'
import { useT } from '@/i18n'
import { formatDuration, useTimeAgo } from '@/lib/format'

const EVENT_GROUPS: { labelKey: string; events: readonly string[] }[] = [
  {
    labelKey: 'webhooks.groups.conversations',
    events: ['conversation.create', 'conversation.rename', 'conversation.delete'],
  },
  { labelKey: 'webhooks.groups.projects', events: ['project.create', 'project.update', 'project.delete'] },
  { labelKey: 'webhooks.groups.agents', events: ['agent.create', 'agent.update', 'agent.delete'] },
  { labelKey: 'webhooks.groups.memories', events: ['memory.create', 'memory.delete'] },
  {
    labelKey: 'webhooks.groups.documents',
    events: ['document.create', 'document.delete', 'document.ready', 'document.failed'],
  },
  {
    labelKey: 'webhooks.groups.research',
    events: ['research.start', 'research.delete', 'research.ready', 'research.failed'],
  },
  {
    labelKey: 'webhooks.groups.system',
    events: ['api_key.create', 'api_key.update', 'api_key.revoke', 'settings.update', 'task.failed'],
  },
]

interface WebhookDraft {
  name: string
  url: string
  events: string[]
}

const EMPTY_DRAFT: WebhookDraft = { name: '', url: '', events: [] }

function successRate(row: WebhookRow): number | null {
  const total = row.successCount + row.failureCount
  if (total === 0) return null
  return (row.successCount / total) * 100
}

export default function WebhooksPage(): ReactNode {
  const t = useT()
  const formatAgo = useTimeAgo()
  const webhooks = useCollection('webhooks')
  const [draft, setDraft] = useState<WebhookDraft | null>(null)
  const [busy, setBusy] = useState(false)
  const [created, setCreated] = useState<WebhookCreatedRow | null>(null)
  const [rotated, setRotated] = useState<{ id: string; secret: string } | null>(null)
  const [expandedId, setExpandedId] = useState<string | null>(null)
  const [deliveries, setDeliveries] = useState<Record<string, WebhookDeliveryRow[]>>({})
  const [testResult, setTestResult] = useState<Record<string, WebhookDeliveryOutcome>>({})
  usePageTitle(t('nav.items.webhooks'))

  const create = useCallback(async () => {
    if (!draft || draft.name.trim().length === 0 || draft.events.length === 0) return
    setBusy(true)
    try {
      const row = await apiFetch<WebhookCreatedRow>('/api/webhooks', {
        method: 'POST',
        json: { name: draft.name.trim(), url: draft.url.trim(), events: draft.events },
      })
      setCreated(row)
      setDraft(null)
      await store.refresh(['webhooks', 'activity'])
    } catch {
      return
    } finally {
      setBusy(false)
    }
  }, [draft])

  const patch = useCallback(async (id: string, payload: Record<string, unknown>) => {
    try {
      await apiFetch(`/api/webhooks/${id}`, { method: 'PATCH', json: payload })
      await store.refresh(['webhooks', 'activity'])
    } catch {
      return
    }
  }, [])

  const remove = useCallback(async (id: string) => {
    try {
      await apiFetch(`/api/webhooks/${id}`, { method: 'DELETE' })
      setExpandedId((current) => (current === id ? null : current))
      await store.refresh(['webhooks', 'activity'])
    } catch {
      return
    }
  }, [])

  const test = useCallback(async (id: string) => {
    try {
      const outcome = await apiFetch<WebhookDeliveryOutcome>(`/api/webhooks/${id}/test`, { method: 'POST' })
      setTestResult((current) => ({ ...current, [id]: outcome }))
      await store.refresh(['webhooks'])
    } catch {
      return
    }
  }, [])

  const rotate = useCallback(async (id: string) => {
    try {
      const row = await apiFetch<{ id: string; secret: string }>(`/api/webhooks/${id}/rotate`, { method: 'POST' })
      setRotated(row)
      await store.refresh(['webhooks', 'activity'])
    } catch {
      return
    }
  }, [])

  const toggleDeliveries = useCallback(
    async (id: string) => {
      if (expandedId === id) {
        setExpandedId(null)
        return
      }
      setExpandedId(id)
      if (!deliveries[id]) {
        try {
          const rows = await apiFetch<WebhookDeliveryRow[]>(`/api/webhooks/${id}/deliveries`)
          setDeliveries((current) => ({ ...current, [id]: rows }))
        } catch {
          return
        }
      }
    },
    [expandedId, deliveries],
  )

  const toggleDraftEvent = useCallback((event: string) => {
    setDraft((current) =>
      current
        ? {
            ...current,
            events: current.events.includes(event)
              ? current.events.filter((value) => value !== event)
              : [...current.events, event],
          }
        : current,
    )
  }, [])

  const secretPanel = (secret: string, title: string, hint: string, onDone: () => void): ReactNode => (
    <div className="space-y-3 rounded-xl border border-primary/40 bg-primary/5 p-5">
      <p className="text-sm font-semibold text-primary">{title}</p>
      <p className="text-sm text-muted-foreground">{hint}</p>
      <div className="flex items-center gap-2">
        <code className="flex-1 truncate rounded-md border border-border bg-card px-3 py-2 font-mono text-xs">{secret}</code>
        <CopyButton text={secret} aria-label={t('common.copy')} title={t('common.copy')} />
      </div>
      <div className="flex justify-end">
        <Button variant="outline" size="sm" onClick={onDone}>
          {t('apiKeys.done')}
        </Button>
      </div>
    </div>
  )

  return (
    <div className="udb-fill-page overflow-y-auto">
      <div className="mx-auto w-full max-w-3xl space-y-6">
        <div className="flex items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">{t('webhooks.title')}</h1>
            <p className="mt-1 text-sm text-muted-foreground">{t('webhooks.subtitle')}</p>
          </div>
          {draft === null && created === null && (
            <Button onClick={() => setDraft(EMPTY_DRAFT)}>{t('webhooks.new')}</Button>
          )}
        </div>

        {created !== null &&
          secretPanel(
            created.secret,
            t('webhooks.createdTitle'),
            t('webhooks.createdHint'),
            () => setCreated(null),
          )}

        {rotated !== null &&
          secretPanel(
            rotated.secret,
            t('webhooks.rotatedTitle'),
            t('webhooks.rotatedHint'),
            () => setRotated(null),
          )}

        {draft !== null && created === null && (
          <div className="space-y-4 rounded-xl border border-border bg-card p-5">
            <h2 className="text-sm font-semibold">{t('webhooks.createTitle')}</h2>
            <div className="grid gap-3 sm:grid-cols-2">
              <div className="flex flex-col gap-1">
                <label className="text-xs font-medium text-muted-foreground">{t('webhooks.nameLabel')}</label>
                <Input
                  value={draft.name}
                  onChange={(event) => setDraft({ ...draft, name: event.target.value })}
                  placeholder={t('webhooks.namePlaceholder')}
                  maxLength={120}
                  autoFocus
                />
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-xs font-medium text-muted-foreground">{t('webhooks.urlLabel')}</label>
                <Input
                  value={draft.url}
                  onChange={(event) => setDraft({ ...draft, url: event.target.value })}
                  placeholder="https://example.com/hooks/nexora"
                  inputMode="url"
                  maxLength={2048}
                />
              </div>
            </div>
            <div className="space-y-3">
              <div>
                <span className="text-xs font-medium text-muted-foreground">{t('webhooks.eventsLabel')}</span>
                <p className="mt-0.5 text-xs text-muted-foreground">{t('webhooks.eventsHint')}</p>
              </div>
              {EVENT_GROUPS.map((group) => (
                <div key={group.labelKey} className="space-y-1.5">
                  <p className="text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">
                    {t(group.labelKey)}
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {group.events.map((event) => {
                      const bound = draft.events.includes(event)
                      return (
                        <button
                          key={event}
                          type="button"
                          onClick={() => toggleDraftEvent(event)}
                          aria-pressed={bound}
                          className={`rounded-full border px-3 py-1 text-xs transition ${
                            bound
                              ? 'border-primary bg-primary/10 text-foreground'
                              : 'border-border text-muted-foreground hover:bg-accent'
                          }`}
                        >
                          {t(`webhooks.events.${event}`)}
                        </button>
                      )
                    })}
                  </div>
                </div>
              ))}
            </div>
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setDraft(null)}>
                {t('common.cancel')}
              </Button>
              <Button
                onClick={() => void create()}
                disabled={busy || draft.name.trim().length === 0 || draft.url.trim().length === 0 || draft.events.length === 0}
              >
                {t('webhooks.new')}
              </Button>
            </div>
          </div>
        )}

        {webhooks.length === 0 && draft === null && created === null && rotated === null && (
          <p className="rounded-xl border border-dashed border-border p-8 text-center text-sm text-muted-foreground">
            {t('webhooks.empty')}
          </p>
        )}

        <div className="space-y-3">
          {webhooks.map((row: WebhookRow) => {
            const rate = successRate(row)
            const outcome = testResult[row.id]
            return (
              <div key={row.id} className="rounded-xl border border-border bg-card">
                <div className="space-y-3 p-5">
                  <div className="flex items-start justify-between gap-4">
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <p className="font-medium">{row.name}</p>
                        {!row.active ? <Badge tone="neutral">{t('webhooks.inactive')}</Badge> : null}
                      </div>
                      <p className="mt-1 truncate font-mono text-xs text-muted-foreground">{row.url}</p>
                      <div className="mt-2 flex flex-wrap gap-1.5">
                        {row.events.map((event) => (
                          <span
                            key={event}
                            className="rounded-full border border-border px-2 py-0.5 text-[10px] text-muted-foreground"
                          >
                            {t(`webhooks.events.${event}`)}
                          </span>
                        ))}
                      </div>
                      <p className="mt-2 text-xs text-muted-foreground">
                        {rate === null
                          ? t('webhooks.neverTriggered')
                          : `${t('webhooks.successRate')} ${rate.toFixed(0)}% · ${t('webhooks.lastTriggered')} ${
                              row.lastTriggeredAt ? formatAgo(row.lastTriggeredAt) : t('webhooks.neverTriggered')
                            }`}
                      </p>
                      {outcome ? (
                        <p className={`mt-1 text-xs ${outcome.ok ? 'text-success' : 'text-destructive'}`}>
                          {outcome.ok
                            ? t('webhooks.testSent', { code: outcome.statusCode ?? 0, ms: outcome.durationMs })
                            : t('webhooks.testFailed', { error: outcome.error ?? '' })}
                        </p>
                      ) : null}
                    </div>
                    <div className="flex shrink-0 items-center gap-3">
                      <div className="flex items-center gap-2">
                        <Switch
                          checked={row.active}
                          onCheckedChange={(checked) => void patch(row.id, { active: checked })}
                          aria-label={t('webhooks.active')}
                        />
                      </div>
                      <div className="flex flex-col gap-1">
                        <Button variant="ghost" size="sm" onClick={() => void test(row.id)}>
                          {t('webhooks.test')}
                        </Button>
                        <Button variant="ghost" size="sm" onClick={() => void toggleDeliveries(row.id)}>
                          {t('webhooks.deliveries')}
                        </Button>
                        <ConfirmButton
                          size="sm"
                          variant="ghost"
                          confirmText={t('webhooks.rotateConfirm')}
                          onConfirm={() => void rotate(row.id)}
                        >
                          {t('webhooks.rotate')}
                        </ConfirmButton>
                        <ConfirmButton
                          size="sm"
                          variant="ghost"
                          confirmText={t('webhooks.deleteConfirm')}
                          onConfirm={() => void remove(row.id)}
                        >
                          {t('common.delete')}
                        </ConfirmButton>
                      </div>
                    </div>
                  </div>
                </div>

                {expandedId === row.id ? (
                  <div className="border-t border-border px-5 py-4">
                    {(deliveries[row.id] ?? []).length === 0 ? (
                      <p className="text-center text-sm text-muted-foreground">{t('webhooks.deliveriesEmpty')}</p>
                    ) : (
                      <ul className="space-y-2">
                        {(deliveries[row.id] ?? []).map((delivery) => (
                          <li
                            key={delivery.id}
                            className="flex flex-wrap items-center justify-between gap-2 rounded-md border border-border px-3 py-2 text-xs"
                          >
                            <span className="flex items-center gap-2">
                              <Badge tone={delivery.ok ? 'success' : 'destructive'}>
                                {delivery.statusCode ?? t('webhooks.noResponse')}
                              </Badge>
                              <span className="font-mono">{delivery.event}</span>
                            </span>
                            <span className="text-muted-foreground">
                              {formatDuration(delivery.durationMs)} · {formatAgo(delivery.createdAt)}
                              {delivery.error ? ` · ${delivery.error}` : ''}
                            </span>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                ) : null}
              </div>
            )
          })}
        </div>

        <div className="rounded-xl border border-border bg-card p-5">
          <p className="text-sm font-semibold">{t('webhooks.usageTitle')}</p>
          <p className="mt-1 text-sm text-muted-foreground">{t('webhooks.usageHint')}</p>
          <div className="mt-3">
            <CodeBlock language="bash">{`curl -X POST https://your-endpoint.example/hook \\
  -H "Content-Type: application/json" \\
  -H "X-Nexora-Event: document.ready" \\
  -H "X-Nexora-Signature: sha256=$(printf '%s' "$BODY" | openssl dgst -sha256 -hmac "$WHSEC" | cut -d' ' -f2)" \\
  -d "$BODY"`}</CodeBlock>
          </div>
        </div>
      </div>
    </div>
  )
}
