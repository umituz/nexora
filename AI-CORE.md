# Nexora AI Core — Project-Local Implementation

The AI layer is implemented entirely inside this project (`api/ai/` + chat UI in `src/`).
It deliberately does **not** depend on `@umituz/web-ai`, `@umituz/web-ai-*` provider
packages, or any future Umituz AI package (owner directive). The internal architecture
is designed so mature modules can later be extracted into Umituz packages without a
rewrite: explicit contracts, no UI coupling, no route coupling, provider specifics
isolated in adapters, database access behind narrow repository functions.

## Modules

```
api/ai/
├── providers/
│   ├── openai-compatible.ts  # adapter: OpenAI chat-completions wire (Groq, OpenAI), SSE, error mapping
│   ├── images.ts             # adapter: OpenAI Images API wire (gpt-image family), b64 payload, usage
│   ├── embeddings.ts         # adapter: OpenAI embeddings wire, index-ordered, batch-complete check
│   ├── anthropic.ts          # adapter: Anthropic Messages API wire (own SSE event format)
│   └── index.ts              # adapter registry: adapter kind (from provider row) → factory
├── memories.ts         # long-term memory selection (pinned-first, recency, caps) + loader
├── model-registry.ts   # DB-backed catalog: available models (provider key present + active)
├── model-router.ts     # model id → provider row + adapter; capability & param validation; timeouts
├── prompt-engine.ts    # system prompt assembly, versioned templates, dynamic context slots
├── context-manager.ts  # history windowing, token estimation, context budget enforcement
├── streaming.ts        # provider-independent SSE event protocol + cancellation
├── failover.ts         # pure policy: when a failed attempt may retry on another provider
├── execution.ts        # generation lifecycle orchestration (validate → context → stream → persist → usage)
├── chunker.ts          # pure: paragraph-aware text splitting for knowledge indexing
├── knowledge.ts        # document/chunk repository: index, pgvector KNN search, list/delete
├── search.ts           # web search capability module (Tavily), decoupled from chat
├── tools.ts            # builtin tool arg schemas + executors (approval-gated loop)
├── tasks.ts            # task engine: queue, claim, retry/backoff policy, logs, kicks
├── task-handlers.ts    # builtin task consumers (index_document)
├── usage.ts            # cost computation from registry pricing; usage record construction
└── errors.ts           # AiError taxonomy; normalization of provider HTTP/stream failures
```

## Contract summary (`shared/ai/contracts.ts` — shared with the SPA)

```ts
type ChatRole = 'system' | 'user' | 'assistant';
interface ChatMessage { role: ChatRole; content: string }

interface GenerationRequest {
  messages: ChatMessage[];
  model: ResolvedModel;            // registry row + provider row
  settings: GenerationSettings;    // temperature, maxOutputTokens, topP
  signal?: AbortSignal;            // client cancellation
}

type ProviderEvent =
  | { type: 'delta'; channel: 'answer' | 'reasoning'; text: string }
  | { type: 'usage'; inputTokens: number; outputTokens: number; reasoningTokens?: number };

interface ChatAdapter {
  stream(req: GenerationRequest): AsyncIterable<ProviderEvent>;   // streaming path
}

interface ModelCapabilities { streaming: boolean; tools: boolean; structured: boolean; reasoning: boolean; vision: boolean }
interface ModelPricing { inputPerMTok: number; outputPerMTok: number; currency: 'USD' }
```

Verified against the live Groq API (2026-11-08): SSE chunks carry `delta.content`
(answer) and `delta.reasoning` + `channel: "analysis"` (reasoning) — both channels are
first-class in the contract. Usage arrives in a terminal chunk via
`stream_options: { include_usage: true }`.

## Provider adapters

| adapter kind | wire | providers (seeded) | env var |
|---|---|---|---|
| `openai-compatible` | `POST {base}/chat/completions`, OpenAI SSE chunks | Groq, OpenAI | `GROQ_API_KEY` (live), `OPENAI_API_KEY` |
| `anthropic` | `POST {base}/v1/messages`, Anthropic SSE events | Anthropic | `ANTHROPIC_API_KEY` |

- A provider row (adapter kind + base URL + `api_key_env`) plus model rows are all it
  takes to activate a provider — no code changes, keys are Worker secrets referenced
  by name. Models of providers without a key are hidden from the catalog instead of
  failing at request time.
- Groq streaming is live-verified. OpenAI and Anthropic adapters are implemented and
  unit-tested against their documented wire formats (official pricing pages,
  2026-11-08), but **not** live-verified: set `OPENAI_API_KEY` / `ANTHROPIC_API_KEY`
  to activate them.
- Anthropic wire specifics handled by its adapter: `system` is a top-level request
  param (never a message role), `max_tokens` is required, usage arrives via
  `message_start`/`message_delta` events, and sampling params (`temperature`,
  `top_p`) are omitted because current Claude models reject them with a 400 — the
  registry's temperature/topP settings apply to OpenAI-compatible providers only.

## Image generation

- `POST /api/artifacts` generates one image from a prompt: `resolveImageModel`
  picks the requested model or the first available model whose `outputTypes`
  include `image` (chat models are rejected with 400), the OpenAI Images adapter
  posts `{base}/images/generations` (`model`, `prompt`, `n: 1`, `size`,
  `quality`) and reads `data[0].b64_json` plus the `usage` object
  (`input_tokens`/`output_tokens`). Tokens and cost flow through the same
  usage pipeline as chat (registry pricing, micro-USD records) with no
  conversation binding.
- Wire and pricing verified against OpenAI's official docs (2026-11-08):
  gpt-image-2.5 text input $5/MTok, image output $30/MTok. The seeded image
  models' `contextWindow`/`maxOutputTokens` are internal validation bounds —
  OpenAI publishes no context window for them; prompts are capped at 4000
  chars by the route.
- Image bytes are stored base64 in Neon (pilot path, ≤12 MB base64 cap);
  R2 object storage is the documented production path, same as attachments.
- Versioning: artifacts carry `rootId` + `version`. Generating with `basedOnId`
  creates the next version of the base artifact's root (prompt, model, size and
  quality inherited unless overridden) — a chain of variations stays one root
  regardless of which member it branches from. `GET /api/artifacts/:id/versions`
  returns the whole chain, newest first.
- The pipeline is E2E-verified against the documented wire via a scratch local
  stub provider (generate → store → serve → download → delete → usage record);
  **live OpenAI generation is not verified** — set `OPENAI_API_KEY` to activate
  the seeded gpt-image models.

## Server → client streaming protocol (`streaming.ts`)

Standard SSE (`text/event-stream`) on `POST /api/chat/:conversationId/stream`:

| event | data | meaning |
|---|---|---|
| `delta` | `{ channel: 'answer' \| 'reasoning', text }` | partial output |
| `usage` | `{ inputTokens, outputTokens, reasoningTokens }` | final token usage |
| `tool_call` | `{ toolCall }` | the model requested a tool; the call is pending approval (no `done` follows) |
| `done` | `{ messageId }` | assistant message persisted |
| `error` | `{ code, message }` | normalized failure (stream continues to close) |

Cancellation: the client aborts the fetch and then persists the partial text it already
received via `POST /api/conversations/:id/stop` (status `stopped`). The server also watches
the request signal and attempts the same persist through `waitUntil`, but the Workers
runtime cancels the request's I/O context on client disconnect, so the client-driven stop
is the reliable path (verified live, 2026-11-08). The stop endpoint is idempotent: if an
assistant row already trails the thread it is returned unchanged, and server-side
finalizers skip inserting when a trailing assistant row exists, so a raced stop and
server finalize never duplicate rows.

## Provider failover

When an attempt fails before any output has streamed and the error is transient
(`capacity`, `rate_limited`, `timeout`, `network`), execution retries once on the
workspace default model — but only if it lives on a **different provider** and supports
streaming. Deterministic failures (`invalid_key`, `invalid_request`,
`model_unavailable`, …) and mid-stream failures (partial output already delivered)
never fail over: the user sees the error and the partial message persists. Policy is a
pure, unit-tested module (`failover.ts`); orchestration lives in `execution.ts`.

## Model router

- Input: model id (registry id) + requested settings.
- Resolution: registry row → provider row → adapter kind → adapter instance
  (configured with base URL + worker-secret API key, resolved by `api_key_env` name).
- Validation: model active, provider available (key present in env), requested
  capabilities supported, output token count within model max, settings within bounds.
- No provider business logic in the router; no registry knowledge in adapters.

## Context manager

- Strategy (configurable): recent-messages window within the model's context budget,
  always ending with the newest user message; system prompt occupies the head.
- Token estimation: characters/4 heuristic (no tokenizer dependency); budget checks
  against registry `context_window` minus requested `max_output_tokens`. Serialized
  tool-call structure counts toward a message's estimate, and a window never starts
  with an unpaired assistant-tool-call or tool-result message (leading fragments are
  trimmed so provider replay validation always passes).
- Phase 2 landed: project instructions, long-term memories (pinned-first, recency-ordered,
  capped 20 items / 4 K chars), and attachment text are prioritized context segments
  assembled by the prompt engine (never ad-hoc concatenation in handlers). Retrieved
  knowledge follows the same pattern.

## Prompt engine

- Versioned system prompt template (constant + interpolation slots, currently v2),
  assembled per request: base persona → conversation settings → project instructions →
  memories → attachment text blocks (delimited begin/end, capped).
- Attachment content is untrusted data: injected inside delimited blocks, never treated
  as system instructions. Memories are user-authored facts surfaced as bullets.
- Prompt text never lives in UI components or route handlers.

## Usage & cost

- Tokens come from the provider (never estimated for billing rows).
- Cost = tokens × registry pricing (per-million rates), stored as integer micro-USD
  per record; pricing is data, never hardcoded.
- Provider cost is kept separate from any future subscription/billing logic.

## Error taxonomy (`errors.ts`)

`invalid_key | missing_key | rate_limited | capacity | timeout | invalid_request |
upstream_error | network | cancelled` — each with a user-safe message. Mapped to the
fleet envelope for request-time failures (ApiError) or to `error` stream events for
mid-stream failures. Provider response bodies are logged server-side only.

## Agents and tools

- Tool registry (`nexora_tools`): seeded builtin tools with JSON-Schema
  parameters and a `requiresApproval` flag; read-only through `/api/tools`.
  The four seeded tools map to implemented executors — `generate_image`
  (artifact pipeline), `save_memory` (memory engine, `source: 'agent'`),
  `web_search` (Tavily-backed capability module, below), and
  `search_knowledge` (pgvector retrieval, below).
  No tool is seeded before its executor exists.
- Agents (`nexora_agents`): per-user name, description, standing instructions,
  an optional bound model (must produce text) and tool bindings validated
  against the registry at write time. CRUD mirrors the projects/memories
  pattern; the Agents page manages bindings.
- Execution loop (live-verified against Groq, 2026-11-08): a conversation
  binds an agent via `conversations.agentId` (validated on create/PATCH).
  Generation in an agent conversation injects the agent instructions into the
  system prompt, prefers the agent's bound model (`request → agent →
  conversation`), and offers the bound tools to the model (OpenAI wire
  `tools` + `tool_choice: auto`, OpenAI-compatible providers only — the
  gate rejects other adapters and models without the `tools` capability;
  failover is disabled for tool-carrying requests so a tool conversation
  never silently degrades to another provider).
- When the model requests a tool, the streamed turn persists as an assistant
  message carrying the provider `tool_calls` array, each call becomes a
  `nexora_tool_calls` history row (`pending`), and the stream emits a
  `tool_call` SSE event instead of `done`. Unknown tool names requested by
  the model are marked `failed` immediately with a synthetic tool-result
  message, so the continuation request always satisfies provider replay
  validation.
- Approval: `POST /api/conversations/:id/tool-calls/:callId/resolve
  {approved}` rejects, or executes after zod-validated args (`failed` on
  validation/executor errors, never a 500), writes a role-`tool` result
  message, and — when no other calls are pending — streams the continuation
  generation itself (SSE). Rejection feeds `{status: 'rejected'}` back to the
  model so it can answer honestly; the loop supports chained calls (a
  continuation may request further tools). Re-resolving a settled call is
  409; every endpoint is user-scoped.
- Arg schemas live in `api/ai/tools.ts` next to the executors; the image
  core (`generateArtifact`) is shared with the Studio route so the tool and
  the page generate identically.
- The `generate_image` executor's failure path is live-verified (no
  `OPENAI_API_KEY` in this workspace → call marked `failed`, model informed,
  answers without the image); its success path is verified through the same
  shared core via the Studio stub E2E.

## Web search (capability module)

- `api/ai/search.ts` is a standalone capability — `searchWeb(env, {query,
  maxResults?, topic?, includeAnswer?})` — with no dependency on the chat
  engine, agents, or tools; any route may call it directly. The `web_search`
  tool executor is one such caller, so search also flows through the
  approval-gated loop above.
- Provider: Tavily (`POST https://api.tavily.com/search`, Bearer auth,
  `TAVILY_API_KEY`). Results are normalized to `{title, url, snippet}` with
  malformed entries dropped, `maxResults` clamped server-side to 1–5.
  Upstream statuses reuse the shared `AiError` mapping (401 → `invalid_key`,
  429 → `rate_limited`, …); network faults map to `network`.
- Untrusted-content stance (live-verified 2026-11-08): the system prompt
  declares tool/search/attachment content to be data, never instructions.
  Live-verified failure path: with no `TAVILY_API_KEY` the approved call
  marks `failed` with "The provider is not configured with an API key." and
  the continuation answers honestly (reports the failure, labels unverified
  recall as low-confidence). **Live search results are not verified in this
  workspace** — set `TAVILY_API_KEY` to activate them.

## Knowledge indexing and retrieval (pgvector)

- Store: `nexora_documents` (per-user title, char/chunk counts, embedding
  model) and `nexora_document_chunks` (ordinal, text, `vector(1536)`
  embedding). Requires the `vector` extension on Neon
  (`CREATE EXTENSION vector` — one-time, already applied to this database;
  verified live 2026-11-08).
- `api/ai/chunker.ts` (pure): paragraph-aware splitting into ≤1200-char
  chunks with 160-char carry overlap; sentence boundaries outrank newlines
  outrank spaces, oversize hard-cuts as last resort.
- `api/ai/providers/embeddings.ts`: OpenAI-wire embeddings adapter
  (`POST {base}/embeddings`), reorders by index, rejects incomplete batches,
  reuses the shared `AiError` mapping. Models declare
  `capabilities.embeddings`; `resolveEmbeddingModel` picks the first
  available one (seeded: OpenAI `text-embedding-3-small`, 1536 dims,
  $0.02/MTok input). `embedTexts` batches at 32 inputs per call and records
  usage with the standard cost pipeline.
- `api/ai/knowledge.ts`: `createPendingDocument` (status `indexing`),
  `executeIndexing` (chunk → embed → insert, all or nothing),
  `markDocumentFailed`, `searchKnowledge` (embed query → pgvector KNN
  `ORDER BY embedding <=> query LIMIT k`, user-scoped, soft-delete aware),
  plus list/delete. Routes under `/api/documents`; indexing runs as a
  background task (below), so create returns 202 with the document and a
  `taskId` and the Knowledge page polls the task until terminal, then
  refreshes. The `search_knowledge` builtin tool exposes retrieval to
  agents through the approval-gated loop.
- Verification tier (2026-11-08): chunker, adapter, and batching are
  unit-tested; the **full pipeline is live-verified against a local stub
  OpenAI-wire embeddings server with real pgvector KNN on Neon** (document
  → 5 chunks → vectors stored; "payroll" query ranks payroll chunks at
  distance 0, onboarding chunks last, and vice versa; UI indexing and
  retrieval box verified in the browser). Without an embedding provider key
  search fails gracefully with 503 "No embedding model is configured for
  this workspace" (live-verified) and an upload is accepted (202) but its
  task fails terminally with that same message, marking the document
  `failed` (live-verified). **Live OpenAI embeddings are not verified in
  this workspace** — set `OPENAI_API_KEY` to activate them.

## Task engine (`api/ai/tasks.ts`)

- Store: `nexora_tasks` (per-user `kind`, `status`, jsonb `payload`/`result`/
  `logs`, `attempts`/`maxAttempts`, `nextAttemptAt` as ISO text — avoids the
  timestamptz round-trip hazard on Neon). Statuses:
  `queued → running → succeeded | failed`, plus `cancelled`.
- Policies per kind (`TASK_POLICIES`): `index_document` retries up to 3
  attempts with exponential backoff (2 s base, doubling, capped at 30 s).
  The decision functions (`nextAttemptDelayMs`, `canStart`, `planFailure`)
  are pure and unit-tested.
- Execution: `runTask` claims a task with a guarded update
  (`WHERE status = 'queued'`), so a double kick can never run it twice;
  each attempt appends a timestamped log entry (jsonb concat), failures
  either re-queue with a scheduled retry or terminally fail.
- Scheduling: this Worker runs no cron, so due tasks are kicked by traffic —
  `GET /api/tasks` and `GET /api/tasks/:id` schedule due queued tasks via
  `executionCtx.waitUntil(runTask(...))`, and enqueue kicks attempt 1
  immediately. While nobody polls, retries simply wait.
- Endpoints: list (user-scoped), get, `POST /:id/cancel` (queued-only, else
  409), `POST /:id/retry` (failed **or** cancelled — resets attempts/error
  and kicks immediately; a cancelled task's document would otherwise be
  stranded in `indexing`).
- First consumer: `index_document` (create-pending → chunk → embed →
  ready, or `markDocumentFailed` on every failed attempt). Tasks are audit
  history — deleting a document does not delete its task rows (same stance
  as usage records).
- Verification (2026-11-08, live against the stub embeddings provider):
  async happy path (202 → succeeded attempt 1 → document ready → KNN
  correct), retry cycle (provider down: attempts 1→2→3 with poll-driven
  kicks and 2 s/4 s backoff → terminal failed, document `failed` with the
  error message), manual retry (failed → succeeded, document ready), cancel
  mid-backoff (queued → cancelled → retry-from-cancelled → succeeded), and
  the no-key degradation path above. UI polling and the status chip
  (Indexing → Ready) verified in the browser.

## What stays out

- No auto-executing tools yet: every seeded tool is `requiresApproval` and the
  runtime pauses each call for an explicit approve/reject. A no-approval fast
  path would run inside the same executor and history pipeline when needed.
- Retrieved chunks are not auto-injected into prompts: knowledge reaches the
  model through the approval-gated `search_knowledge` tool, keeping every
  retrieval visible to the user. A RAG auto-context path would reuse
  `searchKnowledge` behind the same context-manager budget.
- Generated code is never executed server-side (future sandbox requirement documented in TODO).
