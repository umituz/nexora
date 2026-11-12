import { useMemo } from 'react'
import { timeAgo } from '@umituz/web-dashboard/notifications'
import type { TimeAgoLabels } from '@umituz/web-dashboard/notifications'
import { useT } from '@/i18n'

export function useTimeAgo(): (iso: string) => string {
  const t = useT()
  return useMemo(() => {
    const labels: TimeAgoLabels = {
      justNow: t('timeAgo.justNow'),
      minutesPattern: t('timeAgo.minutesAgo'),
      hoursPattern: t('timeAgo.hoursAgo'),
      daysPattern: t('timeAgo.daysAgo'),
    }
    return (iso: string) => timeAgo(iso, labels)
  }, [t])
}

export function formatDateTime(iso: string): string {
  const date = new Date(iso)
  if (Number.isNaN(date.getTime())) return iso
  return date.toLocaleString(undefined, {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}

export function formatDate(iso: string): string {
  const date = new Date(iso)
  if (Number.isNaN(date.getTime())) return iso
  return date.toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' })
}

export function formatCost(micros: number): string {
  const dollars = micros / 1_000_000
  if (dollars < 0.01) return `$${dollars.toFixed(4)}`
  return `$${dollars.toFixed(2)}`
}

export function formatCompact(value: number): string {
  return new Intl.NumberFormat(undefined, { notation: 'compact', maximumFractionDigits: 1 }).format(value)
}

export function formatDayLabel(date: string): string {
  return new Date(`${date}T00:00:00Z`).toLocaleDateString(undefined, {
    month: 'short',
    day: 'numeric',
    timeZone: 'UTC',
  })
}

export function formatDuration(ms: number): string {
  if (ms <= 0) return '—'
  if (ms < 1000) return `${Math.round(ms)} ms`
  return `${(ms / 1000).toFixed(1)} s`
}
