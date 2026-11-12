import { uid } from '@umituz/web-hono'
import { notifications } from './schema'
import type { NotificationSeverity } from './schema'
import { dispatchWebhooks } from './webhooks'
import type { Db } from './env'

export interface NotifyInput {
  userId: string
  type: string
  title: string
  body?: string
  severity?: NotificationSeverity
  link?: string
}

export async function notify(db: Db, input: NotifyInput): Promise<void> {
  await db.insert(notifications).values({
    id: uid('ntf'),
    userId: input.userId,
    type: input.type,
    title: input.title,
    body: input.body ?? null,
    severity: input.severity ?? 'info',
    link: input.link ?? null,
  })
  await dispatchWebhooks(db, input.userId, input.type, {
    title: input.title,
    body: input.body ?? null,
    severity: input.severity ?? 'info',
    link: input.link ?? null,
  })
}
