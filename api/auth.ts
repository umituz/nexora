import { Hono } from 'hono'
import { createAuthGetter } from '@umituz/web-hono/auth'
import { getDb } from './db'
import { ba } from './schema'
import type { Env } from './env'

const LOCAL_ORIGINS = [
  'http://localhost:5190',
  'http://127.0.0.1:5190',
  'http://localhost:8792',
  'http://127.0.0.1:8792',
]

function trustedOriginsFor(env: Env): string[] {
  const base = (env.BETTER_AUTH_URL ?? '').trim()
  if (!base) return LOCAL_ORIGINS
  try {
    const url = new URL(base)
    if (url.hostname === 'localhost' || url.hostname === '127.0.0.1') return LOCAL_ORIGINS
    return [url.origin]
  } catch {
    return []
  }
}

let trustedOrigins: string[] = LOCAL_ORIGINS

const rawGetAuth = createAuthGetter<Env>({
  db: getDb,
  tables: ba,
  get trustedOrigins() {
    return trustedOrigins
  },
})

export const getAuth = (env: Env) => {
  trustedOrigins = trustedOriginsFor(env)
  return rawGetAuth(env)
}

export const authRouter = new Hono<{ Bindings: Env }>()

authRouter.all('*', (c) => getAuth(c.env).handler(c.req.raw))
