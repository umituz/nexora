import { Hono } from 'hono'
import { and, eq } from 'drizzle-orm'
import { ApiError } from '@umituz/web-hono'
import type { Env } from '../env'
import { getDb } from '../db'
import { baSession } from '../schema'
import { getAuth } from '../auth'
import { requireUser } from '../session'
import { logActivity } from '../activity-log'

export const sessionsRouter = new Hono<{ Bindings: Env }>()

const SESSION_COLUMNS = {
  id: baSession.id,
  ipAddress: baSession.ipAddress,
  userAgent: baSession.userAgent,
  createdAt: baSession.createdAt,
  updatedAt: baSession.updatedAt,
  expiresAt: baSession.expiresAt,
}

function describeDevice(userAgent: string | null): string {
  if (!userAgent) return 'Unknown device'
  const os = /Windows/.test(userAgent)
    ? 'Windows'
    : /Android/.test(userAgent)
      ? 'Android'
      : /iPhone|iPad/.test(userAgent)
        ? 'iOS'
        : /Mac OS X|Macintosh/.test(userAgent)
          ? 'macOS'
          : /Linux/.test(userAgent)
            ? 'Linux'
            : 'Unknown OS'
  const browser = /Edg\//.test(userAgent)
    ? 'Edge'
    : /OPR\//.test(userAgent)
      ? 'Opera'
      : /Firefox\//.test(userAgent)
        ? 'Firefox'
        : /Chrome\//.test(userAgent)
          ? 'Chrome'
          : /Safari\//.test(userAgent)
            ? 'Safari'
            : 'Unknown browser'
  return `${browser} on ${os}`
}

async function currentSessionId(c: Parameters<typeof requireUser>[0]): Promise<string | null> {
  const auth = getAuth(c.env)
  const resolved = await auth.api.getSession({ headers: c.req.raw.headers })
  return resolved?.session.id ?? null
}

sessionsRouter.get('/', async (c) => {
  const user = await requireUser(c)
  const db = getDb(c.env)
  const currentId = await currentSessionId(c)

  const rows = await db
    .select(SESSION_COLUMNS)
    .from(baSession)
    .where(eq(baSession.userId, user.id))
    .orderBy(baSession.updatedAt)

  return c.json(
    rows.map((row) => ({
      id: row.id,
      device: describeDevice(row.userAgent),
      ipAddress: row.ipAddress,
      createdAt: row.createdAt.toISOString(),
      updatedAt: row.updatedAt.toISOString(),
      expiresAt: row.expiresAt.toISOString(),
      current: row.id === currentId,
    })),
  )
})

sessionsRouter.delete('/:id', async (c) => {
  const user = await requireUser(c)
  const db = getDb(c.env)

  const [row] = await db
    .select(SESSION_COLUMNS)
    .from(baSession)
    .where(and(eq(baSession.id, c.req.param('id')), eq(baSession.userId, user.id)))
    .limit(1)
  if (!row) throw ApiError.notFound('Session')

  const currentId = await currentSessionId(c)
  if (row.id === currentId) throw ApiError.badRequest('Sign out from the menu to end the current session')

  await db.delete(baSession).where(eq(baSession.id, row.id))
  await logActivity(db, user.id, 'session.revoke', {
    type: 'session',
    id: row.id,
    label: describeDevice(row.userAgent),
  })

  return c.json({ ok: true })
})
