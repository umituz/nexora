import { useEffect, useMemo, useState } from 'react'
import type { ReactNode } from 'react'
import { Link } from 'react-router'
import { BookOpen, Bot, MessagesSquare, Telescope } from 'lucide-react'
import { usePageTitle } from '@umituz/web-dashboard'
import { LineChart } from '@umituz/web-design-system/charts'
import { apiFetch } from '@umituz/web-hono/client'
import type { UsageAnalytics, UsageHeatmap } from '@shared/ai/contracts'
import { useCollection } from '@/data/store'
import { useT } from '@/i18n'
import { formatCompact, formatCost, formatDayLabel, useTimeAgo } from '@/lib/format'

function formatTokens(value: number): string {
  if (value >= 1_000_000) return `${(value / 1_000_000).toFixed(1)}M`
  if (value >= 1_000) return `${(value / 1_000).toFixed(1)}K`
  return String(value)
}

function StatCard({
  label,
  value,
  sub,
  icon,
  to,
}: {
  label: string
  value: string
  sub: string
  icon: ReactNode
  to: string
}): ReactNode {
  return (
    <Link
      to={to}
      className="flex flex-col rounded-xl border border-border bg-card p-5 transition-colors hover:bg-accent/40"
    >
      <div className="flex items-center justify-between gap-2">
        <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">{label}</p>
        <span className="text-muted-foreground">{icon}</span>
      </div>
      <p className="mt-2 text-2xl font-bold tabular-nums">{value}</p>
      <p className="mt-1 text-xs text-muted-foreground">{sub}</p>
    </Link>
  )
}

function Panel({
  title,
  viewAllTo,
  viewAllLabel,
  children,
}: {
  title: string
  viewAllTo: string
  viewAllLabel: string
  children: ReactNode
}): ReactNode {
  return (
    <section className="flex flex-col rounded-xl border border-border bg-card">
      <div className="flex items-center justify-between gap-2 border-b border-border px-4 py-3">
        <h2 className="text-sm font-semibold">{title}</h2>
        <Link to={viewAllTo} className="text-xs text-primary hover:underline">
          {viewAllLabel}
        </Link>
      </div>
      <div className="flex-1">{children}</div>
    </section>
  )
}

const TASK_KIND_LABELS: Record<string, string> = {
  index_document: 'tasks.kinds.indexDocument',
  research: 'tasks.kinds.research',
}

const HEATMAP_LEVELS = [
  'bg-muted',
  'bg-primary/20',
  'bg-primary/40',
  'bg-primary/60',
  'bg-primary/80',
  'bg-primary',
]

const WEEK_ORDER = [1, 2, 3, 4, 5, 6, 0]

function weekdayLabel(dow: number): string {
  return new Date(Date.UTC(2024, 0, WEEK_ORDER.indexOf(dow) + 1)).toLocaleDateString(undefined, {
    weekday: 'short',
    timeZone: 'UTC',
  })
}

function UsageHeatmapGrid({ heatmap }: { heatmap: UsageHeatmap }): ReactNode {
  const t = useT()
  const byCell = new Map(heatmap.cells.map((cell) => [`${cell.dow}:${cell.hour}`, cell.requests]))
  const max = heatmap.cells.reduce((top, cell) => Math.max(top, cell.requests), 0)
  const levelOf = (count: number): number =>
    count === 0 || max === 0 ? 0 : Math.min(5, Math.ceil((count / max) * 5))

  return (
    <section className="rounded-xl border border-border bg-card p-4 sm:p-5">
      <div className="flex flex-wrap items-baseline justify-between gap-2">
        <h2 className="text-sm font-semibold">{t('overview.heatmap.title')}</h2>
        <p className="text-xs text-muted-foreground">
          {t('overview.heatmap.summary', {
            requests: formatCompact(heatmap.totalRequests),
            hour: String(heatmap.peakHour ?? 0).padStart(2, '0'),
          })}
        </p>
      </div>
      <div className="mt-4 overflow-x-auto">
        <div className="min-w-[540px] space-y-1">
          {WEEK_ORDER.map((dow) => (
            <div key={dow} className="flex items-center gap-1">
              <span className="w-8 shrink-0 text-[10px] font-medium text-muted-foreground">{weekdayLabel(dow)}</span>
              <div className="flex flex-1 gap-[2px]">
                {Array.from({ length: 24 }, (_, hour) => {
                  const count = byCell.get(`${dow}:${hour}`) ?? 0
                  return (
                    <div
                      key={hour}
                      className={`h-4 flex-1 rounded-[3px] ${HEATMAP_LEVELS[levelOf(count)]}`}
                      title={t('overview.heatmap.cell', {
                        day: weekdayLabel(dow),
                        hour: String(hour).padStart(2, '0'),
                        count: String(count),
                      })}
                    />
                  )
                })}
              </div>
            </div>
          ))}
          <div className="flex items-center gap-1 pl-9">
            {Array.from({ length: 24 }, (_, hour) => (
              <span key={hour} className="flex-1 text-[10px] text-muted-foreground">
                {hour % 6 === 0 ? String(hour).padStart(2, '0') : ''}
              </span>
            ))}
          </div>
        </div>
      </div>
      <div className="mt-3 flex items-center justify-end gap-2">
        <span className="text-[10px] text-muted-foreground">{t('overview.heatmap.less')}</span>
        {HEATMAP_LEVELS.map((level) => (
          <div key={level} className={`h-3 w-3 rounded-[3px] ${level}`} />
        ))}
        <span className="text-[10px] text-muted-foreground">{t('overview.heatmap.more')}</span>
      </div>
    </section>
  )
}

export default function OverviewPage(): ReactNode {
  const t = useT()
  const formatAgo = useTimeAgo()
  const profile = useCollection('profile')
  const conversations = useCollection('conversations')
  const tasks = useCollection('tasks')
  const activity = useCollection('activity')
  const [analytics, setAnalytics] = useState<UsageAnalytics | null>(null)
  const [heatmap, setHeatmap] = useState<UsageHeatmap | null>(null)
  usePageTitle(t('nav.items.overview'))

  useEffect(() => {
    let alive = true
    apiFetch<UsageAnalytics>('/api/usage/analytics?days=30')
      .then((data) => {
        if (alive) setAnalytics(data)
      })
      .catch(() => {
        if (alive) setAnalytics(null)
      })
    apiFetch<UsageHeatmap>(`/api/usage/heatmap?days=30&tzOffset=${new Date().getTimezoneOffset()}`)
      .then((data) => {
        if (alive) setHeatmap(data)
      })
      .catch(() => {
        if (alive) setHeatmap(null)
      })
    return () => {
      alive = false
    }
  }, [])

  const recentConversations = useMemo(
    () =>
      [...conversations]
        .sort((a, b) => (a.updatedAt < b.updatedAt ? 1 : -1))
        .slice(0, 5),
    [conversations],
  )
  const activeTasks = useMemo(
    () => tasks.filter((row) => row.status === 'queued' || row.status === 'running').slice(0, 5),
    [tasks],
  )
  const recentActivity = useMemo(() => activity.slice(0, 6), [activity])
  const dayLabels = useMemo(
    () => (analytics ? analytics.days.map((day) => formatDayLabel(day.date)) : []),
    [analytics],
  )

  const hasSignals =
    recentConversations.length > 0 ||
    activeTasks.length > 0 ||
    recentActivity.length > 0

  return (
    <div className="udb-fill-page overflow-y-auto">
      <div className="mx-auto w-full max-w-6xl space-y-6 px-1">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">{t('overview.title')}</h1>
          <p className="mt-1 text-sm text-muted-foreground">{t('overview.subtitle')}</p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <StatCard
            label={t('overview.stats.conversations')}
            value={String(profile.stats.conversations)}
            sub={t('overview.stats.conversationsSub', { messages: formatCompact(profile.stats.messages) })}
            icon={<MessagesSquare size={15} aria-hidden="true" />}
            to="/app/chat"
          />
          <StatCard
            label={t('overview.stats.documents')}
            value={String(profile.stats.documents)}
            sub={t('overview.stats.documentsSub', { memories: formatCompact(profile.stats.memories) })}
            icon={<BookOpen size={15} aria-hidden="true" />}
            to="/app/knowledge"
          />
          <StatCard
            label={t('overview.stats.agents')}
            value={String(profile.stats.agents)}
            sub={t('overview.stats.agentsSub')}
            icon={<Bot size={15} aria-hidden="true" />}
            to="/app/agents"
          />
          <StatCard
            label={t('overview.stats.research')}
            value={String(profile.stats.research)}
            sub={t('overview.stats.researchSub')}
            icon={<Telescope size={15} aria-hidden="true" />}
            to="/app/research"
          />
        </div>

        {analytics ? (
          <section className="rounded-xl border border-border bg-card p-4 sm:p-5">
            <div className="flex flex-wrap items-baseline justify-between gap-2">
              <h2 className="text-sm font-semibold">{t('overview.chart.title')}</h2>
              <p className="text-xs text-muted-foreground">
                {t('overview.chart.legend', {
                  requests: formatCompact(analytics.summary.requests),
                  cost: formatCost(analytics.summary.costMicros),
                })}
              </p>
            </div>
            <div className="mt-4">
              <LineChart
                labels={dayLabels}
                height={220}
                series={[
                  {
                    key: 'requests',
                    label: t('overview.chart.requests'),
                    values: analytics.days.map((day) => day.requests),
                    area: true,
                    areaFill: 'gradient',
                  },
                  {
                    key: 'errors',
                    label: t('overview.chart.errors'),
                    values: analytics.days.map((day) => day.errors),
                    kind: 'bars',
                    axis: 'right',
                    color: 'var(--color-destructive)',
                  },
                ]}
                formatLeft={(v) => formatTokens(v)}
                formatRight={(v) => String(Math.round(v))}
              />
            </div>
          </section>
        ) : null}

        {heatmap && heatmap.totalRequests > 0 ? <UsageHeatmapGrid heatmap={heatmap} /> : null}

        <div className="grid gap-4 lg:grid-cols-2">
          <Panel title={t('overview.recentConversations')} viewAllTo="/app/chat" viewAllLabel={t('overview.viewAll')}>
            {recentConversations.length > 0 ? (
              <ul>
                {recentConversations.map((row) => (
                  <li key={row.id} className="border-b border-border last:border-0">
                    <Link to={`/app/chat/${row.id}`} className="flex items-center justify-between gap-3 px-4 py-3 hover:bg-accent/40">
                      <span className="min-w-0 truncate text-sm font-medium">{row.title}</span>
                      <span className="shrink-0 text-xs text-muted-foreground">{formatAgo(row.updatedAt)}</span>
                    </Link>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="px-4 py-6 text-center text-sm text-muted-foreground">{t('overview.noConversations')}</p>
            )}
          </Panel>

          <Panel title={t('overview.activeTasks')} viewAllTo="/app/tasks" viewAllLabel={t('overview.viewAll')}>
            {activeTasks.length > 0 ? (
              <ul>
                {activeTasks.map((row) => (
                  <li key={row.id} className="flex items-center justify-between gap-3 border-b border-border px-4 py-3 last:border-0">
                    <span className="min-w-0 truncate text-sm">
                      {t(TASK_KIND_LABELS[row.kind] ?? 'tasks.kinds.indexDocument')}
                    </span>
                    <span className="shrink-0 text-xs text-muted-foreground">{t(`tasks.status.${row.status}`)}</span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="px-4 py-6 text-center text-sm text-muted-foreground">{t('overview.noTasks')}</p>
            )}
          </Panel>
        </div>

        <Panel title={t('overview.recentActivity')} viewAllTo="/app/activity" viewAllLabel={t('overview.viewAll')}>
          {recentActivity.length > 0 ? (
            <ul>
              {recentActivity.map((row) => (
                <li key={row.id} className="flex items-center justify-between gap-3 border-b border-border px-4 py-2.5 last:border-0">
                  <span className="min-w-0 truncate text-sm">
                    <span className="text-muted-foreground">{t('activity.you')}</span>{' '}
                    {t(`activity.actions.${row.action}`)}
                    {row.targetLabel ? <span className="font-medium"> {row.targetLabel}</span> : null}
                  </span>
                  <span className="shrink-0 text-xs text-muted-foreground">{formatAgo(row.createdAt)}</span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="px-4 py-6 text-center text-sm text-muted-foreground">{t('overview.noActivity')}</p>
          )}
        </Panel>

        {!hasSignals && analytics === null ? (
          <p className="rounded-xl border border-dashed border-border p-8 text-center text-sm text-muted-foreground">
            {t('overview.empty')}
          </p>
        ) : null}
      </div>
    </div>
  )
}
