import { useEffect, useMemo, useState } from 'react'
import { Navigate } from 'react-router'
import { DashboardLayout } from '@umituz/web-dashboard'
import type {
  DashboardLayoutConfig,
  DashboardLayoutLabels,
  DashboardUser,
  SidebarGroup,
} from '@umituz/web-dashboard'
import { useSession } from '@umituz/web-auth/session'
import { BRAND } from '@/brand'
import { useT } from '@/i18n'
import { useHydration } from '@/data/store'
import { NAV_GROUPS, NAV_ITEMS } from './navigation'
import { applyTheme, readStoredTheme, type Theme } from '@/utils/theme'

function PageFallback() {
  return (
    <div className="flex min-h-[60vh] items-center justify-center" role="status" aria-label="Loading">
      <span className="h-2.5 w-2.5 animate-pulse rounded-full bg-primary" />
    </div>
  )
}

export default function AppLayout() {
  const { user: sessionUser, status, logout } = useSession()
  const hydration = useHydration()
  const t = useT()
  const [theme, setTheme] = useState<Theme>(readStoredTheme)

  useEffect(() => {
    applyTheme(theme)
  }, [theme])

  const labels: DashboardLayoutLabels = useMemo(
    () => ({
      skipToContent: t('shell.skipToContent'),
      navigation: t('shell.navigation'),
      searchResults: t('shell.searchResults'),
      header: {
        expandSidebar: t('shell.expandSidebar'),
        collapseSidebar: t('shell.collapseSidebar'),
        switchToLight: t('shell.switchToLight'),
        switchToDark: t('shell.switchToDark'),
        notificationsTitle: t('shell.notificationsTitle'),
        markAllRead: t('shell.markAllRead'),
        dismissNotification: t('shell.dismissNotification'),
        noNotifications: t('shell.noNotifications'),
        profile: t('shell.profile'),
        settings: t('common.settings'),
        logout: t('common.signOut'),
        guestName: t('topbar.guest'),
      },
      sidebar: {},
    }),
    [t],
  )

  const user: DashboardUser | undefined = useMemo(
    () =>
      sessionUser
        ? { id: sessionUser.id, name: sessionUser.name || undefined, email: sessionUser.email, role: 'member' }
        : undefined,
    [sessionUser],
  )

  const config: DashboardLayoutConfig = useMemo(() => {
    const sidebarGroups: SidebarGroup[] = NAV_GROUPS.map((group) => ({
      title: group.titleKey ? t(group.titleKey) : undefined,
      items: NAV_ITEMS.filter((item) => item.group === group.id).map((item) => ({
        label: t(`nav.items.${item.key}`),
        icon: item.icon,
        path: item.href,
      })),
    })).filter((group) => group.items.length > 0)

    return {
      sidebarGroups,
      brandName: BRAND.name,
      brandTagline: t('sidebar.tagline'),
      brand: (
        <span className="nexora-brand-mark flex h-9 w-9 items-center justify-center rounded-[0.5rem] text-sm font-bold">
          {BRAND.mark}
        </span>
      ),
    }
  }, [t])

  if (status === 'loading') return <PageFallback />
  if (!sessionUser) return <Navigate to="/login" replace />
  if (hydration.status === 'loading') return <PageFallback />
  if (hydration.status === 'error') {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-4 p-8 text-center">
        <p className="text-sm text-muted-foreground">{t('common.error')}</p>
        <p className="max-w-md text-xs text-muted-foreground">{hydration.error}</p>
        <button
          type="button"
          onClick={hydration.retry}
          className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground"
        >
          {t('common.retry')}
        </button>
      </div>
    )
  }

  return (
    <DashboardLayout
      config={config}
      labels={labels}
      user={user}
      onLogout={async () => {
        await logout()
      }}
      loginRoute="/login"
      theme={theme}
      onToggleTheme={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
      contentFallback={<PageFallback />}
    />
  )
}
