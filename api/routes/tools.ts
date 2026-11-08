import { Hono } from 'hono'
import { and, asc, eq, isNull } from 'drizzle-orm'
import type { Env } from '../env'
import { getDb } from '../db'
import { tools } from '../schema'
import { requireUser } from '../session'

export const toolsRouter = new Hono<{ Bindings: Env }>()

toolsRouter.get('/', async (c) => {
  await requireUser(c)
  const db = getDb(c.env)

  const rows = await db
    .select({
      id: tools.id,
      key: tools.key,
      name: tools.name,
      description: tools.description,
      parameters: tools.parameters,
      kind: tools.kind,
      requiresApproval: tools.requiresApproval,
    })
    .from(tools)
    .where(and(eq(tools.active, true), isNull(tools.deletedAt)))
    .orderBy(asc(tools.sortOrder), asc(tools.name))
  return c.json(rows)
})
