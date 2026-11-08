import { Hono } from 'hono'
import { validator } from 'hono/validator'
import { ApiError } from '@umituz/web-hono'
import { validateJson } from '@umituz/web-hono/validator'
import { z } from 'zod'
import type { Env } from '../env'
import { getDb } from '../db'
import { KNOWLEDGE_MAX_RESULTS, listDocuments, searchKnowledge, deleteDocument, createPendingDocument } from '../ai/knowledge'
import { enqueueTask, runTask } from '../ai/tasks'
import { registerBuiltinTaskHandlers } from '../ai/task-handlers'
import { CHUNK_TEXT_LIMIT } from '../ai/chunker'
import { AiError } from '../ai/errors'
import { AI_ERROR_STATUS } from './chat'
import { requireUser } from '../session'

registerBuiltinTaskHandlers()

export const documentsRouter = new Hono<{ Bindings: Env }>()

const TITLE_MAX = 200

const createSchema = z.object({
  title: z.string().min(1).max(TITLE_MAX),
  text: z.string().min(1).max(CHUNK_TEXT_LIMIT),
})

const searchSchema = z.object({
  query: z.string().min(1).max(1000),
  limit: z.number().int().min(1).max(KNOWLEDGE_MAX_RESULTS).optional(),
})

documentsRouter.get('/', async (c) => {
  const user = await requireUser(c)
  const db = getDb(c.env)
  return c.json(await listDocuments(db, user.id))
})

documentsRouter.post('/', validator('json', validateJson(createSchema, 'Invalid document payload')), async (c) => {
  const user = await requireUser(c)
  const db = getDb(c.env)
  const body = c.req.valid('json')

  const document = await createPendingDocument(db, { userId: user.id, title: body.title })
  const task = await enqueueTask(db, {
    userId: user.id,
    kind: 'index_document',
    payload: { documentId: document.id, text: body.text },
  })
  c.executionCtx.waitUntil(runTask(db, c.env, task.id))

  return c.json({ document, taskId: task.id }, 202)
})

documentsRouter.post('/search', validator('json', validateJson(searchSchema, 'Invalid search payload')), async (c) => {
  const user = await requireUser(c)
  const db = getDb(c.env)
  const body = c.req.valid('json')

  try {
    const hits = await searchKnowledge(db, c.env, {
      userId: user.id,
      query: body.query,
      limit: body.limit,
    })
    return c.json(hits)
  } catch (err) {
    if (err instanceof ApiError) return c.json({ error: err.message }, err.status)
    if (err instanceof AiError) return c.json({ error: err.userMessage, code: err.code }, AI_ERROR_STATUS[err.code])
    throw err
  }
})

documentsRouter.delete('/:id', async (c) => {
  const user = await requireUser(c)
  const db = getDb(c.env)
  const removed = await deleteDocument(db, user.id, c.req.param('id'))
  if (!removed) return c.json({ error: 'Document not found' }, 404)
  return c.json({ ok: true }, 200)
})
