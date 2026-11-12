import { Hono } from 'hono'
import { validator } from 'hono/validator'
import { and, desc, eq, isNull } from 'drizzle-orm'
import { ApiError, stampUpdate, uid } from '@umituz/web-hono'
import { validateJson } from '@umituz/web-hono/validator'
import { z } from 'zod'
import type { Env } from '../env'
import { getDb } from '../db'
import { NOTIFICATION_SEVERITIES, automationRuns, automations } from '../schema'
import type { AutomationAction } from '../schema'
import { requireUser } from '../session'
import { logActivity } from '../activity-log'
import { WEBHOOK_EVENTS } from '../webhooks'
import { testAutomation } from '../automations'

export const automationsRouter = new Hono<{ Bindings: Env }>()

const notifyActionSchema = z.object({
  type: z.literal('notify'),
  title: z.string().min(1).max(200),
  body: z.string().max(2000).nullable().optional(),
  severity: z.enum(NOTIFICATION_SEVERITIES),
})

const webhookActionSchema = z.object({
  type: z.literal('webhook'),
  url: z.string().url().max(2048),
  secret: z.string().min(1).max(200).nullable().optional(),
})

const actionSchema = z.discriminatedUnion('type', [notifyActionSchema, webhookActionSchema])

const createSchema = z.object({
  name: z.string().min(1).max(120),
  trigger: z.enum(WEBHOOK_EVENTS),
  actions: z.array(actionSchema).min(1).max(10),
})

const patchSchema = z
  .object({
    name: z.string().min(1).max(120),
    trigger: z.enum(WEBHOOK_EVENTS),
    actions: z.array(actionSchema).min(1).max(10),
    active: z.boolean(),
  })
  .partial()
  .refine((body) => Object.keys(body).length > 0, { message: 'Empty automation payload' })

const LIST_COLUMNS = {
  id: automations.id,
  name: automations.name,
  trigger: automations.trigger,
  actions: automations.actions,
  active: automations.active,
  runCount: automations.runCount,
  lastRunAt: automations.lastRunAt,
  createdAt: automations.createdAt,
}

function normalizeActions(actions: z.infer<typeof actionSchema>[]): AutomationAction[] {
  return actions.map((action) =>
    action.type === 'notify'
      ? { type: 'notify', title: action.title, body: action.body ?? null, severity: action.severity }
      : { type: 'webhook', url: action.url, secret: action.secret ?? null },
  )
}

automationsRouter.get('/', async (c) => {
  const user = await requireUser(c)
  const db = getDb(c.env)
  const rows = await db
    .select(LIST_COLUMNS)
    .from(automations)
    .where(and(eq(automations.userId, user.id), isNull(automations.deletedAt)))
    .orderBy(desc(automations.createdAt))
  return c.json(rows)
})

automationsRouter.post(
  '/',
  validator('json', validateJson(createSchema, 'Invalid automation payload')),
  async (c) => {
    const user = await requireUser(c)
    const db = getDb(c.env)
    const body = c.req.valid('json')

    const [row] = await db
      .insert(automations)
      .values({
        id: uid('atm'),
        userId: user.id,
        name: body.name,
        trigger: body.trigger,
        actions: normalizeActions(body.actions),
      })
      .returning(LIST_COLUMNS)
    await logActivity(db, user.id, 'automation.create', { type: 'automation', id: row.id, label: body.name })
    return c.json(row, 201)
  },
)

automationsRouter.patch(
  '/:id',
  validator('json', validateJson(patchSchema, 'Invalid automation payload')),
  async (c) => {
    const user = await requireUser(c)
    const db = getDb(c.env)
    const id = c.req.param('id')
    const body = c.req.valid('json')

    const [row] = await db
      .update(automations)
      .set({
        name: body.name,
        trigger: body.trigger,
        active: body.active,
        ...(body.actions ? { actions: normalizeActions(body.actions) } : {}),
        ...stampUpdate(automations),
      })
      .where(and(eq(automations.id, id), eq(automations.userId, user.id), isNull(automations.deletedAt)))
      .returning(LIST_COLUMNS)
    if (!row) throw ApiError.notFound('Automation')
    await logActivity(db, user.id, 'automation.update', { type: 'automation', id, label: row.name })
    return c.json(row)
  },
)

automationsRouter.post('/:id/test', async (c) => {
  const user = await requireUser(c)
  const db = getDb(c.env)
  const id = c.req.param('id')

  const [row] = await db
    .select({ id: automations.id, userId: automations.userId, actions: automations.actions })
    .from(automations)
    .where(and(eq(automations.id, id), eq(automations.userId, user.id), isNull(automations.deletedAt)))
    .limit(1)
  if (!row) throw ApiError.notFound('Automation')
  const ok = await testAutomation(db, row)
  return c.json({ ok })
})

automationsRouter.get('/:id/runs', async (c) => {
  const user = await requireUser(c)
  const db = getDb(c.env)
  const id = c.req.param('id')

  const [owned] = await db
    .select({ id: automations.id })
    .from(automations)
    .where(and(eq(automations.id, id), eq(automations.userId, user.id), isNull(automations.deletedAt)))
    .limit(1)
  if (!owned) throw ApiError.notFound('Automation')

  const rows = await db
    .select({
      id: automationRuns.id,
      event: automationRuns.event,
      ok: automationRuns.ok,
      results: automationRuns.results,
      error: automationRuns.error,
      createdAt: automationRuns.createdAt,
    })
    .from(automationRuns)
    .where(and(eq(automationRuns.automationId, id), isNull(automationRuns.deletedAt)))
    .orderBy(desc(automationRuns.createdAt))
    .limit(50)
  return c.json(rows)
})

automationsRouter.delete('/:id', async (c) => {
  const user = await requireUser(c)
  const db = getDb(c.env)
  const id = c.req.param('id')

  const [row] = await db
    .update(automations)
    .set({ active: false, deletedAt: new Date(), ...stampUpdate(automations) })
    .where(and(eq(automations.id, id), eq(automations.userId, user.id), isNull(automations.deletedAt)))
    .returning({ id: automations.id, name: automations.name })
  if (!row) throw ApiError.notFound('Automation')
  await logActivity(db, user.id, 'automation.delete', { type: 'automation', id, label: row.name })
  return c.json({ id: row.id })
})
