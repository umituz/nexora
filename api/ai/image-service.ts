import { uid } from '@umituz/web-hono'
import { artifacts, usageRecords } from '../schema'
import type { Db, Env } from '../env'
import { buildUsageData, IMAGE_QUALITIES, IMAGE_SIZES } from '@umituz/web-ai'
import { resolveImageModel } from './model-registry'
import { imageAdapterFor, type ImageAdapter } from './providers'

export type ImageSize = (typeof IMAGE_SIZES)[number]
export type ImageQuality = (typeof IMAGE_QUALITIES)[number]

export interface GenerateArtifactInput {
  userId: string
  prompt: string
  size?: ImageSize
  quality?: ImageQuality
  modelId?: string | null
  rootId?: string
  version?: number
}

export interface GeneratedArtifact {
  id: string
  kind: 'image'
  prompt: string
  revisedPrompt: string | null
  modelId: string | null
  mimeType: string
  size: string
  quality: string
  rootId: string
  version: number
  createdAt: Date
  updatedAt: Date
}

export async function generateArtifact(
  db: Db,
  env: Env,
  input: GenerateArtifactInput,
  adapterOverride?: ImageAdapter,
): Promise<GeneratedArtifact> {
  const resolved = await resolveImageModel(db, env, input.modelId ?? null)
  const adapter = adapterOverride ?? imageAdapterFor(env, resolved.provider)

  const size = input.size ?? '1024x1024'
  const quality = input.quality ?? 'auto'

  const startedAt = Date.now()
  const generated = await adapter.generate({
    externalModelId: resolved.model.externalId,
    prompt: input.prompt,
    size,
    quality,
  })
  const durationMs = Date.now() - startedAt

  const artifactId = uid('art')
  const [row] = await db
    .insert(artifacts)
    .values({
      id: artifactId,
      userId: input.userId,
      kind: 'image',
      prompt: input.prompt,
      modelId: resolved.model.id,
      mimeType: 'image/png',
      size,
      quality,
      rootId: input.rootId ?? artifactId,
      version: input.version ?? 1,
      dataBase64: generated.images[0],
    })
    .returning({
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
    })

  if (generated.usage && (generated.usage.inputTokens > 0 || generated.usage.outputTokens > 0)) {
    await db.insert(usageRecords).values({
      id: uid('usage'),
      userId: input.userId,
      conversationId: null,
      messageId: null,
      providerId: resolved.provider.id,
      model: resolved.model.displayName,
      ...buildUsageData({
        usage: generated.usage,
        pricing: resolved.model.pricing,
        durationMs,
      }),
      status: 'complete',
    })
  }

  return row
}
