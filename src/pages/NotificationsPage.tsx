import { useCallback, useMemo } from 'react'
import type { ReactNode } from 'react'
import { apiFetch } from '@umituz/web-hono/client'
import { usePageTitle } from '@umituz/web-dashboard'
import { NotificationsPage as WorkspaceNotificationsPage } from '@umituz/web-dashboard/notifications/components'
import { NotificationsProvider } from '@umituz/web-dashboard/notifications'
import type { NotificationRecord } from '@umituz/web-dashboard/notifications'
import { BookOpen, CircleAlert, Telescope } from 'lucide-react'
import type { NotificationRow } from '@/data/chatTypes'
import { store, useCollection } from '@/data/store'
import { useT } from '@/i18n'
import { useTimeAgo } from '@/lib/format'

export default function NotificationsPage(): ReactNode {
  const t = useT()
  const formatAgo = useTimeAgo()
  const notifications = useCollection('notifications')
  usePageTitle(t('nav.items.notifications'))

  const records = useMemo<NotificationRecord[]>(
    () =>
      notifications.map((row: NotificationRow) => ({
        id: row.id,
        type: row.type,
        title: row.title,
        body: row.body ?? undefined,
        read: row.readAt !== null,
        createdAt: row.createdAt,
        severity: row.severity,
        link: row.link ?? undefined,
      })),
    [notifications],
  )

  const markRead = useCallback(async (id: string) => {
    try {
      await apiFetch(`/api/notifications/${id}/read`, { method: 'PATCH' })
      await store.refresh(['notifications'])
    } catch {
      return
    }
  }, [])

  const markAllRead = useCallback(async () => {
    try {
      await apiFetch('/api/notifications/read-all', { method: 'POST' })
      await store.refresh(['notifications'])
    } catch {
      return
    }
  }, [])

  const dismiss = useCallback(async (id: string) => {
    try {
      await apiFetch(`/api/notifications/${id}`, { method: 'DELETE' })
      await store.refresh(['notifications'])
    } catch {
      return
    }
  }, [])

  const typeMeta = useMemo(
    () => ({
      'document.ready': { label: t('notifications.types.documentReady'), icon: BookOpen },
      'document.failed': { label: t('notifications.types.documentFailed'), icon: CircleAlert },
      'research.ready': { label: t('notifications.types.researchReady'), icon: Telescope },
      'research.failed': { label: t('notifications.types.researchFailed'), icon: CircleAlert },
      'task.failed': { label: t('notifications.types.taskFailed'), icon: CircleAlert },
    }),
    [t],
  )

  return (
    <div className="udb-fill-page overflow-y-auto">
      <div className="mx-auto w-full max-w-3xl">
        <NotificationsProvider
          notifications={records}
          onMarkAllRead={() => void markAllRead()}
          onMarkRead={(id) => void markRead(id)}
          onDismiss={(id) => void dismiss(id)}
        >
          <WorkspaceNotificationsPage
            typeMeta={typeMeta}
            attentionLabel={t('notifications.attention')}
            timeFormatter={formatAgo}
            labels={{
              title: t('notifications.title'),
              description: t('notifications.subtitle'),
              allLabel: t('notifications.all'),
              unreadLabel: t('notifications.unread'),
              markAllLabel: t('shell.markAllRead'),
              emptyTitle: t('notifications.emptyTitle'),
              emptyUnreadTitle: t('notifications.emptyUnreadTitle'),
              emptyAttentionTitle: t('notifications.emptyAttentionTitle'),
              emptyDescription: t('notifications.emptyDescription'),
              markReadLabel: t('notifications.markRead'),
              dismissLabel: t('notifications.dismiss'),
              viewLabel: t('notifications.view'),
            }}
          />
        </NotificationsProvider>
      </div>
    </div>
  )
}
