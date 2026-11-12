import type { UsageDayBucket, UsageTrend } from '@shared/ai/contracts'

/** Raw daily aggregates coming from SQL (date keys are UTC `YYYY-MM-DD`). */
export interface UsageSqlDayRow {
  date: string
  requests: number | string
  inputTokens: number | string
  outputTokens: number | string
  reasoningTokens: number | string
  costMicros: number | string
}

export interface MessageSqlDayRow {
  date: string
  attempts: number | string
  errors: number | string
}

export interface DayWindowTotals {
  requests: number
  attempts: number
  errors: number
  inputTokens: number
  outputTokens: number
  costMicros: number
}

function num(value: number | string | null | undefined): number {
  const parsed = typeof value === 'number' ? value : Number(value ?? 0)
  return Number.isFinite(parsed) ? parsed : 0
}

function utcDateKey(base: Date, offsetDays: number): string {
  const shifted = new Date(base.getTime() - offsetDays * 86_400_000)
  return shifted.toISOString().slice(0, 10)
}

/**
 * Merge sparse SQL day aggregates into a zero-filled series covering the last
 * `days` UTC days ending today. Both windows (current + previous) fit in the
 * result when called with the doubled length.
 */
export function buildDailySeries(
  days: number,
  usageRows: readonly UsageSqlDayRow[],
  messageRows: readonly MessageSqlDayRow[],
  today: Date = new Date(),
): UsageDayBucket[] {
  const usageByDate = new Map(usageRows.map((row) => [row.date, row]))
  const messageByDate = new Map(messageRows.map((row) => [row.date, row]))
  const series: UsageDayBucket[] = []
  for (let offset = days - 1; offset >= 0; offset -= 1) {
    const date = utcDateKey(today, offset)
    const usage = usageByDate.get(date)
    const message = messageByDate.get(date)
    series.push({
      date,
      requests: num(usage?.requests),
      attempts: num(message?.attempts),
      errors: num(message?.errors),
      inputTokens: num(usage?.inputTokens),
      outputTokens: num(usage?.outputTokens),
      reasoningTokens: num(usage?.reasoningTokens),
      costMicros: num(usage?.costMicros),
    })
  }
  return series
}

/** Sum a contiguous slice of the daily series. `to` is exclusive; both may be negative. */
export function windowTotals(series: readonly UsageDayBucket[], from: number, to: number): DayWindowTotals {
  const slice = series.slice(from, to)
  return slice.reduce<DayWindowTotals>(
    (acc, day) => ({
      requests: acc.requests + day.requests,
      attempts: acc.attempts + day.attempts,
      errors: acc.errors + day.errors,
      inputTokens: acc.inputTokens + day.inputTokens,
      outputTokens: acc.outputTokens + day.outputTokens,
      costMicros: acc.costMicros + day.costMicros,
    }),
    { requests: 0, attempts: 0, errors: 0, inputTokens: 0, outputTokens: 0, costMicros: 0 },
  )
}

/** Percentage change between two windows; null when the previous window is empty. */
export function trendOf(current: number, previous: number): UsageTrend {
  return {
    current,
    previous,
    deltaPct: previous > 0 ? ((current - previous) / previous) * 100 : null,
  }
}

/** Errors / attempts as a percentage (0–100); 0 when there were no attempts. */
export function errorRatePct(errors: number, attempts: number): number {
  if (attempts <= 0) return 0
  return (errors / attempts) * 100
}
