import type { ChatMessage } from '@shared/ai/contracts'

export interface ContextBudget {
  contextWindow: number
  maxOutputTokens: number
}

const CHARS_PER_TOKEN = 4
const SAFETY_MARGIN_TOKENS = 256

export function estimateTokens(text: string): number {
  return Math.ceil(text.length / CHARS_PER_TOKEN)
}

export function estimateMessageTokens(message: ChatMessage): number {
  return estimateTokens(message.content) + 8
}

export function buildContext(
  history: ChatMessage[],
  systemPrompt: string,
  budget: ContextBudget,
): ChatMessage[] {
  const available = budget.contextWindow - budget.maxOutputTokens - SAFETY_MARGIN_TOKENS
  let used = estimateTokens(systemPrompt)

  const selected: ChatMessage[] = []
  for (let i = history.length - 1; i >= 0; i -= 1) {
    const message = history[i]
    const cost = estimateMessageTokens(message)
    if (used + cost > available && selected.length > 0) break
    used += cost
    selected.push(message)
  }

  selected.reverse()
  while (selected.length > 1 && selected[0].role === 'assistant') {
    selected.shift()
  }

  return [{ role: 'system', content: systemPrompt }, ...selected]
}
