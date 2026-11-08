import { and, desc, eq, isNull } from 'drizzle-orm'
import { capText } from '../text-extract'
import type { Db } from '../env'
import { memories } from '../schema'

export const MEMORY_MAX_ITEMS = 20
export const MEMORY_TOTAL_LIMIT = 4_000

export interface MemoryLike {
  content: string
  pinned: boolean
  updatedAt: Date
}

export function selectMemories(
  rows: MemoryLike[],
  maxItems: number = MEMORY_MAX_ITEMS,
  totalLimit: number = MEMORY_TOTAL_LIMIT,
): string[] {
  const ordered = [...rows].sort((a, b) => {
    if (a.pinned !== b.pinned) return a.pinned ? -1 : 1
    return b.updatedAt.getTime() - a.updatedAt.getTime()
  })

  const out: string[] = []
  let used = 0
  for (const row of ordered) {
    if (out.length >= maxItems || used >= totalLimit) break
    const content = row.content.trim()
    if (content.length === 0) continue
    const capped = capText(content, totalLimit - used)
    out.push(capped)
    used += capped.length
  }
  return out
}

export async function loadMemories(db: Db, userId: string): Promise<string[]> {
  const rows = await db
    .select({ content: memories.content, pinned: memories.pinned, updatedAt: memories.updatedAt })
    .from(memories)
    .where(and(eq(memories.userId, userId), isNull(memories.deletedAt)))
    .orderBy(desc(memories.updatedAt))
    .limit(200)
  return selectMemories(rows)
}
