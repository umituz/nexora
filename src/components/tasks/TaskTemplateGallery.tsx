import { useState } from 'react'
import type { ReactNode } from 'react'
import {
  BarChart3,
  Code2,
  FileText,
  Globe2,
  Play,
  ShieldCheck,
  Sparkles,
  Zap,
} from 'lucide-react'
import { Button } from '@umituz/web-design-system'

export interface TaskTemplate {
  id: string
  title: string
  category: 'Engineering' | 'Research' | 'Security' | 'Strategy' | 'Product'
  difficulty: 'Quick' | 'Comprehensive' | 'Deep Multi-Step'
  description: string
  targetOutcome: string
  requiredTools: string[]
  estimatedDuration: string
  icon: typeof Sparkles
  defaultPrompt: string
}

const TEMPLATES: TaskTemplate[] = [
  {
    id: 'tpl-1',
    title: 'Autonomous Full-Stack Feature Generator',
    category: 'Engineering',
    difficulty: 'Deep Multi-Step',
    description:
      'Plan architecture, generate Drizzle ORM schema, write Hono API endpoints, and assemble a responsive React/Tailwind client view.',
    targetOutcome: 'Fully verified multi-file code bundle + web sandbox preview',
    requiredTools: ['code_sandbox', 'ast_linter', 'typescript_compiler'],
    estimatedDuration: '45-90s',
    icon: Code2,
    defaultPrompt:
      'Build a complete subscription billing management module with pricing tiers, status chips, and renewal reminder toggles.',
  },
  {
    id: 'tpl-2',
    title: 'Competitor Intelligence & Pricing Analysis',
    category: 'Strategy',
    difficulty: 'Comprehensive',
    description:
      'Execute multi-source web queries on competitor pricing tiers, feature matrices, and API limits to generate an executive SWOT matrix.',
    targetOutcome: 'Executive synthesis document with verified competitor pricing table',
    requiredTools: ['tavily_web_search', 'document_synthesizer'],
    estimatedDuration: '30-60s',
    icon: BarChart3,
    defaultPrompt:
      'Analyze the top 3 frontier AI SaaS platforms (OpenAI, Anthropic, Cursor) on developer pricing, enterprise SLAs, and context windows.',
  },
  {
    id: 'tpl-3',
    title: 'Codebase Security & Vulnerability Audit',
    category: 'Security',
    difficulty: 'Comprehensive',
    description:
      'Perform static analysis on API routes, inspect SQL query parameterization, and verify authorization guards on webhook handlers.',
    targetOutcome: 'Security scorecard + line-by-line remediation patches',
    requiredTools: ['ast_analyzer', 'security_scanner', 'diff_generator'],
    estimatedDuration: '30-45s',
    icon: ShieldCheck,
    defaultPrompt:
      'Audit all backend API routes for unauthenticated leaks, missing tenant IDs, and unescaped input parameters.',
  },
  {
    id: 'tpl-4',
    title: 'Investor Pitch Deck & Growth Narrative',
    category: 'Product',
    difficulty: 'Deep Multi-Step',
    description:
      'Synthesize product architecture, TAM/SAM/SOM market sizing, unit economics, and competitive moat into a structured presentation deck.',
    targetOutcome: 'Structured slide deck outline with speaker notes and charts',
    requiredTools: ['market_calculator', 'deck_storyboard'],
    estimatedDuration: '40-70s',
    icon: Globe2,
    defaultPrompt:
      'Create an 8-slide seed pitch deck narrative for an autonomous AI developer productivity platform.',
  },
  {
    id: 'tpl-5',
    title: 'Deep Multi-Source Research Whitepaper',
    category: 'Research',
    difficulty: 'Deep Multi-Step',
    description:
      'Perform iterative multi-query search, aggregate peer-reviewed papers, extract quantitative benchmarks, and output an academic-grade report.',
    targetOutcome: 'Markdown report with table of contents, citations, and trust scores',
    requiredTools: ['arxiv_search', 'tavily_search', 'citation_validator'],
    estimatedDuration: '60-120s',
    icon: FileText,
    defaultPrompt:
      'Synthesize state-of-the-art multi-agent execution frameworks, memory retrieval strategies, and hallucination reduction methods.',
  },
  {
    id: 'tpl-6',
    title: 'API Performance & Load Resilience Test',
    category: 'Engineering',
    difficulty: 'Quick',
    description:
      'Benchmark p95/p99 latency, generate synthetic load test scripts, and test sliding-window rate limiting policies.',
    targetOutcome: 'Benchmark latency chart + load testing k6/autocannon script',
    requiredTools: ['load_simulator', 'metric_collector'],
    estimatedDuration: '20-35s',
    icon: Zap,
    defaultPrompt:
      'Generate a resilient k6 stress test scenario measuring 1,000 concurrent streaming chat requests with SSE abort signals.',
  },
]

interface TaskTemplateGalleryProps {
  onLaunchTemplate: (template: TaskTemplate) => void
}

export function TaskTemplateGallery({ onLaunchTemplate }: TaskTemplateGalleryProps): ReactNode {
  const [selectedCat, setSelectedCat] = useState<string>('all')
  const categories = ['all', 'Engineering', 'Research', 'Security', 'Strategy', 'Product']

  const filtered = TEMPLATES.filter(
    (t) => selectedCat === 'all' || t.category === selectedCat,
  )

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-base font-semibold text-foreground flex items-center gap-2">
            <Sparkles size={16} className="text-primary" />
            Autonomous Agent Mission Gallery
          </h2>
          <p className="text-xs text-muted-foreground mt-0.5">
            Select a pre-architected agent mission template to launch multi-turn autonomous execution.
          </p>
        </div>

        <div className="flex flex-wrap gap-1.5">
          {categories.map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => setSelectedCat(cat)}
              className={`rounded-lg px-2.5 py-1 text-xs font-medium transition-colors ${
                selectedCat === cat
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-muted/70 text-muted-foreground hover:bg-muted hover:text-foreground'
              }`}
            >
              {cat === 'all' ? 'All Missions' : cat}
            </button>
          ))}
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {filtered.map((tpl) => {
          const Icon = tpl.icon

          return (
            <div
              key={tpl.id}
              className="rounded-xl border border-border bg-card p-5 flex flex-col justify-between transition-all hover:border-primary/50 hover:shadow-sm"
            >
              <div className="space-y-3">
                <div className="flex items-start justify-between gap-2">
                  <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10 text-primary">
                    <Icon size={18} />
                  </div>
                  <span className="rounded-full bg-muted px-2 py-0.5 text-[10px] font-semibold text-muted-foreground">
                    {tpl.difficulty}
                  </span>
                </div>

                <div>
                  <h3 className="text-sm font-bold text-foreground leading-snug">{tpl.title}</h3>
                  <span className="text-[11px] font-medium text-primary uppercase tracking-wider">
                    {tpl.category} · {tpl.estimatedDuration}
                  </span>
                </div>

                <p className="text-xs text-muted-foreground leading-relaxed">
                  {tpl.description}
                </p>

                <div className="space-y-1 rounded-lg bg-muted/30 p-2.5 text-[11px]">
                  <span className="font-semibold text-foreground block">Deliverable Outcome:</span>
                  <span className="text-muted-foreground">{tpl.targetOutcome}</span>
                </div>
              </div>

              <div className="pt-4 border-t border-border/60 mt-4 flex items-center justify-between">
                <span className="text-[10px] text-muted-foreground">
                  {tpl.requiredTools.length} connected tools
                </span>
                <Button
                  size="sm"
                  onClick={() => onLaunchTemplate(tpl)}
                  className="text-xs h-7"
                >
                  <Play size={11} className="mr-1" />
                  Launch Agent
                </Button>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
