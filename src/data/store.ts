import { createStore } from '@umituz/web-hono/store'
import { makeStoreHooks } from '@umituz/web-hono/store/react'
import type { PublicModel, UsageBreakdown, UsageSummary } from '@shared/ai/contracts'
import type { ArtifactRow, ConversationRow, MemoryRow, ProjectRow } from './chatTypes'

interface NexoraDatabase {
  conversations: ConversationRow[]
  models: PublicModel[]
  projects: ProjectRow[]
  memories: MemoryRow[]
  artifacts: ArtifactRow[]
  usage: UsageSummary
  usageBreakdown: UsageBreakdown
}

export const store = createStore<NexoraDatabase>({
  endpoints: {
    conversations: '/api/conversations',
    models: '/api/models',
    projects: '/api/projects',
    memories: '/api/memories',
    artifacts: '/api/artifacts',
    usage: '/api/usage/summary',
    usageBreakdown: '/api/usage/breakdown',
  },
  empty: () => ({
    conversations: [],
    models: [],
    projects: [],
    memories: [],
    artifacts: [],
    usage: { requests: 0, inputTokens: 0, outputTokens: 0, costMicros: 0 },
    usageBreakdown: { models: [], conversations: [] },
  }),
})

export const { useCollection, useHydration, useQuery, useDbValue } = makeStoreHooks(store)
