import { createStore } from '@umituz/web-hono/store'
import { makeStoreHooks } from '@umituz/web-hono/store/react'
import type { PublicModel, UsageSummary } from '@shared/ai/contracts'
import type { ConversationRow } from './chatTypes'

interface NexoraDatabase {
  conversations: ConversationRow[]
  models: PublicModel[]
  usage: UsageSummary
}

export const store = createStore<NexoraDatabase>({
  endpoints: {
    conversations: '/api/conversations',
    models: '/api/models',
    usage: '/api/usage/summary',
  },
  empty: () => ({
    conversations: [],
    models: [],
    usage: { requests: 0, inputTokens: 0, outputTokens: 0, costMicros: 0 },
  }),
})

export const { useCollection, useHydration, useQuery, useDbValue } = makeStoreHooks(store)
