import { createStore } from '@umituz/web-hono/store'
import { makeStoreHooks } from '@umituz/web-hono/store/react'
import type { PublicModel, UsageBreakdown, UsageSummary } from '@shared/ai/contracts'
import type { AgentRow, ArtifactRow, ConversationRow, DocumentRow, MemoryRow, ProjectRow, ToolRow } from './chatTypes'

interface NexoraDatabase {
  conversations: ConversationRow[]
  models: PublicModel[]
  projects: ProjectRow[]
  memories: MemoryRow[]
  artifacts: ArtifactRow[]
  agents: AgentRow[]
  tools: ToolRow[]
  documents: DocumentRow[]
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
    agents: '/api/agents',
    tools: '/api/tools',
    documents: '/api/documents',
    usage: '/api/usage/summary',
    usageBreakdown: '/api/usage/breakdown',
  },
  empty: () => ({
    conversations: [],
    models: [],
    projects: [],
    memories: [],
    artifacts: [],
    agents: [],
    tools: [],
    documents: [],
    usage: { requests: 0, inputTokens: 0, outputTokens: 0, costMicros: 0 },
    usageBreakdown: { models: [], conversations: [] },
  }),
})

export const { useCollection, useHydration, useQuery, useDbValue } = makeStoreHooks(store)
