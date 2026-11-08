import { and, desc, eq, isNull } from 'drizzle-orm'
import {
  selectMemories,
  type MemoryLike,
  MEMORY_MAX_ITEMS,
  MEMORY_TOTAL_LIMIT,
} from '@umituz/web-ai'
import type { Db } from '../env'
import { memories } from '../schema'

export {
  selectMemories,
  type MemoryLike,
  MEMORY_MAX_ITEMS,
  MEMORY_TOTAL_LIMIT,
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
