import { useCallback, useEffect, useMemo } from 'react'
import { Navigate, useLocation } from 'react-router'
import { DashboardLayout } from '@umituz/web-dashboard'
import type {
  DashboardLayoutConfig,
  DashboardLayoutLabels,
  DashboardNotification,
  DashboardUser,
  SidebarGroup,
} from '@umituz/web-dashboard'
import { useSession } from '@umituz/web-auth/session'
import { apiFetch } from '@umituz/web-hono/client'
import { useDesignSystem } from '@umituz/web-design-system/providers'
import { User as UserIcon } from 'lucide-react'
import { BRAND } from '@/brand'
import { useT } from '@/i18n'
import { useHydration, useCollection, store } from '@/data/store'
import { NOTIFICATIONS_ROUTE, NAV_GROUPS, NAV_ITEMS } from './navigation'

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
  const notifications = useCollection('notifications')
  const t = useT()
  const { mode, toggleMode } = useDesignSystem()
  const location = useLocation()

  useEffect(() => {
    if (hydration.status !== 'ready') return
    if (location.pathname.startsWith(NOTIFICATIONS_ROUTE)) return
    void store.refresh(['notifications'])
  }, [location.pathname, hydration.status])

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

  const bellNotifications: DashboardNotification[] = useMemo(
    () =>
      notifications.slice(0, 8).map((row) => ({
        id: row.id,
        text: row.body ? `${row.title} — ${row.body}` : row.title,
        read: row.readAt !== null,
        createdAt: row.createdAt,
        to: row.link ?? undefined,
      })),
    [notifications],
  )

  const markAllRead = useCallback(async () => {
    try {
      await apiFetch('/api/notifications/read-all', { method: 'POST' })
      await store.refresh(['notifications'])
    } catch {
      return
    }
  }, [])

  const dismissNotification = useCallback(async (id: string) => {
    try {
      await apiFetch(`/api/notifications/${id}`, { method: 'DELETE' })
      await store.refresh(['notifications'])
    } catch {
      return
    }
  }, [])

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
        <span className="bg-gradient-to-br from-[#2563eb] to-[#7c3aed] text-white flex h-9 w-9 items-center justify-center rounded-[0.5rem] text-sm font-bold">
          {BRAND.mark}
        </span>
      ),
      extraTitleMap: {
        [NOTIFICATIONS_ROUTE]: t('nav.items.notifications'),
        '/app/profile': t('nav.items.profile'),
      },
      notificationsViewAll: { label: t('notifications.viewAll'), to: NOTIFICATIONS_ROUTE },
      profileItems: [
        { key: 'profile', label: t('shell.profile'), icon: <UserIcon size={14} aria-hidden="true" />, to: '/app/profile' },
      ],
      showDefaultProfileItems: false,
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
      notifications={bellNotifications}
      onMarkAllRead={() => void markAllRead()}
      onDismissNotification={(id) => void dismissNotification(id)}
      loginRoute="/login"
      theme={mode}
      onToggleTheme={toggleMode}
      contentFallback={<PageFallback />}
    />
  )
}
