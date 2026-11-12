import { Hono } from 'hono'
import { and, desc, eq, inArray, isNull, sql } from 'drizzle-orm'
import type {
  UsageAnalytics,
  UsageBreakdown,
  UsageErrorGroup,
  UsageHeatmap,
  UsageSummary,
} from '@shared/ai/contracts'
import type { Env } from '../env'
import { getDb } from '../db'
import { conversations, messages, models, providers, tn, usageRecords } from '../schema'
import { requireUser } from '../session'
import { buildDailySeries, errorRatePct, trendOf, windowTotals } from '../ai/usage-analytics'
import type { MessageSqlDayRow, UsageSqlDayRow } from '../ai/usage-analytics'

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

const ANALYTICS_RANGES = [7, 30, 90] as const

interface RawErrorGroupRow {
  code: string
  count: number | string
  message: string | null
  model_name: string | null
  conversation_id: string | null
  last_seen: string | null
}

/**
 * Observability analytics for the workspace: daily activity series with
 * period-over-period trends, per-model latency/error-rate rows, and recent
 * error occurrences grouped by error code.
 *
 * All interval math happens server-side (no timestamp round-trips through JS —
 * see the Neon timestamptz offset hazard) and day keys are UTC dates.
 */
interface RawHeatmapRow {
  dow: number | string
  hour: number | string
  requests: number | string
}

usageRouter.get('/heatmap', async (c) => {
  const user = await requireUser(c)
  const db = getDb(c.env)
  const requestedDays = Number(c.req.query('days'))
  const days = (ANALYTICS_RANGES as readonly number[]).includes(requestedDays) ? requestedDays : 30
  const tzParam = Number(c.req.query('tzOffset'))
  const tzOffset = Number.isFinite(tzParam) ? Math.max(-840, Math.min(720, tzParam)) : 0

  const raw = await db.execute(sql`
    select extract(dow from ((u.created_at at time zone 'UTC') + make_interval(mins => ${-tzOffset})))::int as dow,
           extract(hour from ((u.created_at at time zone 'UTC') + make_interval(mins => ${-tzOffset})))::int as hour,
           count(*)::int as requests
    from ${usageRecords} u
    where u.user_id = ${user.id}
      and u.deleted_at is null
      and u.created_at >= now() - make_interval(days => ${days})
      and u.created_at <= now()
    group by 1, 2
  `)
  const rows = (raw as unknown as { rows: RawHeatmapRow[] }).rows ?? []

  const cells = rows.map((row) => ({ dow: Number(row.dow), hour: Number(row.hour), requests: Number(row.requests) }))
  const totalRequests = cells.reduce((sum, cell) => sum + cell.requests, 0)
  const byHour = new Map<number, number>()
  for (const cell of cells) byHour.set(cell.hour, (byHour.get(cell.hour) ?? 0) + cell.requests)
  let peakHour: number | null = null
  let peakCount = 0
  for (const [hour, count] of byHour) {
    if (count > peakCount) {
      peakCount = count
      peakHour = hour
    }
  }

  const heatmap: UsageHeatmap = { days, cells, totalRequests, peakHour, peakCount }
  return c.json(heatmap)
})

usageRouter.get('/analytics', async (c) => {
  const user = await requireUser(c)
  const db = getDb(c.env)
  const requested = Number(c.req.query('days'))
  const days = (ANALYTICS_RANGES as readonly number[]).includes(requested) ? requested : 30
  const span = days * 2 // current window + previous window for trend deltas

  const windowFilter = sql`${usageRecords.createdAt} >= now() - make_interval(days => ${span})`
  const messageWindowFilter = sql`${messages.createdAt} >= now() - make_interval(days => ${span})`

  const usageDayExpr = sql<string>`to_char((${usageRecords.createdAt} at time zone 'UTC')::date, 'YYYY-MM-DD')`
  const usageDayRows = await db
    .select({
      date: usageDayExpr,
      requests: sql<number>`count(*)::int`,
      inputTokens: sql<number>`coalesce(sum(${usageRecords.inputTokens}), 0)::int`,
      outputTokens: sql<number>`coalesce(sum(${usageRecords.outputTokens}), 0)::int`,
      reasoningTokens: sql<number>`coalesce(sum(${usageRecords.reasoningTokens}), 0)::int`,
      costMicros: sql<number>`coalesce(sum(${usageRecords.costMicros}), 0)::bigint`,
    })
    .from(usageRecords)
    .where(and(eq(usageRecords.userId, user.id), isNull(usageRecords.deletedAt), windowFilter))
    .groupBy(usageDayExpr)

  const messageDayExpr = sql<string>`to_char((${messages.createdAt} at time zone 'UTC')::date, 'YYYY-MM-DD')`
  const messageDayRows = await db
    .select({
      date: messageDayExpr,
      attempts: sql<number>`count(*)::int`,
      errors: sql<number>`count(*) filter (where ${messages.status} = 'error')::int`,
    })
    .from(messages)
    .where(
      and(
        eq(messages.userId, user.id),
        eq(messages.role, 'assistant'),
        isNull(messages.deletedAt),
        messageWindowFilter,
      ),
    )
    .groupBy(messageDayExpr)

  const series = buildDailySeries(
    span,
    usageDayRows as unknown as readonly UsageSqlDayRow[],
    messageDayRows as unknown as readonly MessageSqlDayRow[],
  )
  const current = windowTotals(series, days, span)
  const previous = windowTotals(series, 0, days)

  const latencyRows = await db
    .select({
      model: usageRecords.model,
      providerName: providers.name,
      requests: sql<number>`count(*)::int`,
      meanDurationMs: sql<number>`coalesce(avg(${usageRecords.durationMs}), 0)::int`,
      p95DurationMs: sql<number>`coalesce(percentile_cont(0.95) within group (order by ${usageRecords.durationMs}), 0)::int`,
      costMicros: sql<number>`coalesce(sum(${usageRecords.costMicros}), 0)::bigint`,
    })
    .from(usageRecords)
    .leftJoin(providers, eq(providers.id, usageRecords.providerId))
    .where(
      and(
        eq(usageRecords.userId, user.id),
        isNull(usageRecords.deletedAt),
        sql`${usageRecords.createdAt} >= now() - make_interval(days => ${days})`,
      ),
    )
    .groupBy(usageRecords.model, providers.name)
    .orderBy(desc(sql`count(*)`))
    .limit(12)

  const modelErrorRows = await db
    .select({
      model: models.displayName,
      attempts: sql<number>`count(*)::int`,
      errors: sql<number>`count(*) filter (where ${messages.status} = 'error')::int`,
    })
    .from(messages)
    .leftJoin(models, eq(models.id, messages.modelId))
    .where(
      and(
        eq(messages.userId, user.id),
        eq(messages.role, 'assistant'),
        isNull(messages.deletedAt),
        sql`${messages.createdAt} >= now() - make_interval(days => ${days})`,
      ),
    )
    .groupBy(models.displayName)

  const errorRateByModel = new Map(
    modelErrorRows.map((row) => [row.model, errorRatePct(Number(row.errors), Number(row.attempts))]),
  )

  const latency = latencyRows.map((row) => ({
    model: row.model,
    providerName: row.providerName,
    requests: Number(row.requests),
    meanDurationMs: Number(row.meanDurationMs),
    p95DurationMs: Number(row.p95DurationMs),
    errorRatePct: errorRateByModel.has(row.model) ? errorRateByModel.get(row.model)! : null,
    costMicros: Number(row.costMicros),
  }))

  const rawErrorGroups = await db.execute(sql`
    select coalesce(m.error ->> 'code', 'unknown') as code,
           count(*)::int as count,
           to_char(max(m.created_at) at time zone 'UTC', 'YYYY-MM-DD"T"HH24:MI:SS"Z"') as last_seen,
           (array_agg(m.error ->> 'message' order by m.created_at desc))[1] as message,
           (array_agg(mod.display_name order by m.created_at desc))[1] as model_name,
           (array_agg(m.conversation_id order by m.created_at desc))[1] as conversation_id
    from ${sql.raw(tn('messages'))} m
    left join ${sql.raw(tn('models'))} mod on mod.id = m.model_id
    where m.user_id = ${user.id}
      and m.role = 'assistant'
      and m.status = 'error'
      and m.deleted_at is null
      and m.created_at >= now() - make_interval(days => ${days})
    group by 1
    order by count(*) desc
    limit 10
  `)
  const errorGroupRows =
    (rawErrorGroups as unknown as { rows: RawErrorGroupRow[] }).rows ?? []

  const conversationIds = [
    ...new Set(errorGroupRows.map((row) => row.conversation_id).filter((id): id is string => Boolean(id))),
  ]
  const titleRows = conversationIds.length
    ? await db
        .select({ id: conversations.id, title: conversations.title })
        .from(conversations)
        .where(and(eq(conversations.userId, user.id), inArray(conversations.id, conversationIds)))
    : []
  const titleById = new Map(titleRows.map((row) => [row.id, row.title]))

  const errors: UsageErrorGroup[] = errorGroupRows.map((row) => ({
    code: row.code,
    message: row.message ?? '',
    count: Number(row.count),
    model: row.model_name,
    conversationId: row.conversation_id,
    conversationTitle: row.conversation_id ? titleById.get(row.conversation_id) ?? null : null,
    lastSeenAt: row.last_seen ?? '',
  }))

  const summary: UsageSummary = {
    requests: current.requests,
    inputTokens: current.inputTokens,
    outputTokens: current.outputTokens,
    costMicros: current.costMicros,
  }

  const analytics: UsageAnalytics = {
    days: series.slice(days),
    summary,
    trends: {
      requests: trendOf(current.requests, previous.requests),
      inputTokens: trendOf(current.inputTokens, previous.inputTokens),
      outputTokens: trendOf(current.outputTokens, previous.outputTokens),
      costMicros: trendOf(current.costMicros, previous.costMicros),
      errorRatePct: trendOf(
        errorRatePct(current.errors, current.attempts),
        errorRatePct(previous.errors, previous.attempts),
      ),
    },
    latency,
    errors,
  }
  return c.json(analytics)
})
