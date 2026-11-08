import { AiError } from '../errors'
import { createOpenAiCompatibleAdapter, type ChatAdapter } from './openai-compatible'

export type { ChatAdapter, ProviderEvent, AdapterRequest } from './openai-compatible'

export interface ProviderBinding {
  adapter: string
  baseUrl: string
  apiKeyEnv: string
}

const TIMEOUT_MS = 60_000

export function resolveProviderKey(env: object, apiKeyEnv: string): string {
  const value = (env as Record<string, string | undefined>)[apiKeyEnv]
  if (typeof value !== 'string' || value.trim().length === 0) {
    throw new AiError('missing_key')
  }
  return value.trim()
}

export function providerAvailable(env: object, apiKeyEnv: string): boolean {
  try {
    resolveProviderKey(env, apiKeyEnv)
    return true
  } catch {
    return false
  }
}

export function adapterFor(env: object, provider: ProviderBinding): ChatAdapter {
  const apiKey = resolveProviderKey(env, provider.apiKeyEnv)
  if (provider.adapter === 'openai-compatible') {
    return createOpenAiCompatibleAdapter({
      baseUrl: provider.baseUrl.replace(/\/$/, ''),
      apiKey,
      timeoutMs: TIMEOUT_MS,
    })
  }
  throw new AiError('model_unavailable', `Unsupported adapter kind: ${provider.adapter}`)
}
