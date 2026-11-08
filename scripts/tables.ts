import { getTableName } from 'drizzle-orm'
import { isTable } from 'drizzle-orm/table'
import type { PgTable } from 'drizzle-orm/pg-core'
import * as s from '../api/schema'

function spec(table: PgTable) {
  return { name: getTableName(table), table }
}

const tables = (Object.values(s) as unknown[]).filter(isTable) as PgTable[]

function dependencyOrdered(specs: { name: string; table: PgTable }[]): { name: string; table: PgTable }[] {
  const INLINE_FKS = Symbol.for('drizzle:PgInlineForeignKeys')
  const names = new Set(specs.map((item) => item.name))
  const deps = new Map<string, Set<string>>()
  for (const item of specs) {
    const parents = new Set<string>()
    const inline = ((item.table as unknown as Record<symbol, unknown>)[INLINE_FKS] ?? []) as {
      reference?: () => { foreignTable?: unknown }
    }[]
    for (const fk of inline) {
      const target = fk.reference?.()?.foreignTable
      const targetName = target instanceof Object ? getTableName(target as PgTable) : undefined
      if (targetName && targetName !== item.name && names.has(targetName)) parents.add(targetName)
    }
    deps.set(item.name, parents)
  }

  const ordered: { name: string; table: PgTable }[] = []
  const placed = new Set<string>()
  let progress = true
  while (ordered.length < specs.length && progress) {
    progress = false
    for (const item of specs) {
      if (placed.has(item.name)) continue
      if ([...(deps.get(item.name) ?? [])].every((parent) => placed.has(parent))) {
        ordered.push(item)
        placed.add(item.name)
        progress = true
      }
    }
  }
  return [...ordered, ...specs.filter((item) => !placed.has(item.name))]
}

export const TABLE_SPECS: { name: string; table: PgTable }[] = dependencyOrdered(tables.map(spec))
