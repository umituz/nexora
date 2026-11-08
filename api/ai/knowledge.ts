import { and, desc, eq, isNull, sql } from 'drizzle-orm'
import { ApiError, stampUpdate, uid } from '@umituz/web-hono'
import { documents, documentChunks, usageRecords, tn } from '../schema'
import type { Db, Env } from '../env'
import { batchEmbed, buildUsageData, chunkText, CHUNK_TEXT_LIMIT } from '@umituz/web-ai'
import { resolveEmbeddingModel } from './model-registry'
import { embeddingsAdapterFor, type EmbeddingsAdapter } from './providers'

export const KNOWLEDGE_MAX_RESULTS = 8
const EMBED_BATCH_SIZE = 32

export interface IndexedDocument {
  id: string
  title: string
  status: 'indexing' | 'ready' | 'failed'
  charCount: number
  chunkCount: number
  modelId: string | null
  errorMessage: string | null
  createdAt: Date
}

export interface KnowledgeHit {
  chunkId: string
  documentId: string
  documentTitle: string
  ordinal: number
  text: string
  distance: number
}

export async function embedTexts(
  env: Env,
  provider: { adapter: string; baseUrl: string; apiKeyEnv: string },
  externalModelId: string,
  texts: string[],
  adapterOverride?: EmbeddingsAdapter,
): Promise<{ vectors: number[][]; inputTokens: number | null }> {
  const adapter = adapterOverride ?? embeddingsAdapterFor(env, provider)
  return batchEmbed(adapter, externalModelId, texts, EMBED_BATCH_SIZE)
}

export async function createPendingDocument(db: Db, input: { userId: string; title: string }): Promise<IndexedDocument> {
  const [row] = await db
    .insert(documents)
    .values({
      id: uid('doc'),
      userId: input.userId,
      title: input.title,
      status: 'indexing',
    })
    .returning({
      id: documents.id,
      title: documents.title,
      status: documents.status,
      charCount: documents.charCount,
      chunkCount: documents.chunkCount,
      modelId: documents.modelId,
      errorMessage: documents.errorMessage,
      createdAt: documents.createdAt,
    })
  return row
}

export async function markDocumentFailed(db: Db, documentId: string, message: string): Promise<void> {
  await db
    .update(documents)
    .set({ status: 'failed', errorMessage: message, updatedAt: new Date() })
    .where(eq(documents.id, documentId))
}

export async function executeIndexing(
  db: Db,
  env: Env,
  input: { userId: string; documentId: string; text: string },
  adapterOverride?: EmbeddingsAdapter,
): Promise<{ chunkCount: number; modelId: string }> {
  if (input.text.length > CHUNK_TEXT_LIMIT) {
    throw ApiError.badRequest(`Document text exceeds ${CHUNK_TEXT_LIMIT} characters`)
  }

  const chunks = chunkText(input.text)
  if (chunks.length === 0) throw ApiError.badRequest('Document text is empty after processing')

  const resolved = await resolveEmbeddingModel(db, env, null)
  const startedAt = Date.now()
  const { vectors, inputTokens } = await embedTexts(
    env,
    resolved.provider,
    resolved.model.externalId,
    chunks,
    adapterOverride,
  )
  const durationMs = Date.now() - startedAt

  await db.insert(documentChunks).values(
    chunks.map((text, ordinal) => ({
      id: uid('chk'),
      documentId: input.documentId,
      userId: input.userId,
      ordinal,
      text,
      embedding: vectors[ordinal],
    })),
  )

  await db
    .update(documents)
    .set({
      status: 'ready',
      charCount: input.text.length,
      chunkCount: chunks.length,
      modelId: resolved.model.id,
      errorMessage: null,
      updatedAt: new Date(),
    })
    .where(eq(documents.id, input.documentId))

  if (inputTokens !== null && inputTokens > 0) {
    await db.insert(usageRecords).values({
      id: uid('usage'),
      userId: input.userId,
      conversationId: null,
      messageId: null,
      providerId: resolved.provider.id,
      model: resolved.model.displayName,
      ...buildUsageData({
        usage: { inputTokens, outputTokens: 0 },
        pricing: resolved.model.pricing,
        durationMs,
      }),
      status: 'complete',
    })
  }

  return { chunkCount: chunks.length, modelId: resolved.model.id }
}

interface RawHit {
  chunk_id: string
  document_id: string
  title: string
  ordinal: number
  text: string
  distance: number
}

export async function searchKnowledge(
  db: Db,
  env: Env,
  input: { userId: string; query: string; limit?: number; modelId?: string | null },
  adapterOverride?: EmbeddingsAdapter,
): Promise<KnowledgeHit[]> {
  const limit = Math.min(Math.max(Math.trunc(input.limit ?? KNOWLEDGE_MAX_RESULTS), 1), KNOWLEDGE_MAX_RESULTS)
  const resolved = await resolveEmbeddingModel(db, env, input.modelId ?? null)
  const { vectors } = await embedTexts(env, resolved.provider, resolved.model.externalId, [input.query], adapterOverride)

  const literal = JSON.stringify(vectors[0])
  const result = await db.execute(sql`
    SELECT c.id AS chunk_id, c.document_id, d.title, c.ordinal, c.text,
           c.embedding <=> ${literal}::vector AS distance
    FROM ${sql.raw(tn('document_chunks'))} c
    JOIN ${sql.raw(tn('documents'))} d ON d.id = c.document_id
    WHERE c.user_id = ${input.userId} AND d.deleted_at IS NULL
    ORDER BY c.embedding <=> ${literal}::vector
    LIMIT ${limit}
  `)

  const rows = (result as unknown as { rows: RawHit[] }).rows ?? []
  return rows.map((row) => ({
    chunkId: row.chunk_id,
    documentId: row.document_id,
    documentTitle: row.title,
    ordinal: row.ordinal,
    text: row.text,
    distance: Number(row.distance),
  }))
}

export async function listDocuments(db: Db, userId: string): Promise<IndexedDocument[]> {
  return db
    .select({
      id: documents.id,
      title: documents.title,
      status: documents.status,
      charCount: documents.charCount,
      chunkCount: documents.chunkCount,
      modelId: documents.modelId,
      errorMessage: documents.errorMessage,
      createdAt: documents.createdAt,
    })
    .from(documents)
    .where(and(eq(documents.userId, userId), isNull(documents.deletedAt)))
    .orderBy(desc(documents.createdAt))
}

export async function deleteDocument(db: Db, userId: string, id: string): Promise<boolean> {
  const [row] = await db
    .select({ id: documents.id })
    .from(documents)
    .where(and(eq(documents.id, id), eq(documents.userId, userId), isNull(documents.deletedAt)))
    .limit(1)
  if (!row) return false

  await db.delete(documentChunks).where(eq(documentChunks.documentId, id))
  await db
    .update(documents)
    .set({ deletedAt: new Date(), ...stampUpdate(documents) })
    .where(eq(documents.id, id))
  return true
}
