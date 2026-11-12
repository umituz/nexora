import { and, eq, isNull, sql } from 'drizzle-orm'
import { stampUpdate, uid } from '@umituz/web-hono'
import { automations, automationRuns, notifications, tn } from './schema'
import type { AutomationAction, AutomationActionOutcome } from './schema'
import { EVENT_SET, hmacSha256Hex } from './webhooks'
import type { Db } from './env'

const ACTION_TIMEOUT_MS = 8000
const MAX_RUNS_KEPT = 50

interface AutomationRuleRow {
  id: string
  userId: string
  actions: AutomationAction[]
}

async function performAction(
  db: Db,
  userId: string,
  action: AutomationAction,
  body: string,
  event: string,
): Promise<AutomationActionOutcome> {
  if (action.type === 'notify') {
    await db.insert(notifications).values({
      id: uid('ntf'),
      userId,
      type: 'automation.run',
      title: action.title,
      body: action.body ?? null,
      severity: action.severity,
      link: null,
    })
    return { type: action.type, ok: true, detail: 'notification created' }
  }
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    'User-Agent': 'nexora-automations/1.0',
    'X-Nexora-Event': event,
  }
  if (action.secret) headers['X-Nexora-Signature'] = `sha256=${await hmacSha256Hex(action.secret, body)}`
  const startedAt = Date.now()
  let ok = false
  let detail: string
  try {
    const response = await fetch(action.url, {
      method: 'POST',
      headers,
      body,
      signal: AbortSignal.timeout(ACTION_TIMEOUT_MS),
    })
    ok = response.ok
    detail = `HTTP ${response.status}`
  } catch (err) {
    detail = err instanceof Error ? err.message : 'Request failed'
  }
  return { type: action.type, ok, detail: `${detail} in ${Date.now() - startedAt}ms` }
}

export async function runAutomation(
  db: Db,
  rule: AutomationRuleRow,
  event: string,
  data: Record<string, unknown>,
): Promise<boolean> {
  const runId = uid('aur')
  const body = JSON.stringify({
    id: runId,
    event,
    createdAt: new Date().toISOString(),
    data,
  })
  const results: AutomationActionOutcome[] = []
  for (const action of rule.actions) {
    results.push(await performAction(db, rule.userId, action, body, event))
  }
  const ok = results.every((result) => result.ok)
  await db.insert(automationRuns).values({
    id: runId,
    userId: rule.userId,
    automationId: rule.id,
    event,
    ok,
    results,
    error: null,
  })
  await db
    .update(automations)
    .set({
      runCount: sql`${automations.runCount} + 1`,
      lastRunAt: new Date(),
      ...stampUpdate(automations),
    })
    .where(eq(automations.id, rule.id))
  await db.execute(sql`
    delete from ${sql.raw(tn('automation_runs'))}
    where automation_id = ${rule.id}
      and id not in (
        select id from ${sql.raw(tn('automation_runs'))}
        where automation_id = ${rule.id}
        order by created_at desc
        limit ${MAX_RUNS_KEPT}
      )
  `)
  return ok
}

export async function runAutomations(
  db: Db,
  userId: string,
  event: string,
  data: Record<string, unknown>,
): Promise<void> {
  if (!EVENT_SET.has(event)) return
  const rows = await db
    .select({ id: automations.id, userId: automations.userId, actions: automations.actions })
    .from(automations)
    .where(
      and(
        eq(automations.userId, userId),
        eq(automations.trigger, event),
        eq(automations.active, true),
        isNull(automations.deletedAt),
      ),
    )
  await Promise.all(rows.map((row) => runAutomation(db, row, event, data)))
}

export async function testAutomation(db: Db, rule: AutomationRuleRow): Promise<boolean> {
  return runAutomation(db, rule, 'automation.test', { message: 'Test run from Nexora' })
}
