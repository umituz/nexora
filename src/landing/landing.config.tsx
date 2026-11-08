import { useMemo } from 'react'
import type { PublicLayoutConfig } from '@umituz/web-landing'
import '@umituz/web-landing/site.css'
import { useSession } from '@umituz/web-auth/session'
import { BRAND } from '@/brand'
import { useT } from '@/i18n'

export function useLandingConfig(): PublicLayoutConfig {
  const t = useT()
  const { user, logout } = useSession()

  return useMemo<PublicLayoutConfig>(() => {
    const brand = { mark: BRAND.mark, name: BRAND.name, tagline: BRAND.tagline, to: '/' }

    return {
      navItems: [{ to: '/features', label: 'Features' }],
      brand,
      ctaPrimary: { to: '/login?mode=register', label: t('landing.getStarted') },
      authCta: user
        ? { app: { to: '/app/chat', label: t('landing.heroCta') } }
        : {
            login: { to: '/login', label: t('landing.heroSecondary') },
            register: { to: '/login?mode=register', label: t('landing.getStarted') },
          },
      user: user ? { name: user.name, email: user.email } : null,
      onLogout: () => void logout(),
      footerBrand: brand,
      footerNote: t('landing.footerNote'),
      footerColumns: [
        {
          heading: 'Platform',
          links: [
            { to: '/features', label: 'Features' },
            { to: '/login?mode=register', label: t('landing.getStarted') },
          ],
        },
      ],
      skipLabel: t('shell.skipToContent'),
      signOutLabel: t('common.signOut'),
      profileLabel: t('shell.profile'),
    }
  }, [t, user, logout])
}
