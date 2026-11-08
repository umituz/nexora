import type { ConversationSettings, MessageStatus, TokenUsage } from '@shared/ai/contracts'

export interface ConversationRow {
  id: string
  userId: string
  title: string
  projectId: string | null
  modelId: string | null
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
  role: 'user' | 'assistant' | 'system'
  content: string
  reasoning: string | null
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
  source: 'manual' | 'conversation'
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

export interface StreamCallbacks {
  onDelta: (channel: 'answer' | 'reasoning', text: string) => void
  onUsage?: (usage: TokenUsage) => void
  onDone?: (messageId: string) => void
  onError?: (code: string, message: string) => void
}

export interface StreamHandle {
  promise: Promise<void>
  abort: () => void
}
