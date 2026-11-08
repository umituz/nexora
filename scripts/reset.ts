import { resetTables } from '@umituz/web-hono/lifecycle'
import { TABLE_PREFIX } from '../api/schema'
import { TABLE_SPECS } from './tables'
import { guardDbTarget } from './db-guard'

async function main() {
  const url = await guardDbTarget('db:reset (DROP TABLE … CASCADE on every nexora_* table)', {
    destructive: true,
  })
  await resetTables({ specs: TABLE_SPECS, prefix: TABLE_PREFIX, url })
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
