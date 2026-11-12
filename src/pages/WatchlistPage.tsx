import { useCallback, useEffect, useState } from 'react'
import type { ReactNode } from 'react'
import { ApiClientError, apiFetch } from '@umituz/web-hono/client'
import { usePageTitle } from '@umituz/web-dashboard'
import { Button, Input, Switch } from '@umituz/web-design-system'
import { ConfirmButton } from '@umituz/web-design-system/molecules'
import { Plus, Radar } from 'lucide-react'
import type { TaskRow } from '@/data/chatTypes'
import { store, useCollection } from '@/data/store'
import { useT } from '@/i18n'
import { useTimeAgo } from '@/lib/format'

const TASK_POLL_MS = 1500

export default function WatchlistPage(): ReactNode {
  const t = useT()
  const formatAgo = useTimeAgo()
  const items = useCollection('watchlist')
  const feed = useCollection('watchFeed')

  const [keyword, setKeyword] = useState('')
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [scanningIds, setScanningIds] = useState<string[]>([])
  const [pollTaskIds, setPollTaskIds] = useState<string[]>([])
  const [readyOnly, setReadyOnly] = useState(false)
  usePageTitle(t('nav.items.watchlist'))

  useEffect(() => {
    if (pollTaskIds.length === 0) return
    const timer = setInterval(() => {
      void (async () => {
        const settled: string[] = []
        for (const taskId of pollTaskIds) {
          try {
            const task = await apiFetch<TaskRow>(`/api/tasks/${taskId}`)
            if (task.status === 'succeeded' || task.status === 'failed' || task.status === 'cancelled') settled.push(taskId)
          } catch {
            return
          }
        }
        if (settled.length > 0) {
          setPollTaskIds((current) => current.filter((taskId) => !settled.includes(taskId)))
          await store.refresh(['watchFeed', 'watchlist', 'notifications'])
        }
      })()
    }, TASK_POLL_MS)
    return () => clearInterval(timer)
  }, [pollTaskIds])

  const add = useCallback(async () => {
    const trimmed = keyword.trim()
    if (trimmed.length === 0) return
    setBusy(true)
    setError(null)
    try {
      await apiFetch('/api/watchlist', { method: 'POST', json: { keyword: trimmed } })
      setKeyword('')
      await store.refresh(['watchlist', 'activity'])
    } catch (err) {
      setError(err instanceof ApiClientError ? err.message : t('watchlist.addFailed'))
    } finally {
      setBusy(false)
    }
  }, [keyword, t])

  const remove = useCallback(async (id: string) => {
    try {
      await apiFetch(`/api/watchlist/${id}`, { method: 'DELETE' })
      await store.refresh(['watchlist', 'activity'])
    } catch {
      return
    }
  }, [])

  const scan = useCallback(async (id: string) => {
    setScanningIds((current) => [...current, id])
    try {
      const started = await apiFetch<{ taskId: string }>(`/api/watchlist/${id}/scan`, { method: 'POST' })
      setPollTaskIds((current) => [...current, started.taskId])
      await store.refresh(['watchFeed', 'watchlist', 'activity'])
    } catch {
      return
    } finally {
      setScanningIds((current) => current.filter((itemId) => itemId !== id))
    }
  }, [])

  const scanAll = useCallback(async () => {
    await Promise.allSettled(items.map((item) => scan(item.id)))
  }, [items, scan])

  const visibleFeed = readyOnly ? feed.filter((scanRow) => scanRow.status === 'ready') : feed
  const anyScanning = scanningIds.length > 0 || pollTaskIds.length > 0

  return (
    <div className="udb-fill-page overflow-y-auto">
      <div className="mx-auto w-full max-w-5xl space-y-6">
        <div className="flex items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">{t('watchlist.title')}</h1>
            <p className="mt-1 text-sm text-muted-foreground">{t('watchlist.subtitle')}</p>
          </div>
          {items.length > 0 && (
            <Button variant="outline" onClick={() => void scanAll()} disabled={anyScanning}>
              <Radar size={14} aria-hidden="true" />
              {anyScanning ? t('watchlist.scanning') : t('watchlist.scanAll')}
            </Button>
          )}
        </div>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          <aside className="space-y-4">
            <div className="space-y-3 rounded-xl border border-border bg-card p-5">
              <div>
                <h2 className="text-sm font-semibold">{t('watchlist.keywordsTitle')}</h2>
                <p className="mt-1 text-xs text-muted-foreground">{t('watchlist.keywordsHint')}</p>
              </div>
              <div className="flex gap-2">
                <Input
                  value={keyword}
                  onChange={(event) => setKeyword(event.target.value)}
                  onKeyDown={(event) => {
                    if (event.key === 'Enter') void add()
                  }}
                  placeholder={t('watchlist.addPlaceholder')}
                  maxLength={80}
                  aria-label={t('watchlist.keywordsTitle')}
                />
                <Button onClick={() => void add()} disabled={busy || keyword.trim().length === 0}>
                  <Plus size={14} aria-hidden="true" />
                  {t('watchlist.add')}
                </Button>
              </div>
              {error && <p className="text-xs text-destructive">{error}</p>}
            </div>

            <div className="space-y-2">
              {items.length === 0 ? (
                <p className="rounded-xl border border-dashed border-border p-6 text-center text-sm text-muted-foreground">
                  {t('watchlist.empty')}
                </p>
              ) : (
                items.map((item) => (
                  <div key={item.id} className="space-y-2 rounded-xl border border-border bg-card p-4">
                    <div className="flex items-start justify-between gap-2">
                      <p className="min-w-0 break-words text-sm font-medium">{item.keyword}</p>
                      <ConfirmButton
                        size="sm"
                        variant="ghost"
                        confirmText={t('watchlist.removeConfirm')}
                        onConfirm={() => void remove(item.id)}
                      >
                        {t('common.remove')}
                      </ConfirmButton>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      {item.lastScanAt
                        ? t('watchlist.scannedAgo', { when: formatAgo(item.lastScanAt) })
                        : t('watchlist.neverScanned')}
                    </p>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => void scan(item.id)}
                      disabled={anyScanning}
                      className="w-full"
                    >
                      {t('watchlist.scan')}
                    </Button>
                  </div>
                ))
              )}
            </div>
          </aside>

          <section className="space-y-4 lg:col-span-2">
            <div className="flex items-center gap-2 self-end">
              <Switch checked={readyOnly} onCheckedChange={setReadyOnly} aria-label={t('watchlist.readyOnly')} />
              <span className="text-xs text-muted-foreground">{t('watchlist.readyOnly')}</span>
            </div>

            {visibleFeed.length === 0 ? (
              <p className="rounded-xl border border-dashed border-border p-8 text-center text-sm text-muted-foreground">
                {feed.length === 0 ? t('watchlist.feedEmpty') : t('watchlist.feedFilteredEmpty')}
              </p>
            ) : (
              <div className="space-y-3">
                {visibleFeed.map((scanRow) => (
                  <div key={scanRow.id} className="space-y-3 rounded-xl border border-border bg-card p-5">
                    <div className="flex items-center justify-between gap-4">
                      <div className="flex min-w-0 items-center gap-2">
                        <p className="truncate text-sm font-medium">{scanRow.keyword}</p>
                        <span
                          className={`shrink-0 rounded-full px-2 py-0.5 text-[11px] ${
                            scanRow.status === 'ready'
                              ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400'
                              : scanRow.status === 'failed'
                                ? 'bg-destructive/10 text-destructive'
                                : 'bg-muted text-muted-foreground'
                          }`}
                        >
                          {t(`research.status.${scanRow.status}`)}
                        </span>
                      </div>
                      <span className="shrink-0 text-xs text-muted-foreground">{formatAgo(scanRow.createdAt)}</span>
                    </div>

                    {scanRow.status === 'failed' && scanRow.errorMessage && (
                      <p className="text-xs text-destructive">{scanRow.errorMessage}</p>
                    )}

                    {scanRow.status === 'ready' && scanRow.report && (
                      <p className="whitespace-pre-line text-sm leading-relaxed">{scanRow.report}</p>
                    )}

                    {scanRow.sources.length > 0 && (
                      <div className="space-y-1.5 border-t border-border pt-3">
                        <p className="text-xs font-semibold text-muted-foreground">{t('research.sourcesTitle')}</p>
                        <ol className="space-y-1">
                          {scanRow.sources.map((source, index) => (
                            <li key={source.url} className="text-xs">
                              <span className="text-muted-foreground">[{index + 1}]</span>{' '}
                              <a href={source.url} target="_blank" rel="noreferrer" className="text-primary hover:underline">
                                {source.title}
                              </a>
                              {source.snippet && <p className="mt-0.5 pl-5 text-muted-foreground">{source.snippet}</p>}
                            </li>
                          ))}
                        </ol>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </section>
        </div>
      </div>
    </div>
  )
}
