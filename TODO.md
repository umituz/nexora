# Nexora AI — Build Plan

Nexora is a unified AI workspace: conversations, projects, knowledge, memory, agents,
research, and generative studio — built on a project-local AI Core with a provider-independent
architecture. Long-term direction: Nexora AI → project-local AI Core → Umituz AI infrastructure →
self-hosted inference → proprietary models.

Stack (fleet pilot alignment — hangora base, SaaS_BUILD 9.1): React 19 · react-router ^7 core ·
@umituz/web-dashboard ^11 · @umituz/web-design-system ^6.2 · @umituz/web-hono ^1.19 ·
@umituz/web-auth (better-auth) · @umituz/web-localization · Tailwind v4 camp · Hono on
Cloudflare Workers (single worker + ASSETS) · Drizzle + Neon Postgres · TypeScript ~5.9 strict.

Ports: Vite dev **5190** (strictPort) · wrangler dev **8792**.

## Phase 0 — Repository audit and technical plan ✅

- [x] Audit monorepo, fleet conventions (SaaS_BUILD.md), pilot project (hangora), web-packages.
- [x] Verify published vs local package versions (all match latest published).
- [x] Confirm real provider availability: Groq API key live, model catalog + pricing verified.
- [x] Produce ARCHITECTURE.md, PACKAGE-ADOPTION.md, AI-CORE.md, this TODO.md.

## Phase 1 — Core application and chat (current)

**Application shell**
- [x] Scaffold project (configs, wrangler, tsconfigs, eslint, Tailwind 4 entry, gitignore, env examples).
- [x] api/ skeleton: createApi + health + auth mount + DB adapter + schema (TABLE_PREFIX `nexora`).
- [x] Auth: better-auth tables + mount, login/register pages, session provider, auth-guarded routes.
- [x] Dashboard shell from web-dashboard layout; navigation with Chat section only.
- [x] Localization wiring (web-localization, en-US catalog).

**AI Core (project-local, `api/ai/`)**
- [x] Provider contracts: generation request/response, message types, stream events, usage, errors.
- [x] Groq adapter (real, OpenAI-compatible wire, SSE streaming) + provider configuration from env.
- [x] Model registry (DB tables `nexora_providers`, `nexora_models`; seeded from verified live catalog).
- [x] Model router: resolve id → provider → adapter; capability validation; timeouts; error normalization.
- [x] Prompt engine: system prompt assembly, versioned templates.
- [x] Context manager: history windowing, token estimation, context limits.
- [x] Streaming engine: provider-independent SSE event protocol (delta/usage/done/error), cancellation.
- [x] Usage and cost recording (`nexora_usage_records`; pricing from registry, never hardcoded).

**Chat product**
- [x] Conversations CRUD (create, rename, delete, list, temporary flag).
- [x] Chat streaming endpoint (SSE) with full execution lifecycle.
- [x] Chat UI: conversation sidebar, message thread, streaming render, markdown + code blocks,
      composer, model selector, stop generation, copy response, regenerate.
- [x] Message editing (edit-and-resend of a previous user turn).
- [x] Empty/loading/error states; provider error surfacing.
- [x] Seed scripts: providers, models (verified live data), demo user.
- [x] Unit tests for AI Core modules (router, context manager, prompt engine, adapter, usage).
- [x] Quality gates: lint 0/0, typecheck 0, build, tests green.

## Phase 2 — Projects, files, memory

- [x] Projects CRUD + project instructions + context boundary.
- [x] File uploads (attachment metadata, processing states), conversation attachments
      (text extraction sync, base64 in Neon ≤2 MB, R2 documented as production path).
- [x] Memory engine (create/retrieve/update/delete, pinned-first relevance, source
      tracking, pin/delete user controls; Memories page).
- [x] Context manager integration: project instructions + memories + attachments
      into request context.

## Phase 3 — Multi-provider and advanced models

- [ ] Additional provider adapters (OpenAI-compatible family + at least one distinct protocol).
- [ ] Extended capability registry (vision, tools, reasoning as data).
- [ ] Model selection UX with capability badges; provider failover where safe.
- [ ] Usage/cost reporting UI (per user/conversation/model).

## Phase 4 — AI Studio and artifacts

- [ ] Image generation integration (provider-capability driven).
- [ ] Artifact store, versioning, export.

## Phase 5 — Agents and tools

- [ ] Agent CRUD, instructions, model + tool binding.
- [ ] Tool registry with JSON schemas, permission validation, approval workflow, execution history.

## Phase 6 — Research, knowledge, automation

- [ ] Web search integration (capability module, not coupled to chat engine).
- [ ] Research workflows with citations.
- [ ] Document indexing, embeddings, retrieval (pgvector on Neon — verify extension support).
- [ ] Task engine foundation: status tracking, retries, logs.

## Phase 7 — Code workspace

- [ ] Code-focused workflows, multi-file context, diffs, artifacts. No server-side execution of
      generated code without an isolated sandbox.

## Phase 8 — Multimodal

- [ ] Image understanding, audio input/transcription, TTS, video — provider-capability driven.

## Phase 9 — Infrastructure evolution

- [ ] Self-hosted inference evaluation, open-weight models, module extraction into Umituz packages.

## Standing rules (from fleet SaaS_BUILD.md — binding)

- Shared code comes from packages; no local copies or wrappers.
- react-router core only (no react-router-dom imports).
- Layout always from web-dashboard package, customized via props.
- Zero comments in code; no GitHub Actions; lint gate 0 errors 0 warnings.
- Palette via `:root { --app-* }` slots only; design-system `app.css` entry (Tailwind 4 camp).
- `package-lock.json` and secrets never committed; seed scripts standard; snapshot after data changes.
- All AI-specific implementation stays project-local (`api/ai/` + `src/`); no `@umituz/web-ai*` dependency.
