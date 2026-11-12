import { Hono } from 'hono'
import { and, eq, isNull } from 'drizzle-orm'
import { validator } from 'hono/validator'
import { validateJson } from '@umituz/web-hono/validator'
import { z } from 'zod'
import type { Env } from '../env'
import { getDb } from '../db'
import { RESEARCH_QUERY_MAX, RESEARCH_QUERY_MIN } from '@umituz/web-ai'
import { researchRuns } from '../schema'
import { createResearchRun, deleteResearchRun, listResearchRuns } from '../ai/research'
import { enqueueTask, runTask } from '../ai/tasks'
import { registerBuiltinTaskHandlers } from '../ai/task-handlers'
import { requireUser } from '../session'
import { logActivity } from '../activity-log'

registerBuiltinTaskHandlers()

export const researchRouter = new Hono<{ Bindings: Env }>()

const startSchema = z.object({
  query: z.string().min(RESEARCH_QUERY_MIN).max(RESEARCH_QUERY_MAX),
})

researchRouter.get('/', async (c) => {
  const user = await requireUser(c)
  const db = getDb(c.env)
  return c.json(await listResearchRuns(db, user.id))
})

researchRouter.post('/', validator('json', validateJson(startSchema, 'Invalid research payload')), async (c) => {
  const user = await requireUser(c)
  const db = getDb(c.env)
  const body = c.req.valid('json')

  const run = await createResearchRun(db, { userId: user.id, query: body.query })
  const task = await enqueueTask(db, {
    userId: user.id,
    kind: 'research',
    payload: { researchId: run.id, query: body.query },
  })
  c.executionCtx.waitUntil(runTask(db, c.env, task.id))
  const trimmed = body.query.length > 60 ? `${body.query.slice(0, 60)}…` : body.query
  await logActivity(db, user.id, 'research.start', { type: 'research', id: run.id, label: trimmed })
  return c.json({ run, taskId: task.id }, 202)
})

researchRouter.get('/:id', async (c) => {
  const user = await requireUser(c)
  const db = getDb(c.env)
  const [row] = await db
    .select()
    .from(researchRuns)
    .where(and(eq(researchRuns.id, c.req.param('id')), eq(researchRuns.userId, user.id), isNull(researchRuns.deletedAt)))
    .limit(1)
  if (!row) return c.json({ error: 'Research run not found' }, 404)
  return c.json(row)
})

researchRouter.delete('/:id', async (c) => {
  const user = await requireUser(c)
  const db = getDb(c.env)
  const removed = await deleteResearchRun(db, user.id, c.req.param('id'))
  if (!removed) return c.json({ error: 'Research run not found' }, 404)
  await logActivity(db, user.id, 'research.delete', { type: 'research', id: c.req.param('id') })
  return c.json({ ok: true })
})
