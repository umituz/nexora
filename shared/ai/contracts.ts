export type ChatRole = 'system' | 'user' | 'assistant' | 'tool'

export interface AssistantToolCall {
  id: string
  name: string
  arguments: string
}

export interface ChatMessage {
  role: ChatRole
  content: string
  toolCalls?: AssistantToolCall[]
  toolCallId?: string
}

export interface ToolDefinition {
  name: string
  description: string
  parameters: Record<string, unknown>
}

export interface RequestImage {
  mimeType: string
  dataBase64: string
}

export type ToolCallStatus = 'pending' | 'approved' | 'rejected' | 'succeeded' | 'failed'

export interface PublicToolCall {
  id: string
  conversationId: string
  messageId: string | null
  agentId: string | null
  callId: string
  toolKey: string
  toolName: string
  args: Record<string, unknown>
  status: ToolCallStatus
  result: Record<string, unknown> | null
  error: string | null
  createdAt: string
}

export interface ModelCapabilities {
  streaming: boolean
  tools: boolean
  structured: boolean
  reasoning: boolean
  vision: boolean
  embeddings: boolean
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
  | { type: 'tool_call'; toolCall: PublicToolCall }
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

export interface ModelUsageStats {
  model: string
  providerId: string | null
  requests: number
  inputTokens: number
  outputTokens: number
  costMicros: number
  avgDurationMs: number
  lastUsedAt: string | null
}

export interface UsageSummary {
  requests: number
  inputTokens: number
  outputTokens: number
  costMicros: number
}

export interface UsageModelRow {
  model: string
  providerId: string
  providerName: string | null
  requests: number
  inputTokens: number
  outputTokens: number
  costMicros: number
}

export interface UsageConversationRow {
  conversationId: string | null
  title: string | null
  requests: number
  inputTokens: number
  outputTokens: number
  costMicros: number
  lastUsedAt: string | null
}

export interface UsageBreakdown {
  models: UsageModelRow[]
  conversations: UsageConversationRow[]
}

export interface UsageDayBucket {
  date: string
  requests: number
  attempts: number
  errors: number
  inputTokens: number
  outputTokens: number
  reasoningTokens: number
  costMicros: number
}

export interface UsageTrend {
  current: number
  previous: number
  deltaPct: number | null
}

export interface UsageModelLatency {
  model: string
  providerName: string | null
  requests: number
  meanDurationMs: number
  p95DurationMs: number
  errorRatePct: number | null
  costMicros: number
}

export interface UsageErrorGroup {
  code: string
  message: string
  count: number
  model: string | null
  conversationId: string | null
  conversationTitle: string | null
  lastSeenAt: string
}

export interface UsageAnalytics {
  days: UsageDayBucket[]
  summary: UsageSummary
  trends: {
    requests: UsageTrend
    inputTokens: UsageTrend
    outputTokens: UsageTrend
    costMicros: UsageTrend
    errorRatePct: UsageTrend
  }
  latency: UsageModelLatency[]
  errors: UsageErrorGroup[]
}

export interface UsageRequestRow {
  id: string
  createdAt: string
  status: string
  model: string
  providerName: string | null
  conversationId: string | null
  conversationTitle: string | null
  durationMs: number
  inputTokens: number
  outputTokens: number
  reasoningTokens: number
  costMicros: number
}

export interface UsageRequestsPage {
  rows: UsageRequestRow[]
  total: number
  page: number
  pageSize: number
  models: string[]
}

export interface WebhookDeliveryOutcome {
  ok: boolean
  statusCode: number | null
  durationMs: number
  error: string | null
}

export interface AutomationActionOutcome {
  type: string
  ok: boolean
  detail: string
}

export interface AutomationTestOutcome {
  ok: boolean
}
