import { Hono } from 'hono'
import { validator } from 'hono/validator'
import type { ContentfulStatusCode } from 'hono/utils/http-status'
import { and, desc, eq, isNull } from 'drizzle-orm'
import { ApiError, stampUpdate } from '@umituz/web-hono'
import { validateJson } from '@umituz/web-hono/validator'
import { z } from 'zod'
import type { AiErrorCode } from '@shared/ai/contracts'
import type { Env } from '../env'
import { getDb } from '../db'
import { artifacts } from '../schema'
import { requireUser } from '../session'
import { generateArtifact } from '../ai/image-service'
import { IMAGE_QUALITIES, IMAGE_SIZES, type ImageQuality, type ImageSize } from '../ai/providers/images'
import { AiError } from '../ai/errors'

export const artifactsRouter = new Hono<{ Bindings: Env }>()

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

const MIME_EXTENSIONS: Readonly<Record<string, string>> = {
  'image/png': 'png',
  'image/jpeg': 'jpg',
  'image/webp': 'webp',
  'image/gif': 'gif',
}

const generateBodySchema = z
  .object({
    prompt: z.string().min(1).max(4000).optional(),
    modelId: z.string().optional(),
    size: z.enum([...IMAGE_SIZES] as [ImageSize, ...ImageSize[]]).optional(),
    quality: z.enum([...IMAGE_QUALITIES] as [ImageQuality, ...ImageQuality[]]).optional(),
    basedOnId: z.string().optional(),
  })
  .superRefine((body, ctx) => {
    if (!body.basedOnId && !body.prompt) {
      ctx.addIssue({ code: 'custom', path: ['prompt'], message: 'Message content is required' })
    }
  })

const metadataColumns = {
  id: artifacts.id,
  kind: artifacts.kind,
  prompt: artifacts.prompt,
  revisedPrompt: artifacts.revisedPrompt,
  modelId: artifacts.modelId,
  mimeType: artifacts.mimeType,
  size: artifacts.size,
  quality: artifacts.quality,
  rootId: artifacts.rootId,
  version: artifacts.version,
  createdAt: artifacts.createdAt,
  updatedAt: artifacts.updatedAt,
}

artifactsRouter.post(
  '/',
  validator('json', validateJson(generateBodySchema, 'Invalid generation payload')),
  async (c) => {
    const user = await requireUser(c)
    const db = getDb(c.env)
    const body = c.req.valid('json')

    let baseArtifact: typeof artifacts.$inferSelect | null = null
    if (body.basedOnId) {
      const [found] = await db
        .select()
        .from(artifacts)
        .where(and(eq(artifacts.id, body.basedOnId), eq(artifacts.userId, user.id), isNull(artifacts.deletedAt)))
        .limit(1)
      if (!found) return c.json({ error: 'Artifact not found' }, 404)
      baseArtifact = found
    }

    const prompt = body.prompt ?? baseArtifact?.prompt ?? ''
    let rootId: string | null = null
    let version: number | undefined
    if (baseArtifact) {
      rootId = baseArtifact.rootId
      const [latest] = await db
        .select({ version: artifacts.version })
        .from(artifacts)
        .where(and(eq(artifacts.rootId, rootId), isNull(artifacts.deletedAt)))
        .orderBy(desc(artifacts.version))
        .limit(1)
      version = (latest?.version ?? 0) + 1
    }

    let row
    try {
      row = await generateArtifact(db, c.env, {
        userId: user.id,
        prompt,
        size: body.size ?? (baseArtifact?.size as ImageSize | undefined),
        quality: body.quality ?? (baseArtifact?.quality as ImageQuality | undefined),
        modelId: body.modelId ?? baseArtifact?.modelId ?? null,
        ...(rootId ? { rootId, version } : {}),
      })
    } catch (err) {
      if (err instanceof ApiError) return c.json({ error: err.message }, err.status)
      if (err instanceof AiError) return c.json({ error: err.userMessage, code: err.code }, AI_ERROR_STATUS[err.code])
      throw err
    }

    return c.json(row, 201)
  },
)

artifactsRouter.get('/', async (c) => {
  const user = await requireUser(c)
  const db = getDb(c.env)

  const rows = await db
    .select(metadataColumns)
    .from(artifacts)
    .where(and(eq(artifacts.userId, user.id), isNull(artifacts.deletedAt)))
    .orderBy(desc(artifacts.createdAt))
    .limit(50)
  return c.json(rows)
})

artifactsRouter.get('/:id', async (c) => {
  const user = await requireUser(c)
  const db = getDb(c.env)

  const [row] = await db
    .select(metadataColumns)
    .from(artifacts)
    .where(and(eq(artifacts.id, c.req.param('id')), eq(artifacts.userId, user.id), isNull(artifacts.deletedAt)))
    .limit(1)
  if (!row) return c.json({ error: 'Artifact not found' }, 404)
  return c.json(row)
})

artifactsRouter.get('/:id/versions', async (c) => {
  const user = await requireUser(c)
  const db = getDb(c.env)

  const [row] = await db
    .select({ rootId: artifacts.rootId })
    .from(artifacts)
    .where(and(eq(artifacts.id, c.req.param('id')), eq(artifacts.userId, user.id), isNull(artifacts.deletedAt)))
    .limit(1)
  if (!row) return c.json({ error: 'Artifact not found' }, 404)

  const rows = await db
    .select(metadataColumns)
    .from(artifacts)
    .where(and(eq(artifacts.rootId, row.rootId), eq(artifacts.userId, user.id), isNull(artifacts.deletedAt)))
    .orderBy(desc(artifacts.version))
  return c.json(rows)
})

artifactsRouter.get('/:id/image', async (c) => {
  const user = await requireUser(c)
  const db = getDb(c.env)

  const [row] = await db
    .select({ mimeType: artifacts.mimeType, dataBase64: artifacts.dataBase64 })
    .from(artifacts)
    .where(and(eq(artifacts.id, c.req.param('id')), eq(artifacts.userId, user.id), isNull(artifacts.deletedAt)))
    .limit(1)
  if (!row) return c.json({ error: 'Artifact not found' }, 404)

  return new Response(decodeBase64(row.dataBase64), {
    headers: {
      'Content-Type': row.mimeType,
      'Cache-Control': 'private, max-age=31536000, immutable',
    },
  })
})

artifactsRouter.get('/:id/download', async (c) => {
  const user = await requireUser(c)
  const db = getDb(c.env)
  const id = c.req.param('id')

  const [row] = await db
    .select({ mimeType: artifacts.mimeType, dataBase64: artifacts.dataBase64 })
    .from(artifacts)
    .where(and(eq(artifacts.id, id), eq(artifacts.userId, user.id), isNull(artifacts.deletedAt)))
    .limit(1)
  if (!row) return c.json({ error: 'Artifact not found' }, 404)

  const extension = MIME_EXTENSIONS[row.mimeType] ?? 'png'
  return new Response(decodeBase64(row.dataBase64), {
    headers: {
      'Content-Type': row.mimeType,
      'Content-Disposition': `attachment; filename="nexora-${id}.${extension}"`,
    },
  })
})

artifactsRouter.delete('/:id', async (c) => {
  const user = await requireUser(c)
  const db = getDb(c.env)

  const [row] = await db
    .update(artifacts)
    .set({ deletedAt: new Date(), ...stampUpdate(artifacts) })
    .where(and(eq(artifacts.id, c.req.param('id')), eq(artifacts.userId, user.id), isNull(artifacts.deletedAt)))
    .returning({ id: artifacts.id })
  if (!row) return c.json({ error: 'Artifact not found' }, 404)
  return c.json({ id: row.id })
})

function decodeBase64(value: string): Uint8Array<ArrayBuffer> {
  const binary = atob(value)
  const bytes = new Uint8Array(new ArrayBuffer(binary.length))
  for (let index = 0; index < binary.length; index++) {
    bytes[index] = binary.charCodeAt(index)
  }
  return bytes
}
