import { Hono } from 'hono'
import { validator } from 'hono/validator'
import { and, desc, eq, isNull } from 'drizzle-orm'
import { stampUpdate, uid } from '@umituz/web-hono'
import { validateJson } from '@umituz/web-hono/validator'
import { z } from 'zod'
import type { Env } from '../env'
import { getDb } from '../db'
import { memories } from '../schema'
import { requireUser } from '../session'

export const memoriesRouter = new Hono<{ Bindings: Env }>()

const CONTENT_MAX = 1_000

const createSchema = z.object({
  content: z.string().min(1).max(CONTENT_MAX),
  pinned: z.boolean().optional(),
})

const updateSchema = z.object({
  content: z.string().min(1).max(CONTENT_MAX).optional(),
  pinned: z.boolean().optional(),
})

async function ownedMemory(db: ReturnType<typeof getDb>, id: string, userId: string) {
  const [row] = await db
    .select({ id: memories.id })
    .from(memories)
    .where(and(eq(memories.id, id), eq(memories.userId, userId), isNull(memories.deletedAt)))
    .limit(1)
  return row
}

memoriesRouter.get('/', async (c) => {
  const user = await requireUser(c)
  const db = getDb(c.env)
  const rows = await db
    .select()
    .from(memories)
    .where(and(eq(memories.userId, user.id), isNull(memories.deletedAt)))
    .orderBy(desc(memories.pinned), desc(memories.updatedAt))
  return c.json(rows)
})

memoriesRouter.post('/', validator('json', validateJson(createSchema, 'Invalid memory payload')), async (c) => {
  const user = await requireUser(c)
  const db = getDb(c.env)
  const body = c.req.valid('json')

  const [created] = await db
    .insert(memories)
    .values({
      id: uid('mem'),
      userId: user.id,
      content: body.content,
      source: 'manual',
      pinned: body.pinned ?? false,
    })
    .returning()
  return c.json(created, 201)
})

memoriesRouter.patch(
  '/:id',
  validator('json', validateJson(updateSchema, 'Invalid memory payload')),
  async (c) => {
    const user = await requireUser(c)
    const db = getDb(c.env)
    const id = c.req.param('id')
    if (!(await ownedMemory(db, id, user.id))) return c.json({ error: 'Memory not found' }, 404)

    const body = c.req.valid('json')
    const [updated] = await db
      .update(memories)
      .set({
        ...(body.content !== undefined ? { content: body.content } : {}),
        ...(body.pinned !== undefined ? { pinned: body.pinned } : {}),
        ...stampUpdate(memories),
      })
      .where(eq(memories.id, id))
      .returning()
    return c.json(updated, 200)
  },
)

memoriesRouter.delete('/:id', async (c) => {
  const user = await requireUser(c)
  const db = getDb(c.env)
  const id = c.req.param('id')
  if (!(await ownedMemory(db, id, user.id))) return c.json({ error: 'Memory not found' }, 404)

  await db
    .update(memories)
    .set({ deletedAt: new Date(), ...stampUpdate(memories) })
    .where(eq(memories.id, id))
  return c.json({ ok: true }, 200)
})
