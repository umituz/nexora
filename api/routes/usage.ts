import { Hono } from 'hono'
import { and, desc, eq, isNull, sql } from 'drizzle-orm'
import type { UsageBreakdown, UsageSummary } from '@shared/ai/contracts'
import type { Env } from '../env'
import { getDb } from '../db'
import { conversations, providers, usageRecords } from '../schema'
import { requireUser } from '../session'

export const usageRouter = new Hono<{ Bindings: Env }>()

usageRouter.get('/summary', async (c) => {
  const user = await requireUser(c)
  const db = getDb(c.env)

  const [row] = await db
    .select({
      requests: sql<number>`count(*)::int`,
      inputTokens: sql<number>`coalesce(sum(${usageRecords.inputTokens}), 0)::int`,
      outputTokens: sql<number>`coalesce(sum(${usageRecords.outputTokens}), 0)::int`,
      costMicros: sql<number>`coalesce(sum(${usageRecords.costMicros}), 0)::bigint`,
    })
    .from(usageRecords)
    .where(and(eq(usageRecords.userId, user.id), isNull(usageRecords.deletedAt)))

  const summary: UsageSummary = {
    requests: Number(row?.requests ?? 0),
    inputTokens: Number(row?.inputTokens ?? 0),
    outputTokens: Number(row?.outputTokens ?? 0),
    costMicros: Number(row?.costMicros ?? 0),
  }
  return c.json(summary)
})

usageRouter.get('/breakdown', async (c) => {
  const user = await requireUser(c)
  const db = getDb(c.env)
  const scope = and(eq(usageRecords.userId, user.id), isNull(usageRecords.deletedAt))

  const modelRows = await db
    .select({
      model: usageRecords.model,
      providerId: usageRecords.providerId,
      providerName: providers.name,
      requests: sql<number>`count(*)::int`,
      inputTokens: sql<number>`coalesce(sum(${usageRecords.inputTokens}), 0)::int`,
      outputTokens: sql<number>`coalesce(sum(${usageRecords.outputTokens}), 0)::int`,
      costMicros: sql<number>`coalesce(sum(${usageRecords.costMicros}), 0)::bigint`,
    })
    .from(usageRecords)
    .leftJoin(providers, eq(providers.id, usageRecords.providerId))
    .where(scope)
    .groupBy(usageRecords.model, usageRecords.providerId, providers.name)
    .orderBy(desc(sql`sum(${usageRecords.costMicros})`))
    .limit(50)

  const conversationRows = await db
    .select({
      conversationId: usageRecords.conversationId,
      title: conversations.title,
      requests: sql<number>`count(*)::int`,
      inputTokens: sql<number>`coalesce(sum(${usageRecords.inputTokens}), 0)::int`,
      outputTokens: sql<number>`coalesce(sum(${usageRecords.outputTokens}), 0)::int`,
      costMicros: sql<number>`coalesce(sum(${usageRecords.costMicros}), 0)::bigint`,
      lastUsedAt: sql<string | null>`max(${usageRecords.createdAt})`,
    })
    .from(usageRecords)
    .leftJoin(conversations, and(eq(conversations.id, usageRecords.conversationId), isNull(conversations.deletedAt)))
    .where(scope)
    .groupBy(usageRecords.conversationId, conversations.title)
    .orderBy(desc(sql`sum(${usageRecords.costMicros})`))
    .limit(50)

  const breakdown: UsageBreakdown = {
    models: modelRows.map((row) => ({ ...row, costMicros: Number(row.costMicros) })),
    conversations: conversationRows.map((row) => ({
      ...row,
      costMicros: Number(row.costMicros),
      lastUsedAt: row.lastUsedAt ? new Date(row.lastUsedAt).toISOString() : null,
    })),
  }
  return c.json(breakdown)
})
