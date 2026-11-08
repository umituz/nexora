# Nexora AI — Infrastructure Evolution (Phase 9 evaluation)

Phase 9 evaluates the three long-term directions from the build plan — self-hosted
inference, open-weight models, and extracting the AI Core into Umituz packages —
against what the running application actually proves today. Scope is evaluation:
no provider contracts changed, and the standing build rule (AI implementation
stays project-local, no `@umituz/web-ai*` dependency) remains in force.

## 1. Self-hosted inference — onboarding verified with zero code changes

**Experiment (2026-11-08, live):** a local OpenAI-compatible endpoint (stub server
on `127.0.0.1:9401` speaking the same wire as vLLM/Ollama/llama.cpp — SSE
`chat/completions` chunks with reasoning, content, and usage) was onboarded with
exactly two registry rows: a provider (`openai-compatible`, base URL, bearer key
env name) and a model (capabilities, input/output types, pricing). A conversation
on that model streamed reasoning + answer + usage through the normal execution
path, and the usage ledger recorded the request under the self-hosted provider
(17/11 tokens, cost 0 from registry pricing). Registry rows were soft-deleted
afterward.

What this establishes:

- Provider onboarding is registry data, not code. Any endpoint that speaks the
  OpenAI wire with bearer auth (vLLM `--api-key`, llama.cpp server `--api-key`,
  Ollama behind a gateway, SGLang, TGI) works through the existing adapter.
- Capability, pricing, and usage accounting are provider-independent — a
  self-hosted model with zero pricing is tracked like any other model.

Known gaps, in the order they would bite:

1. **Keyless endpoints.** `providers.api_key_env` is required and the key must
   exist as a Worker secret; Ollama's default no-auth mode would need the
   nullable-key change (small, localized to `resolveProviderKey` + schema).
2. **Network reachability.** Cloudflare Workers call public HTTPS only; a
   self-hosted GPU box needs a public endpoint or a Cloudflare Tunnel. The
   localhost experiment worked because wrangler dev runs on this machine.
3. **No image/embedding/audio/speech verification** against self-hosted servers
   — those adapters speak the same family of OpenAI endpoints but were verified
   against Groq's implementations.

## 2. Open-weight models — already the default path

Seeded registry split (verified against the live Groq catalog 2026-11-08):

| model | weights | served by | role |
|---|---|---|---|
| `openai/gpt-oss-120b` | open-weight (OpenAI) | Groq | **default chat model** |
| `openai/gpt-oss-20b` | open-weight (OpenAI) | Groq | fast chat |
| `qwen/qwen3.8-27b` | open-weight (Qwen family) | Groq | vision input (project-blocked; see AI-CORE) |
| `whisper-large-v3-turbo` | open-weight (Whisper) | Groq | transcription (live-verified) |
| `canopylabs/orpheus-v1-english` | open-weight (Orpheus) | Groq | TTS (terms pending) |
| `gpt-6.1-*`, `gpt-image-*`, `claude-*`, `text-embedding-3-small` | proprietary | OpenAI / Anthropic | optional; no keys configured in this workspace |

The default generation path therefore already runs on open weights. Because the
open-weight chat models are the same weights a self-hosted server would load,
migrating the default from Groq to own hardware is a registry row swap, not a
rewrite.

## 3. Module extraction into Umituz packages — plan, not yet action

The build rules kept the AI layer project-local by design; extraction is the
next step once the surface is stable. Dependency audit of `api/ai/` supports a
two-package first wave:

| candidate | contents | why ready | why not sooner |
|---|---|---|---|
| `@umituz/ai-contracts` | `shared/ai/contracts.ts` — types, bounds, defaults | pure data; consumed unchanged by SPA and API since Phase 1 | needs a second consumer to justify the move |
| `@umituz/ai-adapters` | `providers/*` (openai-compatible, anthropic, images, embeddings, audio, speech) + `errors.ts` | imports only contracts + errors (no DB, no schema); each adapter is unit-tested in isolation against its wire format | provider surface should survive one full phase without change |
| deferred | `model-registry`, `execution`, `research`, `tasks`, `knowledge` | — | coupled to the fleet DB schema and to product lifecycle (sessions, tool approvals, task queue) — these are Nexora's product, not shared infrastructure |

Readiness rule before creating either package: the module's public API unchanged
for a full phase, zero project-specific imports (holds today for both
candidates), and a second fleet project as pilot consumer. The repo's standing
rule (no `@umituz/web-ai*` dependency during the build) stays until that pilot
exists.

## Verification ledger

- Live-verified 2026-11-08: self-hosted onboarding experiment (above),
  transcription end-to-end, TTS request path up to the provider terms wall,
  vision capability gate, blocked-model error surfacing.
- Not verified in this workspace: live vision generation (model project-blocked),
  live TTS synthesis (terms pending), OpenAI/Anthropic adapters (no keys),
  self-hosted image/embedding/audio endpoints, keyless self-hosted auth.
