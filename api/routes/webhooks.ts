import { Hono } from 'hono'
import { validator } from 'hono/validator'
import { and, desc, eq, isNull } from 'drizzle-orm'
import { ApiError, stampUpdate, uid } from '@umituz/web-hono'
import { validateJson } from '@umituz/web-hono/validator'
import { z } from 'zod'
import type { Env } from '../env'
import { getDb } from '../db'
import { webhookDeliveries, webhooks } from '../schema'
import { requireUser } from '../session'
import { logActivity } from '../activity-log'
import { WEBHOOK_EVENTS, sendTestWebhook } from '../webhooks'

export const webhooksRouter = new Hono<{ Bindings: Env }>()

const SECRET_ALPHABET = 'abcdefghijklmnopqrstuvwxyz0123456789'
const SECRET_RANDOM_LENGTH = 36

function generateSecret(): string {
  const bytes = crypto.getRandomValues(new Uint8Array(SECRET_RANDOM_LENGTH))
  let random = ''
  for (const byte of bytes) random += SECRET_ALPHABET[byte % SECRET_ALPHABET.length]
  return `whsec_${random}`
}

const eventSchema = z.enum(WEBHOOK_EVENTS)

const createSchema = z.object({
  name: z.string().min(1).max(120),
  url: z.string().url().max(2048),
  events: z.array(eventSchema).min(1),
})

const patchSchema = z
  .object({
    name: z.string().min(1).max(120),
    url: z.string().url().max(2048),
    events: z.array(eventSchema).min(1),
    active: z.boolean(),
  })
  .partial()
  .refine((body) => Object.keys(body).length > 0, { message: 'Empty webhook payload' })

const LIST_COLUMNS = {
  id: webhooks.id,
  name: webhooks.name,
  url: webhooks.url,
  events: webhooks.events,
  active: webhooks.active,
  successCount: webhooks.successCount,
  failureCount: webhooks.failureCount,
  lastTriggeredAt: webhooks.lastTriggeredAt,
  lastStatusCode: webhooks.lastStatusCode,
  createdAt: webhooks.createdAt,
}

webhooksRouter.get('/', async (c) => {
  const user = await requireUser(c)
  const db = getDb(c.env)
  const rows = await db
    .select(LIST_COLUMNS)
    .from(webhooks)
    .where(and(eq(webhooks.userId, user.id), isNull(webhooks.deletedAt)))
    .orderBy(desc(webhooks.createdAt))
  return c.json(rows)
})

webhooksRouter.post(
  '/',
  validator('json', validateJson(createSchema, 'Invalid webhook payload')),
  async (c) => {
    const user = await requireUser(c)
    const db = getDb(c.env)
    const body = c.req.valid('json')

    const secret = generateSecret()
    const [row] = await db
      .insert(webhooks)
      .values({
        id: uid('wh'),
        userId: user.id,
        name: body.name,
        url: body.url,
        events: body.events,
        secret,
      })
      .returning(LIST_COLUMNS)
    await logActivity(db, user.id, 'webhook.create', { type: 'webhook', id: row.id, label: body.name })
    return c.json({ ...row, secret }, 201)
  },
)

webhooksRouter.patch(
  '/:id',
  validator('json', validateJson(patchSchema, 'Invalid webhook payload')),
  async (c) => {
    const user = await requireUser(c)
    const db = getDb(c.env)
    const id = c.req.param('id')
    const body = c.req.valid('json')

    const [row] = await db
      .update(webhooks)
      .set({ ...body, ...stampUpdate(webhooks) })
      .where(and(eq(webhooks.id, id), eq(webhooks.userId, user.id), isNull(webhooks.deletedAt)))
      .returning(LIST_COLUMNS)
    if (!row) throw ApiError.notFound('Webhook')
    await logActivity(db, user.id, 'webhook.update', { type: 'webhook', id, label: row.name })
    return c.json(row)
  },
)

webhooksRouter.post('/:id/test', async (c) => {
  const user = await requireUser(c)
  const db = getDb(c.env)
  const id = c.req.param('id')

  const [row] = await db
    .select({ id: webhooks.id, userId: webhooks.userId, url: webhooks.url, secret: webhooks.secret })
    .from(webhooks)
    .where(and(eq(webhooks.id, id), eq(webhooks.userId, user.id), isNull(webhooks.deletedAt)))
    .limit(1)
  if (!row) throw ApiError.notFound('Webhook')
  const outcome = await sendTestWebhook(db, row)
  return c.json(outcome)
})

webhooksRouter.post('/:id/rotate', async (c) => {
  const user = await requireUser(c)
  const db = getDb(c.env)
  const id = c.req.param('id')

  const secret = generateSecret()
  const [row] = await db
    .update(webhooks)
    .set({ secret, ...stampUpdate(webhooks) })
    .where(and(eq(webhooks.id, id), eq(webhooks.userId, user.id), isNull(webhooks.deletedAt)))
    .returning({ id: webhooks.id })
  if (!row) throw ApiError.notFound('Webhook')
  await logActivity(db, user.id, 'webhook.update', { type: 'webhook', id })
  return c.json({ id: row.id, secret })
})

webhooksRouter.get('/:id/deliveries', async (c) => {
  const user = await requireUser(c)
  const db = getDb(c.env)
  const id = c.req.param('id')

  const [owned] = await db
    .select({ id: webhooks.id })
    .from(webhooks)
    .where(and(eq(webhooks.id, id), eq(webhooks.userId, user.id), isNull(webhooks.deletedAt)))
    .limit(1)
  if (!owned) throw ApiError.notFound('Webhook')

  const rows = await db
    .select({
      id: webhookDeliveries.id,
      event: webhookDeliveries.event,
      ok: webhookDeliveries.ok,
      statusCode: webhookDeliveries.statusCode,
      durationMs: webhookDeliveries.durationMs,
      error: webhookDeliveries.error,
      createdAt: webhookDeliveries.createdAt,
    })
    .from(webhookDeliveries)
    .where(and(eq(webhookDeliveries.webhookId, id), isNull(webhookDeliveries.deletedAt)))
    .orderBy(desc(webhookDeliveries.createdAt))
    .limit(50)
  return c.json(rows)
})

webhooksRouter.delete('/:id', async (c) => {
  const user = await requireUser(c)
  const db = getDb(c.env)
  const id = c.req.param('id')

  const [row] = await db
    .update(webhooks)
    .set({ active: false, deletedAt: new Date(), ...stampUpdate(webhooks) })
    .where(and(eq(webhooks.id, id), eq(webhooks.userId, user.id), isNull(webhooks.deletedAt)))
    .returning({ id: webhooks.id, name: webhooks.name })
  if (!row) throw ApiError.notFound('Webhook')
  await logActivity(db, user.id, 'webhook.delete', { type: 'webhook', id, label: row.name })
  return c.json({ id: row.id })
})
