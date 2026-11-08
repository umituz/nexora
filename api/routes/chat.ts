import { Hono } from 'hono'
import { validator } from 'hono/validator'
import type { ContentfulStatusCode } from 'hono/utils/http-status'
import { and, asc, eq, inArray, isNull } from 'drizzle-orm'
import { ApiError, stampUpdate } from '@umituz/web-hono'
import { validateJson } from '@umituz/web-hono/validator'
import { z } from 'zod'
import { GENERATION_BOUNDS, type AiErrorCode, type StreamEvent } from '@shared/ai/contracts'
import type { Env } from '../env'
import { getDb } from '../db'
import { conversations, messages } from '../schema'
import { requireUser } from '../session'
import { runGeneration, type GenerationMode } from '../ai/execution'
import { replayFirst, sseStreamResponse } from '../ai/streaming'
import { AiError } from '../ai/errors'

export const chatRouter = new Hono<{ Bindings: Env }>()

const settingsSchema = z
  .object({
    temperature: z.number().min(GENERATION_BOUNDS.temperature.min).max(GENERATION_BOUNDS.temperature.max).optional(),
    maxOutputTokens: z.number().int().positive().optional(),
    topP: z.number().min(GENERATION_BOUNDS.topP.min).max(GENERATION_BOUNDS.topP.max).optional(),
  })
  .optional()

const streamBodySchema = z
  .object({
    mode: z.enum(['append', 'regenerate']).default('append'),
    content: z.string().min(1).max(32_000).optional(),
    modelId: z.string().optional(),
    settings: settingsSchema,
  })
  .superRefine((body, ctx) => {
    if (body.mode === 'append' && !body.content) {
      ctx.addIssue({ code: 'custom', path: ['content'], message: 'Message content is required' })
    }
  })

const editBodySchema = z.object({ content: z.string().min(1).max(32_000) })

const AI_ERROR_STATUS: Readonly<Record<AiErrorCode, ContentfulStatusCode>> = {
  invalid_key: 502,
  missing_key: 503,
  rate_limited: 429,
  capacity: 503,
  timeout: 504,
  invalid_request: 400,
  model_unavailable: 503,
  upstream_error: 502,
  network: 502,
  cancelled: 400,
}

chatRouter.post(
  '/conversations/:id/stream',
  validator('json', validateJson(streamBodySchema, 'Invalid chat payload')),
  async (c) => {
    const user = await requireUser(c)
    const body = c.req.valid('json')

    const events = runGeneration({
      db: getDb(c.env),
      env: c.env,
      userId: user.id,
      conversationId: c.req.param('id'),
      content: body.content ?? null,
      mode: body.mode as GenerationMode,
      modelId: body.modelId ?? null,
      settings: body.settings,
      signal: c.req.raw.signal,
    })

    let first: IteratorResult<StreamEvent>
    try {
      first = await events.next()
    } catch (err) {
      if (err instanceof ApiError) return c.json({ error: err.message }, err.status)
      if (err instanceof AiError) {
        return c.json({ error: err.userMessage, code: err.code }, AI_ERROR_STATUS[err.code])
      }
      throw err
    }

    if (first.done) return c.json({ error: 'Generation produced no output' }, 500)
    return sseStreamResponse(replayFirst(first.value, events))
  },
)

chatRouter.post(
  '/conversations/:id/messages/:messageId/edit',
  validator('json', validateJson(editBodySchema, 'Invalid edit payload')),
  async (c) => {
    const user = await requireUser(c)
    const db = getDb(c.env)
    const conversationId = c.req.param('id')
    const messageId = c.req.param('messageId')

    const [conversation] = await db
      .select({ id: conversations.id })
      .from(conversations)
      .where(and(eq(conversations.id, conversationId), eq(conversations.userId, user.id), isNull(conversations.deletedAt)))
      .limit(1)
    if (!conversation) return c.json({ error: 'Conversation not found' }, 404)

    const [message] = await db
      .select({ id: messages.id, role: messages.role })
      .from(messages)
      .where(and(eq(messages.id, messageId), eq(messages.conversationId, conversationId), isNull(messages.deletedAt)))
      .limit(1)
    if (!message) return c.json({ error: 'Message not found' }, 404)
    if (message.role !== 'user') return c.json({ error: 'Only user messages can be edited' }, 400)

    const [updated] = await db
      .update(messages)
      .set({ content: c.req.valid('json').content, ...stampUpdate(messages) })
      .where(eq(messages.id, messageId))
      .returning()

    const threadRows = await db
      .select({ id: messages.id })
      .from(messages)
      .where(and(eq(messages.conversationId, conversationId), isNull(messages.deletedAt)))
      .orderBy(asc(messages.createdAt))
    const position = threadRows.findIndex((row) => row.id === messageId)
    const doomed = position >= 0 ? threadRows.slice(position + 1).map((row) => row.id) : []
    if (doomed.length > 0) {
      await db
        .update(messages)
        .set({ deletedAt: new Date(), ...stampUpdate(messages) })
        .where(inArray(messages.id, doomed))
    }
    await db.update(conversations).set(stampUpdate(conversations)).where(eq(conversations.id, conversationId))

    return c.json(updated, 200)
  },
)

chatRouter.get('/conversations/:id/messages', async (c) => {
  const user = await requireUser(c)
  const db = getDb(c.env)
  const conversationId = c.req.param('id')

  const [conversation] = await db
    .select({ id: conversations.id })
    .from(conversations)
    .where(and(eq(conversations.id, conversationId), eq(conversations.userId, user.id), isNull(conversations.deletedAt)))
    .limit(1)
  if (!conversation) return c.json({ error: 'Conversation not found' }, 404)

  const rows = await db
    .select()
    .from(messages)
    .where(and(eq(messages.conversationId, conversationId), isNull(messages.deletedAt)))
    .orderBy(asc(messages.createdAt))
  return c.json(rows)
})
