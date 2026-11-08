import { describe, expect, it } from 'vitest'
import { DEFAULT_GENERATION } from '@shared/ai/contracts'
import { normalizeSettings } from './model-router'

describe('normalizeSettings', () => {
  it('fills defaults when nothing is requested', () => {
    expect(normalizeSettings(undefined, 8192)).toEqual(DEFAULT_GENERATION)
  })

  it('merges requested settings over defaults', () => {
    expect(normalizeSettings({ temperature: 0.2 }, 8192)).toEqual({
      ...DEFAULT_GENERATION,
      temperature: 0.2,
    })
  })

  it('drops undefined keys instead of overriding defaults', () => {
    expect(normalizeSettings({ temperature: undefined }, 8192)).toEqual(DEFAULT_GENERATION)
  })

  it('clamps maxOutputTokens to the model ceiling', () => {
    expect(normalizeSettings({ maxOutputTokens: 999_999 }, 4096).maxOutputTokens).toBe(4096)
  })

  it('rejects temperature outside bounds', () => {
    expect(() => normalizeSettings({ temperature: 3 }, 8192)).toThrow(/temperature/)
  })

  it('rejects topP outside bounds', () => {
    expect(() => normalizeSettings({ topP: 1.5 }, 8192)).toThrow(/topP/)
  })

  it('rejects non-integer maxOutputTokens', () => {
    expect(() => normalizeSettings({ maxOutputTokens: 10.5 }, 8192)).toThrow(/maxOutputTokens/)
  })
})
