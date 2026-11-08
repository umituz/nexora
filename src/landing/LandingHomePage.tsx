import type { ReactNode } from 'react'
import { Link } from 'react-router'
import { PublicSiteLayout } from '@umituz/web-landing'
import { BadgeCheck, Coins, Database, Layers, ShieldCheck, Zap } from 'lucide-react'
import { Button } from '@umituz/web-design-system'
import { useT } from '@/i18n'
import { useLandingConfig } from './landing.config'

const FEATURE_ICONS = {
  multiProvider: Database,
  streaming: Zap,
  costs: Coins,
  memory: Layers,
  privacy: ShieldCheck,
  roadmap: BadgeCheck,
} as const

export default function LandingHomePage(): ReactNode {
  const config = useLandingConfig()
  const t = useT()

  return (
    <PublicSiteLayout config={config}>
      <section className="mx-auto flex max-w-3xl flex-col items-center px-6 py-24 text-center">
        <p className="mb-4 inline-flex rounded-full border border-border bg-card px-3 py-1 text-xs font-medium text-muted-foreground">
          {t('landing.heroBadge')}
        </p>
        <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">{t('landing.heroTitle')}</h1>
        <p className="mt-5 text-balance text-lg text-muted-foreground">{t('landing.heroSubtitle')}</p>
        <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
          <Button asChild size="lg">
            <Link to="/login?mode=register">{t('landing.heroCta')}</Link>
          </Button>
          <Button asChild variant="outline" size="lg">
            <Link to="/login">{t('landing.heroSecondary')}</Link>
          </Button>
        </div>
      </section>

      <section className="mx-auto max-w-5xl px-6 pb-24">
        <div className="mb-10 text-center">
          <h2 className="text-2xl font-semibold sm:text-3xl">{t('landing.featuresTitle')}</h2>
          <p className="mt-2 text-muted-foreground">{t('landing.featuresSubtitle')}</p>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {(Object.keys(FEATURE_ICONS) as (keyof typeof FEATURE_ICONS)[]).map((key) => {
            const Icon = FEATURE_ICONS[key]
            return (
              <div key={key} className="rounded-xl border border-border bg-card p-5 text-left">
                <span className="mb-3 inline-flex h-9 w-9 items-center justify-center rounded-lg bg-accent text-accent-foreground">
                  <Icon size={18} aria-hidden="true" />
                </span>
                <h3 className="text-sm font-semibold">{t(`landing.features.${key}.title`)}</h3>
                <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">
                  {t(`landing.features.${key}.body`)}
                </p>
              </div>
            )
          })}
        </div>
      </section>
    </PublicSiteLayout>
  )
}
