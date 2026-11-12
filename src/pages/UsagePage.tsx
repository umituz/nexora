import { useEffect, useMemo, useState } from 'react'
import type { ReactNode } from 'react'
import { Link } from 'react-router'
import { Minus, TrendingDown, TrendingUp } from 'lucide-react'
import { usePageTitle } from '@umituz/web-dashboard'
import { BarChart, Donut, HBars, LineChart } from '@umituz/web-design-system/charts'
import { apiFetch } from '@umituz/web-hono/client'
import type {
  UsageAnalytics,
  UsageConversationRow,
  UsageModelRow,
  UsageTrend,
} from '@shared/ai/contracts'
import { useCollection } from '@/data/store'
import { useT } from '@/i18n'

const RANGES = [7, 30, 90] as const

function formatTokens(value: number): string {
  if (value >= 1_000_000) return `${(value / 1_000_000).toFixed(1)}M`
  if (value >= 1_000) return `${(value / 1_000).toFixed(1)}K`
  return String(value)
}

function formatCost(costMicros: number): string {
  const dollars = costMicros / 1_000_000
  if (dollars === 0) return '$0.00'
  if (dollars < 0.01) return `$${dollars.toFixed(4)}`
  return `$${dollars.toFixed(2)}`
}

function formatDuration(ms: number): string {
  if (ms <= 0) return '—'
  if (ms < 1000) return `${Math.round(ms)} ms`
  return `${(ms / 1000).toFixed(1)} s`
}

function formatPct(value: number): string {
  return `${value.toFixed(1)}%`
}

function formatDayLabel(date: string): string {
  return new Date(`${date}T00:00:00Z`).toLocaleDateString(undefined, {
    month: 'short',
    day: 'numeric',
    timeZone: 'UTC',
  })
}

function formatFullDay(date: string): string {
  return new Date(`${date}T00:00:00Z`).toLocaleDateString(undefined, {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    timeZone: 'UTC',
  })
}

function formatLastUsed(value: string | null): string {
  if (!value) return '—'
  return new Date(value).toLocaleString(undefined, { dateStyle: 'medium', timeStyle: 'short' })
}

/** Trend chip ported from the AppSignal-style StatsCard: delta vs previous window. */
function TrendBadge({ trend, positive }: { trend: UsageTrend; positive: 'up' | 'down' }): ReactNode {
  if (trend.deltaPct === null) {
    return <span className="text-xs text-muted-foreground">—</span>
  }
  const direction = trend.deltaPct > 0.05 ? 'up' : trend.deltaPct < -0.05 ? 'down' : 'stable'
  if (direction === 'stable') {
    return (
      <span className="inline-flex items-center gap-1 text-xs text-muted-foreground">
        <Minus className="h-3 w-3" />
        0%
      </span>
    )
  }
  const isGood = direction === positive
  const tone = isGood ? 'text-success' : 'text-destructive'
  return (
    <span className={`inline-flex items-center gap-1 text-xs font-medium ${tone}`}>
      {direction === 'up' ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
      {formatPct(Math.abs(trend.deltaPct))}
    </span>
  )
}

function StatCard({
  label,
  value,
  sub,
  trend,
  positive,
  children,
}: {
  label: string
  value: string
  sub?: ReactNode
  trend?: UsageTrend
  positive?: 'up' | 'down'
  children?: ReactNode
}): ReactNode {
  return (
    <div className="rounded-xl border border-border bg-card p-5">
      <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">{label}</p>
      <p className="mt-2 text-2xl font-bold tabular-nums">{value}</p>
      {sub ? <p className="mt-1 text-xs text-muted-foreground">{sub}</p> : null}
      {children}
      {trend && positive ? (
        <div className="mt-2 flex items-center gap-2">
          <TrendBadge trend={trend} positive={positive} />
        </div>
      ) : null}
    </div>
  )
}

function ChartShell({
  title,
  subtitle,
  children,
  className,
}: {
  title: string
  subtitle?: string
  children: ReactNode
  className?: string
}): ReactNode {
  return (
    <section className={`rounded-xl border border-border bg-card p-4 sm:p-5 ${className ?? ''}`}>
      <h2 className="text-sm font-semibold">{title}</h2>
      {subtitle ? <p className="mt-0.5 text-xs text-muted-foreground">{subtitle}</p> : null}
      <div className="mt-4">{children}</div>
    </section>
  )
}

function TableShell({ head, children }: { head: ReactNode; children: ReactNode }): ReactNode {
  return (
    <div className="overflow-x-auto rounded-xl border border-border bg-card">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-border text-left text-xs font-medium uppercase tracking-wide text-muted-foreground">
            {head}
          </tr>
        </thead>
        <tbody>{children}</tbody>
      </table>
    </div>
  )
}

function cell(className: string): string {
  return `px-4 py-3 align-middle ${className}`
}

function ErrorRateCell({ value }: { value: number | null }): ReactNode {
  if (value === null) return <span className="text-muted-foreground">—</span>
  const tone = value === 0 ? 'text-success' : value >= 20 ? 'text-destructive' : 'text-warning'
  return <span className={`font-medium tabular-nums ${tone}`}>{formatPct(value)}</span>
}

export default function UsagePage(): ReactNode {
  const t = useT()
  const [days, setDays] = useState<number>(30)
  const [analytics, setAnalytics] = useState<UsageAnalytics | null>(null)
  const [loadError, setLoadError] = useState<string | null>(null)
  const [reloadKey, setReloadKey] = useState(0)
  usePageTitle(t('nav.items.usage'))

  const usage = useCollection('usage')
  const breakdown = useCollection('usageBreakdown')

  useEffect(() => {
    let alive = true
    setLoadError(null)
    apiFetch<UsageAnalytics>(`/api/usage/analytics?days=${days}`)
      .then((data) => {
        if (alive) setAnalytics(data)
      })
      .catch((err: unknown) => {
        if (alive) setLoadError(err instanceof Error ? err.message : t('common.error'))
      })
    return () => {
      alive = false
    }
  }, [days, reloadKey, t])

  const dayLabels = useMemo(
    () => (analytics ? analytics.days.map((day) => formatDayLabel(day.date)) : []),
    [analytics],
  )
  const tokenTotals = useMemo(() => {
    if (!analytics) return { input: 0, output: 0, reasoning: 0 }
    return analytics.days.reduce(
      (acc, day) => ({
        input: acc.input + day.inputTokens,
        output: acc.output + day.outputTokens,
        reasoning: acc.reasoning + day.reasoningTokens,
      }),
      { input: 0, output: 0, reasoning: 0 },
    )
  }, [analytics])
  const costByModel = useMemo(() => {
    if (!analytics) return []
    return [...analytics.latency]
      .sort((a, b) => b.costMicros - a.costMicros)
      .slice(0, 6)
      .map((row) => ({
        label: row.model,
        sub: row.providerName ?? undefined,
        value: row.costMicros / 1_000_000,
      }))
  }, [analytics])

  const hasAllTimeRows =
    breakdown.models.length > 0 || breakdown.conversations.length > 0

  return (
    <div className="udb-fill-page overflow-y-auto">
      <div className="mx-auto w-full max-w-6xl space-y-8 px-1">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">{t('usage.title')}</h1>
            <p className="mt-1 text-sm text-muted-foreground">{t('usage.subtitle')}</p>
          </div>
          <div className="flex gap-1 rounded-lg border border-border bg-card p-1" role="group" aria-label={t('usage.rangeLabel')}>
            {RANGES.map((range) => (
              <button
                key={range}
                type="button"
                onClick={() => setDays(range)}
                aria-pressed={days === range}
                className={`rounded-md px-3 py-1.5 text-xs font-medium transition-colors ${
                  days === range
                    ? 'bg-primary text-primary-foreground'
                    : 'text-muted-foreground hover:bg-accent hover:text-foreground'
                }`}
              >
                {t('usage.rangeDays', { days: range })}
              </button>
            ))}
          </div>
        </div>

        {loadError ? (
          <div className="flex flex-col items-center gap-3 rounded-xl border border-destructive/40 bg-card p-8 text-center">
            <p className="text-sm text-muted-foreground">{t('usage.loadFailed')}</p>
            <p className="max-w-md text-xs text-muted-foreground">{loadError}</p>
            <button
              type="button"
              onClick={() => setReloadKey((key) => key + 1)}
              className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground"
            >
              {t('common.retry')}
            </button>
          </div>
        ) : !analytics ? (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4" role="status" aria-label={t('common.loading')}>
            {Array.from({ length: 4 }, (_, i) => (
              <div key={i} className="h-32 animate-pulse rounded-xl border border-border bg-card" />
            ))}
          </div>
        ) : (
          <>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <StatCard
                label={t('usage.requests')}
                value={String(analytics.summary.requests)}
                trend={analytics.trends.requests}
                positive="up"
              />
              <StatCard
                label={t('usage.tokens')}
                value={formatTokens(analytics.summary.inputTokens + analytics.summary.outputTokens)}
                sub={`${formatTokens(analytics.summary.inputTokens)} ${t('usage.in')} · ${formatTokens(analytics.summary.outputTokens)} ${t('usage.out')}`}
                trend={analytics.trends.inputTokens}
                positive="up"
              />
              <StatCard
                label={t('usage.cost')}
                value={formatCost(analytics.summary.costMicros)}
                trend={analytics.trends.costMicros}
                positive="down"
              />
              <StatCard
                label={t('usage.errorRate')}
                value={formatPct(analytics.trends.errorRatePct.current)}
                trend={analytics.trends.errorRatePct}
                positive="down"
              />
            </div>

            <div className="grid gap-4 lg:grid-cols-5">
              <ChartShell
                title={t('usage.chart.activity')}
                subtitle={t('usage.chart.activitySub')}
                className="lg:col-span-3"
              >
                <LineChart
                  labels={dayLabels}
                  height={260}
                  series={[
                    {
                      key: 'requests',
                      label: t('usage.requests'),
                      values: analytics.days.map((day) => day.requests),
                      area: true,
                      areaFill: 'gradient',
                    },
                    {
                      key: 'errors',
                      label: t('usage.chart.errors'),
                      values: analytics.days.map((day) => day.errors),
                      kind: 'bars',
                      axis: 'right',
                      color: 'var(--color-destructive)',
                    },
                  ]}
                  formatLeft={(v) => formatTokens(v)}
                  formatRight={(v) => String(Math.round(v))}
                />
              </ChartShell>
              <ChartShell
                title={t('usage.chart.dailyCost')}
                subtitle={t('usage.chart.dailyCostSub')}
                className="lg:col-span-2"
              >
                <BarChart
                  labels={analytics.days.map((day) => day.date)}
                  height={260}
                  series={[
                    {
                      key: 'cost',
                      label: t('usage.cost'),
                      values: analytics.days.map((day) => day.costMicros / 1_000_000),
                      color: 'var(--udb-chart-2)',
                    },
                  ]}
                  formatValue={(v) => formatCost(Math.round(v * 1_000_000))}
                  formatLabel={(label) => formatFullDay(label)}
                />
              </ChartShell>
            </div>

            <div className="grid gap-4 lg:grid-cols-5">
              <ChartShell title={t('usage.chart.tokenMix')} className="lg:col-span-2">
                <div className="flex flex-wrap items-center gap-6">
                  <Donut
                    size={148}
                    centerValue={formatTokens(tokenTotals.input + tokenTotals.output + tokenTotals.reasoning)}
                    centerLabel={t('usage.tokens')}
                    formatValue={(v) => formatTokens(v)}
                    segments={[
                      { label: t('usage.chart.input'), value: tokenTotals.input },
                      { label: t('usage.chart.output'), value: tokenTotals.output },
                      { label: t('usage.chart.reasoning'), value: tokenTotals.reasoning },
                    ]}
                  />
                  <div className="min-w-40 flex-1 space-y-2 text-sm">
                    {[
                      { label: t('usage.chart.input'), value: tokenTotals.input, tone: 'var(--udb-chart-1)' },
                      { label: t('usage.chart.output'), value: tokenTotals.output, tone: 'var(--udb-chart-2)' },
                      { label: t('usage.chart.reasoning'), value: tokenTotals.reasoning, tone: 'var(--udb-chart-3)' },
                    ].map((row) => (
                      <div key={row.label} className="flex items-center justify-between gap-3">
                        <span className="flex items-center gap-2 text-muted-foreground">
                          <span className="h-2.5 w-2.5 rounded-full" style={{ background: row.tone }} />
                          {row.label}
                        </span>
                        <span className="font-medium tabular-nums">{formatTokens(row.value)}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </ChartShell>
              <ChartShell
                title={t('usage.chart.costByModel')}
                subtitle={t('usage.chart.costByModelSub')}
                className="lg:col-span-3"
              >
                {costByModel.length > 0 ? (
                  <HBars rows={costByModel} formatValue={(v) => `$${v.toFixed(2)}`} />
                ) : (
                  <p className="py-8 text-center text-sm text-muted-foreground">{t('usage.empty')}</p>
                )}
              </ChartShell>
            </div>

            {analytics.latency.length > 0 ? (
              <section className="space-y-3">
                <h2 className="text-lg font-semibold">{t('usage.performance.title')}</h2>
                <TableShell
                  head={
                    <>
                      <th className={cell('w-2/5')}>{t('usage.model')}</th>
                      <th className={cell('text-right')}>{t('usage.requests')}</th>
                      <th className={cell('text-right')}>{t('usage.performance.meanDuration')}</th>
                      <th className={cell('text-right')}>{t('usage.performance.p95Duration')}</th>
                      <th className={cell('text-right')}>{t('usage.errorRate')}</th>
                      <th className={cell('text-right')}>{t('usage.cost')}</th>
                    </>
                  }
                >
                  {analytics.latency.map((row) => (
                    <tr key={`${row.providerName ?? ''}:${row.model}`} className="border-b border-border last:border-0">
                      <td className={cell('font-medium')}>
                        {row.model}
                        {row.providerName ? (
                          <span className="ml-2 text-xs text-muted-foreground">{row.providerName}</span>
                        ) : null}
                      </td>
                      <td className={`${cell('text-right')} tabular-nums`}>{row.requests}</td>
                      <td className={`${cell('text-right')} tabular-nums`}>{formatDuration(row.meanDurationMs)}</td>
                      <td className={`${cell('text-right')} tabular-nums`}>{formatDuration(row.p95DurationMs)}</td>
                      <td className={cell('text-right')}>
                        <ErrorRateCell value={row.errorRatePct} />
                      </td>
                      <td className={`${cell('text-right')} tabular-nums`}>{formatCost(row.costMicros)}</td>
                    </tr>
                  ))}
                </TableShell>
              </section>
            ) : null}

            <section className="space-y-3">
              <h2 className="text-lg font-semibold">{t('usage.errors.title')}</h2>
              {analytics.errors.length > 0 ? (
                <div className="overflow-hidden rounded-xl border border-border bg-card">
                  {analytics.errors.map((group) => (
                    <div
                      key={group.code}
                      className="flex flex-wrap items-center justify-between gap-3 border-b border-border px-4 py-3 last:border-0"
                    >
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2">
                          <span className="rounded-full bg-destructive/15 px-2.5 py-0.5 text-xs font-semibold text-destructive">
                            {group.code}
                          </span>
                          <span className="text-xs text-muted-foreground">
                            {group.count}× · {t('usage.errors.lastSeen')} {formatLastUsed(group.lastSeenAt)}
                          </span>
                        </div>
                        <p className="mt-1 truncate text-sm text-muted-foreground">{group.message}</p>
                      </div>
                      <div className="flex shrink-0 items-center gap-3 text-xs text-muted-foreground">
                        {group.model ? <span className="font-medium">{group.model}</span> : null}
                        {group.conversationId && group.conversationTitle ? (
                          <Link to={`/app/chat/${group.conversationId}`} className="text-primary hover:underline">
                            {group.conversationTitle}
                          </Link>
                        ) : null}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="rounded-xl border border-dashed border-border p-6 text-center text-sm text-muted-foreground">
                  {t('usage.errors.empty')}
                </p>
              )}
            </section>
          </>
        )}

        <section className="space-y-6 border-t border-border pt-6">
          <div className="flex flex-wrap items-baseline justify-between gap-2">
            <h2 className="text-lg font-semibold">{t('usage.allTime.title')}</h2>
            <p className="text-xs text-muted-foreground">
              {usage.requests} {t('usage.requests').toLowerCase()} · {formatCost(usage.costMicros)}
            </p>
          </div>

          {hasAllTimeRows ? (
            <>
              {breakdown.models.length > 0 ? (
                <section className="space-y-3">
                  <h3 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
                    {t('usage.byModel')}
                  </h3>
                  <TableShell
                    head={
                      <>
                        <th className={cell('w-2/5')}>{t('usage.model')}</th>
                        <th className={cell('text-right')}>{t('usage.requests')}</th>
                        <th className={cell('text-right')}>{t('usage.inputTokens')}</th>
                        <th className={cell('text-right')}>{t('usage.outputTokens')}</th>
                        <th className={cell('text-right')}>{t('usage.cost')}</th>
                      </>
                    }
                  >
                    {breakdown.models.map((row: UsageModelRow) => (
                      <tr key={`${row.providerId}:${row.model}`} className="border-b border-border last:border-0">
                        <td className={cell('font-medium')}>
                          {row.model}
                          {row.providerName ? (
                            <span className="ml-2 text-xs text-muted-foreground">{row.providerName}</span>
                          ) : null}
                        </td>
                        <td className={`${cell('text-right')} tabular-nums`}>{row.requests}</td>
                        <td className={`${cell('text-right')} tabular-nums`}>{formatTokens(row.inputTokens)}</td>
                        <td className={`${cell('text-right')} tabular-nums`}>{formatTokens(row.outputTokens)}</td>
                        <td className={`${cell('text-right')} tabular-nums`}>{formatCost(row.costMicros)}</td>
                      </tr>
                    ))}
                  </TableShell>
                </section>
              ) : null}

              {breakdown.conversations.length > 0 ? (
                <section className="space-y-3">
                  <h3 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
                    {t('usage.byConversation')}
                  </h3>
                  <TableShell
                    head={
                      <>
                        <th className={cell('w-2/5')}>{t('usage.conversation')}</th>
                        <th className={cell('text-right')}>{t('usage.requests')}</th>
                        <th className={cell('text-right')}>{t('usage.inputTokens')}</th>
                        <th className={cell('text-right')}>{t('usage.outputTokens')}</th>
                        <th className={cell('text-right')}>{t('usage.cost')}</th>
                        <th className={cell('text-right')}>{t('usage.lastUsed')}</th>
                      </>
                    }
                  >
                    {breakdown.conversations.map((row: UsageConversationRow) => (
                      <tr key={row.conversationId ?? 'unknown'} className="border-b border-border last:border-0">
                        <td className={cell('max-w-56 truncate font-medium')}>
                          {row.conversationId && row.title ? (
                            <Link to={`/app/chat/${row.conversationId}`} className="hover:underline">
                              {row.title}
                            </Link>
                          ) : (
                            <span className="text-muted-foreground">{t('usage.deletedConversation')}</span>
                          )}
                        </td>
                        <td className={`${cell('text-right')} tabular-nums`}>{row.requests}</td>
                        <td className={`${cell('text-right')} tabular-nums`}>{formatTokens(row.inputTokens)}</td>
                        <td className={`${cell('text-right')} tabular-nums`}>{formatTokens(row.outputTokens)}</td>
                        <td className={`${cell('text-right')} tabular-nums`}>{formatCost(row.costMicros)}</td>
                        <td className={`${cell('whitespace-nowrap text-right text-muted-foreground')}`}>
                          {formatLastUsed(row.lastUsedAt)}
                        </td>
                      </tr>
                    ))}
                  </TableShell>
                </section>
              ) : null}
            </>
          ) : (
            <p className="rounded-xl border border-dashed border-border p-8 text-center text-sm text-muted-foreground">
              {t('usage.empty')}
            </p>
          )}
        </section>
      </div>
    </div>
  )
}
