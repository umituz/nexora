import 'dotenv/config'
import { snapshotToSeed } from '@umituz/web-hono/lifecycle'
import { TABLE_SPECS } from './tables'
import { guardDbTarget } from './db-guard'

const CREDENTIAL_TABLES = new Set([
  'nexora_ba_session',
  'nexora_ba_account',
  'nexora_ba_verification',
  'nexora_ba_user',
])

async function main() {
  const url = await guardDbTarget('db:snapshot')
  const specs = TABLE_SPECS.filter((spec) => !CREDENTIAL_TABLES.has(spec.name))
  console.log(`Excluded from snapshot (credentials): ${[...CREDENTIAL_TABLES].join(', ')}`)
  await snapshotToSeed({ specs, url, outPath: new URL('./seed-data.json.gz', import.meta.url) })
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
