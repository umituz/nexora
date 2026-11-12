import { useCallback, useEffect, useState } from 'react'
import type { ReactNode } from 'react'
import { apiFetch } from '@umituz/web-hono/client'
import { usePageTitle } from '@umituz/web-dashboard'
import { useSession } from '@umituz/web-auth/session'
import { useDesignSystem } from '@umituz/web-design-system/providers'
import { Button, Input, NativeSelect, Switch } from '@umituz/web-design-system'
import type { NativeSelectOption } from '@umituz/web-design-system'
import { store, useCollection } from '@/data/store'
import { useT } from '@/i18n'
import { formatDate } from '@/lib/format'

export default function SettingsPage(): ReactNode {
  const t = useT()
  const models = useCollection('models')
  const settings = useCollection('settings')
  const profile = useCollection('profile')
  const { user, logout } = useSession()
  const { mode, toggleMode } = useDesignSystem()
  const [defaultModelId, setDefaultModelId] = useState<string>('')
  const [busy, setBusy] = useState(false)
  const [saved, setSaved] = useState(false)
  usePageTitle(t('nav.items.settings'))

  useEffect(() => {
    setDefaultModelId(settings.defaultModelId ?? '')
    setSaved(false)
  }, [settings.defaultModelId])

  const chatModels = models.filter((model) => model.outputTypes.includes('text'))
  const modelOptions: NativeSelectOption[] = [
    { value: '', label: t('settings.modelWorkspaceDefault') },
    ...chatModels.map((model) => ({ value: model.id, label: model.displayName })),
  ]

  const save = useCallback(async () => {
    setBusy(true)
    try {
      await apiFetch('/api/settings', {
        method: 'PUT',
        json: { defaultModelId: defaultModelId || null },
      })
      await store.refresh(['settings', 'activity'])
      setSaved(true)
    } catch {
      return
    } finally {
      setBusy(false)
    }
  }, [defaultModelId])

  const dirty = (settings.defaultModelId ?? '') !== defaultModelId

  return (
    <div className="udb-fill-page overflow-y-auto">
      <div className="mx-auto w-full max-w-3xl space-y-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">{t('settings.title')}</h1>
          <p className="mt-1 text-sm text-muted-foreground">{t('settings.subtitle')}</p>
        </div>

        <section className="space-y-4 rounded-xl border border-border bg-card p-5">
          <h2 className="text-sm font-semibold">{t('settings.defaultsTitle')}</h2>
          <div className="flex flex-col gap-1">
            <label className="text-xs font-medium text-muted-foreground">{t('settings.defaultModel')}</label>
            <NativeSelect
              options={modelOptions}
              value={defaultModelId}
              onChange={(event) => {
                setDefaultModelId(event.target.value)
                setSaved(false)
              }}
              aria-label={t('settings.defaultModel')}
            />
            <p className="text-[11px] text-muted-foreground">{t('settings.defaultModelHint')}</p>
          </div>
          <div className="flex items-center justify-end gap-3">
            {saved && <span className="text-xs text-muted-foreground">{t('settings.saved')}</span>}
            <Button onClick={() => void save()} disabled={busy || !dirty}>
              {t('common.save')}
            </Button>
          </div>
        </section>

        <section className="space-y-4 rounded-xl border border-border bg-card p-5">
          <h2 className="text-sm font-semibold">{t('settings.appearanceTitle')}</h2>
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-sm">{t('settings.darkMode')}</p>
              <p className="text-xs text-muted-foreground">{t('settings.darkModeHint')}</p>
            </div>
            <Switch
              checked={mode === 'dark'}
              onCheckedChange={toggleMode}
              aria-label={t('settings.darkMode')}
            />
          </div>
        </section>

        <section className="space-y-4 rounded-xl border border-border bg-card p-5">
          <h2 className="text-sm font-semibold">{t('settings.accountTitle')}</h2>
          <div className="grid gap-3 sm:grid-cols-2">
            <div className="flex flex-col gap-1">
              <label className="text-xs font-medium text-muted-foreground">{t('auth.fields.name')}</label>
              <Input value={user?.name ?? ''} readOnly aria-readonly />
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-xs font-medium text-muted-foreground">{t('auth.fields.email')}</label>
              <Input value={user?.email ?? ''} readOnly aria-readonly />
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-xs font-medium text-muted-foreground">{t('settings.memberSince')}</label>
              <Input value={profile.createdAt ? formatDate(profile.createdAt) : '—'} readOnly aria-readonly />
            </div>
          </div>
          <div className="flex justify-end">
            <Button variant="outline" onClick={() => void logout()}>
              {t('common.signOut')}
            </Button>
          </div>
        </section>
      </div>
    </div>
  )
}
