import type { AuthConfig } from '@umituz/web-auth'
import { useT } from '@/i18n'
import { BRAND } from '@/brand'

export function useAuthConfig(): AuthConfig {
  const t = useT()
  return {
    brandName: BRAND.name,
    brandTagline: t('login.tagline'),
    loginRoute: '/login',
    registerRoute: '/login',
    termsRoute: '/features',
    privacyRoute: '/features',
    afterLoginRoute: '/app/chat',
    afterLogoutRoute: '/login',
    homeRoute: '/',
  }
}
