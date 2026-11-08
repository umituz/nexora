import { and, asc, desc, eq, inArray, isNull } from 'drizzle-orm'
import { ApiError, stampUpdate, uid } from '@umituz/web-hono'
import {
  DEFAULT_CONVERSATION_TITLE,
  type ChatMessage,
  type ChatRole,
  type ConversationSettings,
  type GenerationSettings,
  type MessageStatus,
  type StreamEvent,
  type TokenUsage,
} from '@shared/ai/contracts'
import type { Db, Env } from '../env'
import { conversations, messages, usageRecords } from '../schema'
import { AiError, errorFromUnknown } from './errors'
import { buildContext } from './context-manager'
import { resolveModel, type ResolvedModel } from './model-registry'
import { routeModelRequest, type RoutedRequest } from './model-router'
import { buildSystemPrompt } from './prompt-engine'
import { buildUsageData } from './usage'

export type GenerationMode = 'append' | 'regenerate'

export interface GenerationInput {
  db: Db
  env: Env
  userId: string
  conversationId: string
  content: string | null
  mode: GenerationMode
  modelId: string | null
  settings: GenerationSettings | undefined
  signal?: AbortSignal
}

interface GenerationState {
  conversationModelId: string | null
  conversationSettings: ConversationSettings
  resolved: ResolvedModel
  routed: RoutedRequest
}

export async function* runGeneration(input: GenerationInput): AsyncGenerator<StreamEvent> {
  const state = await prepareGeneration(input)
  yield* streamAnswer(input, state)
}

async function prepareGeneration(input: GenerationInput): Promise<GenerationState> {
  const { db, env, userId, conversationId, content, mode } = input

  const [conversation] = await db
    .select()
    .from(conversations)
    .where(and(eq(conversations.id, conversationId), eq(conversations.userId, userId), isNull(conversations.deletedAt)))
    .limit(1)
  if (!conversation) throw ApiError.notFound('Conversation')

  if (mode === 'append') {
    if (content === null) throw ApiError.badRequest('Message content is required')
    await db.insert(messages).values({
      id: uid('msg'),
      conversationId,
      userId,
      role: 'user',
      content,
      status: 'complete',
    })

    if (conversation.title === DEFAULT_CONVERSATION_TITLE) {
      await db
        .update(conversations)
        .set({ title: deriveTitle(content), ...stampUpdate(conversations) })
        .where(eq(conversations.id, conversationId))
    }
  } else {
    await dropTrailingAnswers(db, conversationId)
  }

  const resolved = await resolveModel(db, env, input.modelId ?? conversation.modelId).catch((err) => {
    if (input.modelId || !(err instanceof ApiError)) throw err
    return resolveModel(db, env, null)
  })

  const routed = routeModelRequest(env, resolved, {
    ...conversation.settings,
    ...cleanUndefined(input.settings),
  })

  return {
    conversationModelId: conversation.modelId,
    conversationSettings: conversation.settings,
    resolved,
    routed,
  }
}

async function dropTrailingAnswers(db: Db, conversationId: string): Promise<void> {
  const trailing = await db
    .select({ id: messages.id, role: messages.role })
    .from(messages)
    .where(and(eq(messages.conversationId, conversationId), isNull(messages.deletedAt)))
    .orderBy(desc(messages.createdAt))
    .limit(50)

  const doomed: string[] = []
  for (const row of trailing) {
    if (row.role === 'user') break
    doomed.push(row.id)
  }
  if (doomed.length > 0) {
    await db
      .update(messages)
      .set({ deletedAt: new Date(), ...stampUpdate(messages) })
      .where(inArray(messages.id, doomed))
  }

  const remaining = trailing.filter((row) => !doomed.includes(row.id))
  if (!remaining.some((row) => row.role === 'user')) {
    throw ApiError.badRequest('There is no user message to answer')
  }
}

async function* streamAnswer(input: GenerationInput, state: GenerationState): AsyncGenerator<StreamEvent> {
  const { db, userId, conversationId } = input
  const { resolved, routed } = state

  const history = await loadHistory(db, conversationId)
  const systemPrompt = buildSystemPrompt({ settings: state.conversationSettings })
  const context = buildContext(history, systemPrompt, {
    contextWindow: resolved.model.contextWindow,
    maxOutputTokens: routed.settings.maxOutputTokens,
  })

  let answer = ''
  let reasoning = ''
  let usage: TokenUsage | null = null
  const startedAt = Date.now()

  try {
    for await (const event of routed.adapter.stream({
      externalModelId: resolved.model.externalId,
      messages: context,
      temperature: routed.settings.temperature,
      maxOutputTokens: routed.settings.maxOutputTokens,
      topP: routed.settings.topP,
      signal: input.signal,
    })) {
      if (event.type === 'delta') {
        if (event.channel === 'reasoning') reasoning += event.text
        else answer += event.text
        yield { type: 'delta', channel: event.channel, text: event.text }
      } else {
        usage = event.usage
      }
    }
  } catch (err) {
    const durationMs = Date.now() - startedAt

    if (input.signal?.aborted === true) {
      await finalizeFailure(db, {
        userId,
        conversationId,
        model: resolved,
        status: 'stopped',
        answer,
        reasoning,
        usage,
        durationMs,
        error: null,
      })
      return
    }

    const aiError = err instanceof AiError ? err : errorFromUnknown(err)
    await finalizeFailure(db, {
      userId,
      conversationId,
      model: resolved,
      status: 'error',
      answer,
      reasoning,
      usage,
      durationMs,
      error: aiError,
    })
    yield { type: 'error', code: aiError.code, message: aiError.userMessage }
  }

  const durationMs = Date.now() - startedAt
  const messageId = await finalizeSuccess(db, {
    userId,
    conversationId,
    model: resolved,
    answer,
    reasoning,
    usage,
    durationMs,
    stickyModel: state.conversationModelId !== resolved.model.id,
  })

  if (usage) yield { type: 'usage', usage }
  yield { type: 'done', messageId }
}

async function loadHistory(db: Db, conversationId: string): Promise<ChatMessage[]> {
  const rows = await db
    .select({ role: messages.role, content: messages.content, status: messages.status })
    .from(messages)
    .where(and(eq(messages.conversationId, conversationId), isNull(messages.deletedAt)))
    .orderBy(asc(messages.createdAt))

  return rows
    .filter((row) => row.role === 'user' || ((row.status === 'complete' || row.status === 'stopped') && row.content.length > 0))
    .map((row) => ({ role: row.role as ChatRole, content: row.content }))
}

interface FinalizeBase {
  userId: string
  conversationId: string
  model: ResolvedModel
  answer: string
  reasoning: string
  usage: TokenUsage | null
  durationMs: number
}

async function finalizeSuccess(
  db: Db,
  input: FinalizeBase & { stickyModel: boolean },
): Promise<string> {
  const messageId = uid('msg')
  await db.insert(messages).values({
    id: messageId,
    conversationId: input.conversationId,
    userId: input.userId,
    role: 'assistant',
    content: input.answer,
    reasoning: input.reasoning.length > 0 ? input.reasoning : null,
    modelId: input.model.model.id,
    status: 'complete',
    usage: input.usage ?? null,
  })

  await db
    .update(conversations)
    .set({
      ...(input.stickyModel ? { modelId: input.model.model.id } : {}),
      ...stampUpdate(conversations),
    })
    .where(eq(conversations.id, input.conversationId))

  if (input.usage) {
    await insertUsageRecord(db, input, messageId, 'complete')
  }
  return messageId
}

async function finalizeFailure(
  db: Db,
  input: FinalizeBase & { status: MessageStatus; error: AiError | null },
): Promise<void> {
  const messageId = uid('msg')
  await db.insert(messages).values({
    id: messageId,
    conversationId: input.conversationId,
    userId: input.userId,
    role: 'assistant',
    content: input.answer,
    reasoning: input.reasoning.length > 0 ? input.reasoning : null,
    modelId: input.model.model.id,
    status: input.status,
    usage: input.usage ?? null,
    error: input.error ? { code: input.error.code, message: input.error.userMessage } : null,
  })

  await db
    .update(conversations)
    .set(stampUpdate(conversations))
    .where(eq(conversations.id, input.conversationId))

  if (input.usage && (input.usage.inputTokens > 0 || input.usage.outputTokens > 0)) {
    await insertUsageRecord(db, input, messageId, input.status)
  }
}

async function insertUsageRecord(
  db: Db,
  input: FinalizeBase,
  messageId: string,
  status: string,
): Promise<void> {
  const usage = input.usage
  if (!usage) return
  await db.insert(usageRecords).values({
    id: uid('usage'),
    userId: input.userId,
    conversationId: input.conversationId,
    messageId,
    providerId: input.model.provider.id,
    model: input.model.model.displayName,
    ...buildUsageData({
      usage,
      pricing: input.model.model.pricing,
      durationMs: input.durationMs,
    }),
    status,
  })
}

function deriveTitle(content: string): string {
  const firstLine = content
    .split('\n')
    .map((line) => line.trim())
    .find((line) => line.length > 0)
  const cleaned = (firstLine ?? DEFAULT_CONVERSATION_TITLE)
    .replace(/^#{1,6}\s+/, '')
    .replace(/^[>*-]\s+/, '')
    .replace(/\s+/g, ' ')
  return cleaned.length > 60 ? `${cleaned.slice(0, 60).trimEnd()}…` : cleaned
}

function cleanUndefined(settings: GenerationSettings | undefined): GenerationSettings {
  const cleaned: GenerationSettings = {}
  if (!settings) return cleaned
  for (const [key, value] of Object.entries(settings)) {
    if (value !== undefined) cleaned[key as keyof GenerationSettings] = value
  }
  return cleaned
}
