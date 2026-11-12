import { useCallback, useEffect, useState } from 'react'
import type { ReactNode } from 'react'
import { Link } from 'react-router'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { usePageTitle } from '@umituz/web-dashboard'
import { Badge, Button, NativeSelect } from '@umituz/web-design-system'
import type { NativeSelectOption } from '@umituz/web-design-system'
import { Segmented } from '@umituz/web-design-system/molecules'
import type { SegmentedOption } from '@umituz/web-design-system/molecules'
import { apiFetch } from '@umituz/web-hono/client'
import type { UsageRequestRow, UsageRequestsPage } from '@shared/ai/contracts'
import { useT } from '@/i18n'
import { formatCost, formatDateTime, formatDuration, formatCompact, useTimeAgo } from '@/lib/format'

const PAGE_SIZE = 25

function statusTone(status: string): 'success' | 'destructive' | 'neutral' {
  if (status === 'error') return 'destructive'
  if (status === 'complete') return 'success'
  return 'neutral'
}

function formatTokens(value: number): string {
  if (value >= 1_000_000) return `${(value / 1_000_000).toFixed(1)}M`
  if (value >= 1_000) return `${(value / 1_000).toFixed(1)}K`
  return String(value)
}

export default function RequestsPage(): ReactNode {
  const t = useT()
  const formatAgo = useTimeAgo()
  const [data, setData] = useState<UsageRequestsPage | null>(null)
  const [loadError, setLoadError] = useState<string | null>(null)
  const [page, setPage] = useState(1)
  const [status, setStatus] = useState('all')
  const [model, setModel] = useState('')
  const [reloadKey, setReloadKey] = useState(0)
  usePageTitle(t('nav.items.requests'))

  useEffect(() => {
    let alive = true
    setLoadError(null)
    const params = new URLSearchParams({ page: String(page), pageSize: String(PAGE_SIZE) })
    if (status !== 'all') params.set('status', status)
    if (model.length > 0) params.set('model', model)
    apiFetch<UsageRequestsPage>(`/api/requests?${params.toString()}`)
      .then((result) => {
        if (alive) setData(result)
      })
      .catch((err: unknown) => {
        if (alive) setLoadError(err instanceof Error ? err.message : t('common.error'))
      })
    return () => {
      alive = false
    }
  }, [page, status, model, reloadKey, t])

  const statusOptions: SegmentedOption<string>[] = [
    { value: 'all', label: t('requests.status.all') },
    { value: 'complete', label: t('requests.status.complete') },
    { value: 'error', label: t('requests.status.error') },
  ]

  const modelOptions: NativeSelectOption[] = [
    { value: '', label: t('requests.allModels') },
    ...(data?.models ?? []).map((name) => ({ value: name, label: name })),
  ]

  const changeFilter = useCallback((next: string) => {
    setStatus(next)
    setPage(1)
  }, [])

  const changeModel = useCallback((value: string) => {
    setModel(value)
    setPage(1)
  }, [])

  const total = data?.total ?? 0
  const pageCount = Math.max(1, Math.ceil(total / PAGE_SIZE))
  const from = total === 0 ? 0 : (page - 1) * PAGE_SIZE + 1
  const to = Math.min(total, page * PAGE_SIZE)

  const cell = (className: string): string => `px-4 py-3 align-middle ${className}`

  return (
    <div className="udb-fill-page overflow-y-auto">
      <div className="mx-auto w-full max-w-6xl space-y-5 px-1">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">{t('requests.title')}</h1>
          <p className="mt-1 text-sm text-muted-foreground">{t('requests.subtitle')}</p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <Segmented options={statusOptions} value={status} onChange={changeFilter} />
          <div className="w-56">
            <NativeSelect
              options={modelOptions}
              value={model}
              onChange={(event) => changeModel(event.target.value)}
              aria-label={t('requests.modelLabel')}
            />
          </div>
        </div>

        {loadError ? (
          <div className="flex flex-col items-center gap-3 rounded-xl border border-destructive/40 bg-card p-8 text-center">
            <p className="text-sm text-muted-foreground">{t('requests.loadFailed')}</p>
            <p className="max-w-md text-xs text-muted-foreground">{loadError}</p>
            <Button size="sm" onClick={() => setReloadKey((key) => key + 1)}>
              {t('common.retry')}
            </Button>
          </div>
        ) : !data ? (
          <div className="h-64 animate-pulse rounded-xl border border-border bg-card" role="status" aria-label={t('common.loading')} />
        ) : data.rows.length === 0 ? (
          <p className="rounded-xl border border-dashed border-border p-8 text-center text-sm text-muted-foreground">
            {t('requests.empty')}
          </p>
        ) : (
          <>
            <div className="overflow-x-auto rounded-xl border border-border bg-card">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border text-left text-xs font-medium uppercase tracking-wide text-muted-foreground">
                    <th className={cell('w-24')}>{t('requests.status')}</th>
                    <th className={cell('w-1/4')}>{t('requests.model')}</th>
                    <th className={cell('w-1/4')}>{t('requests.conversation')}</th>
                    <th className={cell('text-right')}>{t('requests.duration')}</th>
                    <th className={cell('text-right')}>{t('requests.tokensIn')}</th>
                    <th className={cell('text-right')}>{t('requests.tokensOut')}</th>
                    <th className={cell('text-right')}>{t('requests.cost')}</th>
                    <th className={cell('text-right')}>{t('requests.when')}</th>
                  </tr>
                </thead>
                <tbody>
                  {data.rows.map((row: UsageRequestRow) => (
                    <tr key={row.id} className="border-b border-border last:border-0 hover:bg-accent/40">
                      <td className={cell('')}>
                        <Badge tone={statusTone(row.status)}>{row.status}</Badge>
                      </td>
                      <td className={cell('font-medium')}>
                        {row.model}
                        {row.providerName ? (
                          <span className="ml-2 text-xs text-muted-foreground">{row.providerName}</span>
                        ) : null}
                      </td>
                      <td className={cell('max-w-48 truncate')}>
                        {row.conversationId && row.conversationTitle ? (
                          <Link to={`/app/chat/${row.conversationId}`} className="hover:underline">
                            {row.conversationTitle}
                          </Link>
                        ) : (
                          <span className="text-muted-foreground">—</span>
                        )}
                      </td>
                      <td className={`${cell('whitespace-nowrap text-right text-muted-foreground')} tabular-nums`}>
                        {formatDuration(row.durationMs)}
                      </td>
                      <td className={`${cell('text-right text-muted-foreground')} tabular-nums`}>
                        {formatTokens(row.inputTokens)}
                      </td>
                      <td className={`${cell('text-right text-muted-foreground')} tabular-nums`}>
                        {formatTokens(row.outputTokens)}
                      </td>
                      <td className={`${cell('whitespace-nowrap text-right')} tabular-nums`}>
                        {formatCost(row.costMicros)}
                      </td>
                      <td className={`${cell('whitespace-nowrap text-right text-muted-foreground')}`} title={formatDateTime(row.createdAt)}>
                        {formatAgo(row.createdAt)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="flex items-center justify-between gap-3">
              <p className="text-xs text-muted-foreground">
                {t('requests.range', {
                  from: formatCompact(from),
                  to: formatCompact(to),
                  total: formatCompact(total),
                })}
              </p>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="icon"
                  disabled={page <= 1}
                  onClick={() => setPage((current) => Math.max(1, current - 1))}
                  aria-label={t('requests.prev')}
                >
                  <ChevronLeft size={14} aria-hidden="true" />
                </Button>
                <span className="text-xs tabular-nums text-muted-foreground">
                  {t('requests.pageOf', { page, pageCount })}
                </span>
                <Button
                  variant="outline"
                  size="icon"
                  disabled={page >= pageCount}
                  onClick={() => setPage((current) => current + 1)}
                  aria-label={t('requests.next')}
                >
                  <ChevronRight size={14} aria-hidden="true" />
                </Button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  )
}
