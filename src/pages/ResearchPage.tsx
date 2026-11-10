import { useCallback, useEffect, useState } from 'react'
import type { ReactNode } from 'react'
import { ApiClientError, apiFetch } from '@umituz/web-hono/client'
import { usePageTitle } from '@umituz/web-dashboard'
import { Button, Input } from '@umituz/web-design-system'
import { Search } from 'lucide-react'
import type { TaskRow } from '@/data/chatTypes'
import { store, useCollection } from '@/data/store'
import { useT } from '@/i18n'

const TASK_POLL_MS = 1500

export default function ResearchPage(): ReactNode {
  const t = useT()
  const runs = useCollection('research')

  const [query, setQuery] = useState('')
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [pollTaskId, setPollTaskId] = useState<string | null>(null)

  usePageTitle(t('nav.items.research'))

  useEffect(() => {
    if (!pollTaskId) return
    const timer = setInterval(() => {
      void (async () => {
        try {
          const task = await apiFetch<TaskRow>(`/api/tasks/${pollTaskId}`)
          if (task.status === 'succeeded' || task.status === 'failed' || task.status === 'cancelled') {
            clearInterval(timer)
            setPollTaskId(null)
            await store.refresh(['research'])
          }
        } catch {
          return
        }
      })()
    }, TASK_POLL_MS)
    return () => clearInterval(timer)
  }, [pollTaskId])

  const startResearch = useCallback(async () => {
    const trimmed = query.trim()
    if (trimmed.length === 0) return
    setBusy(true)
    setError(null)
    try {
      const created = await apiFetch<{ taskId: string }>('/api/research', { method: 'POST', json: { query: trimmed } })
      setQuery('')
      setPollTaskId(created.taskId)
      await store.refresh(['research'])
    } catch (err) {
      setError(err instanceof ApiClientError ? err.message : t('research.startFailed'))
    } finally {
      setBusy(false)
    }
  }, [query, t])

  const removeRun = useCallback(async (id: string) => {
    try {
      await apiFetch(`/api/research/${id}`, { method: 'DELETE' })
      await store.refresh(['research'])
    } catch {
      return
    }
  }, [])

  return (
    <div className="udb-fill-page overflow-y-auto">
      <div className="mx-auto w-full max-w-3xl space-y-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">{t('research.title')}</h1>
          <p className="mt-1 text-sm text-muted-foreground">{t('research.subtitle')}</p>
        </div>

        <div className="space-y-2 rounded-xl border border-border bg-card p-5">
          <div className="flex gap-2">
            <Input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              onKeyDown={(event) => {
                if (event.key === 'Enter') void startResearch()
              }}
              placeholder={t('research.placeholder')}
              aria-label={t('research.title')}
            />
            <Button onClick={() => void startResearch()} disabled={busy || query.trim().length === 0}>
              <Search size={14} aria-hidden="true" />
              {busy ? t('research.status.running') : t('research.run')}
            </Button>
          </div>
          <p className="text-xs text-muted-foreground">{t('research.hint')}</p>
          {error && <p className="text-xs text-destructive">{error}</p>}
        </div>

        {runs.length === 0 && (
          <p className="rounded-xl border border-dashed border-border p-8 text-center text-sm text-muted-foreground">
            {t('research.empty')}
          </p>
        )}

        <div className="space-y-3">
          {runs.map((run) => (
            <div key={run.id} className="space-y-3 rounded-xl border border-border bg-card p-5">
              <div className="flex items-start justify-between gap-4">
                <div className="flex min-w-0 items-center gap-2">
                  <p className="truncate text-sm font-medium">{run.query}</p>
                  <span
                    className={`shrink-0 rounded-full px-2 py-0.5 text-[11px] ${
                      run.status === 'ready'
                        ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400'
                        : run.status === 'failed'
                          ? 'bg-destructive/10 text-destructive'
                          : 'bg-muted text-muted-foreground'
                    }`}
                  >
                    {t(`research.status.${run.status}`)}
                  </span>
                </div>
                <Button variant="ghost" size="sm" onClick={() => void removeRun(run.id)}>
                  {t('common.delete')}
                </Button>
              </div>

              {run.status === 'failed' && run.errorMessage && <p className="text-xs text-destructive">{run.errorMessage}</p>}

              {run.status === 'ready' && run.report && (
                <div className="space-y-3">
                  <p className="whitespace-pre-line text-sm leading-relaxed">{run.report}</p>
                  {run.sources.length > 0 && (
                    <div className="space-y-1.5 border-t border-border pt-3">
                      <p className="text-xs font-semibold text-muted-foreground">{t('research.sourcesTitle')}</p>
                      <ol className="space-y-1">
                        {run.sources.map((source, index) => (
                          <li key={source.url} className="text-xs">
                            <span className="text-muted-foreground">[{index + 1}]</span>{' '}
                            <a href={source.url} target="_blank" rel="noreferrer" className="text-primary hover:underline">
                              {source.title}
                            </a>
                          </li>
                        ))}
                      </ol>
                    </div>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
