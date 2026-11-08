import 'dotenv/config'
import { drizzle } from 'drizzle-orm/neon-http'
import { neon } from '@neondatabase/serverless'
import type { ModelCapabilities, ModelPricing } from '@shared/ai/contracts'
import { models, providers } from '../api/schema'
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

const GROQ_PROVIDER_ID = 'provider_groq'

const SEED_MODELS: SeedModel[] = [
  {
    id: 'model_gpt_oss_120b',
    providerId: GROQ_PROVIDER_ID,
    externalId: 'openai/gpt-oss-120b',
    displayName: 'GPT OSS 120B',
    family: 'gpt-oss',
    description: 'OpenAI open-weight flagship reasoning model served by Groq at ultra-low latency.',
    capabilities: { streaming: true, tools: true, structured: true, reasoning: true, vision: false },
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
    providerId: GROQ_PROVIDER_ID,
    externalId: 'openai/gpt-oss-20b',
    displayName: 'GPT OSS 20B',
    family: 'gpt-oss',
    description: 'Compact open-weight reasoning model for fast, cost-effective generation.',
    capabilities: { streaming: true, tools: true, structured: true, reasoning: true, vision: false },
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
    providerId: GROQ_PROVIDER_ID,
    externalId: 'qwen/qwen3.8-27b',
    displayName: 'Qwen3.8 27B',
    family: 'qwen',
    description: 'Multimodal model from the Qwen family; accepts text and images.',
    capabilities: { streaming: true, tools: true, structured: false, reasoning: true, vision: true },
    inputTypes: ['text', 'image'],
    outputTypes: ['text'],
    contextWindow: 131072,
    maxOutputTokens: 16384,
    pricing: { inputPerMTok: 0.8, outputPerMTok: 4, currency: 'USD' },
    isDefault: false,
    sortOrder: 30,
  },
]

async function main() {
  const url = await guardDbTarget('db:seed (idempotent model registry upsert)')
  const db = drizzle(neon(url))

  await db
    .insert(providers)
    .values({
      id: GROQ_PROVIDER_ID,
      name: 'Groq',
      adapter: 'openai-compatible',
      baseUrl: 'https://api.groq.com/openai/v1',
      apiKeyEnv: 'GROQ_API_KEY',
    })
    .onConflictDoUpdate({
      target: providers.id,
      set: { name: 'Groq', adapter: 'openai-compatible', baseUrl: 'https://api.groq.com/openai/v1', apiKeyEnv: 'GROQ_API_KEY' },
    })

  for (const model of SEED_MODELS) {
    const { id: _modelId, ...rest } = model
    await db.insert(models).values(model).onConflictDoUpdate({ target: models.id, set: rest })
  }

  console.log(`Seeded ${SEED_MODELS.length} models for provider Groq (verified against the live catalog on 2026-11-08).`)
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
