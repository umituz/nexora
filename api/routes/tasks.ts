import { Hono } from 'hono'
import { and, desc, eq, inArray } from 'drizzle-orm'
import type { Env } from '../env'
import { getDb } from '../db'
import { tasks } from '../schema'
import { kickDueTasks, runTask } from '../ai/tasks'
import { registerBuiltinTaskHandlers } from '../ai/task-handlers'
import { requireUser } from '../session'

registerBuiltinTaskHandlers()

export const tasksRouter = new Hono<{ Bindings: Env }>()

const TASK_COLUMNS = {
  id: tasks.id,
  kind: tasks.kind,
  status: tasks.status,
  result: tasks.result,
  error: tasks.error,
  attempts: tasks.attempts,
  maxAttempts: tasks.maxAttempts,
  nextAttemptAt: tasks.nextAttemptAt,
  logs: tasks.logs,
  createdAt: tasks.createdAt,
  updatedAt: tasks.updatedAt,
}

tasksRouter.get('/', async (c) => {
  const user = await requireUser(c)
  const db = getDb(c.env)
  void kickDueTasks(db, c.env, user.id, (promise) => c.executionCtx.waitUntil(promise))
  const rows = await db
    .select(TASK_COLUMNS)
    .from(tasks)
    .where(eq(tasks.userId, user.id))
    .orderBy(desc(tasks.createdAt))
  return c.json(rows)
})

tasksRouter.get('/:id', async (c) => {
  const user = await requireUser(c)
  const db = getDb(c.env)
  const id = c.req.param('id')
  void kickDueTasks(db, c.env, user.id, (promise) => c.executionCtx.waitUntil(promise), id)
  const [row] = await db
    .select(TASK_COLUMNS)
    .from(tasks)
    .where(and(eq(tasks.id, id), eq(tasks.userId, user.id)))
    .limit(1)
  if (!row) return c.json({ error: 'Task not found' }, 404)
  return c.json(row)
})

tasksRouter.post('/:id/cancel', async (c) => {
  const user = await requireUser(c)
  const db = getDb(c.env)
  const id = c.req.param('id')

  const [row] = await db
    .update(tasks)
    .set({ status: 'cancelled', nextAttemptAt: null, updatedAt: new Date() })
    .where(and(eq(tasks.id, id), eq(tasks.userId, user.id), eq(tasks.status, 'queued')))
    .returning({ id: tasks.id })
  if (!row) return c.json({ error: 'Only queued tasks can be cancelled' }, 409)
  return c.json({ ok: true }, 200)
})

tasksRouter.post('/:id/retry', async (c) => {
  const user = await requireUser(c)
  const db = getDb(c.env)
  const id = c.req.param('id')

  const [row] = await db
    .update(tasks)
    .set({ status: 'queued', attempts: 0, error: null, nextAttemptAt: null, updatedAt: new Date() })
    .where(and(eq(tasks.id, id), eq(tasks.userId, user.id), inArray(tasks.status, ['failed', 'cancelled'])))
    .returning({ id: tasks.id, kind: tasks.kind, payload: tasks.payload })
  if (!row) return c.json({ error: 'Only failed or cancelled tasks can be retried' }, 409)

  c.executionCtx.waitUntil(runTask(db, c.env, id))
  return c.json({ ok: true }, 200)
})
