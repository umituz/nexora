import type { RouteMeta } from '@umituz/web-seo'

export const SITE_URL = 'https://nexora.umituz998.workers.dev'

export const SEO_ROUTES: Record<string, RouteMeta> = {
  '/': {
    title: 'Nexora AI',
    description:
      'Nexora AI — a unified workspace for AI conversations, projects, knowledge and agents.',
    og: { siteName: 'Nexora AI' },
  },
  '/features': {
    title: 'Features — Nexora AI',
    description:
      'What the Nexora AI workspace includes — conversations, projects, knowledge, agents and usage.',
    og: { siteName: 'Nexora AI' },
  },
}
