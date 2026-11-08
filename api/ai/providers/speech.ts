import { AiError, errorFromStatus, errorFromUnknown } from '../errors'
import type { AdapterConfig } from './openai-compatible'

export const SPEECH_VOICES = ['tara', 'leah', 'jess', 'julian', 'annie', 'steve', 'zac', 'bella'] as const
export type SpeechVoice = (typeof SPEECH_VOICES)[number]

export const SPEECH_INPUT_MAX = 4000

export interface SpeechRequest {
  externalModelId: string
  input: string
  voice: SpeechVoice
}

export interface SpeechResult {
  audio: Uint8Array
  mimeType: string
}

export interface SpeechAdapter {
  speak(req: SpeechRequest): Promise<SpeechResult>
}

export function createOpenAiSpeechAdapter(config: AdapterConfig): SpeechAdapter {
  return {
    async speak(req: SpeechRequest): Promise<SpeechResult> {
      let response: Response
      try {
        response = await fetch(`${config.baseUrl}/audio/speech`, {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${config.apiKey}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            model: req.externalModelId,
            input: req.input,
            voice: req.voice,
            response_format: 'wav',
          }),
          signal: AbortSignal.timeout(config.timeoutMs),
        })
      } catch (err) {
        throw errorFromUnknown(err)
      }

      if (!response.ok) {
        const detail = await extractErrorDetail(response)
        throw errorFromStatus(response.status, detail?.message, detail)
      }

      const audio = new Uint8Array(await response.arrayBuffer())
      if (audio.length === 0) throw new AiError('upstream_error', 'Speech synthesis returned no audio')
      return { audio, mimeType: response.headers.get('content-type')?.split(';')[0] ?? 'audio/wav' }
    },
  }
}

async function extractErrorDetail(response: Response): Promise<{ message?: string; type?: string; code?: string } | undefined> {
  try {
    const body = (await response.json()) as { error?: { message?: string; type?: string; code?: string } }
    return body.error
  } catch {
    return undefined
  }
}
