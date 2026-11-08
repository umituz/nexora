import type { ChatMessage, TokenUsage } from '@shared/ai/contracts'
import { errorFromStatus, errorFromUnknown } from '../errors'

export interface AdapterRequest {
  externalModelId: string
  messages: ChatMessage[]
  temperature: number
  maxOutputTokens: number
  topP: number
  signal?: AbortSignal
}

export type ProviderEvent =
  | { type: 'delta'; channel: 'answer' | 'reasoning'; text: string }
  | { type: 'usage'; usage: TokenUsage }

export interface ChatAdapter {
  stream(req: AdapterRequest): AsyncIterable<ProviderEvent>
}

export interface AdapterConfig {
  baseUrl: string
  apiKey: string
  timeoutMs: number
}

interface WireDelta {
  content?: string
  reasoning?: string
}

interface WireChunk {
  choices?: { delta?: WireDelta }[]
  usage?: {
    prompt_tokens?: number
    completion_tokens?: number
    completion_tokens_details?: { reasoning_tokens?: number }
  }
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
            messages: req.messages,
            temperature: req.temperature,
            max_completion_tokens: req.maxOutputTokens,
            top_p: req.topP,
            stream: true,
            stream_options: { include_usage: true },
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
        yield* parseSseEvent(rawEvent)
      }
    }
  } catch (err) {
    throw errorFromUnknown(err)
  } finally {
    reader.releaseLock()
  }
}

async function* parseSseEvent(rawEvent: string): AsyncIterable<ProviderEvent> {
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
