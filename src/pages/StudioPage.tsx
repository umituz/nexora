import { useCallback, useEffect, useState } from 'react'
import type { ReactNode } from 'react'
import { usePageTitle } from '@umituz/web-dashboard'
import { ApiClientError, apiFetch } from '@umituz/web-hono/client'
import { Button, NativeSelect, Textarea } from '@umituz/web-design-system'
import type { NativeSelectOption } from '@umituz/web-design-system'
import { Copy, Download, Loader2, Sparkles, Trash2 } from 'lucide-react'
import type { PublicModel } from '@shared/ai/contracts'
import type { ArtifactRow } from '@/data/chatTypes'
import { store, useCollection } from '@/data/store'
import { useT } from '@/i18n'

const SIZES = ['1024x1024', '1536x1024', '1024x1536'] as const
const QUALITIES = ['auto', 'low', 'medium', 'high', 'xhigh', 'max'] as const

const SIZE_LABELS: Record<(typeof SIZES)[number], string> = {
  '1024x1024': 'studio.sizeSquare',
  '1536x1024': 'studio.sizeLandscape',
  '1024x1536': 'studio.sizePortrait',
}

export default function StudioPage(): ReactNode {
  const t = useT()
  const models = useCollection('models')
  const artifacts = useCollection('artifacts')
  usePageTitle(t('nav.items.studio'))

  const imageModels = models.filter((model) => model.outputTypes.includes('image'))
  const [selectedModelId, setSelectedModelId] = useState<string | null>(null)
  const [prompt, setPrompt] = useState('')
  const [size, setSize] = useState<string>('1024x1024')
  const [quality, setQuality] = useState<string>('auto')
  const [generating, setGenerating] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    setSelectedModelId((current) => current ?? imageModels[0]?.id ?? null)
  }, [imageModels])

  const generate = useCallback(async () => {
    const trimmed = prompt.trim()
    if (trimmed.length === 0 || generating) return
    setGenerating(true)
    setError(null)
    try {
      await apiFetch<ArtifactRow>('/api/artifacts', {
        method: 'POST',
        json: {
          prompt: trimmed,
          ...(selectedModelId ? { modelId: selectedModelId } : {}),
          size,
          quality,
        },
      })
      setPrompt('')
      await store.refresh(['artifacts', 'usage', 'usageBreakdown'])
    } catch (err) {
      setError(err instanceof ApiClientError ? err.message : t('studio.generateFailed'))
    } finally {
      setGenerating(false)
    }
  }, [generating, prompt, quality, selectedModelId, size, t])

  const variation = useCallback(
    async (artifact: ArtifactRow) => {
      if (generating) return
      setGenerating(true)
      setError(null)
      try {
        await apiFetch<ArtifactRow>('/api/artifacts', {
          method: 'POST',
          json: { basedOnId: artifact.id },
        })
        await store.refresh(['artifacts', 'usage', 'usageBreakdown'])
      } catch (err) {
        setError(err instanceof ApiClientError ? err.message : t('studio.generateFailed'))
      } finally {
        setGenerating(false)
      }
    },
    [generating, t],
  )

  const remove = useCallback(async (id: string) => {
    try {
      await apiFetch(`/api/artifacts/${id}`, { method: 'DELETE' })
      await store.refresh(['artifacts'])
    } catch {
      return
    }
  }, [])

  const modelOptions: NativeSelectOption[] = imageModels.map((model: PublicModel) => ({
    value: model.id,
    label: model.displayName,
  }))
  const sizeOptions: NativeSelectOption[] = SIZES.map((value) => ({ value, label: t(SIZE_LABELS[value]) }))
  const qualityOptions: NativeSelectOption[] = QUALITIES.map((value) => ({ value, label: value }))

  return (
    <div className="nexora-fill overflow-y-auto">
      <div className="mx-auto w-full max-w-4xl space-y-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">{t('studio.title')}</h1>
          <p className="mt-1 text-sm text-muted-foreground">{t('studio.subtitle')}</p>
        </div>

        {imageModels.length > 0 ? (
          <div className="space-y-3 rounded-xl border border-border bg-card p-5">
            <Textarea
              value={prompt}
              onChange={(event) => setPrompt(event.target.value)}
              placeholder={t('studio.promptPlaceholder')}
              rows={3}
              maxLength={4000}
              disabled={generating}
              aria-label={t('studio.promptLabel')}
            />
            <div className="flex flex-wrap items-end gap-3">
              <div className="flex min-w-44 flex-col gap-1">
                <label className="text-xs font-medium text-muted-foreground">{t('studio.model')}</label>
                <NativeSelect
                  options={modelOptions}
                  value={selectedModelId ?? ''}
                  onChange={(event) => setSelectedModelId(event.target.value || null)}
                  disabled={generating}
                  aria-label={t('studio.model')}
                />
              </div>
              <div className="flex min-w-36 flex-col gap-1">
                <label className="text-xs font-medium text-muted-foreground">{t('studio.size')}</label>
                <NativeSelect
                  options={sizeOptions}
                  value={size}
                  onChange={(event) => setSize(event.target.value)}
                  disabled={generating}
                  aria-label={t('studio.size')}
                />
              </div>
              <div className="flex min-w-28 flex-col gap-1">
                <label className="text-xs font-medium text-muted-foreground">{t('studio.quality')}</label>
                <NativeSelect
                  options={qualityOptions}
                  value={quality}
                  onChange={(event) => setQuality(event.target.value)}
                  disabled={generating}
                  aria-label={t('studio.quality')}
                />
              </div>
              <Button onClick={() => void generate()} disabled={generating || prompt.trim().length === 0}>
                {generating ? <Loader2 size={14} className="animate-spin" aria-hidden="true" /> : <Sparkles size={14} aria-hidden="true" />}
                {generating ? t('studio.generating') : t('studio.generate')}
              </Button>
            </div>
            {error ? <p className="text-sm text-destructive">{error}</p> : null}
          </div>
        ) : (
          <p className="rounded-xl border border-dashed border-border p-8 text-center text-sm text-muted-foreground">
            {t('studio.noModel')}
          </p>
        )}

        {artifacts.length > 0 ? (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {artifacts.map((artifact: ArtifactRow) => (
              <figure key={artifact.id} className="overflow-hidden rounded-xl border border-border bg-card">
                <img
                  src={`/api/artifacts/${artifact.id}/image`}
                  alt={artifact.prompt.slice(0, 120)}
                  className="aspect-square w-full bg-muted object-cover"
                  loading="lazy"
                />
                <figcaption className="space-y-2 p-3">
                  <p className="line-clamp-2 text-xs text-muted-foreground" title={artifact.prompt}>
                    {artifact.prompt}
                  </p>
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] text-muted-foreground">
                      {artifact.size} · {artifact.quality}
                      {artifact.version > 1 ? ` · ${t('studio.version', { version: artifact.version })}` : ''}
                    </span>
                    <div className="flex gap-1">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => void variation(artifact)}
                        disabled={generating || imageModels.length === 0}
                        aria-label={t('studio.variation')}
                        title={t('studio.variation')}
                      >
                        <Copy size={13} aria-hidden="true" />
                      </Button>
                      <a
                        href={`/api/artifacts/${artifact.id}/download`}
                        className="inline-flex h-7 w-7 items-center justify-center rounded-md text-muted-foreground transition hover:bg-accent hover:text-foreground"
                        aria-label={t('studio.download')}
                        title={t('studio.download')}
                      >
                        <Download size={13} aria-hidden="true" />
                      </a>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => void remove(artifact.id)}
                        aria-label={t('studio.delete')}
                        title={t('studio.delete')}
                      >
                        <Trash2 size={13} aria-hidden="true" />
                      </Button>
                    </div>
                  </div>
                </figcaption>
              </figure>
            ))}
          </div>
        ) : (
          <p className="rounded-xl border border-dashed border-border p-8 text-center text-sm text-muted-foreground">
            {t('studio.empty')}
          </p>
        )}
      </div>
    </div>
  )
}
