import { Hono } from 'hono'
import { and, desc, eq, isNull, sql } from 'drizzle-orm'
import type { ModelUsageStats } from '@shared/ai/contracts'
import type { Env } from '../env'
import { getDb } from '../db'
import { listAvailableModels } from '../ai/model-registry'
import { usageRecords } from '../schema'
import { requireUser } from '../session'

export const modelsRouter = new Hono<{ Bindings: Env }>()

modelsRouter.get('/', async (c) => {
  await requireUser(c)
  const models = await listAvailableModels(getDb(c.env), c.env)
  return c.json(models)
})

/**
 * Per-model usage stats for the model directory: how often the workspace
 * actually uses each model, at what cost and latency, and when last.
 */
modelsRouter.get('/stats', async (c) => {
  const user = await requireUser(c)
  const db = getDb(c.env)

  const rows = await db
    .select({
      model: usageRecords.model,
      providerId: usageRecords.providerId,
      requests: sql<number>`count(*)::int`,
      inputTokens: sql<number>`coalesce(sum(${usageRecords.inputTokens}), 0)::int`,
      outputTokens: sql<number>`coalesce(sum(${usageRecords.outputTokens}), 0)::int`,
      costMicros: sql<number>`coalesce(sum(${usageRecords.costMicros}), 0)::bigint`,
      avgDurationMs: sql<number>`coalesce(avg(${usageRecords.durationMs}), 0)::int`,
      lastUsedAt: sql<string | null>`max(${usageRecords.createdAt})`,
    })
    .from(usageRecords)
    .where(and(eq(usageRecords.userId, user.id), isNull(usageRecords.deletedAt)))
    .groupBy(usageRecords.model, usageRecords.providerId)
    .orderBy(desc(sql`count(*)`))
    .limit(100)

  const stats: ModelUsageStats[] = rows.map((row) => ({
    model: row.model,
    providerId: row.providerId,
    requests: Number(row.requests),
    inputTokens: Number(row.inputTokens),
    outputTokens: Number(row.outputTokens),
    costMicros: Number(row.costMicros),
    avgDurationMs: Number(row.avgDurationMs),
    lastUsedAt: row.lastUsedAt ? new Date(row.lastUsedAt).toISOString() : null,
  }))
  return c.json(stats)
})
