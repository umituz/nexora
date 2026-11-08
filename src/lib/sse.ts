import type { GenerationSettings, PublicToolCall } from '@shared/ai/contracts'
import { readSseResponse } from '@umituz/web-ai'
import type { StreamCallbacks, StreamHandle } from '@/data/chatTypes'

export interface StreamRequestBody {
  mode?: 'append' | 'regenerate'
  content?: string
  modelId?: string
  settings?: GenerationSettings
}

export function streamChat(
  conversationId: string,
  body: StreamRequestBody,
  callbacks: StreamCallbacks,
): StreamHandle {
  const controller = new AbortController()

  const promise = (async () => {
    const response = await fetch(`/api/conversations/${conversationId}/stream`, {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify(body),
      signal: controller.signal,
    })

    if (!response.ok) {
      const payload = (await response.json().catch(() => null)) as { error?: string; code?: string } | null
      callbacks.onError?.(payload?.code ?? 'request_failed', payload?.error ?? 'Request failed')
      return
    }
    if (!response.body) {
      callbacks.onError?.('request_failed', 'The server returned an empty stream.')
      return
    }

    await readSseResponse(response, callbacks)
  })()

  return {
    promise,
    abort: () => controller.abort(),
  }
}

export async function resolveToolCall(
  conversationId: string,
  toolCallId: string,
  approved: boolean,
  callbacks: StreamCallbacks,
): Promise<boolean> {
  const response = await fetch(`/api/conversations/${conversationId}/tool-calls/${toolCallId}/resolve`, {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({ approved }),
  })

  if (!response.ok) {
    const payload = (await response.json().catch(() => null)) as { error?: string; code?: string } | null
    callbacks.onError?.(payload?.code ?? 'request_failed', payload?.error ?? 'Request failed')
    return false
  }

  const contentType = response.headers.get('content-type') ?? ''
  if (!contentType.includes('text/event-stream') || !response.body) {
    return false
  }

  await readSseResponse(response, callbacks)
  return true
}

export type { PublicToolCall }
