import { and, eq, isNull, sql } from 'drizzle-orm'
import { stampUpdate, uid } from '@umituz/web-hono'
import { tn, webhookDeliveries, webhooks } from './schema'
import type { Db } from './env'

export const WEBHOOK_EVENTS = [
  'conversation.create',
  'conversation.rename',
  'conversation.delete',
  'project.create',
  'project.update',
  'project.delete',
  'agent.create',
  'agent.update',
  'agent.delete',
  'memory.create',
  'memory.delete',
  'document.create',
  'document.delete',
  'document.ready',
  'document.failed',
  'research.start',
  'research.delete',
  'research.ready',
  'research.failed',
  'api_key.create',
  'api_key.update',
  'api_key.revoke',
  'settings.update',
  'task.failed',
] as const

export type WebhookEvent = (typeof WEBHOOK_EVENTS)[number]

export const EVENT_SET = new Set<string>(WEBHOOK_EVENTS)
const DELIVERY_TIMEOUT_MS = 8000
const MAX_DELIVERIES_KEPT = 50

export async function hmacSha256Hex(secret: string, body: string): Promise<string> {
  const encoder = new TextEncoder()
  const key = await crypto.subtle.importKey('raw', encoder.encode(secret), { name: 'HMAC', hash: 'SHA-256' }, false, [
    'sign',
  ])
  const signature = await crypto.subtle.sign('HMAC', key, encoder.encode(body))
  return Array.from(new Uint8Array(signature), (byte) => byte.toString(16).padStart(2, '0')).join('')
}

export interface WebhookDeliveryOutcome {
  ok: boolean
  statusCode: number | null
  durationMs: number
  error: string | null
}

interface WebhookTarget {
  id: string
  userId: string
  url: string
  secret: string
}

async function deliver(
  db: Db,
  target: WebhookTarget,
  event: string,
  data: Record<string, unknown>,
): Promise<WebhookDeliveryOutcome> {
  const deliveryId = uid('whd')
  const body = JSON.stringify({
    id: deliveryId,
    event,
    createdAt: new Date().toISOString(),
    data,
  })
  const startedAt = Date.now()
  let ok = false
  let statusCode: number | null = null
  let error: string | null = null
  try {
    const response = await fetch(target.url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'User-Agent': 'nexora-webhooks/1.0',
        'X-Nexora-Event': event,
        'X-Nexora-Signature': `sha256=${await hmacSha256Hex(target.secret, body)}`,
      },
      body,
      signal: AbortSignal.timeout(DELIVERY_TIMEOUT_MS),
    })
    statusCode = response.status
    ok = response.ok
    if (!ok) error = `HTTP ${response.status}`
  } catch (err) {
    error = err instanceof Error ? err.message : 'Delivery failed'
  }
  const durationMs = Date.now() - startedAt
  await db.insert(webhookDeliveries).values({
    id: deliveryId,
    userId: target.userId,
    webhookId: target.id,
    event,
    ok,
    statusCode,
    durationMs,
    error,
  })
  await db
    .update(webhooks)
    .set({
      successCount: sql`${webhooks.successCount} + ${ok ? 1 : 0}`,
      failureCount: sql`${webhooks.failureCount} + ${ok ? 0 : 1}`,
      lastTriggeredAt: new Date(),
      lastStatusCode: statusCode,
      ...stampUpdate(webhooks),
    })
    .where(eq(webhooks.id, target.id))
  await db.execute(sql`
    delete from ${sql.raw(tn('webhook_deliveries'))}
    where webhook_id = ${target.id}
      and id not in (
        select id from ${sql.raw(tn('webhook_deliveries'))}
        where webhook_id = ${target.id}
        order by created_at desc
        limit ${MAX_DELIVERIES_KEPT}
      )
  `)
  return { ok, statusCode, durationMs, error }
}

export async function dispatchWebhooks(
  db: Db,
  userId: string,
  event: string,
  data: Record<string, unknown>,
): Promise<void> {
  if (!EVENT_SET.has(event)) return
  const rows = await db
    .select({ id: webhooks.id, userId: webhooks.userId, url: webhooks.url, secret: webhooks.secret, events: webhooks.events })
    .from(webhooks)
    .where(and(eq(webhooks.userId, userId), eq(webhooks.active, true), isNull(webhooks.deletedAt)))
  const matched = rows.filter((row) => row.events.includes(event))
  await Promise.all(matched.map((row) => deliver(db, row, event, data)))
}

export async function sendTestWebhook(db: Db, target: WebhookTarget): Promise<WebhookDeliveryOutcome> {
  return deliver(db, target, 'webhook.test', { message: 'Test delivery from Nexora' })
}
