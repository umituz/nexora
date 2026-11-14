import { useState } from 'react'
import type { ReactNode } from 'react'
import { Link } from 'react-router'
import {
  ArrowRight,
  Brain,
  CheckCircle,
  Code,
  Compass,
  FileText,
  Lightbulb,
  MessageSquare,
  Sparkles,
  Zap,
} from 'lucide-react'
import { Button } from '@umituz/web-design-system'
import type { PublicModel } from '@shared/ai/contracts'
import { USE_CASES_DATA, type UseCaseDefinition } from './benchmarkData'

interface UseCaseMatcherProps {
  models: PublicModel[]
}

const USE_CASE_ICONS: Record<string, typeof Brain> = {
  'fullstack-dev': Code,
  'deep-research': FileText,
  'low-latency-agent': Zap,
  'multimodal-doc-ocr': Sparkles,
  'content-creative': MessageSquare,
}

export function UseCaseMatcher({ models }: UseCaseMatcherProps): ReactNode {
  const [selectedId, setSelectedId] = useState<string>(USE_CASES_DATA[0]!.id)
  const currentCase = USE_CASES_DATA.find((c) => c.id === selectedId) ?? USE_CASES_DATA[0]!

  // Find best matching models in user's registry
  const primaryModel =
    models.find((m) =>
      currentCase.id === 'fullstack-dev'
        ? m.displayName.toLowerCase().includes('sonnet') || m.displayName.toLowerCase().includes('claude')
        : currentCase.id === 'deep-research'
          ? m.capabilities.reasoning
          : currentCase.id === 'low-latency-agent'
            ? m.displayName.toLowerCase().includes('flash') || m.displayName.toLowerCase().includes('haiku')
            : currentCase.id === 'multimodal-doc-ocr'
              ? m.capabilities.vision
              : true,
    ) ?? models[0]

  const budgetModel =
    models.find(
      (m) =>
        m.id !== primaryModel?.id &&
        (m.displayName.toLowerCase().includes('flash') ||
          m.displayName.toLowerCase().includes('haiku') ||
          m.displayName.toLowerCase().includes('mini')),
    ) ?? models[1] ?? models[0]

  return (
    <div className="grid gap-6 lg:grid-cols-12">
      {/* Use Cases List */}
      <div className="space-y-2 lg:col-span-5">
        <h2 className="text-sm font-semibold text-foreground mb-3 flex items-center gap-2">
          <Compass size={16} className="text-primary" />
          Target AI Workload
        </h2>

        {USE_CASES_DATA.map((item: UseCaseDefinition) => {
          const Icon = USE_CASE_ICONS[item.id] || Brain
          const isSelected = item.id === selectedId

          return (
            <button
              key={item.id}
              type="button"
              onClick={() => setSelectedId(item.id)}
              className={`w-full text-left rounded-xl p-3.5 border transition-all flex items-start gap-3.5 ${
                isSelected
                  ? 'border-primary bg-primary/5 shadow-sm'
                  : 'border-border bg-card hover:border-border/80 hover:bg-muted/30'
              }`}
            >
              <div
                className={`p-2.5 rounded-lg shrink-0 ${
                  isSelected ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'
                }`}
              >
                <Icon size={16} />
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-center justify-between gap-1">
                  <h3 className="text-xs font-semibold text-foreground truncate">{item.title}</h3>
                  <span
                    className={`text-[10px] px-1.5 py-0.5 rounded-full font-medium shrink-0 ${
                      item.difficulty === 'Expert'
                        ? 'bg-rose-500/10 text-rose-600 dark:text-rose-400'
                        : item.difficulty === 'Advanced'
                          ? 'bg-amber-500/10 text-amber-600 dark:text-amber-400'
                          : 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400'
                    }`}
                  >
                    {item.difficulty}
                  </span>
                </div>
                <p className="text-[11px] text-muted-foreground line-clamp-1 mt-0.5">{item.industry}</p>
              </div>
            </button>
          )
        })}
      </div>

      {/* Selected Case Deep Dive Card */}
      <div className="space-y-4 lg:col-span-7">
        <div className="rounded-xl border border-border bg-card p-5 space-y-4">
          <div className="border-b border-border pb-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-primary uppercase tracking-wider">
                {currentCase.industry}
              </span>
              <span className="text-xs text-muted-foreground">Difficulty: {currentCase.difficulty}</span>
            </div>
            <h3 className="text-lg font-bold text-foreground mt-1">{currentCase.title}</h3>
            <p className="text-xs text-muted-foreground mt-1.5 leading-relaxed">{currentCase.description}</p>
          </div>

          {/* Key capability requirements */}
          <div className="space-y-2">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Required Architecture Features
            </h4>
            <div className="flex flex-wrap gap-2">
              {currentCase.keyFeatures.map((feat, idx) => (
                <span
                  key={idx}
                  className="inline-flex items-center gap-1.5 rounded-md border border-border bg-muted/40 px-2.5 py-1 text-xs text-foreground font-medium"
                >
                  <CheckCircle size={12} className="text-emerald-500" />
                  {feat}
                </span>
              ))}
            </div>
          </div>

          {/* Model Recommendations */}
          <div className="grid gap-3 sm:grid-cols-2 pt-2">
            {primaryModel && (
              <div className="rounded-lg border border-primary/40 bg-primary/5 p-3.5 space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-bold text-primary uppercase">Primary Choice</span>
                  <span className="text-[10px] text-muted-foreground">Highest Quality</span>
                </div>
                <p className="text-sm font-bold text-foreground">{primaryModel.displayName}</p>
                <p className="text-[11px] text-muted-foreground">{primaryModel.providerName}</p>
                <div className="pt-2">
                  <Link to={`/app/chat?model=${primaryModel.id}`}>
                    <Button size="sm" className="w-full text-xs h-7">
                      Chat with this model
                      <ArrowRight size={12} className="ml-1" />
                    </Button>
                  </Link>
                </div>
              </div>
            )}

            {budgetModel && (
              <div className="rounded-lg border border-border bg-muted/30 p-3.5 space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-bold text-emerald-600 dark:text-emerald-400 uppercase">
                    Economical Alternative
                  </span>
                  <span className="text-[10px] text-muted-foreground">Low Cost / Fast</span>
                </div>
                <p className="text-sm font-bold text-foreground">{budgetModel.displayName}</p>
                <p className="text-[11px] text-muted-foreground">{budgetModel.providerName}</p>
                <div className="pt-2">
                  <Link to={`/app/chat?model=${budgetModel.id}`}>
                    <Button variant="outline" size="sm" className="w-full text-xs h-7">
                      Chat with budget option
                      <ArrowRight size={12} className="ml-1" />
                    </Button>
                  </Link>
                </div>
              </div>
            )}
          </div>

          {/* Prompt engineering tip */}
          <div className="rounded-lg border border-amber-500/20 bg-amber-500/5 p-3.5 flex items-start gap-2.5">
            <Lightbulb size={16} className="text-amber-500 shrink-0 mt-0.5" />
            <div className="space-y-0.5">
              <span className="text-xs font-semibold text-foreground">
                Optimal Generation Parameters (Temp: {currentCase.temperature})
              </span>
              <p className="text-[11px] text-muted-foreground leading-relaxed">{currentCase.promptTip}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
