import { z } from 'zod'
import { ApiError, uid } from '@umituz/web-hono'
import { AiError, IMAGE_QUALITIES, IMAGE_SIZES } from '@umituz/web-ai'
import { memories } from '../schema'
import type { Db, Env } from '../env'
import { generateArtifact } from './image-service'
import { KNOWLEDGE_MAX_RESULTS, searchKnowledge } from './knowledge'
import { SEARCH_MAX_RESULTS, searchWeb } from './search'

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

const webSearchArgs = z.object({
  query: z.string().min(1).max(400),
  maxResults: z.number().int().min(1).max(SEARCH_MAX_RESULTS).optional(),
  topic: z.enum(['general', 'news']).optional(),
})

const searchKnowledgeArgs = z.object({
  query: z.string().min(1).max(400),
  limit: z.number().int().min(1).max(KNOWLEDGE_MAX_RESULTS).optional(),
})

const ARG_SCHEMAS: Readonly<Record<string, z.ZodType>> = {
  generate_image: generateImageArgs,
  save_memory: saveMemoryArgs,
  web_search: webSearchArgs,
  search_knowledge: searchKnowledgeArgs,
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

    if (input.toolKey === 'web_search') {
      const args = webSearchArgs.parse(input.args)
      const response = await searchWeb(env, {
        query: args.query,
        maxResults: args.maxResults,
        topic: args.topic,
        includeAnswer: true,
      })
      return {
        ok: true,
        result: {
          query: response.query,
          answer: response.answer,
          responseTime: response.responseTime,
          results: response.results.map((row) => ({ title: row.title, url: row.url, snippet: row.content })),
        },
      }
    }

    if (input.toolKey === 'search_knowledge') {
      const args = searchKnowledgeArgs.parse(input.args)
      const hits = await searchKnowledge(db, env, {
        userId: input.userId,
        query: args.query,
        limit: args.limit,
      })
      return {
        ok: true,
        result: {
          query: args.query,
          results: hits.map((hit) => ({
            documentTitle: hit.documentTitle,
            chunk: hit.ordinal,
            text: hit.text,
            distance: Number(hit.distance.toFixed(4)),
          })),
        },
      }
    }
  } catch (err) {
    if (err instanceof AiError) return { ok: false, error: err.userMessage }
    if (err instanceof ApiError) return { ok: false, error: err.message }
    return { ok: false, error: 'Tool execution failed' }
  }

  return { ok: false, error: `Unknown tool: ${input.toolKey}` }
}
