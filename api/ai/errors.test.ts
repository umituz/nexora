import { describe, expect, it } from 'vitest'
import { AiError, aiErrorMessage, errorFromStatus, errorFromUnknown } from './errors'

describe('errorFromStatus', () => {
  it('maps HTTP statuses to stable codes', () => {
    expect(errorFromStatus(401).code).toBe('invalid_key')
    expect(errorFromStatus(429).code).toBe('rate_limited')
    expect(errorFromStatus(503).code).toBe('capacity')
    expect(errorFromStatus(504).code).toBe('timeout')
    expect(errorFromStatus(404).code).toBe('model_unavailable')
  })

  it('falls back to upstream_error for unmapped statuses', () => {
    expect(errorFromStatus(418).code).toBe('upstream_error')
  })

  it('appends provider detail to the user message', () => {
    expect(errorFromStatus(401, 'bad key').message).toContain('bad key')
  })
})

describe('errorFromUnknown', () => {
  it('passes AiError through untouched', () => {
    const original = new AiError('rate_limited')
    expect(errorFromUnknown(original)).toBe(original)
  })

  it('maps abort and timeout errors to timeout', () => {
    const abort = new Error('aborted')
    abort.name = 'AbortError'
    expect(errorFromUnknown(abort).code).toBe('timeout')
  })

  it('maps TypeError to network', () => {
    expect(errorFromUnknown(new TypeError('fetch failed')).code).toBe('network')
  })

  it('wraps unknown errors as upstream_error', () => {
    expect(errorFromUnknown(new Error('boom')).code).toBe('upstream_error')
    expect(errorFromUnknown('nope').code).toBe('upstream_error')
  })
})

describe('AiError', () => {
  it('exposes a stable user-facing message per code', () => {
    const error = new AiError('missing_key')
    expect(error.userMessage).toBe(aiErrorMessage('missing_key'))
    expect(error.userMessage).not.toContain('missing_key')
  })
})
