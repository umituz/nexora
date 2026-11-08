import { useCallback, useState } from 'react'
import type { ReactNode } from 'react'
import { ApiClientError, apiFetch } from '@umituz/web-hono/client'
import { usePageTitle } from '@umituz/web-dashboard'
import { Button, Input, Textarea } from '@umituz/web-design-system'
import { Search } from 'lucide-react'
import type { KnowledgeHitRow } from '@/data/chatTypes'
import { store, useCollection } from '@/data/store'
import { useT } from '@/i18n'

export default function KnowledgePage(): ReactNode {
  const t = useT()
  const documents = useCollection('documents')

  const [title, setTitle] = useState('')
  const [text, setText] = useState('')
  const [showForm, setShowForm] = useState(false)
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const [query, setQuery] = useState('')
  const [searching, setSearching] = useState(false)
  const [hits, setHits] = useState<KnowledgeHitRow[] | null>(null)
  const [searchError, setSearchError] = useState<string | null>(null)

  usePageTitle(t('nav.items.knowledge'))

  const messageOf = useCallback((err: unknown, fallback: string) => {
    if (err instanceof ApiClientError) return err.message
    return fallback
  }, [])

  const indexDocument = useCallback(async () => {
    if (title.trim().length === 0 || text.trim().length === 0) return
    setBusy(true)
    setError(null)
    try {
      await apiFetch('/api/documents', { method: 'POST', json: { title: title.trim(), text } })
      setTitle('')
      setText('')
      setShowForm(false)
      await store.refresh(['documents'])
    } catch (err) {
      setError(messageOf(err, t('knowledge.indexFailed')))
    } finally {
      setBusy(false)
    }
  }, [messageOf, t, text, title])

  const removeDocument = useCallback(async (id: string) => {
    try {
      await apiFetch(`/api/documents/${id}`, { method: 'DELETE' })
      await store.refresh(['documents'])
    } catch {
      return
    }
  }, [])

  const runSearch = useCallback(async () => {
    if (query.trim().length === 0) return
    setSearching(true)
    setSearchError(null)
    setHits(null)
    try {
      const rows = await apiFetch<KnowledgeHitRow[]>('/api/documents/search', {
        method: 'POST',
        json: { query: query.trim() },
      })
      setHits(rows)
    } catch (err) {
      setSearchError(messageOf(err, t('common.error')))
    } finally {
      setSearching(false)
    }
  }, [messageOf, query, t])

  return (
    <div className="nexora-fill overflow-y-auto">
      <div className="mx-auto w-full max-w-3xl space-y-6">
        <div className="flex items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">{t('knowledge.title')}</h1>
            <p className="mt-1 text-sm text-muted-foreground">{t('knowledge.subtitle')}</p>
          </div>
          {!showForm && (
            <Button
              onClick={() => {
                setShowForm(true)
                setError(null)
              }}
            >
              {t('knowledge.new')}
            </Button>
          )}
        </div>

        {showForm && (
          <div className="space-y-3 rounded-xl border border-border bg-card p-5">
            <h2 className="text-sm font-semibold">{t('knowledge.createTitle')}</h2>
            <Input
              value={title}
              onChange={(event) => setTitle(event.target.value)}
              placeholder={t('knowledge.namePlaceholder')}
              aria-label={t('knowledge.nameLabel')}
            />
            <Textarea
              value={text}
              onChange={(event) => setText(event.target.value)}
              placeholder={t('knowledge.textPlaceholder')}
              aria-label={t('knowledge.textLabel')}
              rows={10}
            />
            {error && <p className="text-xs text-destructive">{error}</p>}
            <div className="flex justify-end gap-2">
              <Button
                variant="outline"
                onClick={() => {
                  setShowForm(false)
                  setTitle('')
                  setText('')
                  setError(null)
                }}
              >
                {t('common.cancel')}
              </Button>
              <Button onClick={() => void indexDocument()} disabled={busy}>
                {busy ? t('knowledge.indexing') : t('common.save')}
              </Button>
            </div>
          </div>
        )}

        {documents.length === 0 && !showForm && (
          <p className="rounded-xl border border-dashed border-border p-8 text-center text-sm text-muted-foreground">
            {t('knowledge.empty')}
          </p>
        )}

        <div className="space-y-3">
          {documents.map((document) => (
            <div key={document.id} className="flex items-start justify-between gap-4 rounded-xl border border-border bg-card p-5">
              <div className="min-w-0">
                <p className="truncate text-sm font-medium">{document.title}</p>
                <p className="mt-1 text-xs text-muted-foreground">
                  {t('knowledge.charsLabel', { count: document.charCount })} · {t('knowledge.chunksLabel', { count: document.chunkCount })}
                </p>
              </div>
              <Button variant="ghost" size="sm" onClick={() => void removeDocument(document.id)}>
                {t('common.delete')}
              </Button>
            </div>
          ))}
        </div>

        {documents.length > 0 && (
          <div className="space-y-3 rounded-xl border border-border bg-card p-5">
            <h2 className="text-sm font-semibold">{t('knowledge.searchTitle')}</h2>
            <div className="flex gap-2">
              <Input
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                onKeyDown={(event) => {
                  if (event.key === 'Enter') void runSearch()
                }}
                placeholder={t('knowledge.searchPlaceholder')}
                aria-label={t('knowledge.searchTitle')}
              />
              <Button variant="outline" onClick={() => void runSearch()} disabled={searching}>
                <Search size={14} aria-hidden="true" />
                {searching ? t('knowledge.searching') : t('knowledge.search')}
              </Button>
            </div>
            <p className="text-xs text-muted-foreground">{t('knowledge.searchHint')}</p>
            {searchError && <p className="text-xs text-destructive">{searchError}</p>}
            {hits !== null && (
              <div className="space-y-2">
                {hits.length === 0 && <p className="text-sm text-muted-foreground">{t('knowledge.noHits')}</p>}
                {hits.map((hit) => (
                  <div key={hit.chunkId} className="rounded-lg border border-border bg-muted/40 p-3">
                    <p className="text-xs font-medium text-muted-foreground">
                      {t('knowledge.hitMeta', { title: hit.documentTitle, ordinal: hit.ordinal, distance: hit.distance.toFixed(3) })}
                    </p>
                    <p className="mt-1 whitespace-pre-line text-sm">{hit.text}</p>
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
