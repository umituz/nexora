import { createStore } from '@umituz/web-hono/store'
import { makeStoreHooks } from '@umituz/web-hono/store/react'
import type { PublicModel, UsageSummary } from '@shared/ai/contracts'
import type { ConversationRow, MemoryRow, ProjectRow } from './chatTypes'

interface NexoraDatabase {
  conversations: ConversationRow[]
  models: PublicModel[]
  projects: ProjectRow[]
  memories: MemoryRow[]
  usage: UsageSummary
}

export const store = createStore<NexoraDatabase>({
  endpoints: {
    conversations: '/api/conversations',
    models: '/api/models',
    projects: '/api/projects',
    memories: '/api/memories',
    usage: '/api/usage/summary',
  },
  empty: () => ({
    conversations: [],
    models: [],
    projects: [],
    memories: [],
    usage: { requests: 0, inputTokens: 0, outputTokens: 0, costMicros: 0 },
  }),
})

export const { useCollection, useHydration, useQuery, useDbValue } = makeStoreHooks(store)
