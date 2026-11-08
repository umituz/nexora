import { describe, expect, it } from 'vitest'
import { SYSTEM_PROMPT_VERSION, buildSystemPrompt } from './prompt-engine'

describe('buildSystemPrompt', () => {
  it('includes the identity and the current date', () => {
    const prompt = buildSystemPrompt({ now: new Date('2026-11-08T12:00:00Z') })
    expect(prompt).toContain('Nexora')
    expect(prompt).toContain('Current date: 2026-11-08')
  })

  it('appends workspace instructions when systemExtra is set', () => {
    const prompt = buildSystemPrompt({ settings: { systemExtra: 'Answer in Turkish.' } })
    expect(prompt).toContain('Answer in Turkish.')
  })

  it('ignores blank systemExtra', () => {
    const prompt = buildSystemPrompt({ settings: { systemExtra: '   ' } })
    expect(prompt).not.toContain('Workspace instructions')
  })
})

describe('SYSTEM_PROMPT_VERSION', () => {
  it('is pinned', () => {
    expect(SYSTEM_PROMPT_VERSION).toBe(1)
  })
})
