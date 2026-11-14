import { useCallback, useMemo, useState } from 'react'
import type { ReactNode } from 'react'
import { apiFetch } from '@umituz/web-hono/client'
import { usePageTitle } from '@umituz/web-dashboard'
import { NotificationsPage as WorkspaceNotificationsPage } from '@umituz/web-dashboard/notifications/components'
import { NotificationsProvider } from '@umituz/web-dashboard/notifications'
import type { NotificationRecord } from '@umituz/web-dashboard/notifications'
import { Segmented } from '@umituz/web-design-system/molecules'
import { BookOpen, CircleAlert, Telescope } from 'lucide-react'
import type { NotificationRow } from '@/data/chatTypes'
import { store, useCollection } from '@/data/store'
import { useT } from '@/i18n'
import { useTimeAgo } from '@/lib/format'
import { DispatchDesk } from '@/components/dispatch/DispatchDesk'

type NotificationsTab = 'dispatch' | 'system'

export default function NotificationsPage(): ReactNode {
  const t = useT()
  const formatAgo = useTimeAgo()
  const notifications = useCollection('notifications')
  const [tab, setTab] = useState<NotificationsTab>('dispatch')
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
      <div className="mx-auto w-full max-w-6xl space-y-6">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">AI Communications & Signals</h1>
            <p className="mt-1 text-sm text-muted-foreground">
              Triage incoming messages, RFC review requests, and FinOps invoices with instant AI actions.
            </p>
          </div>
          <Segmented
            value={tab}
            onChange={(val) => setTab(val as NotificationsTab)}
            options={[
              { value: 'dispatch', label: 'AI Dispatch & Communications' },
              { value: 'system', label: 'System Alerts & Audit' },
            ]}
          />
        </div>

        {tab === 'dispatch' ? (
          <DispatchDesk />
        ) : (
          <div className="mx-auto max-w-3xl">
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
        )}
      </div>
    </div>
  )
}
