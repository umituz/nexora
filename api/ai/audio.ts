import { capText, TEXT_EXTRACT_PER_FILE_LIMIT } from '@umituz/web-ai'
import type { Db, Env } from '../env'
import { findTranscriptionModel } from './model-registry'
import { audioTranscriptionAdapterFor } from './providers'

export async function transcribeAudio(
  db: Db,
  env: Env,
  input: { audio: Uint8Array; mimeType: string; name: string },
): Promise<string | null> {
  const resolved = await findTranscriptionModel(db, env)
  if (!resolved) return null

  const adapter = audioTranscriptionAdapterFor(env, resolved.provider)
  const result = await adapter.transcribe({
    externalModelId: resolved.model.externalId,
    audio: input.audio,
    mimeType: input.mimeType,
    name: input.name,
  })
  return capText(result.text, TEXT_EXTRACT_PER_FILE_LIMIT)
}
