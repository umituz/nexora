import { useEffect, useMemo, useState } from 'react'
import type { ReactNode } from 'react'
import { Link } from 'react-router'
import {
  Braces,
  Brain,
  Crown,
  Eye,
  Image as ImageIcon,
  MessagesSquare,
  Search,
  Sparkles,
  Timer,
  Trophy,
  Wrench,
} from 'lucide-react'
import { usePageTitle } from '@umituz/web-dashboard'
import { FilterSelect, SearchInput, Segmented } from '@umituz/web-design-system'
import type { FilterSelectOption } from '@umituz/web-design-system'
import { apiFetch } from '@umituz/web-hono/client'
import type { ModelUsageStats, PublicModel } from '@shared/ai/contracts'
import { useCollection } from '@/data/store'
import { useT } from '@/i18n'

type CapabilityFilter = 'all' | 'reasoning' | 'vision' | 'tools' | 'structured'
type SortKey = 'usage' | 'name' | 'context' | 'cost'

const CAP_FILTERS: readonly { key: CapabilityFilter; icon: typeof Brain; labelKey: string }[] = [
  { key: 'all', icon: Sparkles, labelKey: 'models.filter.all' },
  { key: 'reasoning', icon: Brain, labelKey: 'models.filter.reasoning' },
  { key: 'vision', icon: Eye, labelKey: 'models.filter.vision' },
  { key: 'tools', icon: Wrench, labelKey: 'models.filter.tools' },
  { key: 'structured', icon: Braces, labelKey: 'models.filter.structured' },
]

const CAP_BADGES: readonly { key: 'reasoning' | 'vision' | 'tools' | 'structured'; icon: typeof Brain; labelKey: string }[] = [
  { key: 'reasoning', icon: Brain, labelKey: 'chat.caps.reasoning' },
  { key: 'vision', icon: Eye, labelKey: 'chat.caps.vision' },
  { key: 'tools', icon: Wrench, labelKey: 'chat.caps.tools' },
  { key: 'structured', icon: Braces, labelKey: 'chat.caps.structured' },
]

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

function formatWindow(tokens: number): string {
  if (tokens <= 0) return '—'
  if (tokens >= 1_000_000) return `${Math.round(tokens / 1_000_000)}M`
  return `${Math.round(tokens / 1024)}K`
}

function formatLastUsed(iso: string | null): string {
  if (!iso) return ''
  const ms = Date.now() - new Date(iso).getTime()
  if (Number.isNaN(ms)) return ''
  const minutes = Math.round(ms / 60_000)
  if (minutes < 1) return 'now'
  if (minutes < 60) return `${minutes}m`
  const hours = Math.round(minutes / 60)
  if (hours < 24) return `${hours}h`
  return `${Math.round(hours / 24)}d`
}

/** usage_records.model stores the display name; merge same-name rows across providers. */
function mergeStats(rows: ModelUsageStats[]): ModelUsageStats {
  const totalRequests = rows.reduce((sum, row) => sum + row.requests, 0)
  return {
    model: rows[0]!.model,
    providerId: rows[0]!.providerId,
    requests: totalRequests,
    inputTokens: rows.reduce((sum, row) => sum + row.inputTokens, 0),
    outputTokens: rows.reduce((sum, row) => sum + row.outputTokens, 0),
    costMicros: rows.reduce((sum, row) => sum + row.costMicros, 0),
    avgDurationMs:
      totalRequests > 0
        ? Math.round(rows.reduce((sum, row) => sum + row.avgDurationMs * row.requests, 0) / totalRequests)
        : 0,
    lastUsedAt: rows.reduce<string | null>(
      (latest, row) => (!latest || (row.lastUsedAt && row.lastUsedAt > latest) ? row.lastUsedAt : latest),
      null,
    ),
  }
}

function CapabilityBadge({ icon: Icon, label }: { icon: typeof Brain; label: string }): ReactNode {
  return (
    <span className="inline-flex items-center gap-1 rounded-full border border-border px-1.5 py-0.5 text-[10px] text-muted-foreground">
      <Icon size={10} aria-hidden="true" />
      {label}
    </span>
  )
}

function ModelCard({
  model,
  stats,
  t,
}: {
  model: PublicModel
  stats: ModelUsageStats | undefined
  t: (key: string, options?: Record<string, string | number>) => string
}): ReactNode {
  const isChatModel = model.outputTypes.includes('text') && model.capabilities.streaming
  const isImageModel = model.outputTypes.includes('image')
  return (
    <div className="flex flex-col gap-3 rounded-xl border border-border bg-card p-4 transition-colors hover:border-primary/50">
      <div className="flex items-start justify-between gap-2">
        <div className="min-w-0">
          <h3 className="truncate font-semibold text-foreground">{model.displayName}</h3>
          <p className="truncate text-xs text-muted-foreground">
            {model.providerName}
            {model.family ? ` · ${model.family}` : ''}
          </p>
        </div>
        {model.isDefault && (
          <span className="shrink-0 rounded-full bg-primary/10 px-2 py-0.5 text-[10px] font-medium text-primary">
            {t('models.default')}
          </span>
        )}
      </div>

      <div className="flex flex-wrap gap-1">
        {CAP_BADGES.filter((badge) => model.capabilities[badge.key]).map((badge) => (
          <CapabilityBadge key={badge.key} icon={badge.icon} label={t(badge.labelKey)} />
        ))}
      </div>

      <dl className="grid grid-cols-3 gap-2 border-t border-border pt-3 text-xs">
        <div>
          <dt className="text-muted-foreground">{t('models.context')}</dt>
          <dd className="font-medium text-foreground">{formatWindow(model.contextWindow)}</dd>
        </div>
        <div>
          <dt className="text-muted-foreground">{t('models.priceIn')}</dt>
          <dd className="font-medium text-foreground">
            {model.pricing.inputPerMTok > 0 ? `$${model.pricing.inputPerMTok}/M` : '—'}
          </dd>
        </div>
        <div>
          <dt className="text-muted-foreground">{t('models.priceOut')}</dt>
          <dd className="font-medium text-foreground">
            {model.pricing.outputPerMTok > 0 ? `$${model.pricing.outputPerMTok}/M` : '—'}
          </dd>
        </div>
      </dl>

      {stats && stats.requests > 0 ? (
        <p className="text-xs text-muted-foreground">
          {t('models.usageLine', {
            requests: stats.requests,
            tokens: formatTokens(stats.inputTokens + stats.outputTokens),
            cost: formatCost(stats.costMicros),
          })}
          {stats.lastUsedAt ? ` · ${t('models.lastUsed')} ${formatLastUsed(stats.lastUsedAt)}` : ''}
        </p>
      ) : (
        <p className="text-xs text-muted-foreground/70">{t('models.unused')}</p>
      )}

      <div className="mt-auto flex gap-2 pt-1">
        {isChatModel ? (
          <Link
            to={`/app/chat?model=${model.id}`}
            className="inline-flex flex-1 items-center justify-center gap-1.5 rounded-md bg-primary px-3 py-1.5 text-xs font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            <MessagesSquare size={13} aria-hidden="true" />
            {t('models.chatWith')}
          </Link>
        ) : isImageModel ? (
          <Link
            to="/app/studio"
            className="inline-flex flex-1 items-center justify-center gap-1.5 rounded-md bg-primary px-3 py-1.5 text-xs font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            <ImageIcon size={13} aria-hidden="true" />
            {t('models.openStudio')}
          </Link>
        ) : (
          <span className="inline-flex flex-1 items-center justify-center rounded-md border border-border px-3 py-1.5 text-xs text-muted-foreground">
            {t('models.otherModel')}
          </span>
        )}
      </div>
    </div>
  )
}

export default function ModelsPage(): ReactNode {
  const t = useT()
  const models = useCollection('models')
  const [query, setQuery] = useState('')
  const [capability, setCapability] = useState<CapabilityFilter>('all')
  const [provider, setProvider] = useState('all')
  const [sort, setSort] = useState<SortKey>('usage')
  const [statsRows, setStatsRows] = useState<ModelUsageStats[] | null>(null)

  usePageTitle(t('nav.items.models'))

  useEffect(() => {
    let alive = true
    apiFetch<ModelUsageStats[]>('/api/models/stats')
      .then((rows) => {
        if (alive) setStatsRows(rows)
      })
      .catch(() => {
        if (alive) setStatsRows([])
      })
    return () => {
      alive = false
    }
  }, [])

  const statsByName = useMemo(() => {
    const byName = new Map<string, ModelUsageStats[]>()
    for (const row of statsRows ?? []) {
      const existing = byName.get(row.model)
      if (existing) existing.push(row)
      else byName.set(row.model, [row])
    }
    const merged = new Map<string, ModelUsageStats>()
    for (const [name, rows] of byName) merged.set(name, mergeStats(rows))
    return merged
  }, [statsRows])

  const providerOptions: FilterSelectOption[] = useMemo(() => {
    const names = [...new Set(models.map((model) => model.providerName))].sort()
    return names.map((name) => ({ value: name, label: name }))
  }, [models])

  const sortOptions: FilterSelectOption[] = useMemo(
    () => [
      { value: 'usage', label: t('models.sort.usage') },
      { value: 'name', label: t('models.sort.name') },
      { value: 'context', label: t('models.sort.context') },
      { value: 'cost', label: t('models.sort.cost') },
    ],
    [t],
  )

  const filtered = useMemo(() => {
    const needle = query.trim().toLowerCase()
    const result = models.filter((model) => {
      if (capability !== 'all' && !model.capabilities[capability]) return false
      if (provider !== 'all' && model.providerName !== provider) return false
      if (!needle) return true
      return [model.displayName, model.providerName, model.family, model.description ?? ''].some((field) =>
        field.toLowerCase().includes(needle),
      )
    })
    const statsFor = (model: PublicModel) => statsByName.get(model.displayName)
    const comparators: Record<SortKey, (a: PublicModel, b: PublicModel) => number> = {
      usage: (a, b) => (statsFor(b)?.requests ?? -1) - (statsFor(a)?.requests ?? -1) || a.displayName.localeCompare(b.displayName),
      name: (a, b) => a.displayName.localeCompare(b.displayName),
      context: (a, b) => b.contextWindow - a.contextWindow,
      cost: (a, b) => (statsFor(b)?.costMicros ?? -1) - (statsFor(a)?.costMicros ?? -1),
    }
    return [...result].sort(comparators[sort])
  }, [models, query, capability, provider, sort, statsByName])

  const topModels = useMemo(() => {
    const ranked = models
      .map((model) => ({ model, stats: statsByName.get(model.displayName) }))
      .filter((entry): entry is { model: PublicModel; stats: ModelUsageStats } => (entry.stats?.requests ?? 0) > 0)
      .sort((a, b) => b.stats.requests - a.stats.requests)
      .slice(0, 5)
    return ranked
  }, [models, statsByName])

  return (
    <div className="flex flex-col gap-6">
      <header className="flex flex-col gap-1">
        <h1 className="text-2xl font-semibold tracking-tight text-foreground">{t('models.title')}</h1>
        <p className="text-sm text-muted-foreground">{t('models.subtitle')}</p>
      </header>

      <div className="flex flex-wrap items-center gap-2">
        <SearchInput
          value={query}
          onChange={setQuery}
          placeholder={t('models.searchPlaceholder')}
          aria-label={t('models.searchPlaceholder')}
          clearable
          className="w-full sm:w-64"
        />
        <Segmented
          options={CAP_FILTERS.map((filter) => ({
            value: filter.key,
            label: t(filter.labelKey),
            icon: <filter.icon aria-hidden="true" />,
          }))}
          value={capability}
          onChange={setCapability}
          aria-label={t('models.filter.label')}
        />
        <FilterSelect
          value={provider}
          onChange={setProvider}
          options={providerOptions}
          allLabel={t('models.allProviders')}
          ariaLabel={t('models.allProviders')}
        />
        <FilterSelect
          value={sort}
          onChange={(value) => setSort(value as SortKey)}
          options={sortOptions}
          allLabel={t('models.sort.label')}
          ariaLabel={t('models.sort.label')}
          className="ml-auto"
        />
      </div>

      {topModels.length > 1 && (
        <section aria-label={t('models.top.title')} className="rounded-xl border border-border bg-card p-4">
          <h2 className="flex items-center gap-2 text-sm font-semibold text-foreground">
            <Trophy size={14} className="text-primary" aria-hidden="true" />
            {t('models.top.title')}
          </h2>
          <ol className="mt-3 grid gap-2 md:grid-cols-2 xl:grid-cols-3">
            {topModels.map(({ model, stats }, index) => (
              <li
                key={model.id}
                className={`flex items-center gap-3 rounded-lg border p-2.5 ${index === 0 ? 'border-primary/50' : 'border-border'}`}
              >
                <span
                  className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-xs font-bold ${
                    index === 0 ? 'bg-primary/15 text-primary' : 'bg-muted text-muted-foreground'
                  }`}
                >
                  {index === 0 ? <Crown size={14} aria-hidden="true" /> : `#${index + 1}`}
                </span>
                <div className="min-w-0 flex-1">
                  <Link
                    to={`/app/chat?model=${model.id}`}
                    className="block truncate text-sm font-medium text-foreground hover:text-primary"
                  >
                    {model.displayName}
                  </Link>
                  <p className="truncate text-xs text-muted-foreground">
                    {t('models.top.line', { requests: stats.requests, tokens: formatTokens(stats.inputTokens + stats.outputTokens), cost: formatCost(stats.costMicros) })}
                  </p>
                </div>
                {stats.avgDurationMs > 0 && (
                  <span className="flex shrink-0 items-center gap-1 text-xs text-muted-foreground">
                    <Timer size={12} aria-hidden="true" />
                    {`${(stats.avgDurationMs / 1000).toFixed(1)}s`}
                  </span>
                )}
              </li>
            ))}
          </ol>
        </section>
      )}

      {models.length === 0 ? (
        <p className="rounded-xl border border-dashed border-border p-8 text-center text-sm text-muted-foreground">
          {t('models.empty')}
        </p>
      ) : filtered.length === 0 ? (
        <p className="rounded-xl border border-dashed border-border p-8 text-center text-sm text-muted-foreground">
          {t('models.noMatches')}
        </p>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4">
          {filtered.map((model) => (
            <ModelCard key={model.id} model={model} stats={statsByName.get(model.displayName)} t={t} />
          ))}
        </div>
      )}

      {statsRows === null && (
        <p className="flex items-center justify-center gap-2 text-xs text-muted-foreground" role="status">
          <Search size={12} aria-hidden="true" className="animate-pulse" />
          {t('models.loadingStats')}
        </p>
      )}
    </div>
  )
}
