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
