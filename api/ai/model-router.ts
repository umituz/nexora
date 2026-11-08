import { ApiError } from '@umituz/web-hono'
import { DEFAULT_GENERATION, GENERATION_BOUNDS, type GenerationSettings } from '@shared/ai/contracts'
import type { Env } from '../env'
import type { ResolvedModel } from './model-registry'
import { adapterFor, type ChatAdapter } from './providers'

export interface RoutedRequest {
  adapter: ChatAdapter
  model: ResolvedModel
  settings: Required<GenerationSettings>
}

export function normalizeSettings(
  requested: GenerationSettings | undefined,
  maxOutputTokens: number,
): Required<GenerationSettings> {
  const merged = { ...DEFAULT_GENERATION, ...cleanUndefined(requested) }
  const { temperature, topP } = GENERATION_BOUNDS

  if (merged.temperature < temperature.min || merged.temperature > temperature.max) {
    throw ApiError.badRequest(`temperature must be between ${temperature.min} and ${temperature.max}`)
  }
  if (merged.topP < topP.min || merged.topP > topP.max) {
    throw ApiError.badRequest(`topP must be between ${topP.min} and ${topP.max}`)
  }
  if (!Number.isInteger(merged.maxOutputTokens) || merged.maxOutputTokens < 1) {
    throw ApiError.badRequest('maxOutputTokens must be a positive integer')
  }
  if (merged.maxOutputTokens > maxOutputTokens) {
    merged.maxOutputTokens = maxOutputTokens
  }
  return merged
}

function cleanUndefined(settings: GenerationSettings | undefined): GenerationSettings {
  const cleaned: GenerationSettings = {}
  if (!settings) return cleaned
  for (const [key, value] of Object.entries(settings)) {
    if (value !== undefined) cleaned[key as keyof GenerationSettings] = value
  }
  return cleaned
}

export function routeModelRequest(
  env: Env,
  resolved: ResolvedModel,
  requested: GenerationSettings | undefined,
): RoutedRequest {
  if (!resolved.model.capabilities.streaming) {
    throw new ApiError(400, `Model ${resolved.model.displayName} does not support streaming`)
  }
  return {
    adapter: adapterFor(env, resolved.provider),
    model: resolved,
    settings: normalizeSettings(requested, resolved.model.maxOutputTokens),
  }
}
