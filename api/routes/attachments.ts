import { Hono } from 'hono'
import { and, asc, eq, isNull } from 'drizzle-orm'
import { ApiError, stampUpdate, uid } from '@umituz/web-hono'
import type { Env } from '../env'
import { getDb } from '../db'
import { AiError } from '../ai/errors'
import { transcribeAudio } from '../ai/audio'
import { attachments, conversations } from '../schema'
import { requireUser } from '../session'
import { capText, extractText, isTextLike, TEXT_EXTRACT_PER_FILE_LIMIT } from '../text-extract'

export const attachmentsRouter = new Hono<{ Bindings: Env }>()

const MAX_UPLOAD_BYTES = 2 * 1024 * 1024

async function ownedConversation(db: ReturnType<typeof getDb>, id: string, userId: string) {
  const [row] = await db
    .select({ id: conversations.id })
    .from(conversations)
    .where(and(eq(conversations.id, id), eq(conversations.userId, userId), isNull(conversations.deletedAt)))
    .limit(1)
  return row
}

function toBase64(bytes: Uint8Array): string {
  let binary = ''
  const chunkSize = 0x8000
  for (let i = 0; i < bytes.length; i += chunkSize) {
    binary += String.fromCharCode(...bytes.subarray(i, i + chunkSize))
  }
  return btoa(binary)
}

function fromBase64(value: string): Uint8Array {
  const binary = atob(value)
  const out = new Uint8Array(binary.length)
  for (let i = 0; i < binary.length; i += 1) out[i] = binary.charCodeAt(i)
  return out
}

attachmentsRouter.post('/conversations/:id/attachments', async (c) => {
  const user = await requireUser(c)
  const db = getDb(c.env)
  const conversationId = c.req.param('id')
  if (!(await ownedConversation(db, conversationId, user.id))) return c.json({ error: 'Conversation not found' }, 404)

  const body = await c.req.parseBody()
  const file = body['file']
  if (!(file instanceof File)) return c.json({ error: 'Expected multipart field "file"' }, 400)
  if (file.size > MAX_UPLOAD_BYTES) return c.json({ error: 'File exceeds the 2 MB limit' }, 413)

  const bytes = new Uint8Array(await file.arrayBuffer())
  const name = file.name || 'attachment'
  const mimeType = file.type || 'application/octet-stream'
  const textLike = isTextLike(mimeType, name)
  const audioLike = !textLike && mimeType.startsWith('audio/')

  let textContent: string | null = null
  let transcriptionError: string | null = null
  if (textLike) {
    textContent = capText(extractText(bytes), TEXT_EXTRACT_PER_FILE_LIMIT)
  } else if (audioLike) {
    try {
      textContent = await transcribeAudio(db, c.env, { audio: bytes, mimeType, name })
    } catch (err) {
      transcriptionError = err instanceof ApiError || err instanceof AiError ? err.message : 'Transcription failed'
    }
  }

  const [row] = await db
    .insert(attachments)
    .values({
      id: uid('att'),
      userId: user.id,
      conversationId,
      name,
      mimeType,
      sizeBytes: file.size,
      status: textContent !== null ? 'processed' : 'stored',
      textContent,
      errorMessage: transcriptionError,
      contentB64: toBase64(bytes),
    })
    .returning({
      id: attachments.id,
      conversationId: attachments.conversationId,
      name: attachments.name,
      mimeType: attachments.mimeType,
      sizeBytes: attachments.sizeBytes,
      status: attachments.status,
      errorMessage: attachments.errorMessage,
      createdAt: attachments.createdAt,
    })
  return c.json(row, 201)
})

attachmentsRouter.get('/conversations/:id/attachments', async (c) => {
  const user = await requireUser(c)
  const db = getDb(c.env)
  const conversationId = c.req.param('id')
  if (!(await ownedConversation(db, conversationId, user.id))) return c.json({ error: 'Conversation not found' }, 404)

  const rows = await db
    .select({
      id: attachments.id,
      conversationId: attachments.conversationId,
      name: attachments.name,
      mimeType: attachments.mimeType,
      sizeBytes: attachments.sizeBytes,
      status: attachments.status,
      errorMessage: attachments.errorMessage,
      createdAt: attachments.createdAt,
    })
    .from(attachments)
    .where(and(eq(attachments.conversationId, conversationId), isNull(attachments.deletedAt)))
    .orderBy(asc(attachments.createdAt))
  return c.json(rows)
})

attachmentsRouter.get('/attachments/:id/download', async (c) => {
  const user = await requireUser(c)
  const db = getDb(c.env)
  const id = c.req.param('id')

  const [row] = await db
    .select()
    .from(attachments)
    .where(and(eq(attachments.id, id), eq(attachments.userId, user.id), isNull(attachments.deletedAt)))
    .limit(1)
  if (!row || !row.contentB64) return c.json({ error: 'Attachment not found' }, 404)

  return new Response(fromBase64(row.contentB64).buffer as ArrayBuffer, {
    headers: {
      'content-type': row.mimeType,
      'content-disposition': `attachment; filename="${encodeURIComponent(row.name)}"`,
    },
  })
})

attachmentsRouter.delete('/attachments/:id', async (c) => {
  const user = await requireUser(c)
  const db = getDb(c.env)
  const id = c.req.param('id')

  const [row] = await db
    .update(attachments)
    .set({ deletedAt: new Date(), ...stampUpdate(attachments) })
    .where(and(eq(attachments.id, id), eq(attachments.userId, user.id), isNull(attachments.deletedAt)))
    .returning({ id: attachments.id })
  if (!row) return c.json({ error: 'Attachment not found' }, 404)
  return c.json({ success: true })
})
