import type { Context } from 'hono'
import { ApiError } from '@umituz/web-hono'
import { createSessionHelpers, type SessionUserInfo } from '@umituz/web-hono/auth'
import { getAuth } from './auth'
import type { Env } from './env'

type RequestContext = Context<{ Bindings: Env }>

const helpers = createSessionHelpers<Env>(getAuth)

export const scopeOf = (c: RequestContext) => helpers.scopeOf(c)
export const currentUser = (c: RequestContext) => helpers.currentUser(c)

export async function requireUser(c: RequestContext): Promise<SessionUserInfo> {
  const user = await helpers.currentUser(c)
  if (!user) throw new ApiError(401, 'Authentication required')
  return user
}
