import type {
  AssistantToolCall,
  AutomationActionOutcome,
  ConversationSettings,
  MessageStatus,
  PublicToolCall,
  TokenUsage,
} from '@shared/ai/contracts'

export type { PublicToolCall } from '@shared/ai/contracts'

export interface ConversationRow {
  id: string
  userId: string
  title: string
  projectId: string | null
  modelId: string | null
  agentId: string | null
  isTemporary: boolean
  settings: ConversationSettings
  createdAt: string
  updatedAt: string
}

export interface ProjectRow {
  id: string
  userId: string
  name: string
  description: string | null
  instructions: string | null
  createdAt: string
  updatedAt: string
}

export interface MessageRow {
  id: string
  conversationId: string
  userId: string
  role: 'user' | 'assistant' | 'system' | 'tool'
  content: string
  reasoning: string | null
  toolCalls: AssistantToolCall[] | null
  toolCallId: string | null
  modelId: string | null
  status: MessageStatus
  usage: TokenUsage | null
  error: { code: string; message: string } | null
  createdAt: string
}

export interface AttachmentRow {
  id: string
  conversationId: string
  name: string
  mimeType: string
  sizeBytes: number
  status: 'pending' | 'processed' | 'stored' | 'failed'
  errorMessage: string | null
  createdAt: string
}

export interface MemoryRow {
  id: string
  userId: string
  content: string
  source: 'manual' | 'conversation' | 'agent'
  conversationId: string | null
  pinned: boolean
  createdAt: string
  updatedAt: string
}

export interface ArtifactRow {
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
  createdAt: string
  updatedAt: string
}

export interface ToolRow {
  id: string
  key: string
  name: string
  description: string
  parameters: Record<string, unknown>
  kind: 'builtin'
  requiresApproval: boolean
}

export interface DocumentRow {
  id: string
  title: string
  status: 'indexing' | 'ready' | 'failed'
  charCount: number
  chunkCount: number
  modelId: string | null
  errorMessage: string | null
  createdAt: string
}

export interface TaskRow {
  id: string
  kind: string
  status: 'queued' | 'running' | 'succeeded' | 'failed' | 'cancelled'
  result: Record<string, unknown> | null
  error: string | null
  attempts: number
  maxAttempts: number
  nextAttemptAt: string | null
  logs: { at: string; level: 'info' | 'error'; message: string }[]
  createdAt: string
  updatedAt: string
}

export interface KnowledgeHitRow {
  chunkId: string
  documentId: string
  documentTitle: string
  ordinal: number
  text: string
  distance: number
}

export interface ResearchRunRow {
  id: string
  query: string
  status: 'running' | 'ready' | 'failed'
  report: string | null
  sources: { title: string; url: string; snippet: string }[]
  modelId: string | null
  errorMessage: string | null
  createdAt: string
}

export interface CodeArtifactRow {
  id: string
  conversationId: string | null
  title: string
  language: string
  rootId: string
  version: number
  charCount: number
  createdAt: string
  updatedAt: string
}

export interface CodeArtifactVersionRow {
  id: string
  title: string
  language: string
  version: number
  charCount: number
  createdAt: string
}

export interface CodeArtifactFull {
  id: string
  conversationId: string | null
  title: string
  language: string
  rootId: string
  version: number
  content: string
  createdAt: string
  updatedAt: string
}

export interface AgentRow {
  id: string
  userId: string
  name: string
  description: string | null
  instructions: string
  modelId: string | null
  toolIds: string[]
  active: boolean
  createdAt: string
  updatedAt: string
}

export interface StreamCallbacks {
  onDelta: (channel: 'answer' | 'reasoning', text: string) => void
  onUsage?: (usage: TokenUsage) => void
  onDone?: (messageId: string) => void
  onToolCall?: (toolCall: PublicToolCall) => void
  onError?: (code: string, message: string) => void
}

export interface StreamHandle {
  promise: Promise<void>
  abort: () => void
}

export interface ApiKeyRow {
  id: string
  name: string
  prefix: string
  lastFour: string
  createdAt: string
  lastUsedAt: string | null
  revokedAt: string | null
}

export interface ApiKeyCreatedRow extends ApiKeyRow {
  key: string
}

export interface WebhookRow {
  id: string
  name: string
  url: string
  events: string[]
  active: boolean
  successCount: number
  failureCount: number
  lastTriggeredAt: string | null
  lastStatusCode: number | null
  createdAt: string
}

export interface WebhookCreatedRow extends WebhookRow {
  secret: string
}

export interface WebhookDeliveryRow {
  id: string
  event: string
  ok: boolean
  statusCode: number | null
  durationMs: number
  error: string | null
  createdAt: string
}

export type AutomationSeverity = 'info' | 'success' | 'warning' | 'danger'

export type AutomationActionRow =
  | { type: 'notify'; title: string; body: string | null; severity: AutomationSeverity }
  | { type: 'webhook'; url: string; secret: string | null }

export interface AutomationRow {
  id: string
  name: string
  trigger: string
  actions: AutomationActionRow[]
  active: boolean
  runCount: number
  lastRunAt: string | null
  createdAt: string
}

export interface AutomationRunRow {
  id: string
  event: string
  ok: boolean
  results: AutomationActionOutcome[]
  error: string | null
  createdAt: string
}

export interface ActivityRow {
  id: string
  action: string
  targetType: string | null
  targetId: string | null
  targetLabel: string | null
  createdAt: string
}

export interface NotificationRow {
  id: string
  type: string
  title: string
  body: string | null
  severity: 'info' | 'success' | 'warning' | 'danger'
  link: string | null
  readAt: string | null
  createdAt: string
}

export interface UserSettings {
  defaultModelId: string | null
}

export interface ProfileSummary {
  id: string
  name: string | null
  email: string
  createdAt: string | null
  stats: {
    conversations: number
    messages: number
    projects: number
    agents: number
    documents: number
    memories: number
    research: number
    codeArtifacts: number
    images: number
    apiKeys: number
    requests: number
    inputTokens: number
    outputTokens: number
    costMicros: number
  }
}
