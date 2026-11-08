import { Hono } from 'hono'
import { validator } from 'hono/validator'
import type { ContentfulStatusCode } from 'hono/utils/http-status'
import { and, asc, eq, isNull } from 'drizzle-orm'
import { ApiError } from '@umituz/web-hono'
import { validateJson } from '@umituz/web-hono/validator'
import { z } from 'zod'
import { GENERATION_BOUNDS, type AiErrorCode, type StreamEvent } from '@shared/ai/contracts'
import type { Env } from '../env'
import { getDb } from '../db'
import { conversations, messages } from '../schema'
import { requireUser } from '../session'
import { runGeneration } from '../ai/execution'
import { replayFirst, sseStreamResponse } from '../ai/streaming'
import { AiError } from '../ai/errors'

export const chatRouter = new Hono<{ Bindings: Env }>()

const streamBodySchema = z.object({
  content: z.string().min(1).max(32_000),
  modelId: z.string().optional(),
  settings: z
    .object({
      temperature: z.number().min(GENERATION_BOUNDS.temperature.min).max(GENERATION_BOUNDS.temperature.max).optional(),
      maxOutputTokens: z.number().int().positive().optional(),
      topP: z.number().min(GENERATION_BOUNDS.topP.min).max(GENERATION_BOUNDS.topP.max).optional(),
    })
    .optional(),
})

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
      content: body.content,
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
