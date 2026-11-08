import { Hono } from 'hono'
import { and, asc, desc, eq, isNull, sql } from 'drizzle-orm'
import { stampUpdate, uid } from '@umituz/web-hono'
import { validator } from 'hono/validator'
import { validateJson } from '@umituz/web-hono/validator'
import { z } from 'zod'
import type { Env } from '../env'
import { getDb } from '../db'
import { codeArtifacts, conversations, tn } from '../schema'
import { requireUser } from '../session'

export const CODE_TITLE_MAX = 200
export const CODE_LANGUAGE_MAX = 24
export const CODE_CONTENT_LIMIT = 100_000

const LANGUAGE_PATTERN = /^[a-z0-9+#.-]*$/

export const codeArtifactsRouter = new Hono<{ Bindings: Env }>()

const createSchema = z.object({
  title: z.string().min(1).max(CODE_TITLE_MAX).optional(),
  language: z.string().max(CODE_LANGUAGE_MAX).optional(),
  content: z
    .string()
    .min(1)
    .max(CODE_CONTENT_LIMIT)
    .refine((value) => value.trim().length > 0, 'Content must not be blank'),
  conversationId: z.string().optional(),
  basedOnId: z.string().optional(),
})

function normalizeLanguage(value: string | undefined): string {
  const normalized = (value ?? '').trim().toLowerCase()
  if (normalized.length === 0) return 'text'
  if (!LANGUAGE_PATTERN.test(normalized)) return 'text'
  return normalized
}

const META_COLUMNS = {
  id: codeArtifacts.id,
  conversationId: codeArtifacts.conversationId,
  title: codeArtifacts.title,
  language: codeArtifacts.language,
  rootId: codeArtifacts.rootId,
  version: codeArtifacts.version,
  charCount: sql<number>`char_length(${codeArtifacts.content})`,
  createdAt: codeArtifacts.createdAt,
  updatedAt: codeArtifacts.updatedAt,
}

interface CodeArtifactMeta {
  id: string
  conversationId: string | null
  title: string
  language: string
  rootId: string
  version: number
  charCount: number
  createdAt: Date
  updatedAt: Date
}

codeArtifactsRouter.post('/', validator('json', validateJson(createSchema, 'Invalid code artifact payload')), async (c) => {
  const user = await requireUser(c)
  const db = getDb(c.env)
  const body = c.req.valid('json')

  if (body.conversationId) {
    const [conversation] = await db
      .select({ id: conversations.id })
      .from(conversations)
      .where(and(eq(conversations.id, body.conversationId), eq(conversations.userId, user.id), isNull(conversations.deletedAt)))
      .limit(1)
    if (!conversation) return c.json({ error: 'Conversation not found' }, 404)
  }

  let rootId: string | null = null
  let version = 1
  let title = body.title?.trim()
  let language = normalizeLanguage(body.language)
  let inheritedConversationId: string | null = null

  if (body.basedOnId) {
    const [base] = await db
      .select()
      .from(codeArtifacts)
      .where(and(eq(codeArtifacts.id, body.basedOnId), eq(codeArtifacts.userId, user.id), isNull(codeArtifacts.deletedAt)))
      .limit(1)
    if (!base) return c.json({ error: 'Code artifact not found' }, 404)

    rootId = base.rootId
    const [latest] = await db
      .select({ version: codeArtifacts.version })
      .from(codeArtifacts)
      .where(and(eq(codeArtifacts.rootId, rootId), isNull(codeArtifacts.deletedAt)))
      .orderBy(desc(codeArtifacts.version))
      .limit(1)
    version = (latest?.version ?? 0) + 1
    title = title && title.length > 0 ? title : base.title
    if (!body.language) language = base.language
    if (!body.conversationId) inheritedConversationId = base.conversationId
  }

  if (!title || title.length === 0) title = 'Snippet'
  const artifactId = uid('code')

  const [row] = await db
    .insert(codeArtifacts)
    .values({
      id: artifactId,
      userId: user.id,
      conversationId: body.conversationId ?? inheritedConversationId,
      title,
      language,
      content: body.content,
      rootId: rootId ?? artifactId,
      version,
    })
    .returning()
  return c.json({ artifact: row }, 201)
})

codeArtifactsRouter.get('/', async (c) => {
  const user = await requireUser(c)
  const db = getDb(c.env)

  const result = await db.execute(sql`
    SELECT DISTINCT ON (root_id) id, conversation_id, title, language, root_id, version,
           char_length(content) AS char_count, created_at, updated_at
    FROM ${sql.raw(tn('code_artifacts'))}
    WHERE user_id = ${user.id} AND deleted_at IS NULL
    ORDER BY root_id, version DESC
  `)
  const rows = ((result as unknown as { rows: Record<string, unknown>[] }).rows ?? []).map((row) => ({
    id: row.id as string,
    conversationId: (row.conversation_id as string | null) ?? null,
    title: row.title as string,
    language: row.language as string,
    rootId: row.root_id as string,
    version: Number(row.version),
    charCount: Number(row.char_count),
    createdAt: row.created_at as Date,
    updatedAt: row.updated_at as Date,
  })) as CodeArtifactMeta[]
  rows.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
  return c.json(rows)
})

codeArtifactsRouter.get('/:id', async (c) => {
  const user = await requireUser(c)
  const db = getDb(c.env)
  const [row] = await db
    .select()
    .from(codeArtifacts)
    .where(and(eq(codeArtifacts.id, c.req.param('id')), eq(codeArtifacts.userId, user.id), isNull(codeArtifacts.deletedAt)))
    .limit(1)
  if (!row) return c.json({ error: 'Code artifact not found' }, 404)
  return c.json(row)
})

codeArtifactsRouter.get('/:id/versions', async (c) => {
  const user = await requireUser(c)
  const db = getDb(c.env)
  const [base] = await db
    .select({ rootId: codeArtifacts.rootId })
    .from(codeArtifacts)
    .where(and(eq(codeArtifacts.id, c.req.param('id')), eq(codeArtifacts.userId, user.id), isNull(codeArtifacts.deletedAt)))
    .limit(1)
  if (!base) return c.json({ error: 'Code artifact not found' }, 404)

  const rows = await db
    .select(META_COLUMNS)
    .from(codeArtifacts)
    .where(and(eq(codeArtifacts.rootId, base.rootId), eq(codeArtifacts.userId, user.id), isNull(codeArtifacts.deletedAt)))
    .orderBy(asc(codeArtifacts.version))
  return c.json(rows)
})

codeArtifactsRouter.delete('/:id', async (c) => {
  const user = await requireUser(c)
  const db = getDb(c.env)
  const [row] = await db
    .update(codeArtifacts)
    .set({ deletedAt: new Date(), ...stampUpdate(codeArtifacts) })
    .where(and(eq(codeArtifacts.id, c.req.param('id')), eq(codeArtifacts.userId, user.id), isNull(codeArtifacts.deletedAt)))
    .returning({ id: codeArtifacts.id })
  if (!row) return c.json({ error: 'Code artifact not found' }, 404)
  return c.json({ ok: true })
})
