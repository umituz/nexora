import type { ReactNode } from 'react'
import { usePageTitle } from '@umituz/web-dashboard'
import { useCollection } from '@/data/store'
import { useT } from '@/i18n'

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

export default function UsagePage(): ReactNode {
  const t = useT()
  const usage = useCollection('usage')
  usePageTitle(t('nav.items.usage'))

  const cards = [
    { label: t('usage.requests'), value: String(usage.requests) },
    { label: t('usage.inputTokens'), value: formatTokens(usage.inputTokens) },
    { label: t('usage.outputTokens'), value: formatTokens(usage.outputTokens) },
    { label: t('usage.cost'), value: formatCost(usage.costMicros) },
  ]

  return (
    <div className="nexora-fill overflow-y-auto">
      <div className="mx-auto w-full max-w-3xl space-y-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">{t('usage.title')}</h1>
          <p className="mt-1 text-sm text-muted-foreground">{t('usage.subtitle')}</p>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {cards.map((card) => (
            <div key={card.label} className="rounded-xl border border-border bg-card p-5">
              <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">{card.label}</p>
              <p className="mt-2 text-2xl font-bold tabular-nums">{card.value}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
