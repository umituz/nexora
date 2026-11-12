import { Hono } from 'hono'
import { and, asc, desc, eq, isNull, sql } from 'drizzle-orm'
import type { Env } from '../env'
import { getDb } from '../db'
import { conversations, providers, usageRecords } from '../schema'
import { requireUser } from '../session'

export const requestsRouter = new Hono<{ Bindings: Env }>()

const DEFAULT_PAGE_SIZE = 25
const MAX_PAGE_SIZE = 100
const STATUS_FILTERS = new Set(['complete', 'error'])

requestsRouter.get('/', async (c) => {
  const user = await requireUser(c)
  const db = getDb(c.env)

  const page = Math.max(1, Math.floor(Number(c.req.query('page')) || 1))
  const pageSize = Math.min(MAX_PAGE_SIZE, Math.max(1, Math.floor(Number(c.req.query('pageSize')) || DEFAULT_PAGE_SIZE)))
  const status = c.req.query('status') ?? ''
  const model = c.req.query('model') ?? ''

  const conditions = [eq(usageRecords.userId, user.id), isNull(usageRecords.deletedAt)]
  if (STATUS_FILTERS.has(status)) conditions.push(eq(usageRecords.status, status))
  if (model.length > 0) conditions.push(eq(usageRecords.model, model))
  const scope = and(...conditions)

  const [countRow] = await db
    .select({ total: sql<number>`count(*)::int` })
    .from(usageRecords)
    .where(scope)

  const rows = await db
    .select({
      id: usageRecords.id,
      createdAt: usageRecords.createdAt,
      status: usageRecords.status,
      model: usageRecords.model,
      providerName: providers.name,
      conversationId: usageRecords.conversationId,
      conversationTitle: conversations.title,
      durationMs: usageRecords.durationMs,
      inputTokens: usageRecords.inputTokens,
      outputTokens: usageRecords.outputTokens,
      reasoningTokens: usageRecords.reasoningTokens,
      costMicros: usageRecords.costMicros,
    })
    .from(usageRecords)
    .leftJoin(providers, eq(providers.id, usageRecords.providerId))
    .leftJoin(conversations, and(eq(conversations.id, usageRecords.conversationId), isNull(conversations.deletedAt)))
    .where(scope)
    .orderBy(desc(usageRecords.createdAt))
    .limit(pageSize)
    .offset((page - 1) * pageSize)

  const modelRows = await db
    .selectDistinct({ model: usageRecords.model })
    .from(usageRecords)
    .where(and(eq(usageRecords.userId, user.id), isNull(usageRecords.deletedAt)))
    .orderBy(asc(usageRecords.model))

  return c.json({
    rows,
    total: Number(countRow?.total ?? 0),
    page,
    pageSize,
    models: modelRows.map((row) => row.model),
  })
})
