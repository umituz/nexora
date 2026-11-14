import { useState, useMemo } from 'react'
import type { ReactNode } from 'react'
import {
  Award,
  CheckCircle2,
  Clock,
  Flame,
  Lightbulb,
  Sparkles,
  TrendingUp,
  Zap,
} from 'lucide-react'
import { Badge } from '@umituz/web-design-system'

export type AnalyticsPeriod = '7D' | '30D' | '90D' | '1Y'

export interface ExecutivePeriodData {
  productivityScore: number
  productivityDelta: number
  dailyScores: number[]
  tasksDone: number
  totalTasks: number
  focusHours: number
  focusDelta: number
  streakDays: number
  categories: { name: string; pct: number; color: string }[]
  insights: string[]
}

const PERIOD_METRICS: Record<AnalyticsPeriod, ExecutivePeriodData> = {
  '7D': {
    productivityScore: 87,
    productivityDelta: 12,
    dailyScores: [72, 68, 85, 90, 88, 82, 87],
    tasksDone: 29,
    totalTasks: 33,
    focusHours: 24.5,
    focusDelta: 4.2,
    streakDays: 14,
    categories: [
      { name: 'AI Autonomous Ops', pct: 45, color: '#8B5CF6' },
      { name: 'Architecture & Code', pct: 28, color: '#3B82F6' },
      { name: 'Security & Triage', pct: 15, color: '#EF4444' },
      { name: 'FinOps & Telemetry', pct: 12, color: '#10B981' },
    ],
    insights: [
      'Peak autonomous throughput is concentrated between 09:00–11:30 UTC. Ideal window for heavy multi-agent compilation.',
      'Task success rate reached 87.8% this week — up 12% following automated AST bug sweep integration.',
      'FinOps inference spend dropped 18.4% by routing routine summaries to fast Groq LPU endpoints.',
    ],
  },
  '30D': {
    productivityScore: 82,
    productivityDelta: 8,
    dailyScores: [65, 70, 75, 80, 78, 82, 85, 79, 72, 88, 84, 77, 80, 83, 76, 71, 69, 74, 81, 86, 83, 78, 85, 88, 82, 79, 84, 87, 90, 82],
    tasksDone: 118,
    totalTasks: 134,
    focusHours: 94.0,
    focusDelta: 16.5,
    streakDays: 21,
    categories: [
      { name: 'AI Autonomous Ops', pct: 48, color: '#8B5CF6' },
      { name: 'Architecture & Code', pct: 26, color: '#3B82F6' },
      { name: 'Security & Triage', pct: 14, color: '#EF4444' },
      { name: 'FinOps & Telemetry', pct: 12, color: '#10B981' },
    ],
    insights: [
      'November is currently your highest-velocity month this quarter, driven by autonomous pipeline adoption.',
      'Worker retry rate reduced to zero on main deployment after Cloudflare ASSETS binding adjustments.',
      'Knowledge vault embeddings grew by 188 chunks with high semantic density (>94% KNN similarity).',
    ],
  },
  '90D': {
    productivityScore: 78,
    productivityDelta: 5,
    dailyScores: [60, 65, 70, 68, 72, 75, 73, 78, 80, 77, 82, 79, 76, 81, 84, 82, 78, 80, 83, 85, 79, 76, 81, 83, 87, 84, 80, 85, 88, 78],
    tasksDone: 342,
    totalTasks: 398,
    focusHours: 284.0,
    focusDelta: 42.0,
    streakDays: 28,
    categories: [
      { name: 'AI Autonomous Ops', pct: 50, color: '#8B5CF6' },
      { name: 'Architecture & Code', pct: 24, color: '#3B82F6' },
      { name: 'Security & Triage', pct: 14, color: '#EF4444' },
      { name: 'FinOps & Telemetry', pct: 12, color: '#10B981' },
    ],
    insights: [
      'Steady upward trajectory across Q3 and early Q4 with 22% overall speedup in agent mission execution.',
      'Token consumption per feature shipped declined by 31%, reflecting cleaner system instructions.',
    ],
  },
  '1Y': {
    productivityScore: 74,
    productivityDelta: 18,
    dailyScores: [55, 58, 62, 65, 70, 68, 72, 74, 71, 76, 78, 80],
    tasksDone: 1420,
    totalTasks: 1680,
    focusHours: 1120.0,
    focusDelta: 180.0,
    streakDays: 45,
    categories: [
      { name: 'AI Autonomous Ops', pct: 52, color: '#8B5CF6' },
      { name: 'Architecture & Code', pct: 22, color: '#3B82F6' },
      { name: 'Security & Triage', pct: 14, color: '#EF4444' },
      { name: 'FinOps & Telemetry', pct: 12, color: '#10B981' },
    ],
    insights: [
      'Annual developer velocity is up 18% year-over-year since migrating to the unified fleet architecture.',
      'Over 1,120 deep work focus hours recorded across multi-model orchestration and system evolution.',
    ],
  },
}

export function ExecutiveIntelligence(): ReactNode {
  const [period, setPeriod] = useState<AnalyticsPeriod>('7D')
  const current = useMemo(() => PERIOD_METRICS[period], [period])

  const completionPct = Math.round((current.tasksDone / current.totalTasks) * 100)

  return (
    <div className="rounded-xl border border-border bg-card p-5 space-y-6">
      {/* Header & Period Filter */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-border">
        <div className="flex items-center gap-2.5">
          <div className="size-9 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center text-primary">
            <Sparkles className="size-4" />
          </div>
          <div>
            <h2 className="text-base font-semibold text-foreground">
              Executive Productivity & Squad Intelligence
            </h2>
            <p className="text-xs text-muted-foreground">
              Real-time velocity scoring, focus telemetry, and AI operational recommendations
            </p>
          </div>
        </div>

        <div className="flex items-center gap-1 bg-muted/40 p-1 rounded-lg border border-border text-xs">
          {(['7D', '30D', '90D', '1Y'] as const).map((p) => (
            <button
              key={p}
              onClick={() => setPeriod(p)}
              className={`px-2.5 py-1 rounded-md text-xs font-semibold transition-colors ${
                period === p
                  ? 'bg-primary text-primary-foreground shadow-xs'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              {p}
            </button>
          ))}
        </div>
      </div>

      {/* 4 Key Stat Badges */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="rounded-xl border border-border/80 bg-muted/20 p-4 space-y-1">
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <span>Productivity Score</span>
            <Award className="size-4 text-purple-500" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-bold tabular-nums text-foreground">{current.productivityScore}%</span>
            <span className="text-xs font-medium text-emerald-600 dark:text-emerald-400 flex items-center">
              <TrendingUp className="size-3 mr-0.5" /> +{current.productivityDelta}%
            </span>
          </div>
          <p className="text-[11px] text-muted-foreground">Aggregated across all agents</p>
        </div>

        <div className="rounded-xl border border-border/80 bg-muted/20 p-4 space-y-1">
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <span>Deep Work & Focus</span>
            <Clock className="size-4 text-blue-500" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-bold tabular-nums text-foreground">{current.focusHours}h</span>
            <span className="text-xs font-medium text-emerald-600 dark:text-emerald-400 flex items-center">
              <TrendingUp className="size-3 mr-0.5" /> +{current.focusDelta}h
            </span>
          </div>
          <p className="text-[11px] text-muted-foreground">Autonomous execution blocks</p>
        </div>

        <div className="rounded-xl border border-border/80 bg-muted/20 p-4 space-y-1">
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <span>Mission Throughput</span>
            <CheckCircle2 className="size-4 text-emerald-500" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-bold tabular-nums text-foreground">
              {current.tasksDone}/{current.totalTasks}
            </span>
            <span className="text-xs font-medium text-emerald-600 dark:text-emerald-400">
              {completionPct}%
            </span>
          </div>
          <p className="text-[11px] text-muted-foreground">Succeeded queue jobs</p>
        </div>

        <div className="rounded-xl border border-border/80 bg-muted/20 p-4 space-y-1">
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <span>Consistency Streak</span>
            <Flame className="size-4 text-amber-500" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-bold tabular-nums text-amber-500">{current.streakDays} Days</span>
            <Badge tone="success" className="text-[10px]">Active</Badge>
          </div>
          <p className="text-[11px] text-muted-foreground">Zero-blocker cadence</p>
        </div>
      </div>

      {/* Split Mid-Section: Daily Velocity Sparklines & Categorical Breakdown */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
        {/* Daily Velocity Histogram (6 cols) */}
        <div className="md:col-span-6 space-y-2.5">
          <div className="flex items-center justify-between text-xs">
            <span className="font-semibold text-foreground flex items-center gap-1.5">
              <Zap className="size-3.5 text-primary" /> Daily Velocity Trends ({period})
            </span>
            <span className="font-mono text-muted-foreground text-[11px]">
              Avg: {Math.round(current.dailyScores.reduce((a, b) => a + b, 0) / current.dailyScores.length)}%
            </span>
          </div>

          <div className="h-24 rounded-lg bg-muted/20 border border-border/60 p-3 flex items-end justify-between gap-1.5">
            {current.dailyScores.map((score, idx) => {
              const heightPct = Math.max(15, Math.round((score / 100) * 100))
              return (
                <div
                  key={idx}
                  className="flex-1 flex flex-col items-center gap-1 h-full justify-end group"
                  title={`Day ${idx + 1}: ${score}% velocity`}
                >
                  <div
                    className="w-full rounded-xs bg-primary/70 group-hover:bg-primary transition-all duration-300"
                    style={{ height: `${heightPct}%` }}
                  />
                  <span className="text-[9px] text-muted-foreground font-mono opacity-60 group-hover:opacity-100">
                    {score}
                  </span>
                </div>
              )
            })}
          </div>
        </div>

        {/* Categorical Workload Allocation (6 cols) */}
        <div className="md:col-span-6 space-y-3">
          <div className="flex items-center justify-between text-xs">
            <span className="font-semibold text-foreground">Workload Distribution</span>
            <span className="text-muted-foreground text-[11px]">By operational domain</span>
          </div>

          {/* Segmented Bar */}
          <div className="h-3 w-full rounded-full bg-muted flex overflow-hidden">
            {current.categories.map((cat, i) => (
              <div
                key={i}
                className="h-full transition-all duration-500"
                style={{ width: `${cat.pct}%`, backgroundColor: cat.color }}
                title={`${cat.name}: ${cat.pct}%`}
              />
            ))}
          </div>

          {/* Category Legend */}
          <div className="grid grid-cols-2 gap-2 text-xs">
            {current.categories.map((cat, i) => (
              <div key={i} className="flex items-center gap-2">
                <span className="size-2.5 rounded-full shrink-0" style={{ backgroundColor: cat.color }} />
                <span className="text-foreground text-[11px] font-medium truncate">{cat.name}</span>
                <span className="font-mono text-muted-foreground text-[11px] ml-auto">{cat.pct}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* AI Executive Insights & Coaching */}
      <div className="rounded-xl border border-primary/30 bg-primary/5 p-4 space-y-3">
        <div className="flex items-center gap-2">
          <Lightbulb className="size-4 text-primary" />
          <h3 className="font-semibold text-xs text-foreground uppercase tracking-wider">
            Aria AI Executive Insights & Guidance
          </h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {current.insights.map((insight, idx) => (
            <div
              key={idx}
              className="rounded-lg bg-card/80 border border-border/60 p-3 text-xs leading-relaxed text-muted-foreground flex items-start gap-2"
            >
              <span className="text-primary font-bold shrink-0 mt-0.5">•</span>
              <p>{insight}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
