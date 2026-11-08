import type { StreamEvent } from '@shared/ai/contracts'

export function formatSseEvent(event: StreamEvent): string {
  return `event: ${event.type}\ndata: ${JSON.stringify(event)}\n\n`
}

export function sseStreamResponse(events: AsyncIterable<StreamEvent>): Response {
  const encoder = new TextEncoder()
  const stream = new ReadableStream<Uint8Array>({
    async start(controller) {
      try {
        for await (const event of events) {
          controller.enqueue(encoder.encode(formatSseEvent(event)))
        }
      } catch {
        const fallback = formatSseEvent({
          type: 'error',
          code: 'upstream_error',
          message: 'The generation stream ended unexpectedly.',
        })
        controller.enqueue(encoder.encode(fallback))
      } finally {
        controller.close()
      }
    },
  })

  return new Response(stream, {
    headers: {
      'Content-Type': 'text/event-stream; charset=utf-8',
      'Cache-Control': 'no-cache, no-transform',
      Connection: 'keep-alive',
    },
  })
}

export async function* replayFirst<T>(first: T, rest: AsyncIterable<T>): AsyncIterable<T> {
  yield first
  yield* rest
}
