import type { ReactNode } from 'react'
import { Link } from 'react-router'
import { usePageTitle } from '@umituz/web-dashboard'
import { Badge } from '@umituz/web-design-system'
import { Bot, Coins, FileCode2, FolderKanban, KeyRound, BookOpen, Brain, Image, MessagesSquare, ScrollText, Telescope } from 'lucide-react'
import { useCollection } from '@/data/store'
import { useT } from '@/i18n'
import { formatCompact, formatCost, formatDate } from '@/lib/format'

export default function ProfilePage(): ReactNode {
  const t = useT()
  const profile = useCollection('profile')
  usePageTitle(t('nav.items.profile'))

  const stats = profile.stats
  const items = [
    { key: 'conversations', label: t('nav.items.chat'), value: formatCompact(stats.conversations), icon: MessagesSquare, to: '/app/chat' },
    { key: 'projects', label: t('nav.items.projects'), value: formatCompact(stats.projects), icon: FolderKanban, to: '/app/projects' },
    { key: 'agents', label: t('nav.items.agents'), value: formatCompact(stats.agents), icon: Bot, to: '/app/agents' },
    { key: 'knowledge', label: t('nav.items.knowledge'), value: formatCompact(stats.documents), icon: BookOpen, to: '/app/knowledge' },
    { key: 'memories', label: t('nav.items.memories'), value: formatCompact(stats.memories), icon: Brain, to: '/app/memories' },
    { key: 'research', label: t('nav.items.research'), value: formatCompact(stats.research), icon: Telescope, to: '/app/research' },
    { key: 'code', label: t('nav.items.code'), value: formatCompact(stats.codeArtifacts), icon: FileCode2, to: '/app/code' },
    { key: 'images', label: t('profile.images'), value: formatCompact(stats.images), icon: Image, to: '/app/studio' },
  ]

  return (
    <div className="udb-fill-page overflow-y-auto">
      <div className="mx-auto w-full max-w-3xl space-y-6">
        <section className="flex items-center gap-4 rounded-xl border border-border bg-card p-6">
          <span className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-[#2563eb] to-[#7c3aed] text-xl font-bold text-white">
            {(profile.name ?? profile.email).slice(0, 2).toUpperCase()}
          </span>
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <h1 className="truncate text-xl font-bold tracking-tight">{profile.name ?? profile.email}</h1>
              <Badge tone="primary">{t('profile.memberBadge')}</Badge>
            </div>
            <p className="truncate text-sm text-muted-foreground">{profile.email}</p>
            {profile.createdAt && (
              <p className="mt-1 text-xs text-muted-foreground">{t('profile.joined')} {formatDate(profile.createdAt)}</p>
            )}
          </div>
        </section>

        <section className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          {items.map((item) => {
            const Icon = item.icon
            return (
              <Link
                key={item.key}
                to={item.to}
                className="rounded-xl border border-border bg-card p-4 transition hover:border-primary/40 hover:bg-accent/40"
              >
                <Icon size={16} className="text-muted-foreground" aria-hidden="true" />
                <p className="mt-2 text-xl font-semibold tabular-nums">{item.value}</p>
                <p className="text-xs text-muted-foreground">{item.label}</p>
              </Link>
            )
          })}
        </section>

        <section className="rounded-xl border border-border bg-card p-5">
          <div className="flex items-center gap-2 text-sm font-semibold">
            <Coins size={15} aria-hidden="true" />
            {t('profile.usageTitle')}
          </div>
          <dl className="mt-3 grid gap-3 text-sm sm:grid-cols-2">
            <div className="flex items-center justify-between gap-2 rounded-lg bg-muted/40 px-3 py-2">
              <dt className="text-muted-foreground">{t('usage.requests')}</dt>
              <dd className="font-semibold tabular-nums">{formatCompact(stats.requests)}</dd>
            </div>
            <div className="flex items-center justify-between gap-2 rounded-lg bg-muted/40 px-3 py-2">
              <dt className="text-muted-foreground">{t('usage.tokens')}</dt>
              <dd className="font-semibold tabular-nums">
                {formatCompact(stats.inputTokens + stats.outputTokens)}
              </dd>
            </div>
            <div className="flex items-center justify-between gap-2 rounded-lg bg-muted/40 px-3 py-2">
              <dt className="text-muted-foreground">{t('usage.cost')}</dt>
              <dd className="font-semibold tabular-nums">{formatCost(stats.costMicros)}</dd>
            </div>
            <div className="flex items-center justify-between gap-2 rounded-lg bg-muted/40 px-3 py-2">
              <dt className="text-muted-foreground">{t('nav.items.apiKeys')}</dt>
              <dd className="flex items-center gap-1 font-semibold tabular-nums">
                <KeyRound size={13} aria-hidden="true" />
                {formatCompact(stats.apiKeys)}
              </dd>
            </div>
          </dl>
          <Link
            to="/app/activity"
            className="mt-4 inline-flex items-center gap-1.5 text-xs font-medium text-primary hover:underline"
          >
            <ScrollText size={13} aria-hidden="true" />
            {t('profile.viewActivity')}
          </Link>
        </section>
      </div>
    </div>
  )
}
