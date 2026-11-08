import { Hono } from 'hono'
import type { Env } from '../env'
import { getDb } from '../db'
import { listAvailableModels } from '../ai/model-registry'
import { requireUser } from '../session'

export const modelsRouter = new Hono<{ Bindings: Env }>()

modelsRouter.get('/', async (c) => {
  await requireUser(c)
  const models = await listAvailableModels(getDb(c.env), c.env)
  return c.json(models)
})
