import { and, asc, eq, isNull } from 'drizzle-orm'
import { ApiError } from '@umituz/web-hono'
import type { PublicModel } from '@shared/ai/contracts'
import type { Db } from '../env'
import { models, providers } from '../schema'
import { providerAvailable } from './providers'

export interface ProviderRow {
  id: string
  name: string
  adapter: string
  baseUrl: string
  apiKeyEnv: string
}

export interface ModelRow {
  id: string
  providerId: string
  externalId: string
  displayName: string
  family: string
  description: string | null
  capabilities: ModelRowCapabilities
  inputTypes: string[]
  outputTypes: string[]
  contextWindow: number
  maxOutputTokens: number
  pricing: ModelRowPricing
  isDefault: boolean
}

interface ModelRowCapabilities {
  streaming: boolean
  tools: boolean
  structured: boolean
  reasoning: boolean
  vision: boolean
}

interface ModelRowPricing {
  inputPerMTok: number
  outputPerMTok: number
  currency: 'USD'
}

export interface ResolvedModel {
  model: ModelRow
  provider: ProviderRow
}

export async function listAvailableModels(db: Db, env: object): Promise<PublicModel[]> {
  const rows = await db
    .select({ model: models, provider: providers })
    .from(models)
    .innerJoin(providers, eq(models.providerId, providers.id))
    .where(and(isNull(models.deletedAt), isNull(providers.deletedAt), eq(models.active, true)))
    .orderBy(asc(models.sortOrder), asc(models.displayName))

  return rows
    .filter((row) => providerAvailable(env, row.provider.apiKeyEnv))
    .map((row) => ({
      id: row.model.id,
      providerId: row.provider.id,
      providerName: row.provider.name,
      externalId: row.model.externalId,
      displayName: row.model.displayName,
      family: row.model.family,
      description: row.model.description,
      capabilities: row.model.capabilities,
      inputTypes: row.model.inputTypes,
      outputTypes: row.model.outputTypes,
      contextWindow: row.model.contextWindow,
      maxOutputTokens: row.model.maxOutputTokens,
      pricing: row.model.pricing,
      isDefault: row.model.isDefault,
    }))
}

export async function resolveModel(db: Db, env: object, modelId: string | null): Promise<ResolvedModel> {
  const conditions = [isNull(models.deletedAt), isNull(providers.deletedAt), eq(models.active, true)]
  if (modelId) conditions.push(eq(models.id, modelId))
  else conditions.push(eq(models.isDefault, true))

  const [row] = await db
    .select({ model: models, provider: providers })
    .from(models)
    .innerJoin(providers, eq(models.providerId, providers.id))
    .where(and(...conditions))
    .limit(1)

  if (!row) {
    if (modelId) throw ApiError.notFound('Model')
    throw new ApiError(503, 'No model is configured for this workspace')
  }
  if (!providerAvailable(env, row.provider.apiKeyEnv)) {
    throw new ApiError(503, `Provider ${row.provider.name} is not configured`)
  }

  return { model: toModelRow(row.model), provider: toProviderRow(row.provider) }
}

export async function resolveImageModel(db: Db, env: object, modelId: string | null): Promise<ResolvedModel> {
  if (modelId) {
    const resolved = await resolveModel(db, env, modelId)
    if (!resolved.model.outputTypes.includes('image')) {
      throw ApiError.badRequest('Model does not generate images')
    }
    return resolved
  }

  const rows = await db
    .select({ model: models, provider: providers })
    .from(models)
    .innerJoin(providers, eq(models.providerId, providers.id))
    .where(and(isNull(models.deletedAt), isNull(providers.deletedAt), eq(models.active, true)))
    .orderBy(asc(models.sortOrder), asc(models.displayName))

  const row = rows.find((candidate) => candidate.model.outputTypes.includes('image') && providerAvailable(env, candidate.provider.apiKeyEnv))
  if (!row) throw new ApiError(503, 'No image model is configured for this workspace')
  return { model: toModelRow(row.model), provider: toProviderRow(row.provider) }
}

function toModelRow(row: typeof models.$inferSelect): ModelRow {
  return {
    id: row.id,
    providerId: row.providerId,
    externalId: row.externalId,
    displayName: row.displayName,
    family: row.family,
    description: row.description,
    capabilities: row.capabilities,
    inputTypes: row.inputTypes,
    outputTypes: row.outputTypes,
    contextWindow: row.contextWindow,
    maxOutputTokens: row.maxOutputTokens,
    pricing: row.pricing,
    isDefault: row.isDefault,
  }
}

function toProviderRow(row: typeof providers.$inferSelect): ProviderRow {
  return {
    id: row.id,
    name: row.name,
    adapter: row.adapter,
    baseUrl: row.baseUrl,
    apiKeyEnv: row.apiKeyEnv,
  }
}
