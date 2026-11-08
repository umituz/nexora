# Nexora — Package Adoption Matrix

Fleet rule: shared code comes from `@umituz` packages; no local copies, no wrapper
layers, no re-exports. Versions follow the pilot target stack (SaaS_BUILD 9.1).

| Package | Version | Adopted | Role in Nexora |
|---|---|---|---|
| `@umituz/web-hono` | ^1.19.2 | ✅ core | `createApi` skeleton, health/bootstrap routes, error envelope (`ApiError`/`apiOnError`), `crudRoutes`/`listRoutes` factories for standard entities, `getDb` (neon-http), `trio`/`uid`/`pickPatch`/`stampUpdate`, `validateJson` + field schemas, `apiFetch`/`apiWrite` client, `createStore` + `makeStoreHooks`, lifecycle (`resetTables`/`snapshotToSeed`/`seedFromSnapshot`), better-auth server integration (`authTables`, `createAuthGetter`, `mountAuth`, `createSessionHelpers`) |
| `@umituz/web-design-system` | ^6.2.0 | ✅ core | UI primitives (atoms/molecules/organisms), `MarkdownText` for response rendering, `PageHeader`/`SectionHeader`/`TabNav` templates, charts, Toaster/useToast. Tailwind v4 host entry (`app.css` + `--app-*` slots) |
| `@umituz/web-dashboard` | ^11.0.0 | ✅ core | Application shell: `DashboardLayout`/`DashboardHeader`/`DashboardSidebar`/`BrandLogo`, module registry, settings infrastructure. Layout always from the package, customized via props |
| `@umituz/web-auth` | ^2.3.0 | ✅ | Client auth: `SessionProvider` + `betterAuthAdapter` (against `/api/auth`), `AuthLayout` + `LoginForm`/`RegisterForm`, `DemoUserPicker`, `authT` translation catalog |
| `@umituz/web-localization` | ^1.6.1 | ✅ | `setupI18n` (i18next composition), `I18nProvider`/`useT`, `src/locales/*.ts` catalog convention, `en-US` source language |
| `@umituz/web-landing` | ^1.4.1 | ✅ | Public marketing chrome (`PublicSiteLayout` + per-app config object) for the logged-out surface |
| `@umituz/web-cloudflare` | ^1.9.1 | ✅ dev | `cf-ship` deploy chain (wrangler bundled) |
| `better-auth` | ^1.7.x | ✅ | Session/auth engine (peer of web-hono auth integration; client via web-auth's adapter) |
| `@umituz/web-ai`, `web-ai-*` | — | ❌ forbidden | All AI-specific implementation is project-local (AI-CORE.md); owner directive |
| Firebase / Supabase | — | ❌ | Not in the fleet; Neon Postgres is the standard data layer |

Direct runtime dependencies beyond packages: `react`, `react-dom`, `react-router` (^7 core
only — `react-router-dom` imports forbidden by fleet rule 17), `hono`, `drizzle-orm`,
`@neondatabase/serverless`, `zod`, `lucide-react`, `i18next`, `react-i18next`,
`i18next-browser-languagedetector`, `tailwindcss` + `@tailwindcss/vite` (dev), `vitest` (dev).

## What Nexora implements locally (and why it is not a package violation)

- **AI Core (`api/ai/`)** — provider contracts/adapters, model registry & router, prompt
  engine, context manager, streaming engine, usage/cost. The fleet has no AI package in
  the sanctioned SaaS core (`web-ai` is explicitly excluded by the owner directive for
  this project). Designed for future extraction.
- **SSE chat streaming route** — web-hono is JSON-only by design; Hono is a peer
  dependency, so the streaming route uses Hono's streaming primitives directly inside a
  project router mounted through `createApi`. This is project domain logic, not shared
  skeleton duplication.
- **Chat UI** — conversation surface is Nexora product code built from DS primitives;
  no local design system, no wrappers around DS components.
