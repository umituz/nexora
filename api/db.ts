import { getDb as pkgGetDb } from '@umituz/web-hono'
import type { ApiEnv } from '@umituz/web-hono'
import * as schema from './schema'

export function getDb(env: ApiEnv) {
  return pkgGetDb(env, schema)
}
