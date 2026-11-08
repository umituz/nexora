import { describe, expect, it } from 'vitest'
import { embedTexts, KNOWLEDGE_MAX_RESULTS } from './knowledge'
import type { EmbeddingsAdapter } from './providers'

describe('embedTexts', () => {
  it('batches calls at 32 inputs and preserves order', async () => {
    const batches: number[] = []
    const adapter: EmbeddingsAdapter = {
      async embed(req) {
        batches.push(req.input.length)
        return { vectors: req.input.map((_, i) => [batches.length, i]), inputTokens: 3 }
      },
    }

    const texts = Array.from({ length: 70 }, (_, i) => `text-${i}`)
    const { vectors, inputTokens } = await embedTexts({} as never, { adapter: '', baseUrl: '', apiKeyEnv: '' }, 'model-x', texts, adapter)

    expect(batches).toEqual([32, 32, 6])
    expect(vectors).toHaveLength(70)
    expect(vectors[0]).toEqual([1, 0])
    expect(vectors[32]).toEqual([2, 0])
    expect(vectors[69]).toEqual([3, 5])
    expect(inputTokens).toBe(9)
  })

  it('returns null tokens when the provider reports none', async () => {
    const adapter: EmbeddingsAdapter = {
      async embed(req) {
        return { vectors: req.input.map(() => [0.5]), inputTokens: null }
      },
    }
    const { inputTokens } = await embedTexts({} as never, { adapter: '', baseUrl: '', apiKeyEnv: '' }, 'model-x', ['a', 'b'], adapter)
    expect(inputTokens).toBeNull()
  })

  it('exposes the retrieval result cap used by routes and tools', () => {
    expect(KNOWLEDGE_MAX_RESULTS).toBe(8)
  })
})
