import { useState } from 'react'
import type { ReactNode } from 'react'
import {
  ArrowLeftRight,
  Brain,
  CheckCircle2,
  Code2,
  Cpu,
  DollarSign,
  Layers,
  Scale,
  ShieldCheck,
  Sparkles,
  Trophy,
  Zap,
} from 'lucide-react'
import { Button, NativeSelect } from '@umituz/web-design-system'
import type { PublicModel } from '@shared/ai/contracts'
import { estimateModelBenchmarks } from './benchmarkData'

interface ModelComparatorProps {
  models: PublicModel[]
}

interface BenchmarkItem {
  key: string
  label: string
  icon: typeof Brain
  scoreA: number
  scoreB: number
}

function formatCost(ratePerM: number): string {
  if (ratePerM === 0) return '$0.00'
  return `$${ratePerM.toFixed(2)}/M`
}

function formatTokens(tokens: number): string {
  if (tokens >= 1_000_000) return `${(tokens / 1_000_000).toFixed(1)}M`
  return `${Math.round(tokens / 1024)}K`
}

export function ModelComparator({ models }: ModelComparatorProps): ReactNode {
  const [modelAId, setModelAId] = useState<string>(models[0]?.id ?? '')
  const [modelBId, setModelBId] = useState<string>(models[1]?.id ?? models[0]?.id ?? '')

  const modelA = models.find((m) => m.id === modelAId) ?? models[0]
  const modelB = models.find((m) => m.id === modelBId) ?? models[1] ?? models[0]

  if (!modelA || !modelB) {
    return (
      <div className="rounded-xl border border-dashed border-border p-8 text-center text-sm text-muted-foreground">
        Select at least two models to compare.
      </div>
    )
  }

  const benchA = estimateModelBenchmarks(modelA)
  const benchB = estimateModelBenchmarks(modelB)

  const benchmarks: BenchmarkItem[] = [
    { key: 'reasoning', label: 'Reasoning & Logic', icon: Brain, scoreA: benchA.reasoning, scoreB: benchB.reasoning },
    { key: 'coding', label: 'Code Generation & SWE', icon: Code2, scoreA: benchA.coding, scoreB: benchB.coding },
    { key: 'math', label: 'Math & Quantitative', icon: Cpu, scoreA: benchA.math, scoreB: benchB.math },
    { key: 'language', label: 'Language & Nuance', icon: Sparkles, scoreA: benchA.language, scoreB: benchB.language },
    { key: 'speed', label: 'Inference Speed & TTFT', icon: Zap, scoreA: benchA.speed, scoreB: benchB.speed },
    { key: 'safety', label: 'Safety & Hallucination Resistance', icon: ShieldCheck, scoreA: benchA.safety, scoreB: benchB.safety },
    { key: 'context', label: 'Context Processing Depth', icon: Layers, scoreA: benchA.contextScore, scoreB: benchB.contextScore },
    { key: 'costEfficiency', label: 'Cost Efficiency (ROI)', icon: DollarSign, scoreA: benchA.costEfficiency, scoreB: benchB.costEfficiency },
  ]

  let winsA = 0
  let winsB = 0
  let ties = 0

  benchmarks.forEach((b) => {
    if (b.scoreA > b.scoreB) winsA++
    else if (b.scoreB > b.scoreA) winsB++
    else ties++
  })

  const swapModels = () => {
    const temp = modelAId
    setModelAId(modelBId)
    setModelBId(temp)
  }

  return (
    <div className="space-y-6">
      {/* Header Selector Bar */}
      <div className="flex flex-col gap-4 rounded-xl border border-border bg-card p-5 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-1 flex-col gap-1.5 sm:max-w-xs">
          <label className="text-xs font-semibold uppercase tracking-wider text-primary">Model A (Reference)</label>
          <NativeSelect
            value={modelAId}
            onChange={(e) => setModelAId(e.target.value)}
            options={models.map((m) => ({ value: m.id, label: `${m.displayName} (${m.providerName})` }))}
            aria-label="Model A"
          />
        </div>

        <div className="flex items-center justify-center">
          <Button
            variant="outline"
            size="icon"
            onClick={swapModels}
            title="Swap models"
            aria-label="Swap models"
            className="h-10 w-10 rounded-full"
          >
            <ArrowLeftRight size={16} />
          </Button>
        </div>

        <div className="flex flex-1 flex-col gap-1.5 sm:max-w-xs">
          <label className="text-xs font-semibold uppercase tracking-wider text-purple-600 dark:text-purple-400">
            Model B (Comparison)
          </label>
          <NativeSelect
            value={modelBId}
            onChange={(e) => setModelBId(e.target.value)}
            options={models.map((m) => ({ value: m.id, label: `${m.displayName} (${m.providerName})` }))}
            aria-label="Model B"
          />
        </div>
      </div>

      {/* Summary Scoreboard */}
      <div className="grid gap-4 sm:grid-cols-3">
        <div className="rounded-xl border border-border bg-card p-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-muted-foreground">{modelA.displayName}</span>
            <span className="rounded-full bg-primary/10 px-2 py-0.5 text-xs font-semibold text-primary">Model A</span>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-bold text-foreground">{winsA}</span>
            <span className="text-xs text-muted-foreground">categories won</span>
          </div>
        </div>

        <div className="rounded-xl border border-border bg-card p-4 text-center">
          <div className="flex items-center justify-center gap-1.5 text-xs font-medium text-muted-foreground">
            <Scale size={14} />
            <span>Head-to-Head Ratio</span>
          </div>
          <div className="mt-2 text-2xl font-bold tracking-tight text-foreground">
            {winsA} <span className="text-muted-foreground font-normal">:</span> {winsB}
            {ties > 0 && <span className="text-xs text-muted-foreground ml-2">({ties} ties)</span>}
          </div>
        </div>

        <div className="rounded-xl border border-border bg-card p-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-muted-foreground">{modelB.displayName}</span>
            <span className="rounded-full bg-purple-500/10 px-2 py-0.5 text-xs font-semibold text-purple-600 dark:text-purple-400">
              Model B
            </span>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-bold text-foreground">{winsB}</span>
            <span className="text-xs text-muted-foreground">categories won</span>
          </div>
        </div>
      </div>

      {/* Benchmark Bars comparison */}
      <section className="rounded-xl border border-border bg-card p-5">
        <div className="flex items-center justify-between border-b border-border pb-4">
          <div>
            <h2 className="text-base font-semibold text-foreground">Benchmark Metrics Comparison</h2>
            <p className="text-xs text-muted-foreground mt-0.5">
              Side-by-side performance evaluation across key AI operational dimensions.
            </p>
          </div>
          <div className="flex items-center gap-4 text-xs font-medium">
            <div className="flex items-center gap-1.5">
              <span className="h-3 w-3 rounded-full bg-primary" />
              <span>{modelA.displayName}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="h-3 w-3 rounded-full bg-purple-500" />
              <span>{modelB.displayName}</span>
            </div>
          </div>
        </div>

        <div className="mt-5 space-y-5">
          {benchmarks.map((item) => {
            const Icon = item.icon
            const isAWinner = item.scoreA > item.scoreB
            const isBWinner = item.scoreB > item.scoreA

            return (
              <div key={item.key} className="space-y-1.5">
                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2 font-medium text-foreground">
                    <Icon size={14} className="text-muted-foreground" />
                    <span>{item.label}</span>
                  </div>
                  <div className="flex items-center gap-3 tabular-nums font-semibold">
                    <span className={isAWinner ? 'text-primary font-bold' : 'text-muted-foreground'}>
                      {item.scoreA} {isAWinner && '🏆'}
                    </span>
                    <span className="text-muted-foreground/40">vs</span>
                    <span className={isBWinner ? 'text-purple-600 dark:text-purple-400 font-bold' : 'text-muted-foreground'}>
                      {item.scoreB} {isBWinner && '🏆'}
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  {/* Model A bar */}
                  <div className="h-2.5 w-full overflow-hidden rounded-full bg-muted/60">
                    <div
                      className={`h-full rounded-full transition-all duration-500 ${
                        isAWinner ? 'bg-primary' : 'bg-primary/50'
                      }`}
                      style={{ width: `${item.scoreA}%` }}
                    />
                  </div>
                  {/* Model B bar */}
                  <div className="h-2.5 w-full overflow-hidden rounded-full bg-muted/60">
                    <div
                      className={`h-full rounded-full transition-all duration-500 ${
                        isBWinner ? 'bg-purple-600 dark:bg-purple-500' : 'bg-purple-500/50'
                      }`}
                      style={{ width: `${item.scoreB}%` }}
                    />
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </section>

      {/* Specifications Matrix Table */}
      <section className="rounded-xl border border-border bg-card p-5">
        <h2 className="text-base font-semibold text-foreground mb-4">Head-to-Head Specification Matrix</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-border text-muted-foreground">
                <th className="py-2.5 font-medium">Specification</th>
                <th className="py-2.5 font-semibold text-primary">{modelA.displayName}</th>
                <th className="py-2.5 font-semibold text-purple-600 dark:text-purple-400">{modelB.displayName}</th>
                <th className="py-2.5 font-medium text-right">Advantage</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/60">
              <tr>
                <td className="py-2.5 text-muted-foreground font-medium">Provider & Family</td>
                <td className="py-2.5 font-medium">{modelA.providerName} ({modelA.family})</td>
                <td className="py-2.5 font-medium">{modelB.providerName} ({modelB.family})</td>
                <td className="py-2.5 text-right text-muted-foreground">—</td>
              </tr>
              <tr>
                <td className="py-2.5 text-muted-foreground font-medium">Context Window</td>
                <td className="py-2.5 tabular-nums font-semibold">{formatTokens(modelA.contextWindow)}</td>
                <td className="py-2.5 tabular-nums font-semibold">{formatTokens(modelB.contextWindow)}</td>
                <td className="py-2.5 text-right font-medium">
                  {modelA.contextWindow > modelB.contextWindow ? (
                    <span className="text-primary font-bold">Model A (+{Math.round((modelA.contextWindow / modelB.contextWindow - 1) * 100)}%)</span>
                  ) : modelB.contextWindow > modelA.contextWindow ? (
                    <span className="text-purple-600 dark:text-purple-400 font-bold">Model B (+{Math.round((modelB.contextWindow / modelA.contextWindow - 1) * 100)}%)</span>
                  ) : (
                    'Identical'
                  )}
                </td>
              </tr>
              <tr>
                <td className="py-2.5 text-muted-foreground font-medium">Max Output Tokens</td>
                <td className="py-2.5 tabular-nums">{formatTokens(modelA.maxOutputTokens)}</td>
                <td className="py-2.5 tabular-nums">{formatTokens(modelB.maxOutputTokens)}</td>
                <td className="py-2.5 text-right text-muted-foreground">
                  {modelA.maxOutputTokens > modelB.maxOutputTokens ? 'Model A' : modelB.maxOutputTokens > modelA.maxOutputTokens ? 'Model B' : 'Identical'}
                </td>
              </tr>
              <tr>
                <td className="py-2.5 text-muted-foreground font-medium">Input Pricing ($/MTok)</td>
                <td className="py-2.5 tabular-nums font-medium">{formatCost(modelA.pricing.inputPerMTok)}</td>
                <td className="py-2.5 tabular-nums font-medium">{formatCost(modelB.pricing.inputPerMTok)}</td>
                <td className="py-2.5 text-right font-semibold">
                  {modelA.pricing.inputPerMTok < modelB.pricing.inputPerMTok ? (
                    <span className="text-emerald-600 dark:text-emerald-400">Model A Cheaper</span>
                  ) : modelB.pricing.inputPerMTok < modelA.pricing.inputPerMTok ? (
                    <span className="text-emerald-600 dark:text-emerald-400">Model B Cheaper</span>
                  ) : (
                    'Equal'
                  )}
                </td>
              </tr>
              <tr>
                <td className="py-2.5 text-muted-foreground font-medium">Output Pricing ($/MTok)</td>
                <td className="py-2.5 tabular-nums font-medium">{formatCost(modelA.pricing.outputPerMTok)}</td>
                <td className="py-2.5 tabular-nums font-medium">{formatCost(modelB.pricing.outputPerMTok)}</td>
                <td className="py-2.5 text-right font-semibold">
                  {modelA.pricing.outputPerMTok < modelB.pricing.outputPerMTok ? (
                    <span className="text-emerald-600 dark:text-emerald-400">Model A Cheaper</span>
                  ) : modelB.pricing.outputPerMTok < modelA.pricing.outputPerMTok ? (
                    <span className="text-emerald-600 dark:text-emerald-400">Model B Cheaper</span>
                  ) : (
                    'Equal'
                  )}
                </td>
              </tr>
              <tr>
                <td className="py-2.5 text-muted-foreground font-medium">Native Reasoning (Thinking)</td>
                <td className="py-2.5">
                  {modelA.capabilities.reasoning ? (
                    <span className="inline-flex items-center gap-1 text-emerald-600 dark:text-emerald-400 font-medium">
                      <CheckCircle2 size={12} /> Supported
                    </span>
                  ) : (
                    <span className="text-muted-foreground">Standard</span>
                  )}
                </td>
                <td className="py-2.5">
                  {modelB.capabilities.reasoning ? (
                    <span className="inline-flex items-center gap-1 text-emerald-600 dark:text-emerald-400 font-medium">
                      <CheckCircle2 size={12} /> Supported
                    </span>
                  ) : (
                    <span className="text-muted-foreground">Standard</span>
                  )}
                </td>
                <td className="py-2.5 text-right text-muted-foreground">
                  {modelA.capabilities.reasoning && !modelB.capabilities.reasoning ? 'Model A' : modelB.capabilities.reasoning && !modelA.capabilities.reasoning ? 'Model B' : '—'}
                </td>
              </tr>
              <tr>
                <td className="py-2.5 text-muted-foreground font-medium">Vision & Multimodal</td>
                <td className="py-2.5">{modelA.capabilities.vision ? '✅ Yes' : '❌ No'}</td>
                <td className="py-2.5">{modelB.capabilities.vision ? '✅ Yes' : '❌ No'}</td>
                <td className="py-2.5 text-right text-muted-foreground">
                  {modelA.capabilities.vision && !modelB.capabilities.vision ? 'Model A' : modelB.capabilities.vision && !modelA.capabilities.vision ? 'Model B' : '—'}
                </td>
              </tr>
              <tr>
                <td className="py-2.5 text-muted-foreground font-medium">Function / Tool Calling</td>
                <td className="py-2.5">{modelA.capabilities.tools ? '✅ Reliable' : '❌ No'}</td>
                <td className="py-2.5">{modelB.capabilities.tools ? '✅ Reliable' : '❌ No'}</td>
                <td className="py-2.5 text-right text-muted-foreground">—</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      {/* Smart Verdict & Recommendation Card */}
      <section className="rounded-xl border border-primary/20 bg-gradient-to-br from-primary/5 via-card to-purple-500/5 p-5">
        <div className="flex items-start gap-3">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
            <Trophy size={18} />
          </div>
          <div className="space-y-1">
            <h3 className="text-sm font-semibold text-foreground">AI Workload Verdict & Recommendations</h3>
            <p className="text-xs text-muted-foreground leading-relaxed">
              {winsA > winsB ? (
                <>
                  <strong className="text-foreground">{modelA.displayName}</strong> holds an overall technical edge{' '}
                  ({winsA} of {benchmarks.length} categories), particularly suited for high-stakes software engineering,
                  architectural planning, and complex multi-step reasoning.
                </>
              ) : winsB > winsA ? (
                <>
                  <strong className="text-foreground">{modelB.displayName}</strong> holds an overall technical edge{' '}
                  ({winsB} of {benchmarks.length} categories), highly recommended for intensive analytical workflows and
                  specialized tasks.
                </>
              ) : (
                <>
                  Both models are evenly matched across operational benchmarks with complementary performance profiles.
                </>
              )}
            </p>
            <div className="mt-3 flex flex-wrap gap-2 pt-1">
              <span className="rounded-md border border-border bg-card px-2 py-1 text-[11px] font-medium text-foreground">
                📌 When to use {modelA.displayName}: Deep coding, complex problem solving, large documents
              </span>
              <span className="rounded-md border border-border bg-card px-2 py-1 text-[11px] font-medium text-foreground">
                📌 When to use {modelB.displayName}: Fast interactions, low-latency API hooks, economical batch tasks
              </span>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
