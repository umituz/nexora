import { AiError, errorFromStatus, errorFromUnknown } from '../errors'
import type { AdapterConfig } from './openai-compatible'

export interface EmbeddingsRequest {
  externalModelId: string
  input: string[]
}

export interface EmbeddingsResult {
  vectors: number[][]
  inputTokens: number | null
}

export interface EmbeddingsAdapter {
  embed(req: EmbeddingsRequest): Promise<EmbeddingsResult>
}

interface WireItem {
  index?: unknown
  embedding?: unknown
}

interface WireResponse {
  data?: WireItem[]
  usage?: { prompt_tokens?: unknown; total_tokens?: unknown }
  error?: { message?: unknown }
}

const EMBED_TIMEOUT_MS = 60_000

export function createOpenAiEmbeddingsAdapter(config: AdapterConfig): EmbeddingsAdapter {
  return {
    async embed(req: EmbeddingsRequest): Promise<EmbeddingsResult> {
      let response: Response
      try {
        response = await fetch(`${config.baseUrl}/embeddings`, {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${config.apiKey}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ model: req.externalModelId, input: req.input }),
          signal: AbortSignal.timeout(config.timeoutMs ?? EMBED_TIMEOUT_MS),
        })
      } catch (err) {
        throw errorFromUnknown(err)
      }

      if (!response.ok) {
        let detail: string | undefined
        try {
          const parsed = (await response.json()) as WireResponse
          detail = typeof parsed.error?.message === 'string' ? parsed.error.message : undefined
        } catch {
          detail = undefined
        }
        throw errorFromStatus(response.status, detail)
      }

      let parsed: WireResponse
      try {
        parsed = (await response.json()) as WireResponse
      } catch (err) {
        throw errorFromUnknown(err)
      }

      const items = Array.isArray(parsed.data) ? parsed.data : []
      const byIndex = new Map<number, number[]>()
      for (const item of items) {
        if (typeof item.index !== 'number' || !Array.isArray(item.embedding)) continue
        byIndex.set(item.index, item.embedding as number[])
      }
      const vectors: number[][] = []
      for (let i = 0; i < req.input.length; i += 1) {
        const vector = byIndex.get(i)
        if (!vector) throw new AiError('upstream_error', 'Provider returned an incomplete embeddings batch')
        vectors.push(vector)
      }

      const inputTokens =
        typeof parsed.usage?.prompt_tokens === 'number' ? (parsed.usage.prompt_tokens as number) : null
      return { vectors, inputTokens }
    },
  }
}
