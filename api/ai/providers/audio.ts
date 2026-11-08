import { AiError, errorFromStatus, errorFromUnknown } from '../errors'
import type { AdapterConfig } from './openai-compatible'

export interface AudioTranscriptionRequest {
  externalModelId: string
  audio: Uint8Array
  mimeType: string
  name: string
}

export interface AudioTranscriptionResult {
  text: string
}

export interface AudioTranscriptionAdapter {
  transcribe(req: AudioTranscriptionRequest): Promise<AudioTranscriptionResult>
}

export function createOpenAiAudioTranscriptionAdapter(config: AdapterConfig): AudioTranscriptionAdapter {
  return {
    async transcribe(req: AudioTranscriptionRequest): Promise<AudioTranscriptionResult> {
      const form = new FormData()
      form.append('file', new Blob([req.audio as BlobPart], { type: req.mimeType }), req.name)
      form.append('model', req.externalModelId)
      form.append('response_format', 'json')

      let response: Response
      try {
        response = await fetch(`${config.baseUrl}/audio/transcriptions`, {
          method: 'POST',
          headers: { Authorization: `Bearer ${config.apiKey}` },
          body: form,
          signal: AbortSignal.timeout(config.timeoutMs),
        })
      } catch (err) {
        throw errorFromUnknown(err)
      }

      if (!response.ok) {
        const detail = await extractErrorDetail(response)
        throw errorFromStatus(response.status, detail)
      }

      let body: { text?: string }
      try {
        body = (await response.json()) as { text?: string }
      } catch {
        throw new AiError('upstream_error', 'Transcription response was not valid JSON')
      }
      const text = (body.text ?? '').trim()
      if (text.length === 0) throw new AiError('upstream_error', 'Transcription returned no text')
      return { text }
    },
  }
}

async function extractErrorDetail(response: Response): Promise<string | undefined> {
  try {
    const body = (await response.json()) as { error?: { message?: string } }
    return body.error?.message
  } catch {
    return undefined
  }
}
