# Nexora AI — Architecture

Nexora is a unified AI workspace built as a fleet-standard single-origin application:
one Cloudflare Worker serving the compiled SPA (via ASSETS binding) and the Hono API
(`/api/*`). All architecture decisions follow the fleet playbook (`../saas-build/SaaS_BUILD.md`)
with the pilot project (hangora) as the comparison base, plus one deliberate divergence:
the AI layer is implemented project-locally (see AI-CORE.md).

## Topology

```
Browser
  └─ Vite SPA (React 19, react-router ^7 core, Tailwind v4 camp)
       │  same-origin /api/* — apiFetch/apiWrite, never raw fetch
       ▼
Cloudflare Worker (single origin)
  ├─ ASSETS binding → compiled SPA (SPA fallback for non-/api routes)
  └─ Hono app (createApi from @umituz/web-hono)
       ├─ /api/health, /api/bootstrap
       ├─ /api/auth/*  (better-auth via web-hono mountAuth)
       ├─ /api/conversations, /api/models, /api/usage …
       └─ /api/chat/:id/stream (SSE — project-local streaming engine)
            │
            ▼
       AI Core (api/ai/* — project-local)
            │ provider adapters (Groq first, OpenAI-compatible wire)
            ▼
       External AI providers (server-side keys only)
            │
            ▼
       Neon Postgres (Drizzle, neon-http driver, TABLE_PREFIX `nexora`)
```

Postgres also carries the vector store: the `vector` extension (pgvector,
one-time `CREATE EXTENSION vector`) backs `nexora_document_chunks.embeddings`
with KNN retrieval, and the background task queue `nexora_tasks` (document
indexing and research runs with retries/backoff; kicked by request traffic
since the Worker runs no cron). See AI-CORE.md → "Knowledge indexing and
retrieval", "Research workflows with citations", and "Task engine".

## Repository layout (fleet standard)

```
nexora/
├── vite.config.ts            # port 5190 strictPort, /api → 127.0.0.1:8792 proxy
├── tsconfig.json / tsconfig.api.json
├── wrangler.jsonc            # main api/index.ts, ASSETS binding, dev port 8792
├── drizzle.config.ts         # → api/schema.ts
├── api/
│   ├── index.ts              # createApi({ service, build, routers }) — no logic
│   ├── env.ts                # ApiEnv & AuthEnv & AiEnv re-export
│   ├── db.ts                 # getDb(env, schema)
│   ├── schema.ts             # ALL tables, single file, TABLE_PREFIX + trio()
│   ├── ai/                   # project-local AI Core (AI-CORE.md)
│   └── routes/               # domain routers, full sub-paths only
├── scripts/
│   ├── tables.ts             # TABLE_SPECS (seed order)
│   ├── seed.ts / snapshot.ts / reset.ts   # thin wrappers → web-hono /lifecycle
│   └── seed-models.ts        # verified provider/model catalog
└── src/
    ├── main.tsx / App.tsx    # router + providers
    ├── pages/                # route screens
    ├── components/chat/      # chat UI building blocks (DS-driven)
    ├── data/                 # createStore adapter + repositories
    ├── locales/en-US.ts      # source catalog (web-localization)
    ├── styles/               # app.css with --app-* palette slots
    └── lib/                  # sse client, formatting
```

## Data model (Phase 1)

All tables prefixed `nexora_`, soft delete everywhere (`deleted_at IS NULL` reads,
partial unique indexes), timestamp trio via `trio()`.

| Table | Purpose | Key columns |
|---|---|---|
| `nexora_ba_*` | better-auth user/session/account/verification (web-hono `authTables`) | id, email unique |
| `nexora_providers` | AI provider registry rows | id (`groq`), adapter kind, base_url, api_key_env (name of worker secret — never the key) |
| `nexora_models` | Model catalog — data-driven capabilities & pricing | provider_id, external_id (unique per provider), capabilities jsonb, context_window, max_output_tokens, pricing jsonb |
| `nexora_conversations` | Chat threads, per-user isolation | user_id, title, model_id, is_temporary, settings jsonb |
| `nexora_messages` | Messages incl. reasoning channel & per-message usage | conversation_id, role, content, reasoning, model_id, status, usage jsonb, error jsonb |
| `nexora_usage_records` | Provider usage & cost ledger (per request) | user/conversation/message ids, provider, model, token counts, cost micros, duration_ms, status |

Isolation: every user-facing query filters by the authenticated user id from the
session. Model/provider registries are global read-only reference data.

## Request lifecycle (chat generation)

1. Authenticate (better-auth session; 401 otherwise).
2. Validate request (zod): conversation ownership, model id, generation settings.
3. Load conversation + message history; reject unknown/inactive model.
4. Context manager builds the model-visible context (system prompt, windowed history)
   within the model's context budget.
5. Model router resolves registry row → provider → adapter; validates capabilities
   (streaming) and applies timeouts.
6. Adapter executes against the provider (SSE upstream); streaming engine forwards
   provider-independent events to the client.
7. On completion/stop/error the assistant message is persisted with usage + status.
8. Usage record written (tokens from provider, cost computed from registry pricing).
9. Cancellation (client abort) persists partial output with status `stopped`.

## Security posture

- Provider API keys live only in Worker secrets; referenced by name in the registry.
- All chat/usage endpoints require a session; rows are user-scoped.
- Model outputs are untrusted input: rendered as markdown through DS `MarkdownText`
  (no raw HTML injection), never interpreted as instructions.
- Uploads: multipart only, ≤2 MB per file, validated by type/size and processed server-side
  only; text-like files get synchronous UTF-8 extraction (capped 24 K/file, 48 K total into
  the system prompt), binary files are stored without extraction. Storage is base64 in Neon
  for the pilot; R2 is the production path (swap `attachments.contentB64` for an R2 key —
  `@umituz/web-hono` R2 stream helpers already provide the write/read primitives).
- Generated artifacts (studio images): same posture — base64 in Neon capped at 12 MB
  (`artifacts.dataBase64`), served only to the owning user through `/image` (inline,
  immutable cache) and `/download` (attachment) endpoints; R2 swap follows the
  attachments path.
- Agent tool calls never execute without an explicit per-call approval: the model's
  request is persisted (`nexora_tool_calls`, status `pending`) and only the owning
  user's `resolve` call executes it, after zod arg validation against the registry
  schema. Tool args and results are data (jsonb), executors are server-side builtins
  only, and the full history (pending → approved/rejected → succeeded/failed, with
  result/error) is queryable per conversation.
- Errors normalized through the fleet error envelope (`{ error, details? }`); provider
  internals never leak to clients.

## Dev workflow

- `npm run dev` — Vite on :5190 (proxies /api).
- `npm run dev:api` — wrangler dev on :8792 (requires one `npm run build` for dist/).
- `npm run db:push` / `db:seed` / `db:snapshot` / `db:reset` — Drizzle + lifecycle.
- Gates: `lint` (0/0), `typecheck` (0), `build`, `test` (vitest).
- Deploy: `npm run deploy` (cf-ship) → https://nexora.umituz998.workers.dev
