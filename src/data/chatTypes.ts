import type {
  AssistantToolCall,
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
