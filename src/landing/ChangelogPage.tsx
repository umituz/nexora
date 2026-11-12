import type { ReactNode } from 'react'
import { PublicSiteLayout } from '@umituz/web-landing'
import { Badge } from '@umituz/web-design-system'
import { Timeline } from '@umituz/web-design-system/organisms'
import type { TimelineItem } from '@umituz/web-design-system/organisms'
import { useT } from '@/i18n'
import { useLandingConfig } from './landing.config'

const MILESTONES = [
  {
    version: 'v1.4',
    name: 'Developer platform',
    type: 'platform',
    changes: [
      'API keys for programmatic access with bearer authentication',
      'Background task monitoring with cancel and retry',
      'In-app notifications for indexing, research, and task outcomes',
      'Workspace activity log, profile, and settings',
      'Agent templates for quick setup',
    ],
  },
  {
    version: 'v1.3',
    name: 'Multimodal',
    type: 'major',
    changes: [
      'Image understanding, audio transcription, and text-to-speech',
      'Self-hosted OpenAI-compatible endpoints onboarding with zero code changes',
    ],
  },
  {
    version: 'v1.2',
    name: 'Research and automation',
    type: 'feature',
    changes: [
      'Code workspace: snippets, multi-file context, diffs, versioning',
      'Research workflows with web search and cited briefs',
      'Knowledge indexing with pgvector semantic retrieval',
      'Task engine with retries, backoff, and logs',
    ],
  },
  {
    version: 'v1.1',
    name: 'Agents and Studio',
    type: 'feature',
    changes: [
      'Agents with standing instructions, model and tool bindings',
      'Approval-gated tool execution with history',
      'AI Studio image generation with artifact versioning',
      'Extended capability registry: vision, tools, reasoning',
    ],
  },
  {
    version: 'v1.0',
    name: 'Core chat',
    type: 'launch',
    changes: [
      'Streaming chat with reasoning and answer channels',
      'Multi-provider model registry (Groq live; OpenAI, Anthropic adapters)',
      'Projects, memory, and attachments in the context engine',
      'Per-request usage and cost recording with analytics',
    ],
  },
] as const

export default function ChangelogPage(): ReactNode {
  const t = useT()
  const config = useLandingConfig()

  const items: TimelineItem[] = MILESTONES.map((milestone) => ({
    at: milestone.version,
    meta: <span className="font-mono font-semibold">{milestone.version}</span>,
    title: (
      <span className="flex flex-wrap items-center gap-2">
        <span>{milestone.name}</span>
        <Badge tone={milestone.type === 'launch' ? 'primary' : milestone.type === 'major' ? 'violet' : 'info'}>
          {t(`changelog.types.${milestone.type}`)}
        </Badge>
      </span>
    ),
    body: (
      <ul className="mt-1 space-y-1">
        {milestone.changes.map((change) => (
          <li key={change} className="text-sm text-muted-foreground">
            · {change}
          </li>
        ))}
      </ul>
    ),
    tone: milestone.type === 'launch' ? 'primary' : milestone.type === 'major' ? 'violet' : 'info',
  }))

  return (
    <PublicSiteLayout config={config}>
      <section className="mx-auto max-w-3xl px-6 py-20">
        <div className="mb-12 text-center">
          <h1 className="text-4xl font-bold tracking-tight">{t('changelog.title')}</h1>
          <p className="mt-3 text-muted-foreground">{t('changelog.subtitle')}</p>
        </div>
        <Timeline items={items} newestFirst={false} />
      </section>
    </PublicSiteLayout>
  )
}
