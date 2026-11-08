import type { ApiEnv } from '@umituz/web-hono'
import type { getDb } from './db'

export type Env = ApiEnv & {
  BETTER_AUTH_SECRET: string
  BETTER_AUTH_URL?: string
  GROQ_API_KEY?: string
  TAVILY_API_KEY?: string
}

export type Db = ReturnType<typeof getDb>
