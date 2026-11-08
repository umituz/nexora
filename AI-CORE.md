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
│   ├── anthropic.ts          # adapter: Anthropic Messages API wire (own SSE event format)
│   └── index.ts              # adapter registry: adapter kind (from provider row) → factory
├── memories.ts         # long-term memory selection (pinned-first, recency, caps) + loader
├── model-registry.ts   # DB-backed catalog: available models (provider key present + active)
├── model-router.ts     # model id → provider row + adapter; capability & param validation; timeouts
├── prompt-engine.ts    # system prompt assembly, versioned templates, dynamic context slots
├── context-manager.ts  # history windowing, token estimation, context budget enforcement
├── streaming.ts        # provider-independent SSE event protocol + cancellation
├── execution.ts        # generation lifecycle orchestration (validate → context → stream → persist → usage)
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

## Server → client streaming protocol (`streaming.ts`)

Standard SSE (`text/event-stream`) on `POST /api/chat/:conversationId/stream`:

| event | data | meaning |
|---|---|---|
| `delta` | `{ channel: 'answer' \| 'reasoning', text }` | partial output |
| `usage` | `{ inputTokens, outputTokens, reasoningTokens }` | final token usage |
| `done` | `{ messageId }` | assistant message persisted |
| `error` | `{ code, message }` | normalized failure (stream continues to close) |

Cancellation: the client aborts the fetch; the server watches the request signal,
aborts the upstream call, and persists partial output with status `stopped`.

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
  against registry `context_window` minus requested `max_output_tokens`.
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

## What stays out

- No tool execution in Phase 1 (agent framework arrives Phase 5 with schema-validated,
  approval-gated tools).
- No embeddings/RAG in Phase 1 (Phase 6; pgvector availability on Neon to be verified then).
- Generated code is never executed server-side (future sandbox requirement documented in TODO).
