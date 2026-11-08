import { eq } from 'drizzle-orm'
import type { Db, Env } from '../env'
import { documents, researchRuns } from '../schema'
import { executeIndexing, markDocumentFailed } from './knowledge'
import { executeResearch, markResearchFailed } from './research'
import { registerTaskHandler } from './tasks'

let registered = false

export function registerBuiltinTaskHandlers(): void {
  if (registered) return
  registered = true

  registerTaskHandler('index_document', async (db: Db, env: Env, task) => {
    const documentId = typeof task.payload.documentId === 'string' ? task.payload.documentId : null
    const text = typeof task.payload.text === 'string' ? task.payload.text : null
    if (!documentId || text === null) throw new Error('index_document payload is missing documentId or text')

    const [row] = await db.select({ id: documents.id }).from(documents).where(eq(documents.id, documentId)).limit(1)
    if (!row) throw new Error('Document no longer exists')

    try {
      const outcome = await executeIndexing(db, env, { userId: task.userId, documentId, text })
      return { documentId, chunkCount: outcome.chunkCount }
    } catch (err) {
      await markDocumentFailed(db, documentId, err instanceof Error ? err.message : 'Indexing failed')
      throw err
    }
  })

  registerTaskHandler('research', async (db: Db, env: Env, task) => {
    const researchId = typeof task.payload.researchId === 'string' ? task.payload.researchId : null
    const query = typeof task.payload.query === 'string' ? task.payload.query : null
    if (!researchId || query === null) throw new Error('research payload is missing researchId or query')

    const [row] = await db.select({ id: researchRuns.id }).from(researchRuns).where(eq(researchRuns.id, researchId)).limit(1)
    if (!row) throw new Error('Research run no longer exists')

    try {
      const outcome = await executeResearch(db, env, { userId: task.userId, researchId, query })
      return { researchId, sourcesCount: outcome.sourcesCount }
    } catch (err) {
      await markResearchFailed(db, researchId, err instanceof Error ? err.message : 'Research failed')
      throw err
    }
  })
}
