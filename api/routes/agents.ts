import { Hono } from 'hono'
import { validator } from 'hono/validator'
import { and, desc, eq, inArray, isNull } from 'drizzle-orm'
import { ApiError, stampUpdate, uid } from '@umituz/web-hono'
import { validateJson } from '@umituz/web-hono/validator'
import { z } from 'zod'
import type { Env } from '../env'
import { getDb } from '../db'
import { agents, models, tools } from '../schema'
import { requireUser } from '../session'
import { logActivity } from '../activity-log'

export const agentsRouter = new Hono<{ Bindings: Env }>()

const upsertBodySchema = z.object({
  name: z.string().min(1).max(120),
  description: z.string().max(500).optional(),
  instructions: z.string().max(8000).optional(),
  modelId: z.string().optional(),
  toolIds: z.array(z.string()).max(20).optional(),
  active: z.boolean().optional(),
})

const patchBodySchema = upsertBodySchema.partial()

async function ownedAgent(db: ReturnType<typeof getDb>, userId: string, id: string) {
  const [row] = await db
    .select()
    .from(agents)
    .where(and(eq(agents.id, id), eq(agents.userId, userId), isNull(agents.deletedAt)))
    .limit(1)
  if (!row) throw ApiError.notFound('Agent')
  return row
}

async function validateBindings(db: ReturnType<typeof getDb>, modelId: string | undefined, toolIds: string[] | undefined) {
  if (modelId) {
    const [model] = await db
      .select({ id: models.id, outputTypes: models.outputTypes })
      .from(models)
      .where(and(eq(models.id, modelId), eq(models.active, true), isNull(models.deletedAt)))
      .limit(1)
    if (!model) throw ApiError.badRequest('Unknown model')
    if (!model.outputTypes.includes('text')) throw ApiError.badRequest('Agent model must produce text')
  }
  if (toolIds && toolIds.length > 0) {
    const rows = await db
      .select({ id: tools.id })
      .from(tools)
      .where(and(inArray(tools.id, toolIds), eq(tools.active, true), isNull(tools.deletedAt)))
    if (rows.length !== toolIds.length) throw ApiError.badRequest('Unknown tool binding')
  }
}

agentsRouter.get('/', async (c) => {
  const user = await requireUser(c)
  const db = getDb(c.env)

  const rows = await db
    .select()
    .from(agents)
    .where(and(eq(agents.userId, user.id), isNull(agents.deletedAt)))
    .orderBy(desc(agents.updatedAt))
  return c.json(rows)
})

agentsRouter.post(
  '/',
  validator('json', validateJson(upsertBodySchema, 'Invalid agent payload')),
  async (c) => {
    const user = await requireUser(c)
    const db = getDb(c.env)
    const body = c.req.valid('json')

    await validateBindings(db, body.modelId, body.toolIds)

    const [row] = await db
      .insert(agents)
      .values({
        id: uid('agent'),
        userId: user.id,
        name: body.name,
        description: body.description ?? null,
        instructions: body.instructions ?? '',
        modelId: body.modelId ?? null,
        toolIds: body.toolIds ?? [],
        active: body.active ?? true,
      })
      .returning()
    await logActivity(db, user.id, 'agent.create', { type: 'agent', id: row.id, label: row.name })
    return c.json(row, 201)
  },
)

agentsRouter.patch(
  '/:id',
  validator('json', validateJson(patchBodySchema, 'Invalid agent payload')),
  async (c) => {
    const user = await requireUser(c)
    const db = getDb(c.env)
    await ownedAgent(db, user.id, c.req.param('id'))
    const body = c.req.valid('json')

    await validateBindings(db, body.modelId, body.toolIds)

    const [row] = await db
      .update(agents)
      .set({
        ...(body.name !== undefined ? { name: body.name } : {}),
        ...(body.description !== undefined ? { description: body.description } : {}),
        ...(body.instructions !== undefined ? { instructions: body.instructions } : {}),
        ...(body.modelId !== undefined ? { modelId: body.modelId } : {}),
        ...(body.toolIds !== undefined ? { toolIds: body.toolIds } : {}),
        ...(body.active !== undefined ? { active: body.active } : {}),
        ...stampUpdate(agents),
      })
      .where(and(eq(agents.id, c.req.param('id')), eq(agents.userId, user.id), isNull(agents.deletedAt)))
      .returning()
    await logActivity(db, user.id, 'agent.update', { type: 'agent', id: row.id, label: row.name })
    return c.json(row, 200)
  },
)

agentsRouter.delete('/:id', async (c) => {
  const user = await requireUser(c)
  const db = getDb(c.env)
  const owned = await ownedAgent(db, user.id, c.req.param('id'))

  const [row] = await db
    .update(agents)
    .set({ deletedAt: new Date(), active: false, ...stampUpdate(agents) })
    .where(and(eq(agents.id, c.req.param('id')), eq(agents.userId, user.id), isNull(agents.deletedAt)))
    .returning({ id: agents.id })
  await logActivity(db, user.id, 'agent.delete', { type: 'agent', id: row.id, label: owned.name })
  return c.json({ id: row.id })
})
