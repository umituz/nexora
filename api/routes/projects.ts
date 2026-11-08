import { Hono } from 'hono'
import { validator } from 'hono/validator'
import { and, desc, eq, isNull } from 'drizzle-orm'
import { stampUpdate, uid } from '@umituz/web-hono'
import { validateJson } from '@umituz/web-hono/validator'
import { z } from 'zod'
import type { Env } from '../env'
import { getDb } from '../db'
import { conversations, projects } from '../schema'
import { requireUser } from '../session'

export const projectsRouter = new Hono<{ Bindings: Env }>()

const INSTRUCTIONS_MAX = 8_000

const createSchema = z.object({
  name: z.string().min(1).max(120),
  description: z.string().max(500).nullish(),
  instructions: z.string().max(INSTRUCTIONS_MAX).nullish(),
})

const updateSchema = z.object({
  name: z.string().min(1).max(120).optional(),
  description: z.string().max(500).nullish(),
  instructions: z.string().max(INSTRUCTIONS_MAX).nullish(),
})

async function ownedProject(db: ReturnType<typeof getDb>, id: string, userId: string) {
  const [row] = await db
    .select({ id: projects.id })
    .from(projects)
    .where(and(eq(projects.id, id), eq(projects.userId, userId), isNull(projects.deletedAt)))
    .limit(1)
  return row
}

projectsRouter.get('/', async (c) => {
  const user = await requireUser(c)
  const db = getDb(c.env)
  const rows = await db
    .select()
    .from(projects)
    .where(and(eq(projects.userId, user.id), isNull(projects.deletedAt)))
    .orderBy(desc(projects.updatedAt))
  return c.json(rows)
})

projectsRouter.post('/', validator('json', validateJson(createSchema, 'Invalid project payload')), async (c) => {
  const user = await requireUser(c)
  const db = getDb(c.env)
  const body = c.req.valid('json')

  const [created] = await db
    .insert(projects)
    .values({
      id: uid('proj'),
      userId: user.id,
      name: body.name,
      description: body.description ?? null,
      instructions: body.instructions ?? null,
    })
    .returning()
  return c.json(created, 201)
})

projectsRouter.patch(
  '/:id',
  validator('json', validateJson(updateSchema, 'Invalid project payload')),
  async (c) => {
    const user = await requireUser(c)
    const db = getDb(c.env)
    const id = c.req.param('id')
    if (!(await ownedProject(db, id, user.id))) return c.json({ error: 'Project not found' }, 404)

    const body = c.req.valid('json')
    const [updated] = await db
      .update(projects)
      .set({
        ...(body.name !== undefined ? { name: body.name } : {}),
        ...(body.description !== undefined ? { description: body.description ?? null } : {}),
        ...(body.instructions !== undefined ? { instructions: body.instructions ?? null } : {}),
        ...stampUpdate(projects),
      })
      .where(eq(projects.id, id))
      .returning()
    return c.json(updated, 200)
  },
)

projectsRouter.delete('/:id', async (c) => {
  const user = await requireUser(c)
  const db = getDb(c.env)
  const id = c.req.param('id')
  if (!(await ownedProject(db, id, user.id))) return c.json({ error: 'Project not found' }, 404)

  await db
    .update(projects)
    .set({ deletedAt: new Date(), ...stampUpdate(projects) })
    .where(eq(projects.id, id))
  await db
    .update(conversations)
    .set({ projectId: null, ...stampUpdate(conversations) })
    .where(and(eq(conversations.projectId, id), eq(conversations.userId, user.id)))
  return c.json({ ok: true }, 200)
})
