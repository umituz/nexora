import {
  AiError,
  createAnthropicAdapter,
  createOpenAiAudioTranscriptionAdapter,
  createOpenAiEmbeddingsAdapter,
  createOpenAiImageAdapter,
  createOpenAiCompatibleAdapter,
  createOpenAiSpeechAdapter,
  type AudioTranscriptionAdapter,
  type AudioTranscriptionRequest,
  type AudioTranscriptionResult,
  type EmbeddingsAdapter,
  type EmbeddingsRequest,
  type EmbeddingsResult,
  type ImageAdapter,
  type ImageRequest,
  type ImageResult,
  type ChatAdapter,
  type ProviderEvent,
  type AdapterRequest,
  type SpeechAdapter,
  type SpeechRequest,
  type SpeechResult,
  type SpeechVoice,
} from '@umituz/web-ai'

export type {
  ChatAdapter,
  ProviderEvent,
  AdapterRequest,
  ImageAdapter,
  ImageRequest,
  ImageResult,
  EmbeddingsAdapter,
  EmbeddingsRequest,
  EmbeddingsResult,
  AudioTranscriptionAdapter,
  AudioTranscriptionRequest,
  AudioTranscriptionResult,
  SpeechAdapter,
  SpeechRequest,
  SpeechResult,
  SpeechVoice,
}

export interface ProviderBinding {
  adapter: string
  baseUrl: string
  apiKeyEnv: string
}

const TIMEOUT_MS = 60_000
const IMAGE_TIMEOUT_MS = 120_000

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
  if (provider.adapter === 'anthropic') {
    return createAnthropicAdapter({
      baseUrl: provider.baseUrl.replace(/\/$/, ''),
      apiKey,
      timeoutMs: TIMEOUT_MS,
    })
  }
  throw new AiError('model_unavailable', `Unsupported adapter kind: ${provider.adapter}`)
}

export function imageAdapterFor(env: object, provider: ProviderBinding): ImageAdapter {
  const apiKey = resolveProviderKey(env, provider.apiKeyEnv)
  if (provider.adapter !== 'openai-compatible') {
    throw new AiError('model_unavailable', `Adapter kind does not support images: ${provider.adapter}`)
  }
  return createOpenAiImageAdapter({
    baseUrl: provider.baseUrl.replace(/\/$/, ''),
    apiKey,
    timeoutMs: IMAGE_TIMEOUT_MS,
  })
}

export function embeddingsAdapterFor(env: object, provider: ProviderBinding): EmbeddingsAdapter {
  const apiKey = resolveProviderKey(env, provider.apiKeyEnv)
  if (provider.adapter !== 'openai-compatible') {
    throw new AiError('model_unavailable', `Adapter kind does not support embeddings: ${provider.adapter}`)
  }
  return createOpenAiEmbeddingsAdapter({
    baseUrl: provider.baseUrl.replace(/\/$/, ''),
    apiKey,
    timeoutMs: TIMEOUT_MS,
  })
}

export function audioTranscriptionAdapterFor(env: object, provider: ProviderBinding): AudioTranscriptionAdapter {
  const apiKey = resolveProviderKey(env, provider.apiKeyEnv)
  if (provider.adapter !== 'openai-compatible') {
    throw new AiError('model_unavailable', `Adapter kind does not support audio transcription: ${provider.adapter}`)
  }
  return createOpenAiAudioTranscriptionAdapter({
    baseUrl: provider.baseUrl.replace(/\/$/, ''),
    apiKey,
    timeoutMs: TIMEOUT_MS,
  })
}

export function speechAdapterFor(env: object, provider: ProviderBinding): SpeechAdapter {
  const apiKey = resolveProviderKey(env, provider.apiKeyEnv)
  if (provider.adapter !== 'openai-compatible') {
    throw new AiError('model_unavailable', `Adapter kind does not support speech synthesis: ${provider.adapter}`)
  }
  return createOpenAiSpeechAdapter({
    baseUrl: provider.baseUrl.replace(/\/$/, ''),
    apiKey,
    timeoutMs: IMAGE_TIMEOUT_MS,
  })
}
