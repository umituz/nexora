import { Hono } from 'hono'
import { validator } from 'hono/validator'
import { and, desc, eq, isNull } from 'drizzle-orm'
import { ApiError, stampUpdate, uid } from '@umituz/web-hono'
import { validateJson } from '@umituz/web-hono/validator'
import { z } from 'zod'
import { DEFAULT_CONVERSATION_TITLE, GENERATION_BOUNDS, type ConversationSettings } from '@shared/ai/contracts'
import type { Env } from '../env'
import { getDb } from '../db'
import { conversations, projects } from '../schema'
import { requireUser } from '../session'
import { resolveModel } from '../ai/model-registry'

export const conversationsRouter = new Hono<{ Bindings: Env }>()

const settingsSchema = z.object({
  temperature: z.number().min(GENERATION_BOUNDS.temperature.min).max(GENERATION_BOUNDS.temperature.max).optional(),
  maxOutputTokens: z.number().int().positive().optional(),
  topP: z.number().min(GENERATION_BOUNDS.topP.min).max(GENERATION_BOUNDS.topP.max).optional(),
  systemExtra: z.string().max(4000).optional(),
})

const createSchema = z.object({
  modelId: z.string().nullish(),
  projectId: z.string().nullish(),
  settings: settingsSchema.optional(),
})

const patchSchema = z.object({
  title: z.string().min(1).max(200).optional(),
  projectId: z.string().nullish(),
  settings: settingsSchema.optional(),
})

async function ownedProjectId(db: ReturnType<typeof getDb>, projectId: string | null | undefined, userId: string) {
  if (!projectId) return null
  const [row] = await db
    .select({ id: projects.id })
    .from(projects)
    .where(and(eq(projects.id, projectId), eq(projects.userId, userId), isNull(projects.deletedAt)))
    .limit(1)
  if (!row) throw ApiError.notFound('Project')
  return row.id
}

conversationsRouter.get('/', async (c) => {
  const user = await requireUser(c)
  const db = getDb(c.env)
  const rows = await db
    .select()
    .from(conversations)
    .where(and(eq(conversations.userId, user.id), isNull(conversations.deletedAt)))
    .orderBy(desc(conversations.updatedAt))
  return c.json(rows)
})

conversationsRouter.post(
  '/',
  validator('json', validateJson(createSchema, 'Invalid conversation payload')),
  async (c) => {
    const user = await requireUser(c)
    const body = c.req.valid('json')
    const db = getDb(c.env)

    if (body.modelId) {
      await resolveModel(db, c.env, body.modelId)
    }
    const projectId = await ownedProjectId(db, body.projectId, user.id)

    const [row] = await db
      .insert(conversations)
      .values({
        id: uid('conv'),
        userId: user.id,
        title: DEFAULT_CONVERSATION_TITLE,
        projectId,
        modelId: body.modelId ?? null,
        settings: (body.settings ?? {}) satisfies ConversationSettings,
      })
      .returning()
    return c.json(row, 201)
  },
)

conversationsRouter.patch(
  '/:id',
  validator('json', validateJson(patchSchema, 'Invalid conversation patch')),
  async (c) => {
    const user = await requireUser(c)
    const body = c.req.valid('json')
    const db = getDb(c.env)
    const id = c.req.param('id')

    const [existing] = await db
      .select()
      .from(conversations)
      .where(and(eq(conversations.id, id), eq(conversations.userId, user.id), isNull(conversations.deletedAt)))
      .limit(1)
    if (!existing) return c.json({ error: 'Conversation not found' }, 404)

    const projectId = body.projectId !== undefined ? await ownedProjectId(db, body.projectId, user.id) : undefined

    const [row] = await db
      .update(conversations)
      .set({
        ...(body.title !== undefined ? { title: body.title } : {}),
        ...(projectId !== undefined ? { projectId } : {}),
        ...(body.settings !== undefined ? { settings: body.settings satisfies ConversationSettings } : {}),
        ...stampUpdate(conversations),
      })
      .where(and(eq(conversations.id, id), isNull(conversations.deletedAt)))
      .returning()
    return c.json(row)
  },
)

conversationsRouter.delete('/:id', async (c) => {
  const user = await requireUser(c)
  const db = getDb(c.env)
  const id = c.req.param('id')

  const [row] = await db
    .update(conversations)
    .set({ deletedAt: new Date(), ...stampUpdate(conversations) })
    .where(and(eq(conversations.id, id), eq(conversations.userId, user.id), isNull(conversations.deletedAt)))
    .returning()
  if (!row) return c.json({ error: 'Conversation not found' }, 404)
  return c.json({ success: true })
})
