import { sql } from 'drizzle-orm'
import { boolean, index, integer, jsonb, pgTable, text, uniqueIndex, vector } from 'drizzle-orm/pg-core'
import { trio } from '@umituz/web-hono'
import { authTables } from '@umituz/web-hono/auth'
import type {
  AssistantToolCall,
  ConversationSettings,
  MessageStatus,
  ModelCapabilities,
  ModelPricing,
  TokenUsage,
  ToolCallStatus,
} from '@shared/ai/contracts'

export const TABLE_PREFIX = 'nexora'

export const tn = (name: string) => `${TABLE_PREFIX}_${name}`

export const ba = authTables(TABLE_PREFIX)
export const baUser = ba.user
export const baSession = ba.session
export const baAccount = ba.account
export const baVerification = ba.verification

export const providers = pgTable(tn('providers'), {
  id: text('id').primaryKey(),
  name: text('name').notNull(),
  adapter: text('adapter').notNull(),
  baseUrl: text('base_url').notNull(),
  apiKeyEnv: text('api_key_env').notNull(),
  ...trio(),
})

export const models = pgTable(
  tn('models'),
  {
    id: text('id').primaryKey(),
    providerId: text('provider_id')
      .notNull()
      .references(() => providers.id),
    externalId: text('external_id').notNull(),
    displayName: text('display_name').notNull(),
    family: text('family').notNull(),
    description: text('description'),
    capabilities: jsonb('capabilities').$type<ModelCapabilities>().notNull(),
    inputTypes: jsonb('input_types').$type<string[]>().notNull(),
    outputTypes: jsonb('output_types').$type<string[]>().notNull(),
    contextWindow: integer('context_window').notNull(),
    maxOutputTokens: integer('max_output_tokens').notNull(),
    pricing: jsonb('pricing').$type<ModelPricing>().notNull(),
    isDefault: boolean('is_default').notNull().default(false),
    active: boolean('active').notNull().default(true),
    sortOrder: integer('sort_order').notNull().default(0),
    ...trio(),
  },
  (t) => [
    uniqueIndex(tn('models_provider_external_unique'))
      .on(t.providerId, t.externalId)
      .where(sql`deleted_at is null`),
    index(tn('models_sort_idx')).on(t.sortOrder),
  ],
)

export const projects = pgTable(
  tn('projects'),
  {
    id: text('id').primaryKey(),
    userId: text('user_id')
      .notNull()
      .references(() => baUser.id),
    name: text('name').notNull(),
    description: text('description'),
    instructions: text('instructions'),
    ...trio(),
  },
  (t) => [index(tn('projects_user_idx')).on(t.userId, t.updatedAt)],
)

export const conversations = pgTable(
  tn('conversations'),
  {
    id: text('id').primaryKey(),
    userId: text('user_id')
      .notNull()
      .references(() => baUser.id),
    title: text('title').notNull(),
    projectId: text('project_id').references(() => projects.id),
    modelId: text('model_id').references(() => models.id),
    agentId: text('agent_id'),
    isTemporary: boolean('is_temporary').notNull().default(false),
    settings: jsonb('settings').$type<ConversationSettings>().notNull().default({}),
    ...trio(),
  },
  (t) => [index(tn('conversations_user_idx')).on(t.userId, t.updatedAt)],
)

export const messages = pgTable(
  tn('messages'),
  {
    id: text('id').primaryKey(),
    conversationId: text('conversation_id')
      .notNull()
      .references(() => conversations.id),
    userId: text('user_id').notNull(),
    role: text('role').notNull(),
    content: text('content').notNull(),
    reasoning: text('reasoning'),
    toolCalls: jsonb('tool_calls').$type<AssistantToolCall[]>(),
    toolCallId: text('tool_call_id'),
    modelId: text('model_id'),
    status: text('status').$type<MessageStatus>().notNull().default('complete'),
    usage: jsonb('usage').$type<TokenUsage>(),
    error: jsonb('error').$type<{ code: string; message: string }>(),
    ...trio(),
  },
  (t) => [index(tn('messages_conversation_idx')).on(t.conversationId, t.createdAt)],
)

export const usageRecords = pgTable(
  tn('usage_records'),
  {
    id: text('id').primaryKey(),
    userId: text('user_id').notNull(),
    conversationId: text('conversation_id'),
    messageId: text('message_id'),
    providerId: text('provider_id').notNull(),
    model: text('model').notNull(),
    inputTokens: integer('input_tokens').notNull().default(0),
    outputTokens: integer('output_tokens').notNull().default(0),
    reasoningTokens: integer('reasoning_tokens').notNull().default(0),
    costMicros: integer('cost_micros').notNull().default(0),
    durationMs: integer('duration_ms').notNull().default(0),
    status: text('status').notNull(),
    ...trio(),
  },
  (t) => [index(tn('usage_user_idx')).on(t.userId, t.createdAt)],
)

export const ATTACHMENT_STATUSES = ['pending', 'processed', 'stored', 'failed'] as const
export type AttachmentStatus = (typeof ATTACHMENT_STATUSES)[number]

export const ARTIFACT_KINDS = ['image'] as const
export type ArtifactKind = (typeof ARTIFACT_KINDS)[number]

export const artifacts = pgTable(
  tn('artifacts'),
  {
    id: text('id').primaryKey(),
    userId: text('user_id').notNull().references(() => baUser.id),
    kind: text('kind').$type<ArtifactKind>().notNull().default('image'),
    prompt: text('prompt').notNull(),
    revisedPrompt: text('revised_prompt'),
    modelId: text('model_id').references(() => models.id),
    mimeType: text('mime_type').notNull().default('image/png'),
    size: text('size').notNull(),
    quality: text('quality').notNull().default('auto'),
    rootId: text('root_id').notNull(),
    version: integer('version').notNull().default(1),
    dataBase64: text('data_base64').notNull(),
    ...trio(),
  },
  (t) => [
    index(tn('artifacts_user_idx')).on(t.userId, t.createdAt),
    index(tn('artifacts_root_idx')).on(t.rootId, t.version),
  ],
)

export const TOOL_KINDS = ['builtin'] as const
export type ToolKind = (typeof TOOL_KINDS)[number]

export const tools = pgTable(
  tn('tools'),
  {
    id: text('id').primaryKey(),
    key: text('key').notNull(),
    name: text('name').notNull(),
    description: text('description').notNull(),
    parameters: jsonb('parameters').$type<Record<string, unknown>>().notNull(),
    kind: text('kind').$type<ToolKind>().notNull().default('builtin'),
    requiresApproval: boolean('requires_approval').notNull().default(true),
    active: boolean('active').notNull().default(true),
    sortOrder: integer('sort_order').notNull().default(0),
    ...trio(),
  },
  (t) => [
    uniqueIndex(tn('tools_key_unique'))
      .on(t.key)
      .where(sql`deleted_at is null`),
  ],
)

export const agents = pgTable(
  tn('agents'),
  {
    id: text('id').primaryKey(),
    userId: text('user_id').notNull().references(() => baUser.id),
    name: text('name').notNull(),
    description: text('description'),
    instructions: text('instructions').notNull().default(''),
    modelId: text('model_id').references(() => models.id),
    toolIds: jsonb('tool_ids').$type<string[]>().notNull().default([]),
    active: boolean('active').notNull().default(true),
    ...trio(),
  },
  (t) => [index(tn('agents_user_idx')).on(t.userId, t.updatedAt)],
)

export const TOOL_CALL_STATUSES = ['pending', 'approved', 'rejected', 'succeeded', 'failed'] as const
export type ToolCallRowStatus = (typeof TOOL_CALL_STATUSES)[number]

export const toolCalls = pgTable(
  tn('tool_calls'),
  {
    id: text('id').primaryKey(),
    userId: text('user_id')
      .notNull()
      .references(() => baUser.id),
    conversationId: text('conversation_id')
      .notNull()
      .references(() => conversations.id),
    messageId: text('message_id'),
    agentId: text('agent_id'),
    callId: text('call_id').notNull(),
    toolKey: text('tool_key').notNull(),
    toolName: text('tool_name').notNull(),
    args: jsonb('args').$type<Record<string, unknown>>().notNull(),
    status: text('status').$type<ToolCallStatus>().notNull().default('pending'),
    result: jsonb('result').$type<Record<string, unknown>>(),
    error: text('error'),
    ...trio(),
  },
  (t) => [index(tn('tool_calls_conversation_idx')).on(t.conversationId, t.createdAt)],
)

export const attachments = pgTable(
  tn('attachments'),
  {
    id: text('id').primaryKey(),
    userId: text('user_id')
      .notNull()
      .references(() => baUser.id),
    conversationId: text('conversation_id')
      .notNull()
      .references(() => conversations.id),
    name: text('name').notNull(),
    mimeType: text('mime_type').notNull(),
    sizeBytes: integer('size_bytes').notNull(),
    status: text('status').$type<AttachmentStatus>().notNull().default('pending'),
    textContent: text('text_content'),
    contentB64: text('content_b64'),
    errorMessage: text('error_message'),
    ...trio(),
  },
  (t) => [index(tn('attachments_conversation_idx')).on(t.conversationId, t.createdAt)],
)

export const MEMORY_SOURCES = ['manual', 'conversation', 'agent'] as const
export type MemorySource = (typeof MEMORY_SOURCES)[number]

export const memories = pgTable(
  tn('memories'),
  {
    id: text('id').primaryKey(),
    userId: text('user_id')
      .notNull()
      .references(() => baUser.id),
    content: text('content').notNull(),
    source: text('source').$type<MemorySource>().notNull().default('manual'),
    conversationId: text('conversation_id').references(() => conversations.id),
    pinned: boolean('pinned').notNull().default(false),
    ...trio(),
  },
  (t) => [index(tn('memories_user_idx')).on(t.userId, t.pinned, t.updatedAt)],
)

export const EMBEDDING_DIMENSIONS = 1536

export const DOCUMENT_STATUSES = ['indexing', 'ready', 'failed'] as const
export type DocumentStatus = (typeof DOCUMENT_STATUSES)[number]

export const documents = pgTable(
  tn('documents'),
  {
    id: text('id').primaryKey(),
    userId: text('user_id')
      .notNull()
      .references(() => baUser.id),
    title: text('title').notNull(),
    status: text('status').$type<DocumentStatus>().notNull().default('indexing'),
    charCount: integer('char_count').notNull().default(0),
    chunkCount: integer('chunk_count').notNull().default(0),
    modelId: text('model_id').references(() => models.id),
    errorMessage: text('error_message'),
    ...trio(),
  },
  (t) => [index(tn('documents_user_idx')).on(t.userId, t.createdAt)],
)

export const documentChunks = pgTable(
  tn('document_chunks'),
  {
    id: text('id').primaryKey(),
    documentId: text('document_id')
      .notNull()
      .references(() => documents.id, { onDelete: 'cascade' }),
    userId: text('user_id')
      .notNull()
      .references(() => baUser.id),
    ordinal: integer('ordinal').notNull(),
    text: text('text').notNull(),
    embedding: vector('embedding', { dimensions: EMBEDDING_DIMENSIONS }).notNull(),
    ...trio(),
  },
  (t) => [index(tn('document_chunks_document_idx')).on(t.documentId, t.ordinal)],
)

export const TASK_STATUSES = ['queued', 'running', 'succeeded', 'failed', 'cancelled'] as const
export type TaskStatus = (typeof TASK_STATUSES)[number]

export interface TaskLogEntry {
  at: string
  level: 'info' | 'error'
  message: string
}

export const tasks = pgTable(
  tn('tasks'),
  {
    id: text('id').primaryKey(),
    userId: text('user_id')
      .notNull()
      .references(() => baUser.id),
    kind: text('kind').notNull(),
    status: text('status').$type<TaskStatus>().notNull().default('queued'),
    payload: jsonb('payload').$type<Record<string, unknown>>().notNull(),
    result: jsonb('result').$type<Record<string, unknown>>(),
    error: text('error'),
    attempts: integer('attempts').notNull().default(0),
    maxAttempts: integer('max_attempts').notNull().default(3),
    nextAttemptAt: text('next_attempt_at'),
    logs: jsonb('logs').$type<TaskLogEntry[]>().notNull().default([]),
    ...trio(),
  },
  (t) => [index(tn('tasks_user_idx')).on(t.userId, t.createdAt)],
)

export const RESEARCH_STATUSES = ['running', 'ready', 'failed'] as const
export type ResearchStatus = (typeof RESEARCH_STATUSES)[number]

export interface ResearchSource {
  title: string
  url: string
  snippet: string
}

export const researchRuns = pgTable(
  tn('research_runs'),
  {
    id: text('id').primaryKey(),
    userId: text('user_id')
      .notNull()
      .references(() => baUser.id),
    query: text('query').notNull(),
    status: text('status').$type<ResearchStatus>().notNull().default('running'),
    report: text('report'),
    sources: jsonb('sources').$type<ResearchSource[]>().notNull().default([]),
    modelId: text('model_id').references(() => models.id),
    errorMessage: text('error_message'),
    ...trio(),
  },
  (t) => [index(tn('research_runs_user_idx')).on(t.userId, t.createdAt)],
)

export const codeArtifacts = pgTable(
  tn('code_artifacts'),
  {
    id: text('id').primaryKey(),
    userId: text('user_id')
      .notNull()
      .references(() => baUser.id),
    conversationId: text('conversation_id').references(() => conversations.id),
    title: text('title').notNull(),
    language: text('language').notNull().default('text'),
    content: text('content').notNull(),
    rootId: text('root_id').notNull(),
    version: integer('version').notNull().default(1),
    ...trio(),
  },
  (t) => [
    index(tn('code_artifacts_user_idx')).on(t.userId, t.createdAt),
    index(tn('code_artifacts_root_idx')).on(t.rootId, t.version),
  ],
)
