import { useCallback, useState } from 'react'
import type { ReactNode } from 'react'
import { apiFetch } from '@umituz/web-hono/client'
import { usePageTitle } from '@umituz/web-dashboard'
import { Badge, Button, Input, NativeSelect, Switch, Textarea } from '@umituz/web-design-system'
import type { NativeSelectOption } from '@umituz/web-design-system'
import { Segmented } from '@umituz/web-design-system/molecules'
import { ConfirmButton } from '@umituz/web-design-system/molecules'
import type { AutomationTestOutcome } from '@shared/ai/contracts'
import type { AutomationActionRow, AutomationRow, AutomationRunRow, AutomationSeverity } from '@/data/chatTypes'
import { store, useCollection } from '@/data/store'
import { useT } from '@/i18n'
import { useTimeAgo } from '@/lib/format'

const TRIGGER_GROUPS: { labelKey: string; events: readonly string[] }[] = [
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

const SEVERITIES: AutomationSeverity[] = ['info', 'success', 'warning', 'danger']

interface AutomationDraft {
  name: string
  trigger: string
  actions: AutomationActionRow[]
}

const EMPTY_DRAFT: AutomationDraft = { name: '', trigger: '', actions: [] }

function actionSummaryKey(action: AutomationActionRow): string {
  return action.type === 'notify' ? 'automations.actionNotify' : 'automations.actionWebhook'
}

export default function AutomationsPage(): ReactNode {
  const t = useT()
  const formatAgo = useTimeAgo()
  const automations = useCollection('automations')
  const [draft, setDraft] = useState<AutomationDraft | null>(null)
  const [busy, setBusy] = useState(false)
  const [expandedId, setExpandedId] = useState<string | null>(null)
  const [runs, setRuns] = useState<Record<string, AutomationRunRow[]>>({})
  const [testResult, setTestResult] = useState<Record<string, boolean>>({})
  usePageTitle(t('nav.items.automations'))

  const triggerOptions: NativeSelectOption[] = TRIGGER_GROUPS.flatMap((group) =>
    group.events.map((event) => ({ value: event, label: t(`webhooks.events.${event}`) })),
  )

  const create = useCallback(async () => {
    if (!draft || draft.name.trim().length === 0 || draft.trigger.length === 0 || draft.actions.length === 0) return
    setBusy(true)
    try {
      await apiFetch('/api/automations', {
        method: 'POST',
        json: { name: draft.name.trim(), trigger: draft.trigger, actions: draft.actions },
      })
      setDraft(null)
      await store.refresh(['automations', 'activity'])
    } catch {
      return
    } finally {
      setBusy(false)
    }
  }, [draft])

  const patch = useCallback(async (id: string, payload: Record<string, unknown>) => {
    try {
      await apiFetch(`/api/automations/${id}`, { method: 'PATCH', json: payload })
      await store.refresh(['automations', 'activity'])
    } catch {
      return
    }
  }, [])

  const remove = useCallback(async (id: string) => {
    try {
      await apiFetch(`/api/automations/${id}`, { method: 'DELETE' })
      setExpandedId((current) => (current === id ? null : current))
      await store.refresh(['automations', 'activity'])
    } catch {
      return
    }
  }, [])

  const test = useCallback(async (id: string) => {
    try {
      const outcome = await apiFetch<AutomationTestOutcome>(`/api/automations/${id}/test`, { method: 'POST' })
      setTestResult((current) => ({ ...current, [id]: outcome.ok }))
      await store.refresh(['automations', 'notifications'])
    } catch {
      return
    }
  }, [])

  const toggleRuns = useCallback(
    async (id: string) => {
      if (expandedId === id) {
        setExpandedId(null)
        return
      }
      setExpandedId(id)
      if (!runs[id]) {
        try {
          const rows = await apiFetch<AutomationRunRow[]>(`/api/automations/${id}/runs`)
          setRuns((current) => ({ ...current, [id]: rows }))
        } catch {
          return
        }
      }
    },
    [expandedId, runs],
  )

  const updateAction = useCallback((index: number, next: AutomationActionRow) => {
    setDraft((current) =>
      current ? { ...current, actions: current.actions.map((action, i) => (i === index ? next : action)) } : current,
    )
  }, [])

  const removeAction = useCallback((index: number) => {
    setDraft((current) =>
      current ? { ...current, actions: current.actions.filter((_, i) => i !== index) } : current,
    )
  }, [])

  const addNotify = useCallback(() => {
    setDraft((current) =>
      current
        ? {
            ...current,
            actions: [...current.actions, { type: 'notify', title: '', body: null, severity: 'info' }],
          }
        : current,
    )
  }, [])

  const addWebhook = useCallback(() => {
    setDraft((current) =>
      current ? { ...current, actions: [...current.actions, { type: 'webhook', url: '', secret: null }] } : current,
    )
  }, [])

  const canCreate =
    draft !== null &&
    draft.name.trim().length > 0 &&
    draft.trigger.length > 0 &&
    draft.actions.length > 0 &&
    draft.actions.every((action) =>
      action.type === 'notify' ? action.title.trim().length > 0 : action.url.trim().length > 0,
    )

  return (
    <div className="udb-fill-page overflow-y-auto">
      <div className="mx-auto w-full max-w-3xl space-y-6">
        <div className="flex items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">{t('automations.title')}</h1>
            <p className="mt-1 text-sm text-muted-foreground">{t('automations.subtitle')}</p>
          </div>
          {draft === null && (
            <Button onClick={() => setDraft(EMPTY_DRAFT)}>{t('automations.new')}</Button>
          )}
        </div>

        {draft !== null && (
          <div className="space-y-4 rounded-xl border border-border bg-card p-5">
            <h2 className="text-sm font-semibold">{t('automations.createTitle')}</h2>
            <div className="flex flex-col gap-1">
              <label className="text-xs font-medium text-muted-foreground">{t('automations.nameLabel')}</label>
              <Input
                value={draft.name}
                onChange={(event) => setDraft({ ...draft, name: event.target.value })}
                placeholder={t('automations.namePlaceholder')}
                maxLength={120}
                autoFocus
              />
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-xs font-medium text-muted-foreground">{t('automations.triggerLabel')}</label>
              <NativeSelect
                options={triggerOptions}
                value={draft.trigger}
                onChange={(event) => setDraft({ ...draft, trigger: event.target.value })}
                aria-label={t('automations.triggerLabel')}
              />
              <p className="text-[11px] text-muted-foreground">{t('automations.triggerHint')}</p>
            </div>
            <div className="space-y-3">
              <span className="text-xs font-medium text-muted-foreground">{t('automations.actionsLabel')}</span>
              {draft.actions.map((action, index) => (
                <div key={index} className="space-y-3 rounded-lg border border-border p-4">
                  <div className="flex items-center justify-between">
                    <p className="text-xs font-semibold">{t(actionSummaryKey(action))}</p>
                    <Button variant="ghost" size="sm" onClick={() => removeAction(index)}>
                      {t('common.remove')}
                    </Button>
                  </div>
                  {action.type === 'notify' ? (
                    <>
                      <Input
                        value={action.title}
                        onChange={(event) => updateAction(index, { ...action, title: event.target.value })}
                        placeholder={t('automations.notifyTitlePlaceholder')}
                        maxLength={200}
                      />
                      <Textarea
                        value={action.body ?? ''}
                        onChange={(event) => updateAction(index, { ...action, body: event.target.value || null })}
                        placeholder={t('automations.notifyBodyPlaceholder')}
                        rows={2}
                        maxLength={2000}
                      />
                      <Segmented
                        options={SEVERITIES.map((value) => ({ value, label: t(`automations.severity.${value}`) }))}
                        value={action.severity}
                        onChange={(severity) => updateAction(index, { ...action, severity })}
                      />
                    </>
                  ) : (
                    <>
                      <Input
                        value={action.url}
                        onChange={(event) => updateAction(index, { ...action, url: event.target.value })}
                        placeholder="https://example.com/hooks/nexora"
                        inputMode="url"
                        maxLength={2048}
                      />
                      <Input
                        value={action.secret ?? ''}
                        onChange={(event) => updateAction(index, { ...action, secret: event.target.value || null })}
                        placeholder={t('automations.webhookSecretPlaceholder')}
                        maxLength={200}
                      />
                    </>
                  )}
                </div>
              ))}
              <div className="flex gap-2">
                <Button variant="outline" size="sm" onClick={addNotify}>
                  {t('automations.addNotify')}
                </Button>
                <Button variant="outline" size="sm" onClick={addWebhook}>
                  {t('automations.addWebhook')}
                </Button>
              </div>
            </div>
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setDraft(null)}>
                {t('common.cancel')}
              </Button>
              <Button onClick={() => void create()} disabled={busy || !canCreate}>
                {t('automations.new')}
              </Button>
            </div>
          </div>
        )}

        {automations.length === 0 && draft === null && (
          <p className="rounded-xl border border-dashed border-border p-8 text-center text-sm text-muted-foreground">
            {t('automations.empty')}
          </p>
        )}

        <div className="space-y-3">
          {automations.map((row: AutomationRow) => {
            const tested = testResult[row.id]
            return (
              <div key={row.id} className="rounded-xl border border-border bg-card">
                <div className="space-y-3 p-5">
                  <div className="flex items-start justify-between gap-4">
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <p className="font-medium">{row.name}</p>
                        {!row.active ? <Badge tone="neutral">{t('automations.inactive')}</Badge> : null}
                      </div>
                      <p className="mt-1 text-xs text-muted-foreground">
                        {t('automations.when')} {t(`webhooks.events.${row.trigger}`)}
                      </p>
                      <div className="mt-2 flex flex-wrap gap-1.5">
                        {row.actions.map((action, index) => (
                          <span
                            key={index}
                            className="rounded-full border border-border px-2 py-0.5 text-[10px] text-muted-foreground"
                          >
                            {t(actionSummaryKey(action))}
                          </span>
                        ))}
                      </div>
                      <p className="mt-2 text-xs text-muted-foreground">
                        {row.runCount === 0
                          ? t('automations.neverRun')
                          : `${t('automations.runCount', { count: row.runCount })} · ${
                              row.lastRunAt ? t('automations.lastRun', { when: formatAgo(row.lastRunAt) }) : ''
                            }`}
                      </p>
                      {tested !== undefined ? (
                        <p className={`mt-1 text-xs ${tested ? 'text-success' : 'text-destructive'}`}>
                          {tested ? t('automations.testOk') : t('automations.testFailed')}
                        </p>
                      ) : null}
                    </div>
                    <div className="flex shrink-0 items-center gap-3">
                      <div className="flex items-center gap-2">
                        <Switch
                          checked={row.active}
                          onCheckedChange={(checked) => void patch(row.id, { active: checked })}
                          aria-label={t('automations.active')}
                        />
                      </div>
                      <div className="flex flex-col gap-1">
                        <Button variant="ghost" size="sm" onClick={() => void test(row.id)}>
                          {t('automations.test')}
                        </Button>
                        <Button variant="ghost" size="sm" onClick={() => void toggleRuns(row.id)}>
                          {t('automations.runs')}
                        </Button>
                        <ConfirmButton
                          size="sm"
                          variant="ghost"
                          confirmText={t('automations.deleteConfirm')}
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
                    {(runs[row.id] ?? []).length === 0 ? (
                      <p className="text-center text-sm text-muted-foreground">{t('automations.runsEmpty')}</p>
                    ) : (
                      <ul className="space-y-2">
                        {(runs[row.id] ?? []).map((run) => (
                          <li
                            key={run.id}
                            className="space-y-1 rounded-md border border-border px-3 py-2 text-xs"
                          >
                            <div className="flex flex-wrap items-center justify-between gap-2">
                              <span className="flex items-center gap-2">
                                <Badge tone={run.ok ? 'success' : 'destructive'}>
                                  {run.ok ? t('automations.runOk') : t('automations.runFailed')}
                                </Badge>
                                <span className="font-mono">{run.event}</span>
                              </span>
                              <span className="text-muted-foreground">{formatAgo(run.createdAt)}</span>
                            </div>
                            <ul className="space-y-0.5">
                              {run.results.map((result, index) => (
                                <li key={index} className={result.ok ? 'text-muted-foreground' : 'text-destructive'}>
                                  {t(`automations.actionType.${result.type}`)} · {result.detail}
                                </li>
                              ))}
                            </ul>
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
      </div>
    </div>
  )
}
