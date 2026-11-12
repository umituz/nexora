import { createStore } from '@umituz/web-hono/store'
import { makeStoreHooks } from '@umituz/web-hono/store/react'
import type { PublicModel, UsageBreakdown, UsageSummary } from '@shared/ai/contracts'
import type {
  ActivityRow,
  AgentRow,
  ApiKeyRow,
  ArtifactRow,
  AutomationRow,
  CodeArtifactRow,
  ConversationRow,
  DocumentRow,
  MemoryRow,
  NotificationRow,
  ProfileSummary,
  ProjectRow,
  ResearchRunRow,
  TaskRow,
  ToolRow,
  UserSettings,
  WebhookRow,
  WatchItemRow,
  WatchScanRow,
} from './chatTypes'

interface NexoraDatabase {
  conversations: ConversationRow[]
  models: PublicModel[]
  projects: ProjectRow[]
  memories: MemoryRow[]
  artifacts: ArtifactRow[]
  agents: AgentRow[]
  tools: ToolRow[]
  documents: DocumentRow[]
  research: ResearchRunRow[]
  codeArtifacts: CodeArtifactRow[]
  tasks: TaskRow[]
  apiKeys: ApiKeyRow[]
  webhooks: WebhookRow[]
  automations: AutomationRow[]
  watchlist: WatchItemRow[]
  watchFeed: WatchScanRow[]
  activity: ActivityRow[]
  notifications: NotificationRow[]
  usage: UsageSummary
  usageBreakdown: UsageBreakdown
  settings: UserSettings
  profile: ProfileSummary
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
    research: '/api/research',
    codeArtifacts: '/api/code-artifacts',
    tasks: '/api/tasks',
    apiKeys: '/api/api-keys',
    webhooks: '/api/webhooks',
    automations: '/api/automations',
    watchlist: '/api/watchlist',
    watchFeed: '/api/watchlist/feed',
    activity: '/api/activity',
    notifications: '/api/notifications',
    usage: '/api/usage/summary',
    usageBreakdown: '/api/usage/breakdown',
    settings: '/api/settings',
    profile: '/api/profile',
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
    research: [],
    codeArtifacts: [],
    tasks: [],
    apiKeys: [],
    webhooks: [],
    automations: [],
    watchlist: [],
    watchFeed: [],
    activity: [],
    notifications: [],
    usage: { requests: 0, inputTokens: 0, outputTokens: 0, costMicros: 0 },
    usageBreakdown: { models: [], conversations: [] },
    settings: { defaultModelId: null },
    profile: {
      id: '',
      name: null,
      email: '',
      createdAt: null,
      stats: {
        conversations: 0,
        messages: 0,
        projects: 0,
        agents: 0,
        documents: 0,
        memories: 0,
        research: 0,
        codeArtifacts: 0,
        images: 0,
        apiKeys: 0,
        requests: 0,
        inputTokens: 0,
        outputTokens: 0,
        costMicros: 0,
      },
    },
  }),
})

export const { useCollection, useHydration, useQuery, useDbValue } = makeStoreHooks(store)
