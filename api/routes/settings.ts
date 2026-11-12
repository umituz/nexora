import { Hono } from 'hono'
import { validator } from 'hono/validator'
import { and, eq, isNull } from 'drizzle-orm'
import { ApiError } from '@umituz/web-hono'
import { validateJson } from '@umituz/web-hono/validator'
import { z } from 'zod'
import type { Env } from '../env'
import { getDb } from '../db'
import { models, userSettings } from '../schema'
import { requireUser } from '../session'
import { logActivity } from '../activity-log'

export const settingsRouter = new Hono<{ Bindings: Env }>()

const putSchema = z.object({
  defaultModelId: z.string().nullish(),
})

settingsRouter.get('/', async (c) => {
  const user = await requireUser(c)
  const db = getDb(c.env)
  const [row] = await db
    .select({ defaultModelId: userSettings.defaultModelId })
    .from(userSettings)
    .where(eq(userSettings.userId, user.id))
    .limit(1)
  return c.json({ defaultModelId: row?.defaultModelId ?? null })
})

settingsRouter.put(
  '/',
  validator('json', validateJson(putSchema, 'Invalid settings payload')),
  async (c) => {
    const user = await requireUser(c)
    const db = getDb(c.env)
    const body = c.req.valid('json')

    if (body.defaultModelId) {
      const [model] = await db
        .select({ id: models.id })
        .from(models)
        .where(and(eq(models.id, body.defaultModelId), eq(models.active, true), isNull(models.deletedAt)))
        .limit(1)
      if (!model) throw ApiError.badRequest('Unknown model')
    }

    const [row] = await db
      .insert(userSettings)
      .values({
        userId: user.id,
        defaultModelId: body.defaultModelId ?? null,
        updatedAt: new Date(),
      })
      .onConflictDoUpdate({
        target: userSettings.userId,
        set: { defaultModelId: body.defaultModelId ?? null, updatedAt: new Date() },
      })
      .returning({ defaultModelId: userSettings.defaultModelId })

    await logActivity(db, user.id, 'settings.update')
    return c.json(row)
  },
)
