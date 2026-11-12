import type { Context } from 'hono'
import { eq } from 'drizzle-orm'
import { ApiError } from '@umituz/web-hono'
import { createSessionHelpers, type SessionUserInfo } from '@umituz/web-hono/auth'
import { getAuth } from './auth'
import { getDb } from './db'
import { apiKeys, baUser } from './schema'
import type { Env } from './env'

type RequestContext = Context<{ Bindings: Env }>

const helpers = createSessionHelpers<Env>(getAuth)

export const scopeOf = (c: RequestContext) => helpers.scopeOf(c)
export const currentUser = (c: RequestContext) => helpers.currentUser(c)

async function sha256Hex(value: string): Promise<string> {
  const digest = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(value))
  return Array.from(new Uint8Array(digest), (byte) => byte.toString(16).padStart(2, '0')).join('')
}

async function userById(db: ReturnType<typeof getDb>, userId: string): Promise<SessionUserInfo | null> {
  const [row] = await db
    .select({ id: baUser.id, email: baUser.email, name: baUser.name })
    .from(baUser)
    .where(eq(baUser.id, userId))
    .limit(1)
  return row ?? null
}

async function bearerUser(c: RequestContext): Promise<SessionUserInfo | null> {
  const header = c.req.header('authorization')
  if (!header?.startsWith('Bearer nx_')) return null

  const keyHash = await sha256Hex(header.slice('Bearer '.length).trim())
  const db = getDb(c.env)
  const [row] = await db
    .select({ id: apiKeys.id, userId: apiKeys.userId, revokedAt: apiKeys.revokedAt, deletedAt: apiKeys.deletedAt })
    .from(apiKeys)
    .where(eq(apiKeys.keyHash, keyHash))
    .limit(1)
  if (!row || row.revokedAt || row.deletedAt) throw new ApiError(401, 'Invalid API key')
  const user = await userById(db, row.userId)
  if (!user) throw new ApiError(401, 'Invalid API key')
  await db.update(apiKeys).set({ lastUsedAt: new Date() }).where(eq(apiKeys.id, row.id))
  return user
}

export async function requireUser(c: RequestContext): Promise<SessionUserInfo> {
  const bearer = await bearerUser(c)
  if (bearer) return bearer
  const user = await helpers.currentUser(c)
  if (!user) throw new ApiError(401, 'Authentication required')
  return user
}
