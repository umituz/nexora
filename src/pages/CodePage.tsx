import { useCallback, useState } from 'react'
import type { ReactNode } from 'react'
import { ApiClientError, apiFetch } from '@umituz/web-hono/client'
import { usePageTitle } from '@umituz/web-dashboard'
import { Button, CodeBlock, Input, Textarea } from '@umituz/web-design-system'
import { GitCompare, ChevronDown, ChevronRight } from 'lucide-react'
import type { CodeArtifactFull, CodeArtifactRow, CodeArtifactVersionRow } from '@/data/chatTypes'
import { store, useCollection } from '@/data/store'
import { useT } from '@/i18n'
import { countChanges, diffLines } from '@/lib/diff'

export default function CodePage(): ReactNode {
  const t = useT()
  const artifacts = useCollection('codeArtifacts')

  const [title, setTitle] = useState('')
  const [language, setLanguage] = useState('')
  const [content, setContent] = useState('')
  const [showForm, setShowForm] = useState(false)
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const [openRoot, setOpenRoot] = useState<string | null>(null)
  const [versions, setVersions] = useState<CodeArtifactVersionRow[]>([])
  const [selected, setSelected] = useState<CodeArtifactFull | null>(null)
  const [previous, setPrevious] = useState<CodeArtifactFull | null>(null)
  const [showDiff, setShowDiff] = useState(false)

  usePageTitle(t('nav.items.code'))

  const openArtifact = useCallback(async (row: CodeArtifactRow) => {
    if (openRoot === row.rootId) {
      setOpenRoot(null)
      setSelected(null)
      setPrevious(null)
      setVersions([])
      setShowDiff(false)
      return
    }
    setOpenRoot(row.rootId)
    setShowDiff(false)
    setPrevious(null)
    try {
      const [full, chain] = await Promise.all([
        apiFetch<CodeArtifactFull>(`/api/code-artifacts/${row.id}`),
        apiFetch<CodeArtifactVersionRow[]>(`/api/code-artifacts/${row.id}/versions`),
      ])
      setSelected(full)
      setVersions(chain)
    } catch {
      setSelected(null)
      setVersions([])
    }
  }, [openRoot])

  const selectVersion = useCallback(async (versionRow: CodeArtifactVersionRow) => {
    setShowDiff(false)
    setPrevious(null)
    try {
      setSelected(await apiFetch<CodeArtifactFull>(`/api/code-artifacts/${versionRow.id}`))
    } catch {
      return
    }
  }, [])

  const toggleDiff = useCallback(async () => {
    if (!selected || versions.length < 2) return
    if (showDiff) {
      setShowDiff(false)
      return
    }
    const index = versions.findIndex((row) => row.id === selected.id)
    const prev = index > 0 ? versions[index - 1] : null
    if (!prev) return
    try {
      setPrevious(await apiFetch<CodeArtifactFull>(`/api/code-artifacts/${prev.id}`))
      setShowDiff(true)
    } catch {
      return
    }
  }, [selected, showDiff, versions])

  const createSnippet = useCallback(async () => {
    if (content.trim().length === 0) return
    setBusy(true)
    setError(null)
    try {
      await apiFetch('/api/code-artifacts', {
        method: 'POST',
        json: { title: title.trim().length > 0 ? title.trim() : undefined, language: language.trim(), content },
      })
      setTitle('')
      setLanguage('')
      setContent('')
      setShowForm(false)
      await store.refresh(['codeArtifacts'])
    } catch (err) {
      setError(err instanceof ApiClientError ? err.message : t('code.createFailed'))
    } finally {
      setBusy(false)
    }
  }, [content, language, t, title])

  const removeArtifact = useCallback(async (id: string) => {
    try {
      await apiFetch(`/api/code-artifacts/${id}`, { method: 'DELETE' })
      setOpenRoot(null)
      setSelected(null)
      await store.refresh(['codeArtifacts'])
    } catch {
      return
    }
  }, [])

  const diff = previous && selected ? diffLines(previous.content, selected.content) : []
  const changes = countChanges(diff)

  return (
    <div className="nexora-fill overflow-y-auto">
      <div className="mx-auto w-full max-w-3xl space-y-6">
        <div className="flex items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">{t('code.title')}</h1>
            <p className="mt-1 text-sm text-muted-foreground">{t('code.subtitle')}</p>
          </div>
          {!showForm && (
            <Button
              onClick={() => {
                setShowForm(true)
                setError(null)
              }}
            >
              {t('code.new')}
            </Button>
          )}
        </div>

        {showForm && (
          <div className="space-y-3 rounded-xl border border-border bg-card p-5">
            <h2 className="text-sm font-semibold">{t('code.createTitle')}</h2>
            <div className="flex gap-2">
              <Input
                value={title}
                onChange={(event) => setTitle(event.target.value)}
                placeholder={t('code.namePlaceholder')}
                aria-label={t('code.nameLabel')}
              />
              <Input
                value={language}
                onChange={(event) => setLanguage(event.target.value)}
                placeholder={t('code.languagePlaceholder')}
                aria-label={t('code.languageLabel')}
                className="max-w-32"
              />
            </div>
            <Textarea
              value={content}
              onChange={(event) => setContent(event.target.value)}
              placeholder={t('code.contentPlaceholder')}
              aria-label={t('code.contentLabel')}
              rows={10}
            />
            {error && <p className="text-xs text-destructive">{error}</p>}
            <div className="flex justify-end gap-2">
              <Button
                variant="outline"
                onClick={() => {
                  setShowForm(false)
                  setTitle('')
                  setLanguage('')
                  setContent('')
                  setError(null)
                }}
              >
                {t('common.cancel')}
              </Button>
              <Button onClick={() => void createSnippet()} disabled={busy || content.trim().length === 0}>
                {t('common.save')}
              </Button>
            </div>
          </div>
        )}

        {artifacts.length === 0 && !showForm && (
          <p className="rounded-xl border border-dashed border-border p-8 text-center text-sm text-muted-foreground">{t('code.empty')}</p>
        )}

        <div className="space-y-3">
          {artifacts.map((artifact) => (
            <div key={artifact.id} className="rounded-xl border border-border bg-card">
              <div className="flex items-start justify-between gap-4 p-5">
                <button type="button" className="flex min-w-0 items-center gap-2 text-left" onClick={() => void openArtifact(artifact)}>
                  {openRoot === artifact.rootId ? (
                    <ChevronDown size={16} className="shrink-0 text-muted-foreground" aria-hidden="true" />
                  ) : (
                    <ChevronRight size={16} className="shrink-0 text-muted-foreground" aria-hidden="true" />
                  )}
                  <span className="truncate text-sm font-medium">{artifact.title}</span>
                  <span className="shrink-0 rounded-full bg-muted px-2 py-0.5 text-[11px] text-muted-foreground">{artifact.language}</span>
                  <span className="shrink-0 text-[11px] text-muted-foreground">v{artifact.version}</span>
                  {artifact.conversationId && (
                    <span className="shrink-0 rounded-full bg-primary/10 px-2 py-0.5 text-[11px] text-primary">{t('code.fromChat')}</span>
                  )}
                </button>
                <Button variant="ghost" size="sm" onClick={() => void removeArtifact(artifact.id)}>
                  {t('common.delete')}
                </Button>
              </div>

              {openRoot === artifact.rootId && selected && (
                <div className="space-y-3 border-t border-border p-5">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <select
                      value={selected.id}
                      onChange={(event) => {
                        const row = versions.find((candidate) => candidate.id === event.target.value)
                        if (row) void selectVersion(row)
                      }}
                      className="rounded-lg border border-border bg-background px-2 py-1 text-xs"
                      aria-label={t('code.versions')}
                    >
                      {versions.map((row) => (
                        <option key={row.id} value={row.id}>
                          {t('code.versionOption', { version: row.version })}
                        </option>
                      ))}
                    </select>
                    {versions.length > 1 && selected.version > 1 && (
                      <Button variant="outline" size="sm" onClick={() => void toggleDiff()}>
                        <GitCompare size={14} aria-hidden="true" />
                        {t('code.diffWith', { version: selected.version - 1 })}
                      </Button>
                    )}
                    <span className="text-xs text-muted-foreground">{t('code.charsLabel', { count: selected.content.length })}</span>
                  </div>

                  {showDiff && previous ? (
                    <div className="space-y-1">
                      <p className="text-xs text-muted-foreground">
                        {t('code.diffSummary', { added: changes.added, removed: changes.removed })}
                      </p>
                      <pre className="overflow-x-auto rounded-lg border border-border bg-muted/40 p-3 text-xs leading-relaxed">
                        {diff.map((line, index) => (
                          <span
                            key={index}
                            className={
                              line.type === 'add'
                                ? 'block bg-emerald-500/10 text-emerald-700 dark:text-emerald-400'
                                : line.type === 'remove'
                                  ? 'block bg-destructive/10 text-destructive'
                                  : 'block'
                            }
                          >
                            {line.type === 'add' ? '+ ' : line.type === 'remove' ? '- ' : '  '}
                            {line.text}
                          </span>
                        ))}
                      </pre>
                    </div>
                  ) : (
                    <CodeBlock language={selected.language}>{selected.content}</CodeBlock>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
