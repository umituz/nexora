# Nexora AI Core

The AI layer is integrated with `@umituz/web-ai` for mature, provider-neutral algorithms (chunking, context budgeting, token estimation, system prompt assembly, cost calculations, task retry policies, and failover), while preserving Nexora-specific execution orchestration, database models, and chat UI. The internal architecture follows clean decoupling: explicit contracts, no UI coupling, no route coupling, provider specifics isolated in adapters, and database access behind narrow repository functions.

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
├── research.ts         # research runs: search + cited synthesis, task-driven
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
- Error mapping reads the provider's `error.type`/`error.code`, not just the HTTP
  status: a 403 permission block (e.g. Groq's `model_permission_blocked_project`)
  maps to `model_unavailable`, while 401/403 api-key rejections stay
  `invalid_key`. `AiError.userMessage` surfaces the provider detail so the
  client sees the actionable message (e.g. the console URL to enable the model).

## Image understanding (vision input)

- Image attachments (`image/*`, stored base64 in `nexora_attachments.content_b64`,
  upload cap 2 MB per file) ride along out-of-band: `AdapterRequest.images` carries
  at most `IMAGE_INPUT_MAX = 4` images per request; `ChatMessage.content` stays a
  plain string, so persisted history and the context manager are unchanged.
- `execution.ts` loads stored image attachments for the conversation, and refuses
  with 400 before any provider call when the resolved model lacks the `vision`
  capability ("Model X does not support images"). When images are present,
  provider failover is skipped — the fallback model may not be vision-capable.
- Wire mapping (unit-tested, per adapter): the OpenAI-compatible adapter merges
  `{type:'image_url', image_url:{url:'data:<mime>;base64,<data>'}}` parts into the
  last user message (or appends an image-only user message when history has no user
  turn); the Anthropic adapter emits `{type:'image', source:{type:'base64',
  media_type, data}}` content blocks on the same message. Images are never written
  back to `nexora_messages` — only the model's text answer is persisted.
- Verified live in this workspace: upload of an `image/png` attachment (status
  `stored`) and the capability gate (400 on a non-vision model with an image
  attached). Live image understanding on `qwen/qwen3.8-27b` (vision model seeded
  from the live Groq catalog) is **not** verified: the workspace's Groq project
  blocks that model (`model_permission_blocked_project` — a project admin must
  enable it at console.groq.com/settings/project/limits). The blocked-model path
  surfaces as a `model_unavailable` SSE error carrying the provider's message;
  the adapter wire shapes above are covered by unit tests in the meantime.

## Audio transcription (audio input)

- Audio attachments (`audio/*`, ≤2 MB) are transcribed synchronously during
  upload: `findTranscriptionModel` picks the first registry model whose
  `inputTypes` include `audio` behind a provider with a configured key
  (`whisper-large-v3-turbo` on Groq is seeded), and the audio adapter posts
  multipart to `{base}/audio/transcriptions` (`file`, `model`,
  `response_format: json`) reading `{text}`.
- The transcript is capped by the shared per-file text limit and stored in
  `attachments.text_content` with status `processed` — so it flows into the chat
  context through the same `loadAttachmentTexts` path as extracted file text;
  no chat-side changes are needed. Whisper is billed per audio second by the
  provider, which does not map to the token-based usage ledger; transcription
  writes no usage record (documented limitation).
- Degradation is silent-but-visible: no transcription model configured → the
  attachment is simply `stored`; provider failure (bad key, invalid media,
  blocked model) → still `stored`, with `errorMessage` carrying the provider
  detail and the upload succeeding.
- Live-verified end to end (2026-11-08): a real speech WAV ("Nexora audio
  transcription test. The color of the sunset is amber.") uploaded to a
  conversation came back `processed` in ~3 s, and a follow-up chat answer on
  the default model quoted the transcript verbatim. The invalid-media and
  blocked-model error paths were live-verified as degradation cases.

## Speech synthesis (TTS output)

- `POST /api/audio/speech` (session required, zod-validated: text 1–4000 non-blank,
  voice from a fixed set, optional modelId) resolves the registry's first
  `outputTypes: ['audio']` model behind a keyed provider (`canopylabs/orpheus-v1-english`
  on Groq is seeded), then the speech adapter posts
  `{model, input, voice, response_format: 'wav'}` to `{base}/audio/speech` and
  streams the binary WAV back to the client (`audio/wav`, no-store). Output is
  ephemeral by design — the Studio plays it from a blob URL; nothing is persisted.
- Orpheus is billed per character by the provider, which does not map to the
  token-based usage ledger; speech writes no usage record (documented limitation).
- Verified live in this workspace: model resolution, the request path through the
  adapter, validation (blank text, unknown voice → 400; no session → 401), and
  error surfacing — the provider currently rejects orpheus until the org admin
  accepts its terms (console.groq.com/playground?model=canopylabs/orpheus-v1-english),
  and that actionable message reaches the client verbatim. **Live synthesis is not
  verified** until the terms are accepted; the adapter wire shape is unit-tested.

## Video (capability posture)

- The registry is data-driven for input/output modalities (`inputTypes`/
  `outputTypes` are row data, not code), so declaring a video-capable model
  needs no schema change. What is **not** implemented today is the runtime path:
  no configured provider's catalog offers a video-input chat model (checked
  against the live Groq catalog 2026-11-08), so `execution.ts` loads only
  `image/*` attachments for vision and the adapters carry only text and image
  parts. Supporting video later means: extending the attachment loader to the
  model's declared `inputTypes`, and adding the provider's video part format to
  the adapter wire builders — both localized changes behind the same capability
  gate pattern used for vision.
- Until then, video uploads degrade exactly like any binary: stored base64
  (≤2 MB), no text extraction, no context integration, excluded from vision.

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
- Consumers: `index_document` (create-pending → chunk → embed → ready, or
  `markDocumentFailed` on every failed attempt; 3 attempts / 2 s base) and
  `research` (below; 2 attempts / 4 s base — synthesis spends tokens, so it
  retries once). Tasks are audit history — deleting a document or research
  run does not delete its task rows (same stance as usage records).
- Verification (2026-11-08, live against the stub embeddings provider):
  async happy path (202 → succeeded attempt 1 → document ready → KNN
  correct), retry cycle (provider down: attempts 1→2→3 with poll-driven
  kicks and 2 s/4 s backoff → terminal failed, document `failed` with the
  error message), manual retry (failed → succeeded, document ready), cancel
  mid-backoff (queued → cancelled → retry-from-cancelled → succeeded), and
  the no-key degradation path above. UI polling and the status chip
  (Indexing → Ready) verified in the browser.

## Research workflows with citations (`api/ai/research.ts`)

- A research run is an async task: `POST /api/research {query}` creates a
  `nexora_research_runs` row (`running`) plus a `research` task and returns
  202 with the `taskId`; the Research page polls the task like the
  Knowledge page does.
- Pipeline (`executeResearch`): `searchWeb` (top 5, general topic) →
  normalize/dedup to `{title, url, snippet}` (snippets capped at 1000
  chars) → synthesize with the workspace default chat model (streaming
  required, ≤2048 output tokens, temperature 0.2) → run flips to `ready`
  with report + sources + model id; synthesis usage is recorded through
  the standard cost pipeline (no conversation binding). `TAVILY_BASE_URL`
  optionally overrides the Tavily endpoint (self-hosted proxies).
- Citations: the synthesis prompt (pure, unit-tested builder) forces plain
  ASCII `[n]` markers tied to the stored source list, forbids citing
  numbers that were not provided, forbids fabrication, requires an
  explicit "not covered by the sources" statement for gaps, and declares
  source content untrusted data (instructions inside it are never
  followed). The UI renders the brief as plain text plus the numbered
  source links.
- Degradation: missing `TAVILY_API_KEY` → run accepted, task fails
  terminally with "The provider is not configured with an API key." and
  the run shows `failed` with that message (live-verified).
- Verification tier (2026-11-08): prompt builder, source normalization,
  stream accumulation, and the base-URL override are unit-tested. The full
  pipeline is live-verified with **live Groq synthesis against a stub
  Tavily server** (runs succeeded on attempt 1; reports cited the stub's
  facts with correctly mapped [1]/[2]/[3] markers and closing source list;
  retry path failed 2/2 after the stub was killed). The Research page
  renders run cards with status chips and stored sources (browser-
  verified); the start-from-UI interaction shares the Knowledge page's
  browser-verified poll pattern. **Live Tavily search is not verified in
  this workspace** — set `TAVILY_API_KEY` to activate it.

## Code workspace (snippets, versions, diffs)

- Multi-file context was already complete from earlier phases: a conversation
  accepts any number of text-like attachments (multi-select upload, ≤2 MB
  each, per-file extraction cap) and `execution.ts` loads every processed
  attachment into the prompt as delimited, untrusted blocks.
- Code snippets: `nexora_code_artifacts` (per-user title, normalized
  language tag, content ≤100 K chars, optional conversation link,
  `rootId`/`version` chain like image artifacts). Routes under
  `/api/code-artifacts`: create (v1, or next version via `basedOnId` —
  title, language, and conversation provenance inherit), list (DISTINCT ON
  root, latest version per chain), get, versions, per-row soft delete
  (deleting peels a chain one version at a time from the list view).
- Chat integration: every fenced code block rendered in a conversation
  gets a "Save snippet" action (auto-title from the first meaningful line,
  fence language preserved) — saved blocks carry the conversation link and
  show a "From chat" badge on the Code page.
- Diffs: `src/lib/diff.ts` — pure LCS line diff (whole-block fallback
  above 4 M cells), unit-tested; the Code page diffs any version against
  its predecessor with added/removed counts.
- **No execution**: generated or saved code is never executed server-side
  or client-side; a sandbox requirement is documented in TODO for any
  future run path.
- Verification (2026-11-08): diff and title derivation unit-tested; CRUD,
  version chaining (v1→v4 with inheritance), validation (blank content,
  unknown conversation/basedOn 404s), and the Code page (list, version
  dropdown, diff view with correct +/- counts) live-verified end-to-end.

## What stays out

- No auto-executing tools yet: every seeded tool is `requiresApproval` and the
  runtime pauses each call for an explicit approve/reject. A no-approval fast
  path would run inside the same executor and history pipeline when needed.
- Retrieved chunks are not auto-injected into prompts: knowledge reaches the
  model through the approval-gated `search_knowledge` tool, keeping every
  retrieval visible to the user. A RAG auto-context path would reuse
  `searchKnowledge` behind the same context-manager budget.
- Generated code is never executed server-side (future sandbox requirement documented in TODO).
