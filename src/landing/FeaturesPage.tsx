import type { ReactNode } from 'react'
import { PublicSiteLayout } from '@umituz/web-landing'
import { useT } from '@/i18n'
import { useLandingConfig } from './landing.config'

export default function FeaturesPage(): ReactNode {
  const config = useLandingConfig()
  const t = useT()

  return (
    <PublicSiteLayout config={config}>
      <section className="mx-auto max-w-5xl px-6 py-24">
        <div className="mb-10 text-center">
          <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">{t('landing.featuresTitle')}</h1>
          <p className="mt-2 text-muted-foreground">{t('landing.featuresSubtitle')}</p>
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          {(
            [
              'multiProvider',
              'streaming',
              'costs',
              'memory',
              'privacy',
              'roadmap',
            ] as const
          ).map((key) => (
            <div key={key} className="rounded-xl border border-border bg-card p-5">
              <h2 className="text-sm font-semibold">{t(`landing.features.${key}.title`)}</h2>
              <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">
                {t(`landing.features.${key}.body`)}
              </p>
            </div>
          ))}
        </div>
      </section>
    </PublicSiteLayout>
  )
}
