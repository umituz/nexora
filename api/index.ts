import { createApi } from '@umituz/web-hono'
import type { Env } from './env'
import { conversationsRouter } from './routes/conversations'
import { modelsRouter } from './routes/models'
import { projectsRouter } from './routes/projects'
import { attachmentsRouter } from './routes/attachments'
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
    ['/', chatRouter],
    ['/', attachmentsRouter],
    ['/usage', usageRouter],
    ['/auth', authRouter],
  ],
})
