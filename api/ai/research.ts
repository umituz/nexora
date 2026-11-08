import { and, desc, eq, isNull } from 'drizzle-orm'
import { ApiError, stampUpdate, uid } from '@umituz/web-hono'
import type { ChatMessage, TokenUsage } from '@shared/ai/contracts'
import {
  AiError,
  buildUsageData,
  normalizeSources,
  buildResearchMessages as baseBuildResearchMessages,
  accumulateReport,
  RESEARCH_MAX_OUTPUT_TOKENS,
  RESEARCH_TEMPERATURE,
  RESEARCH_REPORT_MIN_CHARS,
  SEARCH_MAX_RESULTS,
  searchWeb,
  type ResearchSource,
  type WebSearchResult,
} from '@umituz/web-ai'
import { researchRuns, usageRecords } from '../schema'
import type { Db, Env } from '../env'
import { resolveModel } from './model-registry'
import { adapterFor } from './providers'

export interface ResearchRun {
  id: string
  query: string
  status: 'running' | 'ready' | 'failed'
  report: string | null
  sources: ResearchSource[]
  modelId: string | null
  errorMessage: string | null
  createdAt: Date
}

export function buildResearchMessages(query: string, sources: ResearchSource[]): ChatMessage[] {
  return baseBuildResearchMessages(
    query,
    sources,
    'You are Nexora Research, a careful research assistant.',
  ) as ChatMessage[]
}

interface SynthesisOutcome {
  report: string
  modelId: string
  providerId: string
  modelDisplayName: string
  pricing: { inputPerMTok: number; outputPerMTok: number; currency: 'USD' }
  usage: TokenUsage | null
  durationMs: number
}

async function synthesizeWithModel(db: Db, env: Env, query: string, sources: ResearchSource[]): Promise<SynthesisOutcome> {
  const resolved = await resolveModel(db, env, null)
  if (!resolved.model.capabilities.streaming) {
    throw new ApiError(503, 'The default model does not support synthesis')
  }

  const maxOutputTokens =
    resolved.model.maxOutputTokens > 0 ? Math.min(resolved.model.maxOutputTokens, RESEARCH_MAX_OUTPUT_TOKENS) : RESEARCH_MAX_OUTPUT_TOKENS
  const adapter = adapterFor(env, resolved.provider)
  const startedAt = Date.now()
  const { report, usage } = await accumulateReport(
    adapter.stream({
      externalModelId: resolved.model.externalId,
      messages: buildResearchMessages(query, sources),
      temperature: RESEARCH_TEMPERATURE,
      maxOutputTokens,
      topP: 1,
    }),
  )
  const durationMs = Date.now() - startedAt

  if (report.trim().length < RESEARCH_REPORT_MIN_CHARS) {
    throw new AiError('upstream_error', 'Synthesis returned no usable report')
  }

  return {
    report,
    modelId: resolved.model.id,
    providerId: resolved.provider.id,
    modelDisplayName: resolved.model.displayName,
    pricing: resolved.model.pricing,
    usage,
    durationMs,
  }
}

export interface ResearchDeps {
  search?: (query: string) => Promise<WebSearchResult[]>
  synthesize?: (query: string, sources: ResearchSource[]) => Promise<SynthesisOutcome>
}

export async function executeResearch(
  db: Db,
  env: Env,
  input: { userId: string; researchId: string; query: string },
  deps?: ResearchDeps,
): Promise<{ researchId: string; sourcesCount: number; modelId: string | null }> {
  const search =
    deps?.search ?? ((query: string) => searchWeb(env, { query, maxResults: SEARCH_MAX_RESULTS }).then((r) => r.results))
  const synthesize = deps?.synthesize ?? ((query: string, sources: ResearchSource[]) => synthesizeWithModel(db, env, query, sources))

  const sources = normalizeSources(await search(input.query))
  if (sources.length === 0) throw new AiError('upstream_error', 'The search returned no usable sources')

  const outcome = await synthesize(input.query, sources)

  await db
    .update(researchRuns)
    .set({
      status: 'ready',
      report: outcome.report,
      sources,
      modelId: outcome.modelId,
      errorMessage: null,
      updatedAt: new Date(),
    })
    .where(eq(researchRuns.id, input.researchId))

  if (outcome.usage && (outcome.usage.inputTokens > 0 || outcome.usage.outputTokens > 0)) {
    await db.insert(usageRecords).values({
      id: uid('usage'),
      userId: input.userId,
      conversationId: null,
      messageId: null,
      providerId: outcome.providerId,
      model: outcome.modelDisplayName,
      ...buildUsageData({
        usage: { inputTokens: outcome.usage.inputTokens, outputTokens: outcome.usage.outputTokens },
        pricing: outcome.pricing,
        durationMs: outcome.durationMs,
      }),
      status: 'complete',
    })
  }

  return { researchId: input.researchId, sourcesCount: sources.length, modelId: outcome.modelId }
}

export async function createResearchRun(db: Db, input: { userId: string; query: string }): Promise<ResearchRun> {
  const [row] = await db
    .insert(researchRuns)
    .values({
      id: uid('res'),
      userId: input.userId,
      query: input.query,
      status: 'running',
      sources: [],
    })
    .returning({
      id: researchRuns.id,
      query: researchRuns.query,
      status: researchRuns.status,
      report: researchRuns.report,
      sources: researchRuns.sources,
      modelId: researchRuns.modelId,
      errorMessage: researchRuns.errorMessage,
      createdAt: researchRuns.createdAt,
    })
  return row
}

export async function markResearchFailed(db: Db, researchId: string, message: string): Promise<void> {
  await db
    .update(researchRuns)
    .set({ status: 'failed', errorMessage: message, updatedAt: new Date() })
    .where(eq(researchRuns.id, researchId))
}

export async function listResearchRuns(db: Db, userId: string): Promise<ResearchRun[]> {
  return db
    .select({
      id: researchRuns.id,
      query: researchRuns.query,
      status: researchRuns.status,
      report: researchRuns.report,
      sources: researchRuns.sources,
      modelId: researchRuns.modelId,
      errorMessage: researchRuns.errorMessage,
      createdAt: researchRuns.createdAt,
    })
    .from(researchRuns)
    .where(and(eq(researchRuns.userId, userId), isNull(researchRuns.deletedAt)))
    .orderBy(desc(researchRuns.createdAt))
}

export async function deleteResearchRun(db: Db, userId: string, id: string): Promise<boolean> {
  const [row] = await db
    .select({ id: researchRuns.id })
    .from(researchRuns)
    .where(and(eq(researchRuns.id, id), eq(researchRuns.userId, userId), isNull(researchRuns.deletedAt)))
    .limit(1)
  if (!row) return false

  await db
    .update(researchRuns)
    .set({ deletedAt: new Date(), ...stampUpdate(researchRuns) })
    .where(eq(researchRuns.id, id))
  return true
}
