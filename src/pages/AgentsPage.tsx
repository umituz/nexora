import { useCallback, useState } from 'react'
import type { ReactNode } from 'react'
import { apiFetch } from '@umituz/web-hono/client'
import { usePageTitle } from '@umituz/web-dashboard'
import { Button, Input, NativeSelect, Textarea } from '@umituz/web-design-system'
import type { NativeSelectOption } from '@umituz/web-design-system'
import { Segmented } from '@umituz/web-design-system/molecules'
import { Trash2, Wrench } from 'lucide-react'
import type { AgentRow, ToolRow } from '@/data/chatTypes'
import { AGENT_TEMPLATES } from '@/data/agentTemplates'
import { store, useCollection } from '@/data/store'
import { useT } from '@/i18n'
import { SquadHub } from '@/components/team/SquadHub'

type AgentsPageTab = 'squad' | 'blueprints'

interface AgentDraft {
  name: string
  description: string
  instructions: string
  modelId: string
  toolIds: string[]
}

const EMPTY_DRAFT: AgentDraft = { name: '', description: '', instructions: '', modelId: '', toolIds: [] }

export default function AgentsPage(): ReactNode {
  const t = useT()
  const agents = useCollection('agents')
  const tools = useCollection('tools')
  const models = useCollection('models')
  const [draft, setDraft] = useState<AgentDraft | null>(null)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [busy, setBusy] = useState(false)
  const [pageTab, setPageTab] = useState<AgentsPageTab>('squad')
  usePageTitle(t('nav.items.agents'))

  const chatModels = models.filter((model) => model.outputTypes.includes('text'))
  const modelOptions: NativeSelectOption[] = [
    { value: '', label: t('agents.defaultModel') },
    ...chatModels.map((model) => ({ value: model.id, label: model.displayName })),
  ]

  const startCreate = useCallback(() => {
    setEditingId(null)
    setDraft(EMPTY_DRAFT)
  }, [])

  const startFromTemplate = useCallback(
    (templateId: string) => {
      const template = AGENT_TEMPLATES.find((row) => row.id === templateId)
      if (!template) return
      setEditingId(null)
      setDraft({
        name: template.name,
        description: template.description,
        instructions: template.instructions,
        modelId: '',
        toolIds: tools.filter((tool) => template.toolKeys.includes(tool.key)).map((tool) => tool.id),
      })
    },
    [tools],
  )

  const startEdit = useCallback((agent: AgentRow) => {
    setEditingId(agent.id)
    setDraft({
      name: agent.name,
      description: agent.description ?? '',
      instructions: agent.instructions,
      modelId: agent.modelId ?? '',
      toolIds: agent.toolIds,
    })
  }, [])

  const save = useCallback(async () => {
    if (!draft || draft.name.trim().length === 0) return
    setBusy(true)
    const payload = {
      name: draft.name.trim(),
      description: draft.description.trim().length > 0 ? draft.description.trim() : undefined,
      instructions: draft.instructions,
      modelId: draft.modelId || undefined,
      toolIds: draft.toolIds,
    }
    try {
      if (editingId) {
        await apiFetch(`/api/agents/${editingId}`, { method: 'PATCH', json: payload })
      } else {
        await apiFetch('/api/agents', { method: 'POST', json: payload })
      }
      setDraft(null)
      setEditingId(null)
      await store.refresh(['agents'])
    } catch {
      return
    } finally {
      setBusy(false)
    }
  }, [draft, editingId])

  const remove = useCallback(async (id: string) => {
    try {
      await apiFetch(`/api/agents/${id}`, { method: 'DELETE' })
      await store.refresh(['agents'])
    } catch {
      return
    }
  }, [])

  const toggleTool = useCallback((toolId: string) => {
    setDraft((current) =>
      current
        ? { ...current, toolIds: current.toolIds.includes(toolId) ? current.toolIds.filter((id) => id !== toolId) : [...current.toolIds, toolId] }
        : current,
    )
  }, [])

  const editing = editingId ? agents.find((row) => row.id === editingId) : undefined

  return (
    <div className="udb-fill-page overflow-y-auto">
      <div className="mx-auto w-full max-w-6xl space-y-6">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">{t('agents.title')}</h1>
            <p className="mt-1 text-sm text-muted-foreground">
              Coordinate autonomous multi-agent squads, allocate workloads, or customize agent system blueprints.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Segmented
              value={pageTab}
              onChange={(val) => setPageTab(val as AgentsPageTab)}
              options={[
                { value: 'squad', label: 'Squad & Team Operations' },
                { value: 'blueprints', label: 'Agent Blueprints' },
              ]}
            />
            {pageTab === 'blueprints' && draft === null && (
              <Button onClick={startCreate}>{t('agents.new')}</Button>
            )}
          </div>
        </div>

        {pageTab === 'squad' ? (
          <SquadHub />
        ) : (
          <div className="mx-auto max-w-3xl space-y-6">

        {draft !== null && (
          <div className="space-y-3 rounded-xl border border-border bg-card p-5">
            <h2 className="text-sm font-semibold">{editing ? t('agents.editingTitle') : t('agents.createTitle')}</h2>
            <Input
              value={draft.name}
              onChange={(event) => setDraft({ ...draft, name: event.target.value })}
              placeholder={t('agents.namePlaceholder')}
              aria-label={t('agents.nameLabel')}
              maxLength={120}
            />
            <Input
              value={draft.description}
              onChange={(event) => setDraft({ ...draft, description: event.target.value })}
              placeholder={t('agents.descriptionPlaceholder')}
              aria-label={t('agents.descriptionLabel')}
              maxLength={500}
            />
            <div className="flex flex-col gap-1">
              <label className="text-xs font-medium text-muted-foreground">{t('agents.model')}</label>
              <NativeSelect
                options={modelOptions}
                value={draft.modelId}
                onChange={(event) => setDraft({ ...draft, modelId: event.target.value })}
                aria-label={t('agents.model')}
              />
            </div>
            {tools.length > 0 ? (
              <div className="space-y-2">
                <span className="text-xs font-medium text-muted-foreground">{t('agents.tools')}</span>
                <div className="flex flex-wrap gap-2">
                  {tools.map((tool: ToolRow) => {
                    const bound = draft.toolIds.includes(tool.id)
                    return (
                      <button
                        key={tool.id}
                        type="button"
                        onClick={() => toggleTool(tool.id)}
                        className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs transition ${
                          bound ? 'border-primary bg-primary/10 text-foreground' : 'border-border text-muted-foreground hover:bg-accent'
                        }`}
                        title={tool.description}
                      >
                        <Wrench size={12} aria-hidden="true" />
                        {tool.name}
                      </button>
                    )
                  })}
                </div>
                <p className="text-[11px] text-muted-foreground">{t('agents.toolsHint')}</p>
              </div>
            ) : null}
            <div className="flex flex-col gap-1">
              <label className="text-xs font-medium text-muted-foreground">{t('agents.instructionsLabel')}</label>
              <Textarea
                value={draft.instructions}
                onChange={(event) => setDraft({ ...draft, instructions: event.target.value })}
                placeholder={t('agents.instructionsPlaceholder')}
                rows={6}
                maxLength={8000}
              />
            </div>
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
              <Button onClick={() => void save()} disabled={busy || draft.name.trim().length === 0}>
                {t('common.save')}
              </Button>
            </div>
          </div>
        )}

        {agents.length === 0 && draft === null && (
          <p className="rounded-xl border border-dashed border-border p-8 text-center text-sm text-muted-foreground">
            {t('agents.empty')}
          </p>
        )}

        <div className="space-y-3">
          {agents.map((agent: AgentRow) => {
            const boundTools = tools.filter((tool) => agent.toolIds.includes(tool.id))
            const model = models.find((row) => row.id === agent.modelId)
            return (
              <div key={agent.id} className="rounded-xl border border-border bg-card p-5">
                <div className="flex items-start justify-between gap-4">
                  <div className="min-w-0">
                    <p className="font-medium">{agent.name}</p>
                    {agent.description ? <p className="mt-1 text-sm text-muted-foreground">{agent.description}</p> : null}
                    <p className="mt-2 text-xs text-muted-foreground">
                      {model ? model.displayName : t('agents.defaultModel')}
                      {boundTools.length > 0 ? ` · ${boundTools.map((tool) => tool.name).join(' · ')}` : ''}
                    </p>
                  </div>
                  <div className="flex shrink-0 gap-1">
                    <Button variant="ghost" size="sm" onClick={() => startEdit(agent)}>
                      {t('agents.editAction')}
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => void remove(agent.id)}
                      aria-label={t('common.delete')}
                      title={t('common.delete')}
                    >
                      <Trash2 size={14} aria-hidden="true" />
                    </Button>
                  </div>
                </div>
              </div>
            )
          })}
        </div>

        {draft === null && (
          <div className="space-y-3 border-t border-border pt-6">
            <div>
              <h2 className="text-sm font-semibold">{t('agents.templatesTitle')}</h2>
              <p className="mt-1 text-xs text-muted-foreground">{t('agents.templatesHint')}</p>
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              {AGENT_TEMPLATES.map((template) => (
                <div key={template.id} className="flex flex-col rounded-xl border border-border bg-card p-4">
                  <p className="text-sm font-medium">{template.name}</p>
                  <p className="mt-1 flex-1 text-xs text-muted-foreground">{template.description}</p>
                  <div className="mt-3 flex items-center justify-between gap-2">
                    <div className="flex flex-wrap gap-1">
                      {template.toolKeys.map((key) => (
                        <span
                          key={key}
                          className="inline-flex items-center gap-1 rounded-full border border-border px-2 py-0.5 text-[10px] text-muted-foreground"
                        >
                          <Wrench size={10} aria-hidden="true" />
                          {tools.find((tool) => tool.key === key)?.name ?? key}
                        </span>
                      ))}
                    </div>
                    <Button variant="outline" size="sm" onClick={() => startFromTemplate(template.id)}>
                      {t('agents.useTemplate')}
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
          </div>
        )}
      </div>
    </div>
  )
}
