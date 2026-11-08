import { describe, expect, it } from 'vitest'
import { i18n } from './index'

describe('setupI18n', () => {
  it('translates nested catalog keys', async () => {
    await i18n.whenReady()
    expect(i18n.getCurrentLanguage()).toBe('en')
    expect(i18n.instance.t('login.tagline')).toBe('Sign in to continue to your workspace')
  })

  it('registers the full catalog under the base locale code', async () => {
    await i18n.whenReady()
    expect(i18n.instance.exists('auth.register.createAccount')).toBe(true)
    expect(i18n.instance.exists('chat.placeholder')).toBe(true)
  })
})
