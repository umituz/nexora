import { createApi } from '@umituz/web-hono'
import type { Env } from './env'
import { conversationsRouter } from './routes/conversations'
import { modelsRouter } from './routes/models'
import { projectsRouter } from './routes/projects'
import { memoriesRouter } from './routes/memories'
import { attachmentsRouter } from './routes/attachments'
import { artifactsRouter } from './routes/artifacts'
import { agentsRouter } from './routes/agents'
import { toolsRouter } from './routes/tools'
import { documentsRouter } from './routes/documents'
import { tasksRouter } from './routes/tasks'
import { researchRouter } from './routes/research'
import { codeArtifactsRouter } from './routes/code-artifacts'
import { audioRouter } from './routes/audio'
import { chatRouter } from './routes/chat'
import { usageRouter } from './routes/usage'
import { apiKeysRouter } from './routes/api-keys'
import { webhooksRouter } from './routes/webhooks'
import { automationsRouter } from './routes/automations'
import { watchlistRouter } from './routes/watchlist'
import { requestsRouter } from './routes/requests'
import { activityRouter } from './routes/activity'
import { notificationsRouter } from './routes/notifications'
import { settingsRouter } from './routes/settings'
import { profileRouter } from './routes/profile'
import { authRouter } from './auth'

declare const __BUILD_MARKER__: string | undefined
const BUILD_MARKER = typeof __BUILD_MARKER__ === 'string' ? __BUILD_MARKER__ : 'nexora-dev'

export default createApi<Env>({
  service: 'nexora-api',
  build: BUILD_MARKER,
  routers: [
    ['/conversations', conversationsRouter],
    ['/models', modelsRouter],
    ['/projects', projectsRouter],
    ['/memories', memoriesRouter],
    ['/artifacts', artifactsRouter],
    ['/agents', agentsRouter],
    ['/tools', toolsRouter],
    ['/documents', documentsRouter],
    ['/tasks', tasksRouter],
    ['/research', researchRouter],
    ['/code-artifacts', codeArtifactsRouter],
    ['/', audioRouter],
    ['/', chatRouter],
    ['/', attachmentsRouter],
    ['/usage', usageRouter],
    ['/api-keys', apiKeysRouter],
    ['/webhooks', webhooksRouter],
    ['/automations', automationsRouter],
    ['/watchlist', watchlistRouter],
    ['/requests', requestsRouter],
    ['/activity', activityRouter],
    ['/notifications', notificationsRouter],
    ['/settings', settingsRouter],
    ['/profile', profileRouter],
    ['/auth', authRouter],
  ],
})
