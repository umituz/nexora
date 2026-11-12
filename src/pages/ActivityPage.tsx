import { useMemo, useState } from 'react'
import type { ReactNode } from 'react'
import { usePageTitle } from '@umituz/web-dashboard'
import { AuditLogList, EmptyState } from '@umituz/web-design-system'
import { Segmented } from '@umituz/web-design-system/molecules'
import type { SegmentedOption } from '@umituz/web-design-system/molecules'
import type { ActivityRow } from '@/data/chatTypes'
import { useCollection } from '@/data/store'
import { useT } from '@/i18n'
import { formatDateTime } from '@/lib/format'

const ACTION_TARGETS = [
  'conversation',
  'project',
  'agent',
  'memory',
  'document',
  'research',
  'api_key',
  'webhook',
  'automation',
  'watchlist',
  'settings',
] as const

const FILTER_ALL = 'all'

export default function ActivityPage(): ReactNode {
  const t = useT()
  const activity = useCollection('activity')
  const [filter, setFilter] = useState<string>(FILTER_ALL)
  usePageTitle(t('nav.items.activity'))

  const presentTargets = useMemo(() => {
    const present = new Set(activity.map((row) => row.targetType).filter((value): value is string => value !== null))
    return ACTION_TARGETS.filter((target) => present.has(target))
  }, [activity])

  const options = useMemo<SegmentedOption<string>[]>(
    () => [
      { value: FILTER_ALL, label: t('activity.filterAll') },
      ...presentTargets.map((target) => ({ value: target, label: t(`activity.targets.${target}`) })),
    ],
    [presentTargets, t],
  )

  const entries = useMemo(
    () =>
      activity
        .filter((row) => filter === FILTER_ALL || row.targetType === filter)
        .map((row: ActivityRow) => ({
          id: row.id,
          actor: t('activity.you'),
          action: t(`activity.actions.${row.action}`),
          target: row.targetLabel ?? undefined,
          at: row.createdAt,
        })),
    [activity, filter, t],
  )

  const hasAny = activity.length > 0

  return (
    <div className="udb-fill-page overflow-y-auto">
      <div className="mx-auto w-full max-w-3xl space-y-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">{t('activity.title')}</h1>
          <p className="mt-1 text-sm text-muted-foreground">{t('activity.subtitle')}</p>
        </div>

        {hasAny ? (
          <>
            {options.length > 1 && <Segmented options={options} value={filter} onChange={setFilter} />}
            <AuditLogList entries={entries} emptyLabel={t('activity.empty')} formatAt={formatDateTime} />
          </>
        ) : (
          <EmptyState title={t('activity.emptyTitle')} description={t('activity.empty')} />
        )}
      </div>
    </div>
  )
}
