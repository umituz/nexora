import { and, eq, sql } from 'drizzle-orm'
import { uid } from '@umituz/web-hono'
import { canStartTask, planTaskFailure } from '@umituz/web-ai'
import { tasks, type TaskLogEntry, type TaskStatus } from '../schema'
import type { Db, Env } from '../env'

export const TASK_BACKOFF_CAP_MS = 30_000

export type TaskKind = 'index_document' | 'research'

export const TASK_POLICIES: Readonly<Record<TaskKind, { maxAttempts: number; backoffBaseMs: number }>> = {
  index_document: { maxAttempts: 3, backoffBaseMs: 2000 },
  research: { maxAttempts: 2, backoffBaseMs: 4000 },
}

export interface TaskRowLite {
  id: string
  kind: string
  status: TaskStatus
  attempts: number
  maxAttempts: number
  nextAttemptAt: string | null
}

function planFailure(
  row: Pick<TaskRowLite, 'attempts' | 'maxAttempts'>,
  message: string,
  backoffBaseMs: number,
  now: Date,
): { status: 'queued' | 'failed'; nextAttemptAt: string | null; log: TaskLogEntry } {
  const plan = planTaskFailure(row, message, backoffBaseMs, now)
  return {
    status: plan.status,
    nextAttemptAt: plan.nextAttemptAt,
    log: { at: plan.log.at, level: plan.log.level === 'info' ? 'info' : 'error', message: plan.log.message },
  }
}

export async function enqueueTask(
  db: Db,
  input: { userId: string; kind: TaskKind; payload: Record<string, unknown> },
): Promise<TaskRowLite & { createdAt: Date }> {
  const policy = TASK_POLICIES[input.kind]
  const [row] = await db
    .insert(tasks)
    .values({
      id: uid('task'),
      userId: input.userId,
      kind: input.kind,
      status: 'queued',
      payload: input.payload,
      attempts: 0,
      maxAttempts: policy.maxAttempts,
      nextAttemptAt: null,
      logs: [],
    })
    .returning({
      id: tasks.id,
      kind: tasks.kind,
      status: tasks.status,
      attempts: tasks.attempts,
      maxAttempts: tasks.maxAttempts,
      nextAttemptAt: tasks.nextAttemptAt,
      createdAt: tasks.createdAt,
    })
  return row
}

async function appendLog(db: Db, id: string, entry: TaskLogEntry): Promise<void> {
  await db
    .update(tasks)
    .set({ logs: sql`${tasks.logs} || ${JSON.stringify([entry])}::jsonb`, updatedAt: new Date() })
    .where(eq(tasks.id, id))
}

type TaskHandler = (db: Db, env: Env, task: { id: string; userId: string; payload: Record<string, unknown> }) => Promise<Record<string, unknown>>

const HANDLERS: Partial<Record<TaskKind, TaskHandler>> = {}

export function registerTaskHandler(kind: TaskKind, handler: TaskHandler): void {
  HANDLERS[kind] = handler
}

export async function runTask(db: Db, env: Env, taskId: string): Promise<void> {
  const [claimed] = await db
    .update(tasks)
    .set({ status: 'running', attempts: sql`${tasks.attempts} + 1`, updatedAt: new Date() })
    .where(and(eq(tasks.id, taskId), eq(tasks.status, 'queued')))
    .returning({ id: tasks.id, kind: tasks.kind, userId: tasks.userId, payload: tasks.payload, attempts: tasks.attempts, maxAttempts: tasks.maxAttempts })

  if (!claimed) return
  const now = new Date()
  await appendLog(db, taskId, { at: now.toISOString(), level: 'info', message: `Attempt ${claimed.attempts} started` })

  const handler = HANDLERS[claimed.kind as TaskKind]
  try {
    if (!handler) throw new Error(`No handler registered for task kind: ${claimed.kind}`)
    const result = await handler(db, env, { id: claimed.id, userId: claimed.userId, payload: claimed.payload })
    const doneAt = new Date()
    await db
      .update(tasks)
      .set({ status: 'succeeded', result, nextAttemptAt: null, updatedAt: doneAt })
      .where(eq(tasks.id, taskId))
    await appendLog(db, taskId, { at: doneAt.toISOString(), level: 'info', message: 'Succeeded' })
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Task failed'
    const plan = planFailure(claimed, message, TASK_POLICIES[claimed.kind as TaskKind]?.backoffBaseMs ?? 2000, new Date())
    await db
      .update(tasks)
      .set({ status: plan.status, error: message, nextAttemptAt: plan.nextAttemptAt, updatedAt: new Date() })
      .where(eq(tasks.id, taskId))
    await appendLog(db, taskId, plan.log)
  }
}

export async function kickDueTasks(
  db: Db,
  env: Env,
  userId: string,
  waitUntil: (promise: Promise<unknown>) => void,
  onlyTaskId?: string,
): Promise<number> {
  const rows = await db
    .select({ id: tasks.id, status: tasks.status, nextAttemptAt: tasks.nextAttemptAt })
    .from(tasks)
    .where(and(eq(tasks.userId, userId), eq(tasks.status, 'queued')))
  const now = new Date()
  let kicked = 0
  for (const row of rows) {
    if (onlyTaskId && row.id !== onlyTaskId) continue
    if (!canStartTask(row, now)) continue
    kicked += 1
    waitUntil(runTask(db, env, row.id))
  }
  return kicked
}
