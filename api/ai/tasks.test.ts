import { describe, expect, it } from 'vitest'
import { canStart, nextAttemptDelayMs, planFailure, TASK_POLICIES } from './tasks'

const NOW = new Date('2026-11-08T12:00:00.000Z')

describe('nextAttemptDelayMs', () => {
  it('grows exponentially from the base', () => {
    expect(nextAttemptDelayMs(1, 2000)).toBe(2000)
    expect(nextAttemptDelayMs(2, 2000)).toBe(4000)
    expect(nextAttemptDelayMs(3, 2000)).toBe(8000)
  })

  it('caps the delay at 30 seconds', () => {
    expect(nextAttemptDelayMs(6, 2000)).toBe(30000)
    expect(nextAttemptDelayMs(20, 2000)).toBe(30000)
  })

  it('never returns a negative or zero delay', () => {
    expect(nextAttemptDelayMs(0, 500)).toBe(500)
  })
})

describe('canStart', () => {
  it('starts queued tasks with no scheduled retry immediately', () => {
    expect(canStart({ status: 'queued', nextAttemptAt: null }, NOW)).toBe(true)
  })

  it('waits for the scheduled retry time', () => {
    const future = new Date(NOW.getTime() + 5000).toISOString()
    const past = new Date(NOW.getTime() - 5000).toISOString()
    expect(canStart({ status: 'queued', nextAttemptAt: future }, NOW)).toBe(false)
    expect(canStart({ status: 'queued', nextAttemptAt: past }, NOW)).toBe(true)
  })

  it('never starts non-queued tasks', () => {
    expect(canStart({ status: 'running', nextAttemptAt: null }, NOW)).toBe(false)
    expect(canStart({ status: 'succeeded', nextAttemptAt: null }, NOW)).toBe(false)
    expect(canStart({ status: 'cancelled', nextAttemptAt: null }, NOW)).toBe(false)
  })
})

describe('planFailure', () => {
  it('schedules a retry with backoff while attempts remain', () => {
    const plan = planFailure({ attempts: 1, maxAttempts: 3 }, 'provider unreachable', 2000, NOW)
    expect(plan.status).toBe('queued')
    expect(plan.nextAttemptAt).toBe(new Date(NOW.getTime() + 2000).toISOString())
    expect(plan.log.level).toBe('error')
    expect(plan.log.message).toContain('retry scheduled')
    const second = planFailure({ attempts: 2, maxAttempts: 3 }, 'still down', 2000, NOW)
    expect(second.nextAttemptAt).toBe(new Date(NOW.getTime() + 4000).toISOString())
  })

  it('fails terminally when attempts are exhausted', () => {
    const plan = planFailure({ attempts: 3, maxAttempts: 3 }, 'provider unreachable', 2000, NOW)
    expect(plan.status).toBe('failed')
    expect(plan.nextAttemptAt).toBeNull()
    expect(plan.log.message).toBe('provider unreachable')
  })

  it('keeps the log entry timestamped', () => {
    const plan = planFailure({ attempts: 1, maxAttempts: 2 }, 'boom', 1000, NOW)
    expect(plan.log.at).toBe(NOW.toISOString())
  })
})

describe('TASK_POLICIES', () => {
  it('defines bounded retries for every task kind', () => {
    for (const policy of Object.values(TASK_POLICIES)) {
      expect(policy.maxAttempts).toBeGreaterThan(0)
      expect(policy.maxAttempts).toBeLessThanOrEqual(5)
      expect(policy.backoffBaseMs).toBeGreaterThan(0)
    }
    expect(TASK_POLICIES.index_document.maxAttempts).toBe(3)
    expect(TASK_POLICIES.research.maxAttempts).toBe(2)
  })
})
