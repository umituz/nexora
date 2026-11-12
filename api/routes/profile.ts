import { Hono } from 'hono'
import { and, eq, isNull, sql } from 'drizzle-orm'
import type { SQL } from 'drizzle-orm'
import type { PgTable } from 'drizzle-orm/pg-core'
import type { Env } from '../env'
import { getDb } from '../db'
import type { Db } from '../env'
import {
  agents,
  apiKeys,
  artifacts,
  baUser,
  codeArtifacts,
  conversations,
  documents,
  memories,
  messages,
  projects,
  researchRuns,
  usageRecords,
} from '../schema'
import { requireUser } from '../session'

export const profileRouter = new Hono<{ Bindings: Env }>()

async function countRows(db: Db, table: PgTable, where: SQL | undefined): Promise<number> {
  const [row] = await db.select({ value: sql<number>`count(*)::int` }).from(table).where(where)
  return row?.value ?? 0
}

profileRouter.get('/', async (c) => {
  const user = await requireUser(c)
  const db = getDb(c.env)

  const [account] = await db
    .select({ id: baUser.id, name: baUser.name, email: baUser.email, createdAt: baUser.createdAt })
    .from(baUser)
    .where(eq(baUser.id, user.id))
    .limit(1)

  const [
    conversationsCount,
    projectsCount,
    agentsCount,
    documentsCount,
    memoriesCount,
    researchCount,
    codeCount,
    imageCount,
    apiKeyCount,
    messageCount,
  ] = await Promise.all([
    countRows(db, conversations, and(eq(conversations.userId, user.id), isNull(conversations.deletedAt))),
    countRows(db, projects, and(eq(projects.userId, user.id), isNull(projects.deletedAt))),
    countRows(db, agents, and(eq(agents.userId, user.id), isNull(agents.deletedAt))),
    countRows(db, documents, and(eq(documents.userId, user.id), isNull(documents.deletedAt))),
    countRows(db, memories, and(eq(memories.userId, user.id), isNull(memories.deletedAt))),
    countRows(db, researchRuns, and(eq(researchRuns.userId, user.id), isNull(researchRuns.deletedAt))),
    countRows(db, codeArtifacts, and(eq(codeArtifacts.userId, user.id), isNull(codeArtifacts.deletedAt))),
    countRows(db, artifacts, and(eq(artifacts.userId, user.id), isNull(artifacts.deletedAt))),
    countRows(db, apiKeys, and(eq(apiKeys.userId, user.id), isNull(apiKeys.deletedAt))),
    countRows(db, messages, eq(messages.userId, user.id)),
  ])

  const [usage] = await db
    .select({
      requests: sql<number>`count(*)::int`,
      inputTokens: sql<number>`coalesce(sum(${usageRecords.inputTokens}), 0)::int`,
      outputTokens: sql<number>`coalesce(sum(${usageRecords.outputTokens}), 0)::int`,
      costMicros: sql<number>`coalesce(sum(${usageRecords.costMicros}), 0)::bigint`,
    })
    .from(usageRecords)
    .where(eq(usageRecords.userId, user.id))

  return c.json({
    id: account?.id ?? user.id,
    name: account?.name ?? user.name ?? null,
    email: account?.email ?? user.email,
    createdAt: account?.createdAt ?? null,
    stats: {
      conversations: conversationsCount,
      messages: messageCount,
      projects: projectsCount,
      agents: agentsCount,
      documents: documentsCount,
      memories: memoriesCount,
      research: researchCount,
      codeArtifacts: codeCount,
      images: imageCount,
      apiKeys: apiKeyCount,
      requests: Number(usage?.requests ?? 0),
      inputTokens: Number(usage?.inputTokens ?? 0),
      outputTokens: Number(usage?.outputTokens ?? 0),
      costMicros: Number(usage?.costMicros ?? 0),
    },
  })
})
