import { describe, expect, it } from 'vitest'
import {
  buildDailySeries,
  errorRatePct,
  trendOf,
  windowTotals,
} from './usage-analytics'

const TODAY = new Date('2026-11-12T15:00:00Z')

describe('buildDailySeries', () => {
  it('zero-fills missing days and merges both sources', () => {
    const series = buildDailySeries(
      3,
      [
        { date: '2026-11-11', requests: '4', inputTokens: 100, outputTokens: 40, reasoningTokens: 10, costMicros: 250 },
      ],
      [{ date: '2026-11-11', attempts: 5, errors: 1 }],
      TODAY,
    )

    expect(series.map((d) => d.date)).toEqual(['2026-11-10', '2026-11-11', '2026-11-12'])
    expect(series[0]).toMatchObject({ requests: 0, attempts: 0, errors: 0 })
    expect(series[1]).toMatchObject({ requests: 4, attempts: 5, errors: 1, costMicros: 250 })
    expect(series[2]).toMatchObject({ requests: 0, errors: 0 })
  })

  it('coerces bigint-ish string aggregates from SQL', () => {
    const series = buildDailySeries(
      1,
      [{ date: '2026-11-12', requests: 2, inputTokens: '10', outputTokens: '5', reasoningTokens: '2', costMicros: '123456789' }],
      [],
      TODAY,
    )
    expect(series[0]).toMatchObject({ inputTokens: 10, reasoningTokens: 2, costMicros: 123456789 })
  })

  it('uses UTC day boundaries regardless of local offset', () => {
    const series = buildDailySeries(1, [], [], new Date('2026-11-12T23:30:00Z'))
    expect(series[0]!.date).toBe('2026-11-12')
  })
})

describe('windowTotals', () => {
  const series = buildDailySeries(
    4,
    [
      { date: '2026-11-09', requests: 1, inputTokens: 10, outputTokens: 5, reasoningTokens: 1, costMicros: 100 },
      { date: '2026-11-10', requests: 2, inputTokens: 20, outputTokens: 10, reasoningTokens: 2, costMicros: 200 },
      { date: '2026-11-11', requests: 3, inputTokens: 30, outputTokens: 15, reasoningTokens: 3, costMicros: 300 },
      { date: '2026-11-12', requests: 4, inputTokens: 40, outputTokens: 20, reasoningTokens: 4, costMicros: 400 },
    ],
    [
      { date: '2026-11-09', attempts: 1, errors: 1 },
      { date: '2026-11-10', attempts: 2, errors: 0 },
      { date: '2026-11-11', attempts: 3, errors: 1 },
      { date: '2026-11-12', attempts: 4, errors: 0 },
    ],
    TODAY,
  )

  it('sums the current window (last half)', () => {
    expect(windowTotals(series, 2, 4)).toEqual({
      requests: 7,
      attempts: 7,
      errors: 1,
      inputTokens: 70,
      outputTokens: 35,
      costMicros: 700,
    })
  })

  it('sums the previous window (first half)', () => {
    expect(windowTotals(series, 0, 2)).toMatchObject({ requests: 3, errors: 1, costMicros: 300 })
  })
})

describe('trendOf', () => {
  it('computes percentage change', () => {
    expect(trendOf(120, 100)).toEqual({ current: 120, previous: 100, deltaPct: 20 })
    expect(trendOf(50, 100).deltaPct).toBe(-50)
  })

  it('returns null delta when previous window is empty', () => {
    expect(trendOf(10, 0).deltaPct).toBeNull()
    expect(trendOf(0, 0).deltaPct).toBeNull()
  })
})

describe('errorRatePct', () => {
  it('divides errors by attempts', () => {
    expect(errorRatePct(1, 4)).toBe(25)
    expect(errorRatePct(0, 10)).toBe(0)
  })

  it('is 0 without attempts', () => {
    expect(errorRatePct(0, 0)).toBe(0)
  })
})
