import 'dotenv/config'
import { createInterface } from 'node:readline/promises'
import { stdin, stdout } from 'node:process'

const LOCAL_HOSTS = new Set(['localhost', '127.0.0.1', '::1'])

export function requireDatabaseUrl(): string {
  const url = process.env.DATABASE_URL
  if (!url) {
    console.error(
      'DATABASE_URL is required. Scripts read .env only (never .dev.vars);\n' +
        'copy .env.example and fill in the Neon connection string.',
    )
    process.exit(1)
  }
  return url
}

function hostnameOf(url: string): string {
  try {
    return new URL(url).hostname
  } catch {
    return ''
  }
}

export async function guardDbTarget(action: string, opts: { destructive?: boolean } = {}): Promise<string> {
  const url = requireDatabaseUrl()
  const host = hostnameOf(url)
  if (LOCAL_HOSTS.has(host)) return url

  if (process.env.ALLOW_REMOTE_DB !== '1') {
    console.error(
      `⛔ ${action} targets a REMOTE database (${host || 'unparsable URL'}).\n` +
        '   This is usually production. If that is really the intent:\n' +
        '   ALLOW_REMOTE_DB=1 npm run <script>' +
        (opts.destructive ? '  (+ hostname confirmation below)' : ''),
    )
    process.exit(1)
  }

  console.warn(`⚠️  ${action} is running against a REMOTE database: ${host}`)
  if (!opts.destructive) return url

  if (process.env.CONFIRM_REMOTE_DB === host) return url
  if (!stdin.isTTY) {
    console.error(
      `⛔ Destructive action on ${host} in a non-interactive shell.\n` +
        `   Re-run with ALLOW_REMOTE_DB=1 CONFIRM_REMOTE_DB=${host} npm run <script>`,
    )
    process.exit(1)
  }
  const rl = createInterface({ input: stdin, output: stdout })
  const answer = (
    await rl.question(`This will IRREVERSIBLY modify ${host}. Type the hostname to confirm: `)
  ).trim()
  rl.close()
  if (answer !== host) {
    console.error('Confirmation did not match — aborting.')
    process.exit(1)
  }
  return url
}
