import type { GenerationSettings, StreamEvent } from '@shared/ai/contracts'
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

    const reader = response.body.getReader()
    const decoder = new TextDecoder()
    let buffer = ''

    while (true) {
      const { done, value } = await reader.read()
      if (done) break
      buffer += decoder.decode(value, { stream: true })

      let separator = buffer.indexOf('\n\n')
      while (separator !== -1) {
        const rawEvent = buffer.slice(0, separator)
        buffer = buffer.slice(separator + 2)
        separator = buffer.indexOf('\n\n')
        const event = parseSseEvent(rawEvent)
        if (!event) continue
        dispatch(event, callbacks)
      }
    }
  })()

  return {
    promise,
    abort: () => controller.abort(),
  }
}

function parseSseEvent(rawEvent: string): StreamEvent | null {
  let data: string | null = null
  for (const line of rawEvent.split('\n')) {
    if (line.startsWith('data:')) data = line.slice(5).trim()
  }
  if (!data) return null
  try {
    return JSON.parse(data) as StreamEvent
  } catch {
    return null
  }
}

function dispatch(event: StreamEvent, callbacks: StreamCallbacks): void {
  switch (event.type) {
    case 'delta':
      callbacks.onDelta(event.channel, event.text)
      break
    case 'usage':
      callbacks.onUsage?.(event.usage)
      break
    case 'done':
      callbacks.onDone?.(event.messageId)
      break
    case 'error':
      callbacks.onError?.(event.code, event.message)
      break
  }
}
