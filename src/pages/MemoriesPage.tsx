import { useCallback, useState } from 'react'
import type { ReactNode } from 'react'
import { apiFetch } from '@umituz/web-hono/client'
import { usePageTitle } from '@umituz/web-dashboard'
import { Button, Textarea } from '@umituz/web-design-system'
import { Pin, PinOff } from 'lucide-react'
import type { MemoryRow } from '@/data/chatTypes'
import { store, useCollection } from '@/data/store'
import { useT } from '@/i18n'

export default function MemoriesPage(): ReactNode {
  const t = useT()
  const memories = useCollection('memories')
  const [draft, setDraft] = useState<string | null>(null)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [busy, setBusy] = useState(false)
  usePageTitle(t('nav.items.memories'))

  const createMemory = useCallback(async () => {
    if (draft === null || draft.trim().length === 0) return
    setBusy(true)
    try {
      await apiFetch('/api/memories', { method: 'POST', json: { content: draft.trim() } })
      setDraft(null)
      await store.refresh(['memories'])
    } catch {
      return
    } finally {
      setBusy(false)
    }
  }, [draft])

  const saveEditing = useCallback(async () => {
    if (!editingId || draft === null || draft.trim().length === 0) return
    setBusy(true)
    try {
      await apiFetch(`/api/memories/${editingId}`, { method: 'PATCH', json: { content: draft.trim() } })
      setEditingId(null)
      setDraft(null)
      await store.refresh(['memories'])
    } catch {
      return
    } finally {
      setBusy(false)
    }
  }, [draft, editingId])

  const togglePin = useCallback(async (memory: MemoryRow) => {
    try {
      await apiFetch(`/api/memories/${memory.id}`, { method: 'PATCH', json: { pinned: !memory.pinned } })
      await store.refresh(['memories'])
    } catch {
      return
    }
  }, [])

  const removeMemory = useCallback(async (id: string) => {
    try {
      await apiFetch(`/api/memories/${id}`, { method: 'DELETE' })
      await store.refresh(['memories'])
    } catch {
      return
    }
  }, [])

  const editing = editingId ? memories.find((row) => row.id === editingId) : undefined

  return (
    <div className="udb-fill-page overflow-y-auto">
      <div className="mx-auto w-full max-w-3xl space-y-6">
        <div className="flex items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">{t('memories.title')}</h1>
            <p className="mt-1 text-sm text-muted-foreground">{t('memories.subtitle')}</p>
          </div>
          {draft === null && <Button onClick={() => setDraft('')}>{t('memories.new')}</Button>}
        </div>

        {draft !== null && (
          <div className="space-y-3 rounded-xl border border-border bg-card p-5">
            <h2 className="text-sm font-semibold">{editing ? t('memories.editingTitle') : t('memories.createTitle')}</h2>
            <Textarea
              value={draft}
              onChange={(event) => setDraft(event.target.value)}
              placeholder={t('memories.contentPlaceholder')}
              aria-label={t('memories.contentLabel')}
              rows={4}
            />
            <div className="flex justify-end gap-2">
              <Button
                variant="outline"
                onClick={() => {
                  setDraft(null)
                  setEditingId(null)
                }}
              >
                {t('common.cancel')}
              </Button>
              <Button onClick={() => void (editing ? saveEditing() : createMemory())} disabled={busy}>
                {t('common.save')}
              </Button>
            </div>
          </div>
        )}

        {memories.length === 0 && draft === null && (
          <p className="rounded-xl border border-dashed border-border p-8 text-center text-sm text-muted-foreground">
            {t('memories.empty')}
          </p>
        )}

        <div className="space-y-3">
          {memories.map((memory) => (
            <div key={memory.id} className="rounded-xl border border-border bg-card p-5">
              <div className="flex items-start justify-between gap-4">
                <div className="min-w-0">
                  <p className="whitespace-pre-line text-sm">{memory.content}</p>
                  <p className="mt-2 text-xs text-muted-foreground">
                    {memory.source === 'conversation'
                      ? t('memories.sourceConversation')
                      : memory.source === 'agent'
                        ? t('memories.sourceAgent')
                        : t('memories.sourceManual')}
                    {memory.pinned ? ` · ${t('memories.pinned')}` : ''}
                  </p>
                </div>
                <div className="flex shrink-0 gap-1">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => void togglePin(memory)}
                    aria-label={memory.pinned ? t('memories.unpin') : t('memories.pin')}
                  >
                    {memory.pinned ? <PinOff size={14} aria-hidden="true" /> : <Pin size={14} aria-hidden="true" />}
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      setEditingId(memory.id)
                      setDraft(memory.content)
                    }}
                  >
                    {t('memories.editAction')}
                  </Button>
                  <Button variant="ghost" size="sm" onClick={() => void removeMemory(memory.id)}>
                    {t('common.delete')}
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
