import { useState } from 'react'
import type { ReactNode } from 'react'
import {
  BarChart3,
  Code2,
  Cpu,
  FileText,
  ShieldCheck,
  Sparkles,
} from 'lucide-react'

export interface PromptTemplateItem {
  id: string
  title: string
  subtitle: string
  category: 'code' | 'architecture' | 'research' | 'writing'
  icon: typeof Sparkles
  promptText: string
}

const TEMPLATES: PromptTemplateItem[] = [
  {
    id: 'pt-1',
    title: 'Atomic Redis Rate Limiter',
    subtitle: 'Sliding window in Lua with TypeScript client',
    category: 'code',
    icon: Code2,
    promptText:
      'Design and implement an atomic sliding-window rate limiter using Redis Lua scripting with a fully typed TypeScript client and unit tests.',
  },
  {
    id: 'pt-2',
    title: 'Postgres vs Vector DBs',
    subtitle: 'RAG benchmarks at 10M embeddings',
    category: 'architecture',
    icon: Cpu,
    promptText:
      'Compare PostgreSQL pgvector vs dedicated vector databases (Pinecone, Qdrant) at 10M 1536-dim embeddings on latency, indexing memory, and cost.',
  },
  {
    id: 'pt-3',
    title: 'Multi-Agent State Isolation',
    subtitle: 'Subagent orchestration patterns',
    category: 'research',
    icon: Sparkles,
    promptText:
      'Analyze state-of-the-art multi-agent orchestration architectures. How do systems like Manus and AutoGen isolate subagent state and prevent hallucination drift?',
  },
  {
    id: 'pt-4',
    title: 'Security & OAuth 2.1 Audit',
    subtitle: 'Token storage & authorization check',
    category: 'architecture',
    icon: ShieldCheck,
    promptText:
      'Conduct a thorough security review of an OAuth 2.1 + PKCE authentication flow. Outline attack vectors for token theft, CSRF, and session fixation.',
  },
  {
    id: 'pt-5',
    title: 'Developer Release Notes',
    subtitle: 'Changelog from git commit history',
    category: 'writing',
    icon: FileText,
    promptText:
      'Draft an engaging, developer-friendly release changelog highlighting breaking changes, performance optimizations, and newly added endpoints.',
  },
  {
    id: 'pt-6',
    title: 'AI Token Cost Optimization',
    subtitle: 'Model routing & prompt cache savings',
    category: 'research',
    icon: BarChart3,
    promptText:
      'Recommend operational strategies to cut LLM inference costs by 50% without quality degradation, focusing on prompt caching and hybrid model routing.',
  },
]

interface PromptTemplatesRowProps {
  onSelectPrompt: (promptText: string) => void
}

export function PromptTemplatesRow({ onSelectPrompt }: PromptTemplatesRowProps): ReactNode {
  const [filter, setFilter] = useState<'all' | 'code' | 'architecture' | 'research' | 'writing'>('all')

  const filtered = TEMPLATES.filter((t) => filter === 'all' || t.category === filter)

  return (
    <div className="w-full max-w-3xl mx-auto space-y-4">
      {/* Category Pills */}
      <div className="flex flex-wrap items-center justify-center gap-1.5">
        {(
          [
            { key: 'all', label: 'All Suggestions' },
            { key: 'code', label: 'Engineering' },
            { key: 'architecture', label: 'System Design' },
            { key: 'research', label: 'Deep Research' },
            { key: 'writing', label: 'Documentation' },
          ] as const
        ).map((tab) => (
          <button
            key={tab.key}
            type="button"
            onClick={() => setFilter(tab.key)}
            className={`rounded-full px-3 py-1 text-xs font-medium transition-colors ${
              filter === tab.key
                ? 'bg-primary text-primary-foreground shadow-sm'
                : 'bg-muted/70 text-muted-foreground hover:bg-muted hover:text-foreground'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Grid of Prompt Cards (inspired by swift_chatgpt PromptExamplesRow) */}
      <div className="grid gap-2.5 sm:grid-cols-2">
        {filtered.map((item) => {
          const Icon = item.icon

          return (
            <button
              key={item.id}
              type="button"
              onClick={() => onSelectPrompt(item.promptText)}
              className="group text-left rounded-xl border border-border bg-card p-3.5 transition-all hover:border-primary/50 hover:bg-primary/5 hover:shadow-sm flex items-start gap-3"
            >
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-muted text-muted-foreground transition-colors group-hover:bg-primary/10 group-hover:text-primary">
                <Icon size={16} />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-xs font-semibold text-foreground group-hover:text-primary transition-colors truncate">
                  {item.title}
                </p>
                <p className="text-[11px] text-muted-foreground line-clamp-1 mt-0.5">
                  {item.subtitle}
                </p>
              </div>
            </button>
          )
        })}
      </div>
    </div>
  )
}
