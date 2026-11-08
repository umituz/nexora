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
import { chatRouter } from './routes/chat'
import { usageRouter } from './routes/usage'
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
    ['/', chatRouter],
    ['/', attachmentsRouter],
    ['/usage', usageRouter],
    ['/auth', authRouter],
  ],
})
