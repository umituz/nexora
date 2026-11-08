import { Hono } from 'hono'
import { and, eq, isNull, sql } from 'drizzle-orm'
import type { UsageSummary } from '@shared/ai/contracts'
import type { Env } from '../env'
import { getDb } from '../db'
import { usageRecords } from '../schema'
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
