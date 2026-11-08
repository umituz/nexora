import type { ConversationSettings } from '@shared/ai/contracts'

export const SYSTEM_PROMPT_VERSION = 1

const IDENTITY = [
  'You are Nexora, a helpful AI assistant inside the Nexora AI workspace.',
  'Answer accurately and concisely. When a question is ambiguous, state your interpretation before answering.',
  'Format responses in Markdown. Use fenced code blocks with a language tag for code.',
  'For uncertain factual claims, communicate the level of confidence instead of inventing details.',
].join(' ')

export interface SystemPromptInput {
  settings?: ConversationSettings
  now?: Date
}

export function buildSystemPrompt(input: SystemPromptInput = {}): string {
  const now = input.now ?? new Date()
  const parts = [IDENTITY, `Current date: ${now.toISOString().slice(0, 10)}.`]
  const extra = input.settings?.systemExtra?.trim()
  if (extra) parts.push(`Workspace instructions from the user:\n${extra}`)
  return parts.join('\n\n')
}
