import { describe, expect, it } from 'vitest'
import { canFailover, failoverCandidate } from './failover'
import { AiError } from './errors'
import type { ResolvedModel } from './model-registry'

function resolved(providerId: string, overrides: Partial<ResolvedModel['model']> = {}): ResolvedModel {
  return {
    model: {
      id: `model_${providerId}`,
      providerId,
      externalId: `ext-${providerId}`,
      displayName: providerId,
      family: 'test',
      description: null,
      capabilities: { streaming: true, tools: false, structured: false, reasoning: false, vision: false, embeddings: false },
      inputTypes: ['text'],
      outputTypes: ['text'],
      contextWindow: 131072,
      maxOutputTokens: 8192,
      pricing: { inputPerMTok: 1, outputPerMTok: 2, currency: 'USD' },
      isDefault: false,
      ...overrides,
    },
    provider: { id: providerId, name: providerId, adapter: 'openai-compatible', baseUrl: 'https://api.example.com', apiKeyEnv: 'X_KEY' },
  }
}

describe('canFailover', () => {
  it('allows failover for transient errors before any output streamed', () => {
    expect(canFailover(new AiError('capacity'), 0)).toBe(true)
    expect(canFailover(new AiError('rate_limited'), 0)).toBe(true)
    expect(canFailover(new AiError('timeout'), 0)).toBe(true)
    expect(canFailover(new AiError('network'), 0)).toBe(true)
  })

  it('blocks failover after partial output streamed', () => {
    expect(canFailover(new AiError('capacity'), 12)).toBe(false)
  })

  it('blocks failover for deterministic errors and non-AiError throws', () => {
    expect(canFailover(new AiError('invalid_key'), 0)).toBe(false)
    expect(canFailover(new AiError('invalid_request'), 0)).toBe(false)
    expect(canFailover(new Error('boom'), 0)).toBe(false)
  })
})

describe('failoverCandidate', () => {
  it('returns the fallback when it lives on another provider', () => {
    const fallback = resolved('provider_b')
    expect(failoverCandidate(resolved('provider_a'), fallback)).toBe(fallback)
  })

  it('rejects same-provider, missing, and non-streaming fallbacks', () => {
    expect(failoverCandidate(resolved('provider_a'), resolved('provider_a'))).toBeNull()
    expect(failoverCandidate(resolved('provider_a'), null)).toBeNull()
    expect(
      failoverCandidate(resolved('provider_a'), resolved('provider_b', { capabilities: { streaming: false, tools: false, structured: false, reasoning: false, vision: false, embeddings: false } })),
    ).toBeNull()
  })
})
