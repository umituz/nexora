import { uid } from '@umituz/web-hono'
import { activity } from './schema'
import { dispatchWebhooks } from './webhooks'
import type { Db } from './env'

export interface ActivityTarget {
  type: string
  id: string
  label?: string
}

export async function logActivity(
  db: Db,
  userId: string,
  action: string,
  target?: ActivityTarget,
): Promise<void> {
  await db.insert(activity).values({
    id: uid('act'),
    userId,
    action,
    targetType: target?.type ?? null,
    targetId: target?.id ?? null,
    targetLabel: target?.label ?? null,
  })
  await dispatchWebhooks(db, userId, action, {
    targetType: target?.type ?? null,
    targetId: target?.id ?? null,
    targetLabel: target?.label ?? null,
  })
}
