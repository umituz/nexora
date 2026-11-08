import type { AiErrorCode } from '@shared/ai/contracts'
import { AiError } from './errors'
import type { ResolvedModel } from './model-registry'

const TRANSIENT_CODES: ReadonlySet<AiErrorCode> = new Set(['capacity', 'rate_limited', 'timeout', 'network'])

export function canFailover(err: unknown, streamedChars: number): boolean {
  if (!(err instanceof AiError)) return false
  if (!TRANSIENT_CODES.has(err.code)) return false
  return streamedChars === 0
}

export function failoverCandidate(primary: ResolvedModel, fallback: ResolvedModel | null): ResolvedModel | null {
  if (!fallback) return null
  if (fallback.provider.id === primary.provider.id) return null
  if (!fallback.model.capabilities.streaming) return null
  return fallback
}
