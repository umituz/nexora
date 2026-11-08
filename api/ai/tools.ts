import { z } from 'zod'
import { ApiError, uid } from '@umituz/web-hono'
import { memories } from '../schema'
import type { Db, Env } from '../env'
import { AiError } from './errors'
import { generateArtifact } from './image-service'
import { IMAGE_QUALITIES, IMAGE_SIZES } from './providers/images'

export type ToolExecutionOutcome = { ok: true; result: Record<string, unknown> } | { ok: false; error: string }

const generateImageArgs = z.object({
  prompt: z.string().min(1).max(4000),
  size: z.enum([...IMAGE_SIZES] as [string, ...string[]]).optional(),
  quality: z.enum([...IMAGE_QUALITIES] as [string, ...string[]]).optional(),
})

const saveMemoryArgs = z.object({
  content: z.string().min(1).max(2000),
  pinned: z.boolean().optional(),
})

const ARG_SCHEMAS: Readonly<Record<string, z.ZodType>> = {
  generate_image: generateImageArgs,
  save_memory: saveMemoryArgs,
}

export function validateToolArgs(toolKey: string, args: Record<string, unknown>): { ok: true } | { ok: false; error: string } {
  const schema = ARG_SCHEMAS[toolKey]
  if (!schema) return { ok: false, error: `Unknown tool: ${toolKey}` }
  const parsed = schema.safeParse(args)
  if (parsed.success) return { ok: true }
  const issue = parsed.error.issues[0]
  return { ok: false, error: `Invalid arguments: ${issue.path.join('.')} ${issue.message}` }
}

export async function executeToolCall(
  db: Db,
  env: Env,
  input: { userId: string; conversationId: string; toolKey: string; args: Record<string, unknown> },
): Promise<ToolExecutionOutcome> {
  const validated = validateToolArgs(input.toolKey, input.args)
  if (!validated.ok) return validated

  try {
    if (input.toolKey === 'generate_image') {
      const args = generateImageArgs.parse(input.args)
      const artifact = await generateArtifact(db, env, {
        userId: input.userId,
        prompt: args.prompt,
        size: args.size as (typeof IMAGE_SIZES)[number] | undefined,
        quality: args.quality as (typeof IMAGE_QUALITIES)[number] | undefined,
      })
      return {
        ok: true,
        result: {
          artifactId: artifact.id,
          imageUrl: `/api/artifacts/${artifact.id}/image`,
          size: artifact.size,
          quality: artifact.quality,
          version: artifact.version,
        },
      }
    }

    if (input.toolKey === 'save_memory') {
      const args = saveMemoryArgs.parse(input.args)
      const id = uid('mem')
      await db.insert(memories).values({
        id,
        userId: input.userId,
        content: args.content,
        source: 'agent',
        conversationId: input.conversationId,
        pinned: args.pinned ?? false,
      })
      return { ok: true, result: { memoryId: id, content: args.content, pinned: args.pinned ?? false } }
    }
  } catch (err) {
    if (err instanceof AiError) return { ok: false, error: err.userMessage }
    if (err instanceof ApiError) return { ok: false, error: err.message }
    return { ok: false, error: 'Tool execution failed' }
  }

  return { ok: false, error: `Unknown tool: ${input.toolKey}` }
}
