import { Hono } from 'hono'
import { validator } from 'hono/validator'
import { and, desc, eq, isNull } from 'drizzle-orm'
import { ApiError, stampUpdate, uid } from '@umituz/web-hono'
import { validateJson } from '@umituz/web-hono/validator'
import { z } from 'zod'
import type { Env } from '../env'
import { getDb } from '../db'
import { apiKeys } from '../schema'
import { requireUser } from '../session'
import { logActivity } from '../activity-log'

export const apiKeysRouter = new Hono<{ Bindings: Env }>()

const KEY_ALPHABET = 'abcdefghijklmnopqrstuvwxyz0123456789'
const KEY_RANDOM_LENGTH = 36

function generateKey(): string {
  const bytes = crypto.getRandomValues(new Uint8Array(KEY_RANDOM_LENGTH))
  let random = ''
  for (const byte of bytes) random += KEY_ALPHABET[byte % KEY_ALPHABET.length]
  return `nx_${random}`
}

async function sha256Hex(value: string): Promise<string> {
  const digest = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(value))
  return Array.from(new Uint8Array(digest), (byte) => byte.toString(16).padStart(2, '0')).join('')
}

const createSchema = z.object({
  name: z.string().min(1).max(120),
})

const patchSchema = z.object({
  name: z.string().min(1).max(120),
})

const LIST_COLUMNS = {
  id: apiKeys.id,
  name: apiKeys.name,
  prefix: apiKeys.prefix,
  lastFour: apiKeys.lastFour,
  createdAt: apiKeys.createdAt,
  lastUsedAt: apiKeys.lastUsedAt,
  revokedAt: apiKeys.revokedAt,
}

apiKeysRouter.get('/', async (c) => {
  const user = await requireUser(c)
  const db = getDb(c.env)
  const rows = await db
    .select(LIST_COLUMNS)
    .from(apiKeys)
    .where(and(eq(apiKeys.userId, user.id), isNull(apiKeys.deletedAt)))
    .orderBy(desc(apiKeys.createdAt))
  return c.json(rows)
})

apiKeysRouter.post(
  '/',
  validator('json', validateJson(createSchema, 'Invalid API key payload')),
  async (c) => {
    const user = await requireUser(c)
    const db = getDb(c.env)
    const body = c.req.valid('json')

    const key = generateKey()
    const keyHash = await sha256Hex(key)
    const [row] = await db
      .insert(apiKeys)
      .values({
        id: uid('key'),
        userId: user.id,
        name: body.name,
        prefix: key.slice(0, 11),
        lastFour: key.slice(-4),
        keyHash,
      })
      .returning(LIST_COLUMNS)
    await logActivity(db, user.id, 'api_key.create', { type: 'api_key', id: row.id, label: body.name })
    return c.json({ ...row, key }, 201)
  },
)

apiKeysRouter.patch(
  '/:id',
  validator('json', validateJson(patchSchema, 'Invalid API key payload')),
  async (c) => {
    const user = await requireUser(c)
    const db = getDb(c.env)
    const id = c.req.param('id')
    const body = c.req.valid('json')

    const [row] = await db
      .update(apiKeys)
      .set({ name: body.name, ...stampUpdate(apiKeys) })
      .where(and(eq(apiKeys.id, id), eq(apiKeys.userId, user.id), isNull(apiKeys.revokedAt), isNull(apiKeys.deletedAt)))
      .returning(LIST_COLUMNS)
    if (!row) throw ApiError.notFound('API key')
    await logActivity(db, user.id, 'api_key.update', { type: 'api_key', id, label: body.name })
    return c.json(row)
  },
)

apiKeysRouter.delete('/:id', async (c) => {
  const user = await requireUser(c)
  const db = getDb(c.env)
  const id = c.req.param('id')

  const [row] = await db
    .update(apiKeys)
    .set({ revokedAt: new Date(), ...stampUpdate(apiKeys) })
    .where(and(eq(apiKeys.id, id), eq(apiKeys.userId, user.id), isNull(apiKeys.revokedAt), isNull(apiKeys.deletedAt)))
    .returning(LIST_COLUMNS)
  if (!row) throw ApiError.notFound('API key')
  await logActivity(db, user.id, 'api_key.revoke', { type: 'api_key', id, label: row.name })
  return c.json({ id: row.id })
})
