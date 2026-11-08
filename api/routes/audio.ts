import { Hono } from 'hono'
import { validator } from 'hono/validator'
import type { ContentfulStatusCode } from 'hono/utils/http-status'
import { ApiError } from '@umituz/web-hono'
import { validateJson } from '@umituz/web-hono/validator'
import { z } from 'zod'
import type { AiErrorCode } from '@shared/ai/contracts'
import type { Env } from '../env'
import { getDb } from '../db'
import { resolveSpeechModel } from '../ai/model-registry'
import { speechAdapterFor } from '../ai/providers'
import { SPEECH_INPUT_MAX, SPEECH_VOICES, type SpeechVoice } from '../ai/providers/speech'
import { AiError } from '../ai/errors'
import { requireUser } from '../session'

export const audioRouter = new Hono<{ Bindings: Env }>()

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

const speechBodySchema = z.object({
  text: z
    .string()
    .min(1)
    .max(SPEECH_INPUT_MAX)
    .refine((value) => value.trim().length > 0, 'Text must not be blank'),
  modelId: z.string().optional(),
  voice: z.enum([...SPEECH_VOICES] as [SpeechVoice, ...SpeechVoice[]]).optional(),
})

audioRouter.post(
  '/audio/speech',
  validator('json', validateJson(speechBodySchema, 'Invalid speech payload')),
  async (c) => {
    await requireUser(c)
    const db = getDb(c.env)
    const body = c.req.valid('json')

    try {
      const resolved = await resolveSpeechModel(db, c.env, body.modelId ?? null)
      const adapter = speechAdapterFor(c.env, resolved.provider)
      const result = await adapter.speak({
        externalModelId: resolved.model.externalId,
        input: body.text.trim(),
        voice: body.voice ?? 'tara',
      })
      return new Response(result.audio as unknown as BodyInit, {
        headers: {
          'Content-Type': result.mimeType,
          'Cache-Control': 'private, no-store',
        },
      })
    } catch (err) {
      if (err instanceof ApiError) return c.json({ error: err.message }, err.status)
      if (err instanceof AiError) return c.json({ error: err.userMessage, code: err.code }, AI_ERROR_STATUS[err.code])
      throw err
    }
  },
)
