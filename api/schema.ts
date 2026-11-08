import { sql } from 'drizzle-orm'
import { boolean, index, integer, jsonb, pgTable, text, uniqueIndex } from 'drizzle-orm/pg-core'
import { trio } from '@umituz/web-hono'
import { authTables } from '@umituz/web-hono/auth'
import type {
  ConversationSettings,
  MessageStatus,
  ModelCapabilities,
  ModelPricing,
  TokenUsage,
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
