import { useCallback, useState } from 'react'
import type { ReactNode } from 'react'
import { apiFetch } from '@umituz/web-hono/client'
import { usePageTitle } from '@umituz/web-dashboard'
import { Badge, Button, EmptyState, StatusBadge } from '@umituz/web-design-system'
import type { StatusVocab } from '@umituz/web-design-system'
import {
  CircleAlert,
  Cpu,
  ListTodo,
  RotateCcw,
  Sparkles,
} from 'lucide-react'
import type { TaskRow } from '@/data/chatTypes'
import { store, useCollection } from '@/data/store'
import { useT } from '@/i18n'
import { formatDateTime, useTimeAgo } from '@/lib/format'
import { AgentRunCanvas } from '@/components/tasks/AgentRunCanvas'
import { TaskTemplateGallery, type TaskTemplate } from '@/components/tasks/TaskTemplateGallery'

type TasksTab = 'canvas' | 'templates' | 'queue'

export default function TasksPage(): ReactNode {
  const t = useT()
  const formatAgo = useTimeAgo()
  const tasks = useCollection('tasks')
  const [activeTab, setActiveTab] = useState<TasksTab>('canvas')
  const [activeMissionTitle, setActiveMissionTitle] = useState<string>(
    'Autonomous Full-Stack Architecture & Security Verification',
  )

  usePageTitle(t('nav.items.tasks'))

  const vocab: StatusVocab = {
    queued: { label: t('tasks.status.queued'), tone: 'info' },
    running: { label: t('tasks.status.running'), tone: 'primary' },
    succeeded: { label: t('tasks.status.succeeded'), tone: 'success' },
    failed: { label: t('tasks.status.failed'), tone: 'destructive' },
    cancelled: { label: t('tasks.status.cancelled'), tone: 'neutral' },
  }

  const cancel = useCallback(async (id: string) => {
    try {
      await apiFetch(`/api/tasks/${id}/cancel`, { method: 'POST' })
      await store.refresh(['tasks'])
    } catch {
      return
    }
  }, [])

  const retry = useCallback(async (id: string) => {
    try {
      await apiFetch(`/api/tasks/${id}/retry`, { method: 'POST' })
      await store.refresh(['tasks'])
    } catch {
      return
    }
  }, [])

  const kindLabel = (kind: string): string =>
    kind === 'index_document' ? t('tasks.kinds.indexDocument') : kind === 'research' ? t('tasks.kinds.research') : kind

  const handleLaunchTemplate = (template: TaskTemplate) => {
    setActiveMissionTitle(template.title)
    setActiveTab('canvas')
  }

  return (
    <div className="udb-fill-page overflow-y-auto">
      <div className="mx-auto w-full max-w-6xl space-y-6">
        {/* Header & Tabs */}
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-foreground">{t('tasks.title')}</h1>
            <p className="mt-0.5 text-sm text-muted-foreground">
              Autonomous multi-agent execution pipeline, task gallery, and background processing workers.
            </p>
          </div>

          <div className="flex items-center rounded-xl border border-border bg-card p-1">
            <button
              type="button"
              onClick={() => setActiveTab('canvas')}
              className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-medium transition-colors ${
                activeTab === 'canvas'
                  ? 'bg-primary text-primary-foreground shadow-sm'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              <Cpu size={13} />
              <span>Agent Live Canvas</span>
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('templates')}
              className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-medium transition-colors ${
                activeTab === 'templates'
                  ? 'bg-primary text-primary-foreground shadow-sm'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              <Sparkles size={13} />
              <span>Mission Gallery</span>
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('queue')}
              className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-medium transition-colors ${
                activeTab === 'queue'
                  ? 'bg-primary text-primary-foreground shadow-sm'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              <ListTodo size={13} />
              <span>Worker Queue ({tasks.length})</span>
            </button>
          </div>
        </div>

        {/* Tab 1: Live Agent Run Canvas */}
        {activeTab === 'canvas' && (
          <AgentRunCanvas initialMissionTitle={activeMissionTitle} />
        )}

        {/* Tab 2: Mission Templates Gallery */}
        {activeTab === 'templates' && (
          <TaskTemplateGallery onLaunchTemplate={handleLaunchTemplate} />
        )}

        {/* Tab 3: System Worker Task Queue */}
        {activeTab === 'queue' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-semibold text-foreground">Background Worker Execution Queue</h2>
              <span className="text-xs text-muted-foreground">{tasks.length} tasks registered</span>
            </div>

            {tasks.length === 0 ? (
              <EmptyState title={t('tasks.emptyTitle')} description={t('tasks.empty')} />
            ) : (
              <div className="space-y-3">
                {tasks.map((row: TaskRow) => (
                  <div key={row.id} className="rounded-xl border border-border bg-card p-5">
                    <div className="flex items-start justify-between gap-4">
                      <div className="min-w-0">
                        <div className="flex flex-wrap items-center gap-2">
                          <p className="font-medium text-sm text-foreground">{kindLabel(row.kind)}</p>
                          <StatusBadge vocab={vocab} value={row.status} />
                          {row.attempts > 1 && (
                            <Badge tone={row.attempts >= row.maxAttempts ? 'destructive' : 'warning'}>
                              {t('tasks.attempts', { attempts: row.attempts, max: row.maxAttempts })}
                            </Badge>
                          )}
                        </div>
                        <p className="mt-2 text-xs text-muted-foreground">
                          {t('tasks.created')} {formatAgo(row.createdAt)}
                          {row.updatedAt !== row.createdAt ? ` · ${t('tasks.updated')} ${formatDateTime(row.updatedAt)}` : ''}
                        </p>
                        {row.error && (
                          <p className="mt-2 flex items-start gap-1.5 text-xs text-destructive">
                            <CircleAlert size={13} className="mt-0.5 shrink-0" aria-hidden="true" />
                            {row.error}
                          </p>
                        )}
                        {row.status === 'queued' && row.nextAttemptAt && (
                          <p className="mt-2 text-xs text-muted-foreground">
                            {t('tasks.nextAttempt')} {formatDateTime(row.nextAttemptAt)}
                          </p>
                        )}
                      </div>
                      <div className="flex shrink-0 gap-1">
                        {row.status === 'queued' && (
                          <Button variant="ghost" size="sm" onClick={() => void cancel(row.id)}>
                            {t('tasks.cancel')}
                          </Button>
                        )}
                        {(row.status === 'failed' || row.status === 'cancelled') && (
                          <Button variant="ghost" size="sm" onClick={() => void retry(row.id)}>
                            <RotateCcw size={13} aria-hidden="true" />
                            {t('tasks.retry')}
                          </Button>
                        )}
                      </div>
                    </div>
                    {row.logs.length > 0 && (
                      <details className="mt-3">
                        <summary className="cursor-pointer text-xs text-muted-foreground">{t('tasks.logs')}</summary>
                        <ul className="mt-2 space-y-1">
                          {row.logs.map((entry, index) => (
                            <li key={index} className="flex gap-2 font-mono text-[11px] text-muted-foreground">
                              <span className="shrink-0">{formatDateTime(entry.at)}</span>
                              <span className={entry.level === 'error' ? 'text-destructive' : undefined}>{entry.message}</span>
                            </li>
                          ))}
                        </ul>
                      </details>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
