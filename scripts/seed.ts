import 'dotenv/config'
import { drizzle } from 'drizzle-orm/neon-http'
import { neon } from '@neondatabase/serverless'
import type { ModelCapabilities, ModelPricing } from '@shared/ai/contracts'
import { models, providers, tools } from '../api/schema'
import { guardDbTarget } from './db-guard'

interface SeedModel {
  id: string
  providerId: string
  externalId: string
  displayName: string
  family: string
  description: string
  capabilities: ModelCapabilities
  inputTypes: string[]
  outputTypes: string[]
  contextWindow: number
  maxOutputTokens: number
  pricing: ModelPricing
  isDefault: boolean
  sortOrder: number
}

interface SeedProvider {
  id: string
  name: string
  adapter: string
  baseUrl: string
  apiKeyEnv: string
}

interface SeedTool {
  id: string
  key: string
  name: string
  description: string
  parameters: Record<string, unknown>
  requiresApproval: boolean
  sortOrder: number
}

const SEED_PROVIDERS: SeedProvider[] = [
  {
    id: 'provider_groq',
    name: 'Groq',
    adapter: 'openai-compatible',
    baseUrl: 'https://api.groq.com/openai/v1',
    apiKeyEnv: 'GROQ_API_KEY',
  },
  {
    id: 'provider_openai',
    name: 'OpenAI',
    adapter: 'openai-compatible',
    baseUrl: 'https://api.openai.com/v1',
    apiKeyEnv: 'OPENAI_API_KEY',
  },
  {
    id: 'provider_anthropic',
    name: 'Anthropic',
    adapter: 'anthropic',
    baseUrl: 'https://api.anthropic.com',
    apiKeyEnv: 'ANTHROPIC_API_KEY',
  },
]

const CHAT: ModelCapabilities = { streaming: true, tools: true, structured: true, reasoning: true, vision: false, embeddings: false }
const IMAGE: ModelCapabilities = { streaming: false, tools: false, structured: false, reasoning: false, vision: false, embeddings: false }
const EMBEDDINGS: ModelCapabilities = { streaming: false, tools: false, structured: false, reasoning: false, vision: false, embeddings: true }

const SEED_TOOLS: SeedTool[] = [
  {
    id: 'tool_generate_image',
    key: 'generate_image',
    name: 'Generate image',
    description: 'Generates one image from a text prompt using the workspace image model and stores it as an artifact.',
    parameters: {
      type: 'object',
      properties: {
        prompt: { type: 'string', description: 'What the image should depict.' },
        size: { type: 'string', enum: ['1024x1024', '1536x1024', '1024x1536'], description: 'Image dimensions.' },
        quality: { type: 'string', enum: ['auto', 'low', 'medium', 'high', 'xhigh', 'max'], description: 'Render quality.' },
      },
      required: ['prompt'],
      additionalProperties: false,
    },
    requiresApproval: true,
    sortOrder: 10,
  },
  {
    id: 'tool_save_memory',
    key: 'save_memory',
    name: 'Save memory',
    description: 'Stores a durable fact about the user as a long-term memory injected into future conversations.',
    parameters: {
      type: 'object',
      properties: {
        content: { type: 'string', description: 'The fact to remember, one concise sentence.' },
        pinned: { type: 'boolean', description: 'Pin the memory so it outranks others.' },
      },
      required: ['content'],
      additionalProperties: false,
    },
    requiresApproval: true,
    sortOrder: 20,
  },
  {
    id: 'tool_web_search',
    key: 'web_search',
    name: 'Web search',
    description:
      'Searches the public web and returns ranked results with titles, URLs, and snippets. Use for current events or facts you are unsure about.',
    parameters: {
      type: 'object',
      properties: {
        query: { type: 'string', description: 'The search query, focused keywords work best.' },
        maxResults: { type: 'number', description: 'How many results to return, 1 to 5.' },
        topic: { type: 'string', enum: ['general', 'news'], description: 'Search general web pages or recent news.' },
      },
      required: ['query'],
      additionalProperties: false,
    },
    requiresApproval: true,
    sortOrder: 30,
  },
  {
    id: 'tool_search_knowledge',
    key: 'search_knowledge',
    name: 'Search knowledge',
    description:
      'Retrieves the most relevant passages from the documents indexed in this workspace. Use it before answering questions about the user’s own material.',
    parameters: {
      type: 'object',
      properties: {
        query: { type: 'string', description: 'What to look for in the indexed documents.' },
        limit: { type: 'number', description: 'How many passages to return, 1 to 8.' },
      },
      required: ['query'],
      additionalProperties: false,
    },
    requiresApproval: true,
    sortOrder: 40,
  },
]

const SEED_MODELS: SeedModel[] = [
  {
    id: 'model_gpt_oss_120b',
    providerId: 'provider_groq',
    externalId: 'openai/gpt-oss-120b',
    displayName: 'GPT OSS 120B',
    family: 'gpt-oss',
    description: 'OpenAI open-weight flagship reasoning model served by Groq at ultra-low latency.',
    capabilities: CHAT,
    inputTypes: ['text'],
    outputTypes: ['text'],
    contextWindow: 131072,
    maxOutputTokens: 65536,
    pricing: { inputPerMTok: 0.15, outputPerMTok: 0.6, currency: 'USD' },
    isDefault: true,
    sortOrder: 10,
  },
  {
    id: 'model_gpt_oss_20b',
    providerId: 'provider_groq',
    externalId: 'openai/gpt-oss-20b',
    displayName: 'GPT OSS 20B',
    family: 'gpt-oss',
    description: 'Compact open-weight reasoning model for fast, cost-effective generation.',
    capabilities: CHAT,
    inputTypes: ['text'],
    outputTypes: ['text'],
    contextWindow: 131072,
    maxOutputTokens: 65536,
    pricing: { inputPerMTok: 0.075, outputPerMTok: 0.3, currency: 'USD' },
    isDefault: false,
    sortOrder: 20,
  },
  {
    id: 'model_qwen3_8_27b',
    providerId: 'provider_groq',
    externalId: 'qwen/qwen3.8-27b',
    displayName: 'Qwen3.8 27B',
    family: 'qwen',
    description: 'Multimodal model from the Qwen family; accepts text and images.',
    capabilities: { streaming: true, tools: true, structured: false, reasoning: true, vision: true, embeddings: false },
    inputTypes: ['text', 'image'],
    outputTypes: ['text'],
    contextWindow: 131072,
    maxOutputTokens: 16384,
    pricing: { inputPerMTok: 0.8, outputPerMTok: 4, currency: 'USD' },
    isDefault: false,
    sortOrder: 30,
  },
  {
    id: 'model_gpt_6_1_sol',
    providerId: 'provider_openai',
    externalId: 'gpt-6.1-sol',
    displayName: 'GPT-6.1 Sol',
    family: 'gpt-6',
    description: 'OpenAI flagship-class chat model. Short-context rates; long-context input (>272K) is priced higher.',
    capabilities: CHAT,
    inputTypes: ['text'],
    outputTypes: ['text'],
    contextWindow: 1050000,
    maxOutputTokens: 128000,
    pricing: { inputPerMTok: 2, outputPerMTok: 10, currency: 'USD' },
    isDefault: false,
    sortOrder: 40,
  },
  {
    id: 'model_gpt_6_1_terra',
    providerId: 'provider_openai',
    externalId: 'gpt-6.1-terra',
    displayName: 'GPT-6.1 Terra',
    family: 'gpt-6',
    description: 'Balanced OpenAI chat model. Short-context rates; long-context input (>272K) is priced higher.',
    capabilities: CHAT,
    inputTypes: ['text'],
    outputTypes: ['text'],
    contextWindow: 1050000,
    maxOutputTokens: 128000,
    pricing: { inputPerMTok: 1, outputPerMTok: 5, currency: 'USD' },
    isDefault: false,
    sortOrder: 50,
  },
  {
    id: 'model_gpt_6_luna',
    providerId: 'provider_openai',
    externalId: 'gpt-6-luna',
    displayName: 'GPT-6 Luna',
    family: 'gpt-6',
    description: 'Low-cost OpenAI chat model. Short-context rates; long-context input (>272K) is priced higher.',
    capabilities: CHAT,
    inputTypes: ['text'],
    outputTypes: ['text'],
    contextWindow: 1050000,
    maxOutputTokens: 128000,
    pricing: { inputPerMTok: 0.1, outputPerMTok: 0.5, currency: 'USD' },
    isDefault: false,
    sortOrder: 60,
  },
  {
    id: 'model_claude_haiku_5_5',
    providerId: 'provider_anthropic',
    externalId: 'claude-haiku-5-5',
    displayName: 'Claude Haiku 5.5',
    family: 'claude',
    description: 'Fast, low-cost Claude model. Rates apply up to 100K-token prompts; higher beyond.',
    capabilities: CHAT,
    inputTypes: ['text'],
    outputTypes: ['text'],
    contextWindow: 1000000,
    maxOutputTokens: 128000,
    pricing: { inputPerMTok: 0.1, outputPerMTok: 0.5, currency: 'USD' },
    isDefault: false,
    sortOrder: 70,
  },
  {
    id: 'model_claude_sonnet_5_5',
    providerId: 'provider_anthropic',
    externalId: 'claude-sonnet-5-5',
    displayName: 'Claude Sonnet 5.5',
    family: 'claude',
    description: 'Everyday coding and agent workhorse in the Claude family.',
    capabilities: CHAT,
    inputTypes: ['text'],
    outputTypes: ['text'],
    contextWindow: 1000000,
    maxOutputTokens: 128000,
    pricing: { inputPerMTok: 2, outputPerMTok: 10, currency: 'USD' },
    isDefault: false,
    sortOrder: 80,
  },
  {
    id: 'model_claude_opus_5_5',
    providerId: 'provider_anthropic',
    externalId: 'claude-opus-5-5',
    displayName: 'Claude Opus 5.5',
    family: 'claude',
    description: 'Current Claude Opus for demanding reasoning and long-horizon work.',
    capabilities: CHAT,
    inputTypes: ['text'],
    outputTypes: ['text'],
    contextWindow: 1000000,
    maxOutputTokens: 128000,
    pricing: { inputPerMTok: 4, outputPerMTok: 20, currency: 'USD' },
    isDefault: false,
    sortOrder: 90,
  },
  {
    id: 'model_gpt_image_2_5_flare',
    providerId: 'provider_openai',
    externalId: 'gpt-image-2.5-flare',
    displayName: 'GPT Image 2.5 Flare',
    family: 'gpt-image',
    description: 'Fast, high-quality everyday image generation. Text input and image output token rates.',
    capabilities: IMAGE,
    inputTypes: ['text'],
    outputTypes: ['image'],
    contextWindow: 4096,
    maxOutputTokens: 8192,
    pricing: { inputPerMTok: 5, outputPerMTok: 30, currency: 'USD' },
    isDefault: false,
    sortOrder: 100,
  },
  {
    id: 'model_gpt_image_2_5_sunburst',
    providerId: 'provider_openai',
    externalId: 'gpt-image-2.5-sunburst',
    displayName: 'GPT Image 2.5 Sunburst',
    family: 'gpt-image',
    description: 'Most capable image generation and editing model. Text input and image output token rates.',
    capabilities: IMAGE,
    inputTypes: ['text'],
    outputTypes: ['image'],
    contextWindow: 4096,
    maxOutputTokens: 8192,
    pricing: { inputPerMTok: 5, outputPerMTok: 30, currency: 'USD' },
    isDefault: false,
    sortOrder: 110,
  },
  {
    id: 'model_text_embedding_3_small',
    providerId: 'provider_openai',
    externalId: 'text-embedding-3-small',
    displayName: 'Text Embedding 3 Small',
    family: 'text-embedding',
    description: 'Dense 1536-dimension embeddings for document indexing and semantic retrieval.',
    capabilities: EMBEDDINGS,
    inputTypes: ['text'],
    outputTypes: [],
    contextWindow: 8191,
    maxOutputTokens: 0,
    pricing: { inputPerMTok: 0.02, outputPerMTok: 0, currency: 'USD' },
    isDefault: false,
    sortOrder: 120,
  },
  {
    id: 'model_whisper_large_v3_turbo',
    providerId: 'provider_groq',
    externalId: 'whisper-large-v3-turbo',
    displayName: 'Whisper Large v3 Turbo',
    family: 'whisper',
    description: 'Speech-to-text transcription for audio attachments. Audio is billed per second by the provider; pricing is not mapped to the token ledger.',
    capabilities: { streaming: false, tools: false, structured: false, reasoning: false, vision: false, embeddings: false },
    inputTypes: ['audio'],
    outputTypes: ['text'],
    contextWindow: 0,
    maxOutputTokens: 0,
    pricing: { inputPerMTok: 0, outputPerMTok: 0, currency: 'USD' },
    isDefault: false,
    sortOrder: 130,
  },
]

async function main() {
  const url = await guardDbTarget('db:seed (idempotent model registry upsert)')
  const db = drizzle(neon(url))

  for (const provider of SEED_PROVIDERS) {
    await db.insert(providers).values(provider).onConflictDoUpdate({ target: providers.id, set: provider })
  }

  for (const model of SEED_MODELS) {
    const { id: _modelId, ...rest } = model
    await db.insert(models).values(model).onConflictDoUpdate({ target: models.id, set: rest })
  }

  for (const tool of SEED_TOOLS) {
    const { id: _toolId, ...rest } = tool
    await db.insert(tools).values(tool).onConflictDoUpdate({ target: tools.id, set: rest })
  }

  console.log(
    `Seeded ${SEED_PROVIDERS.length} providers, ${SEED_MODELS.length} models, and ${SEED_TOOLS.length} builtin tools (Groq verified against the live catalog 2026-11-08; OpenAI, Anthropic, and GPT Image from official published pricing 2026-11-08).`,
  )
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
