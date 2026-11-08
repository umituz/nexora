import { useCallback, useState } from 'react'
import type { ReactNode } from 'react'
import { apiFetch } from '@umituz/web-hono/client'
import { usePageTitle } from '@umituz/web-dashboard'
import { Button, Input, Textarea } from '@umituz/web-design-system'
import { store, useCollection } from '@/data/store'
import { useT } from '@/i18n'

interface DraftProject {
  name: string
  description: string
  instructions: string
}

const EMPTY_DRAFT: DraftProject = { name: '', description: '', instructions: '' }

export default function ProjectsPage(): ReactNode {
  const t = useT()
  const projects = useCollection('projects')
  const [draft, setDraft] = useState<DraftProject | null>(null)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [busy, setBusy] = useState(false)
  usePageTitle(t('nav.items.projects'))

  const createProject = useCallback(async () => {
    if (!draft || draft.name.trim().length === 0) return
    setBusy(true)
    try {
      await apiFetch('/api/projects', {
        method: 'POST',
        json: { name: draft.name.trim(), description: draft.description.trim() || null, instructions: draft.instructions.trim() || null },
      })
      setDraft(null)
      await store.refresh(['projects'])
    } catch {
      return
    } finally {
      setBusy(false)
    }
  }, [draft])

  const saveEditing = useCallback(async () => {
    if (!draft || draft.name.trim().length === 0) return
    setBusy(true)
    try {
      await apiFetch(`/api/projects/${editingId}`, {
        method: 'PATCH',
        json: { name: draft.name.trim(), description: draft.description.trim() || null, instructions: draft.instructions.trim() || null },
      })
      setEditingId(null)
      setDraft(null)
      await store.refresh(['projects'])
    } catch {
      return
    } finally {
      setBusy(false)
    }
  }, [draft, editingId])

  const removeProject = useCallback(
    async (id: string) => {
      try {
        await apiFetch(`/api/projects/${id}`, { method: 'DELETE' })
        await store.refresh(['projects', 'conversations'])
      } catch {
        return
      }
    },
    [],
  )

  const editing = editingId ? projects.find((row) => row.id === editingId) : undefined

  return (
    <div className="nexora-fill overflow-y-auto">
      <div className="mx-auto w-full max-w-3xl space-y-6">
        <div className="flex items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">{t('projects.title')}</h1>
            <p className="mt-1 text-sm text-muted-foreground">{t('projects.subtitle')}</p>
          </div>
          {!draft && (
            <Button onClick={() => setDraft(EMPTY_DRAFT)}>{t('projects.new')}</Button>
          )}
        </div>

        {draft && (
          <div className="space-y-3 rounded-xl border border-border bg-card p-5">
            <h2 className="text-sm font-semibold">{editing ? t('projects.editingTitle') : t('projects.createTitle')}</h2>
            <Input
              value={draft.name}
              onChange={(event) => setDraft({ ...draft, name: event.target.value })}
              placeholder={t('projects.namePlaceholder')}
              aria-label={t('projects.nameLabel')}
            />
            <Input
              value={draft.description}
              onChange={(event) => setDraft({ ...draft, description: event.target.value })}
              placeholder={t('projects.descriptionPlaceholder')}
              aria-label={t('projects.descriptionLabel')}
            />
            <Textarea
              value={draft.instructions}
              onChange={(event) => setDraft({ ...draft, instructions: event.target.value })}
              placeholder={t('projects.instructionsPlaceholder')}
              aria-label={t('projects.instructionsLabel')}
              rows={6}
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
              <Button onClick={() => void (editing ? saveEditing() : createProject())} disabled={busy}>
                {t('common.save')}
              </Button>
            </div>
          </div>
        )}

        {projects.length === 0 && !draft && (
          <p className="rounded-xl border border-dashed border-border p-8 text-center text-sm text-muted-foreground">
            {t('projects.empty')}
          </p>
        )}

        <div className="space-y-3">
          {projects.map((project) => (
            <div key={project.id} className="rounded-xl border border-border bg-card p-5">
              <div className="flex items-start justify-between gap-4">
                <div className="min-w-0">
                  <h3 className="truncate text-sm font-semibold">{project.name}</h3>
                  {project.description && <p className="mt-0.5 text-sm text-muted-foreground">{project.description}</p>}
                  {project.instructions && (
                    <p className="mt-2 line-clamp-2 whitespace-pre-line text-xs text-muted-foreground">{project.instructions}</p>
                  )}
                </div>
                <div className="flex shrink-0 gap-1">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      setEditingId(project.id)
                      setDraft({ name: project.name, description: project.description ?? '', instructions: project.instructions ?? '' })
                    }}
                  >
                    {t('projects.editAction')}
                  </Button>
                  <Button variant="ghost" size="sm" onClick={() => void removeProject(project.id)}>
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
