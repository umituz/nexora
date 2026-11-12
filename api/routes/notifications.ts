import { Hono } from 'hono'
import { and, desc, eq, isNull } from 'drizzle-orm'
import { ApiError } from '@umituz/web-hono'
import type { Env } from '../env'
import { getDb } from '../db'
import { notifications } from '../schema'
import { requireUser } from '../session'

export const notificationsRouter = new Hono<{ Bindings: Env }>()

const LIST_COLUMNS = {
  id: notifications.id,
  type: notifications.type,
  title: notifications.title,
  body: notifications.body,
  severity: notifications.severity,
  link: notifications.link,
  readAt: notifications.readAt,
  createdAt: notifications.createdAt,
}

notificationsRouter.get('/', async (c) => {
  const user = await requireUser(c)
  const db = getDb(c.env)
  const rows = await db
    .select(LIST_COLUMNS)
    .from(notifications)
    .where(and(eq(notifications.userId, user.id), isNull(notifications.deletedAt)))
    .orderBy(desc(notifications.createdAt))
    .limit(50)
  return c.json(rows)
})

notificationsRouter.post('/read-all', async (c) => {
  const user = await requireUser(c)
  const db = getDb(c.env)
  await db
    .update(notifications)
    .set({ readAt: new Date() })
    .where(and(eq(notifications.userId, user.id), isNull(notifications.readAt), isNull(notifications.deletedAt)))
  return c.json({ ok: true })
})

notificationsRouter.patch('/:id/read', async (c) => {
  const user = await requireUser(c)
  const db = getDb(c.env)
  const id = c.req.param('id')

  const [row] = await db
    .update(notifications)
    .set({ readAt: new Date() })
    .where(and(eq(notifications.id, id), eq(notifications.userId, user.id), isNull(notifications.readAt)))
    .returning({ id: notifications.id })
  if (!row) throw ApiError.notFound('Notification')
  return c.json({ id: row.id })
})

notificationsRouter.delete('/:id', async (c) => {
  const user = await requireUser(c)
  const db = getDb(c.env)
  const id = c.req.param('id')

  const [row] = await db
    .update(notifications)
    .set({ deletedAt: new Date() })
    .where(and(eq(notifications.id, id), eq(notifications.userId, user.id), isNull(notifications.deletedAt)))
    .returning({ id: notifications.id })
  if (!row) throw ApiError.notFound('Notification')
  return c.json({ id: row.id })
})
