import type { AssistantToolCall, ChatMessage, TokenUsage, ToolDefinition } from '@shared/ai/contracts'
import { errorFromStatus, errorFromUnknown } from '../errors'

export interface AdapterRequest {
  externalModelId: string
  messages: ChatMessage[]
  temperature: number
  maxOutputTokens: number
  topP: number
  tools?: ToolDefinition[]
  signal?: AbortSignal
}

export type ProviderEvent =
  | { type: 'delta'; channel: 'answer' | 'reasoning'; text: string }
  | { type: 'usage'; usage: TokenUsage }
  | { type: 'tool_calls'; calls: AssistantToolCall[] }

export interface ChatAdapter {
  stream(req: AdapterRequest): AsyncIterable<ProviderEvent>
}

export interface AdapterConfig {
  baseUrl: string
  apiKey: string
  timeoutMs: number
}

interface WireToolCallDelta {
  index?: number
  id?: string
  function?: { name?: string; arguments?: string }
}

interface WireDelta {
  content?: string
  reasoning?: string
  tool_calls?: WireToolCallDelta[]
}

interface WireChunk {
  choices?: { delta?: WireDelta }[]
  usage?: {
    prompt_tokens?: number
    completion_tokens?: number
    completion_tokens_details?: { reasoning_tokens?: number }
  }
}

type WireMessage =
  | { role: 'system' | 'user' | 'assistant'; content: string; tool_calls?: unknown }
  | { role: 'tool'; content: string; tool_call_id: string }

function toWireMessage(message: ChatMessage): WireMessage {
  if (message.role === 'tool') {
    return { role: 'tool', content: message.content, tool_call_id: message.toolCallId ?? '' }
  }
  if (message.role === 'assistant' && message.toolCalls && message.toolCalls.length > 0) {
    return {
      role: 'assistant',
      content: message.content,
      tool_calls: message.toolCalls.map((call) => ({
        id: call.id,
        type: 'function',
        function: { name: call.name, arguments: call.arguments },
      })),
    }
  }
  return { role: message.role, content: message.content }
}

export function createOpenAiCompatibleAdapter(config: AdapterConfig): ChatAdapter {
  return {
    async *stream(req: AdapterRequest): AsyncIterable<ProviderEvent> {
      const timeout = AbortSignal.timeout(config.timeoutMs)
      const signal = req.signal ? AbortSignal.any([req.signal, timeout]) : timeout

      let response: Response
      try {
        response = await fetch(`${config.baseUrl}/chat/completions`, {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${config.apiKey}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            model: req.externalModelId,
            messages: req.messages.map(toWireMessage),
            temperature: req.temperature,
            max_completion_tokens: req.maxOutputTokens,
            top_p: req.topP,
            stream: true,
            stream_options: { include_usage: true },
            ...(req.tools && req.tools.length > 0
              ? {
                  tools: req.tools.map((tool) => ({ type: 'function', function: tool })),
                  tool_choice: 'auto',
                }
              : {}),
          }),
          signal,
        })
      } catch (err) {
        throw errorFromUnknown(err)
      }

      if (!response.ok || !response.body) {
        const detail = await extractErrorDetail(response)
        throw errorFromStatus(response.status, detail)
      }

      yield* parseSseStream(response.body)
    },
  }
}

async function extractErrorDetail(response: Response): Promise<string | undefined> {
  try {
    const body = (await response.json()) as { error?: { message?: string } }
    return body.error?.message
  } catch {
    return undefined
  }
}

async function* parseSseStream(body: ReadableStream<Uint8Array>): AsyncIterable<ProviderEvent> {
  const reader = body.getReader()
  const decoder = new TextDecoder()
  const toolCallAccumulator = new ToolCallAccumulator()
  let buffer = ''

  try {
    while (true) {
      const { done, value } = await reader.read()
      if (done) break
      buffer += decoder.decode(value, { stream: true })

      let separator = buffer.indexOf('\n\n')
      while (separator !== -1) {
        const rawEvent = buffer.slice(0, separator)
        buffer = buffer.slice(separator + 2)
        separator = buffer.indexOf('\n\n')
        yield* parseSseEvent(rawEvent, toolCallAccumulator)
      }
    }
  } catch (err) {
    throw errorFromUnknown(err)
  } finally {
    reader.releaseLock()
  }

  const calls = toolCallAccumulator.finish()
  if (calls.length > 0) yield { type: 'tool_calls', calls }
}

class ToolCallAccumulator {
  private readonly slots = new Map<number, { id: string; name: string; args: string }>()

  push(delta: WireToolCallDelta): void {
    const index = delta.index ?? 0
    const slot = this.slots.get(index) ?? { id: '', name: '', args: '' }
    if (delta.id) slot.id = delta.id
    if (delta.function?.name) slot.name = delta.function.name
    if (delta.function?.arguments) slot.args += delta.function.arguments
    this.slots.set(index, slot)
  }

  finish(): AssistantToolCall[] {
    return [...this.slots.entries()]
      .sort((a, b) => a[0] - b[0])
      .map(([, slot]) => ({ id: slot.id, name: slot.name, arguments: slot.args }))
      .filter((call) => call.name.length > 0)
  }
}

async function* parseSseEvent(rawEvent: string, toolCallAccumulator: ToolCallAccumulator): AsyncIterable<ProviderEvent> {
  for (const line of rawEvent.split('\n')) {
    if (!line.startsWith('data:')) continue
    const payload = line.slice(5).trim()
    if (payload.length === 0 || payload === '[DONE]') continue

    let chunk: WireChunk
    try {
      chunk = JSON.parse(payload) as WireChunk
    } catch {
      continue
    }

    const delta = chunk.choices?.[0]?.delta
    if (delta?.reasoning) {
      yield { type: 'delta', channel: 'reasoning', text: delta.reasoning }
    }
    if (delta?.content) {
      yield { type: 'delta', channel: 'answer', text: delta.content }
    }
    if (delta?.tool_calls) {
      for (const toolCallDelta of delta.tool_calls) toolCallAccumulator.push(toolCallDelta)
    }
    if (chunk.usage) {
      yield {
        type: 'usage',
        usage: {
          inputTokens: chunk.usage.prompt_tokens ?? 0,
          outputTokens: chunk.usage.completion_tokens ?? 0,
          reasoningTokens: chunk.usage.completion_tokens_details?.reasoning_tokens,
        },
      }
    }
  }
}
