import { describe, expect, it } from 'vitest'
import { validateToolArgs } from './tools'

describe('validateToolArgs', () => {
  it('accepts a valid generate_image payload', () => {
    expect(validateToolArgs('generate_image', { prompt: 'a red panda', size: '1024x1024', quality: 'high' })).toEqual({ ok: true })
  })

  it('rejects generate_image with an unknown size', () => {
    const outcome = validateToolArgs('generate_image', { prompt: 'a red panda', size: '512x512' })
    expect(outcome.ok).toBe(false)
    if (!outcome.ok) expect(outcome.error).toContain('Invalid arguments')
  })

  it('rejects generate_image with an empty prompt', () => {
    const outcome = validateToolArgs('generate_image', { prompt: '' })
    expect(outcome.ok).toBe(false)
  })

  it('accepts a valid save_memory payload and defaults nothing', () => {
    expect(validateToolArgs('save_memory', { content: 'User prefers concise answers', pinned: true })).toEqual({ ok: true })
    expect(validateToolArgs('save_memory', { content: 'User writes TypeScript' })).toEqual({ ok: true })
  })

  it('rejects save_memory without content', () => {
    const outcome = validateToolArgs('save_memory', { pinned: true })
    expect(outcome.ok).toBe(false)
  })

  it('rejects unknown tool keys outright', () => {
    const outcome = validateToolArgs('run_shell', { command: 'rm -rf /' })
    expect(outcome.ok).toBe(false)
    if (!outcome.ok) expect(outcome.error).toContain('Unknown tool')
  })
})
