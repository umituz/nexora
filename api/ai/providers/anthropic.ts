import type { TokenUsage } from '@shared/ai/contracts'
import { AiError, errorFromStatus, errorFromUnknown } from '../errors'
import type { AdapterConfig, AdapterRequest, ChatAdapter, ProviderEvent } from './openai-compatible'

const ANTHROPIC_VERSION = '2023-06-01'

const ERROR_TYPE_TO_CODE: Readonly<Record<string, 'invalid_request' | 'invalid_key' | 'model_unavailable' | 'rate_limited' | 'capacity' | 'upstream_error'>> = {
  invalid_request_error: 'invalid_request',
  authentication_error: 'invalid_key',
  permission_error: 'invalid_key',
  not_found_error: 'model_unavailable',
  request_too_large: 'invalid_request',
  rate_limit_error: 'rate_limited',
  overloaded_error: 'capacity',
  api_error: 'upstream_error',
}

interface WireDelta {
  type?: string
  text?: string
  thinking?: string
}

interface WireUsage {
  input_tokens?: number
  output_tokens?: number
}

interface WireEvent {
  type?: string
  message?: { usage?: WireUsage }
  delta?: WireDelta
  usage?: WireUsage
  error?: { type?: string; message?: string }
}

export function createAnthropicAdapter(config: AdapterConfig): ChatAdapter {
  return {
    async *stream(req: AdapterRequest): AsyncIterable<ProviderEvent> {
      const timeout = AbortSignal.timeout(config.timeoutMs)
      const signal = req.signal ? AbortSignal.any([req.signal, timeout]) : timeout

      const system = req.messages
        .filter((message) => message.role === 'system')
        .map((message) => message.content)
        .join('\n\n')
      const messages = req.messages
        .filter((message) => message.role !== 'system')
        .map((message) => ({ role: message.role, content: message.content }))

      let response: Response
      try {
        response = await fetch(`${config.baseUrl}/v1/messages`, {
          method: 'POST',
          headers: {
            'x-api-key': config.apiKey,
            'anthropic-version': ANTHROPIC_VERSION,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            model: req.externalModelId,
            messages,
            ...(system.length > 0 ? { system } : {}),
            max_tokens: req.maxOutputTokens,
            stream: true,
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

      yield* parseAnthropicStream(response.body)
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

async function* parseAnthropicStream(body: ReadableStream<Uint8Array>): AsyncIterable<ProviderEvent> {
  const reader = body.getReader()
  const decoder = new TextDecoder()
  let buffer = ''
  let usage: TokenUsage | null = null
  let usageEmitted = false

  const flushUsage = function* (): Generator<ProviderEvent> {
    if (usage && !usageEmitted && (usage.inputTokens > 0 || usage.outputTokens > 0)) {
      usageEmitted = true
      yield { type: 'usage', usage }
    }
  }

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

        for (const event of parseAnthropicEvent(rawEvent)) {
          if (event.error) throw wireError(event.error)
          if (event.type === 'message_start' && event.message?.usage) {
            usage = { inputTokens: event.message.usage.input_tokens ?? 0, outputTokens: 0, reasoningTokens: undefined }
          } else if (event.type === 'message_delta' && event.usage) {
            usage = mergeOutputTokens(usage, event.usage.output_tokens ?? 0)
          } else if (event.type === 'message_stop') {
            yield* flushUsage()
          } else if (event.delta?.type === 'text_delta' && event.delta.text) {
            yield { type: 'delta', channel: 'answer', text: event.delta.text }
          } else if (event.delta?.type === 'thinking_delta' && event.delta.thinking) {
            yield { type: 'delta', channel: 'reasoning', text: event.delta.thinking }
          }
        }
      }
    }
    yield* flushUsage()
  } catch (err) {
    throw err instanceof AiError ? err : errorFromUnknown(err)
  } finally {
    reader.releaseLock()
  }
}

function* parseAnthropicEvent(rawEvent: string): Generator<WireEvent> {
  for (const line of rawEvent.split('\n')) {
    if (!line.startsWith('data:')) continue
    const payload = line.slice(5).trim()
    if (payload.length === 0) continue
    try {
      yield JSON.parse(payload) as WireEvent
    } catch {
      continue
    }
  }
}

function mergeOutputTokens(previous: TokenUsage | null, outputTokens: number): TokenUsage {
  return {
    inputTokens: previous?.inputTokens ?? 0,
    outputTokens,
    reasoningTokens: previous?.reasoningTokens,
  }
}

function wireError(error: { type?: string; message?: string }): AiError {
  const code = (error.type && ERROR_TYPE_TO_CODE[error.type]) || 'upstream_error'
  return new AiError(code, error.message)
}
