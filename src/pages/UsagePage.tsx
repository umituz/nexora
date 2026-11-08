import type { ReactNode } from 'react'
import { Link } from 'react-router'
import { usePageTitle } from '@umituz/web-dashboard'
import type { UsageConversationRow, UsageModelRow } from '@shared/ai/contracts'
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

function formatLastUsed(value: string | null): string {
  if (!value) return '—'
  return new Date(value).toLocaleString(undefined, { dateStyle: 'medium', timeStyle: 'short' })
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

export default function UsagePage(): ReactNode {
  const t = useT()
  const usage = useCollection('usage')
  const breakdown = useCollection('usageBreakdown')
  usePageTitle(t('nav.items.usage'))

  const cards = [
    { label: t('usage.requests'), value: String(usage.requests) },
    { label: t('usage.inputTokens'), value: formatTokens(usage.inputTokens) },
    { label: t('usage.outputTokens'), value: formatTokens(usage.outputTokens) },
    { label: t('usage.cost'), value: formatCost(usage.costMicros) },
  ]

  const hasRows = breakdown.models.length > 0 || breakdown.conversations.length > 0

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

        {hasRows ? (
          <>
            {breakdown.models.length > 0 ? (
              <section className="space-y-3">
                <h2 className="text-lg font-semibold">{t('usage.byModel')}</h2>
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
                        {row.providerName ? <span className="ml-2 text-xs text-muted-foreground">{row.providerName}</span> : null}
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
                <h2 className="text-lg font-semibold">{t('usage.byConversation')}</h2>
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
                    <tr
                      key={row.conversationId ?? 'unknown'}
                      className="border-b border-border last:border-0"
                    >
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
      </div>
    </div>
  )
}
