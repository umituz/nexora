import { createApi } from '@umituz/web-hono'
import type { Env } from './env'
import { conversationsRouter } from './routes/conversations'
import { modelsRouter } from './routes/models'
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
    ['/', chatRouter],
    ['/usage', usageRouter],
    ['/auth', authRouter],
  ],
})
