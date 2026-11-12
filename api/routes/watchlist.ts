import { Hono } from 'hono'
import { and, desc, eq, isNull } from 'drizzle-orm'
import { validator } from 'hono/validator'
import { ApiError, stampUpdate, uid } from '@umituz/web-hono'
import { validateJson } from '@umituz/web-hono/validator'
import { z } from 'zod'
import type { Env } from '../env'
import { getDb } from '../db'
import { researchRuns, watchItems, watchScans } from '../schema'
import { createResearchRun } from '../ai/research'
import { enqueueTask, runTask } from '../ai/tasks'
import { registerBuiltinTaskHandlers } from '../ai/task-handlers'
import { requireUser } from '../session'
import { logActivity } from '../activity-log'

registerBuiltinTaskHandlers()

export const watchlistRouter = new Hono<{ Bindings: Env }>()

const KEYWORD_MAX = 80
const MAX_ITEMS = 20
const FEED_LIMIT = 50

const createSchema = z.object({
  keyword: z.string().trim().min(1).max(KEYWORD_MAX),
})

const ITEM_COLUMNS = {
  id: watchItems.id,
  keyword: watchItems.keyword,
  lastScanAt: watchItems.lastScanAt,
  createdAt: watchItems.createdAt,
}

watchlistRouter.get('/', async (c) => {
  const user = await requireUser(c)
  const db = getDb(c.env)
  const rows = await db
    .select(ITEM_COLUMNS)
    .from(watchItems)
    .where(and(eq(watchItems.userId, user.id), isNull(watchItems.deletedAt)))
    .orderBy(desc(watchItems.createdAt))
  return c.json(rows)
})

watchlistRouter.post('/', validator('json', validateJson(createSchema, 'Invalid watchlist payload')), async (c) => {
  const user = await requireUser(c)
  const db = getDb(c.env)
  const { keyword } = c.req.valid('json')

  const existing = await db
    .select({ id: watchItems.id })
    .from(watchItems)
    .where(and(eq(watchItems.userId, user.id), eq(watchItems.keyword, keyword), isNull(watchItems.deletedAt)))
    .limit(1)
  if (existing.length > 0) throw ApiError.conflict('Keyword is already on the watchlist')

  const kept = await db
    .select({ id: watchItems.id })
    .from(watchItems)
    .where(and(eq(watchItems.userId, user.id), isNull(watchItems.deletedAt)))
  if (kept.length >= MAX_ITEMS) throw ApiError.badRequest(`Watchlist is limited to ${MAX_ITEMS} keywords`)

  const [row] = await db
    .insert(watchItems)
    .values({ id: uid('wli'), userId: user.id, keyword })
    .returning(ITEM_COLUMNS)
  await logActivity(db, user.id, 'watchlist.create', { type: 'watchlist', id: row.id, label: keyword })
  return c.json(row, 201)
})

watchlistRouter.post('/:id/scan', async (c) => {
  const user = await requireUser(c)
  const db = getDb(c.env)
  const id = c.req.param('id')

  const [item] = await db
    .select({ id: watchItems.id, keyword: watchItems.keyword })
    .from(watchItems)
    .where(and(eq(watchItems.id, id), eq(watchItems.userId, user.id), isNull(watchItems.deletedAt)))
    .limit(1)
  if (!item) throw ApiError.notFound('Watchlist keyword')

  const query = `Latest news and developments about "${item.keyword}"`
  const run = await createResearchRun(db, { userId: user.id, query })
  const task = await enqueueTask(db, {
    userId: user.id,
    kind: 'research',
    payload: { researchId: run.id, query },
  })

  const [scan] = await db
    .insert(watchScans)
    .values({ id: uid('wsc'), userId: user.id, itemId: item.id, researchId: run.id, keyword: item.keyword })
    .returning({ id: watchScans.id })
  await db
    .update(watchItems)
    .set({ lastScanAt: new Date(), ...stampUpdate(watchItems) })
    .where(eq(watchItems.id, item.id))
  await logActivity(db, user.id, 'watchlist.scan', { type: 'watchlist', id: item.id, label: item.keyword })
  c.executionCtx.waitUntil(runTask(db, c.env, task.id))
  return c.json({ scanId: scan.id, taskId: task.id }, 202)
})

watchlistRouter.get('/feed', async (c) => {
  const user = await requireUser(c)
  const db = getDb(c.env)
  const rows = await db
    .select({
      id: watchScans.id,
      keyword: watchScans.keyword,
      researchId: watchScans.researchId,
      status: researchRuns.status,
      report: researchRuns.report,
      sources: researchRuns.sources,
      errorMessage: researchRuns.errorMessage,
      createdAt: watchScans.createdAt,
    })
    .from(watchScans)
    .innerJoin(researchRuns, eq(researchRuns.id, watchScans.researchId))
    .where(and(eq(watchScans.userId, user.id), isNull(watchScans.deletedAt)))
    .orderBy(desc(watchScans.createdAt))
    .limit(FEED_LIMIT)
  return c.json(rows)
})

watchlistRouter.delete('/:id', async (c) => {
  const user = await requireUser(c)
  const db = getDb(c.env)
  const id = c.req.param('id')

  const [row] = await db
    .update(watchItems)
    .set({ deletedAt: new Date(), ...stampUpdate(watchItems) })
    .where(and(eq(watchItems.id, id), eq(watchItems.userId, user.id), isNull(watchItems.deletedAt)))
    .returning({ id: watchItems.id, keyword: watchItems.keyword })
  if (!row) throw ApiError.notFound('Watchlist keyword')
  await logActivity(db, user.id, 'watchlist.delete', { type: 'watchlist', id, label: row.keyword })
  return c.json({ id: row.id })
})
