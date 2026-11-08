import { ApiError } from '@umituz/web-hono'
import {
  DEFAULT_GENERATION,
  GENERATION_BOUNDS,
  normalizeGenerationSettings,
  type GenerationSettings,
} from '@umituz/web-ai'
import type { Env } from '../env'
import type { ResolvedModel } from './model-registry'
import { adapterFor, type ChatAdapter } from './providers'

export { DEFAULT_GENERATION, GENERATION_BOUNDS }

export interface RoutedRequest {
  adapter: ChatAdapter
  model: ResolvedModel
  settings: Required<GenerationSettings>
}

export function normalizeSettings(
  requested: GenerationSettings | undefined,
  maxOutputTokens: number,
): Required<GenerationSettings> {
  try {
    return normalizeGenerationSettings(requested, maxOutputTokens)
  } catch (err: unknown) {
    if (err && typeof err === 'object' && 'message' in err) {
      throw ApiError.badRequest((err as { message: string }).message)
    }
    throw ApiError.badRequest('Invalid generation settings')
  }
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
