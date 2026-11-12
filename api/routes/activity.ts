import { Hono } from 'hono'
import { and, desc, eq, inArray, isNull } from 'drizzle-orm'
import type { Env } from '../env'
import { getDb } from '../db'
import { activity } from '../schema'
import { requireUser } from '../session'

export const activityRouter = new Hono<{ Bindings: Env }>()

activityRouter.get('/', async (c) => {
  const user = await requireUser(c)
  const db = getDb(c.env)

  const actions = (c.req.query('actions') ?? '')
    .split(',')
    .map((part) => part.trim())
    .filter((part) => part.length > 0)

  const rows = await db
    .select()
    .from(activity)
    .where(
      and(
        eq(activity.userId, user.id),
        isNull(activity.deletedAt),
        actions.length > 0 ? inArray(activity.action, actions) : undefined,
      ),
    )
    .orderBy(desc(activity.createdAt))
    .limit(100)
  return c.json(rows)
})
