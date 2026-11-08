export type ChatRole = 'system' | 'user' | 'assistant'

export interface ChatMessage {
  role: ChatRole
  content: string
}

export interface ModelCapabilities {
  streaming: boolean
  tools: boolean
  structured: boolean
  reasoning: boolean
  vision: boolean
}

export interface ModelPricing {
  inputPerMTok: number
  outputPerMTok: number
  currency: 'USD'
}

export type MessageStatus = 'pending' | 'complete' | 'stopped' | 'error'

export const DEFAULT_CONVERSATION_TITLE = 'New conversation'

export interface TokenUsage {
  inputTokens: number
  outputTokens: number
  reasoningTokens?: number
}

export interface GenerationSettings {
  temperature?: number
  maxOutputTokens?: number
  topP?: number
}

export interface ConversationSettings extends GenerationSettings {
  systemExtra?: string
}

export const GENERATION_BOUNDS = {
  temperature: { min: 0, max: 2 },
  topP: { min: 0, max: 1 },
} as const

export const DEFAULT_GENERATION: Required<GenerationSettings> = {
  temperature: 0.7,
  maxOutputTokens: 4096,
  topP: 1,
}

export type StreamEvent =
  | { type: 'delta'; channel: 'answer' | 'reasoning'; text: string }
  | { type: 'usage'; usage: TokenUsage }
  | { type: 'done'; messageId: string }
  | { type: 'error'; code: AiErrorCode; message: string }

export type AiErrorCode =
  | 'invalid_key'
  | 'missing_key'
  | 'rate_limited'
  | 'capacity'
  | 'timeout'
  | 'invalid_request'
  | 'model_unavailable'
  | 'upstream_error'
  | 'network'
  | 'cancelled'

export interface PublicModel {
  id: string
  providerId: string
  providerName: string
  externalId: string
  displayName: string
  family: string
  description: string | null
  capabilities: ModelCapabilities
  inputTypes: string[]
  outputTypes: string[]
  contextWindow: number
  maxOutputTokens: number
  pricing: ModelPricing
  isDefault: boolean
}

export interface PublicProvider {
  id: string
  name: string
  adapter: string
  available: boolean
}

export interface UsageSummary {
  requests: number
  inputTokens: number
  outputTokens: number
  costMicros: number
}
