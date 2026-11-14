import { useEffect, useRef, useState } from 'react'
import type { ReactNode } from 'react'
import {
  CheckCircle2,
  Clock,
  Eye,
  FileCheck2,
  Layers,
  Pause,
  Play,
  RotateCcw,
  Search,
  Sparkles,
  Terminal,
  Wand2,
} from 'lucide-react'
import { Button } from '@umituz/web-design-system'
import { OutputArtifactViewer } from './OutputArtifactViewer'

export interface AgentStep {
  id: string
  title: string
  detail: string
  icon: typeof Sparkles
  status: 'pending' | 'running' | 'completed' | 'failed'
  duration?: string
}

interface AgentRunCanvasProps {
  initialMissionTitle?: string
  onDone?: () => void
}

const DEFAULT_STEPS: AgentStep[] = [
  {
    id: 's1',
    title: '1. Task Decomposition & Plan Assembly',
    detail: 'Parsing objectives, identifying constraints, and generating multi-turn execution graph.',
    icon: Layers,
    status: 'completed',
    duration: '2.4s',
  },
  {
    id: 's2',
    title: '2. Context Retrieval & Autonomous Web Search',
    detail: 'Querying Tavily search APIs, knowledge base embeddings, and historical memory vectors.',
    icon: Search,
    status: 'completed',
    duration: '5.1s',
  },
  {
    id: 's3',
    title: '3. Tool Execution & Core Model Inference',
    detail: 'Executing code sandbox, calling analytical tools, and synthesizing structured outputs.',
    icon: Wand2,
    status: 'running',
  },
  {
    id: 's4',
    title: '4. Quality Assurance & Constraint Validation',
    detail: 'Running TypeScript compiler checks, security rule scanning, and schema verification.',
    icon: FileCheck2,
    status: 'pending',
  },
  {
    id: 's5',
    title: '5. Artifact Packaging & Delivery',
    detail: 'Generating production artifacts (interactive web sandbox, code, CSV dataset, whitepaper).',
    icon: CheckCircle2,
    status: 'pending',
  },
]

const INITIAL_LOGS: string[] = [
  '[*] Agent session initialized with Manus Autonomous Engine v2.4',
  '[→] Target: "Build Distributed Rate Limiter & Security Benchmark"',
  '[→] Selected Model: Claude 3.7 Sonnet (Thinking Mode: Enabled)',
  '[✓] Plan generated: 5 execution milestones identified',
  '[⚙] TOOL_INVOCATION: web_search(query="distributed sliding window rate limiter redis lua atomic", limit=5)',
  '[✓] 5 research sources fetched and indexed into transient context',
  '[⚙] TOOL_INVOCATION: knowledge_knn_search(collection="architecture-patterns", topK=3)',
  '[→] Synthesizing atomic Lua script with Redis memory persistence...',
  '[→] Compiling TypeScript DistributedTokenBucket client with edge runtime compatibility...',
]

export function AgentRunCanvas({
  initialMissionTitle = 'Autonomous Full-Stack Architecture & Security Verification',
}: AgentRunCanvasProps): ReactNode {
  const [missionTitle] = useState(initialMissionTitle)
  const [steps, setSteps] = useState<AgentStep[]>(DEFAULT_STEPS)
  const [activeStepIndex, setActiveStepIndex] = useState(2)
  const [isRunning, setIsRunning] = useState(true)
  const [elapsedSeconds, setElapsedSeconds] = useState(24)
  const [logs, setLogs] = useState<string[]>(INITIAL_LOGS)
  const [showArtifacts, setShowArtifacts] = useState(false)
  const logEndRef = useRef<HTMLDivElement>(null)

  // Timer loop
  useEffect(() => {
    if (!isRunning) return
    const interval = setInterval(() => {
      setElapsedSeconds((s) => s + 1)
    }, 1000)
    return () => clearInterval(interval)
  }, [isRunning])

  // Simulated live execution steps progress
  useEffect(() => {
    if (!isRunning) return
    const stepInterval = setInterval(() => {
      setActiveStepIndex((prev) => {
        if (prev < steps.length - 1) {
          const next = prev + 1
          setSteps((cur) =>
            cur.map((s, idx) => {
              if (idx < next) return { ...s, status: 'completed', duration: s.duration ?? '4.2s' }
              if (idx === next) return { ...s, status: 'running' }
              return { ...s, status: 'pending' }
            }),
          )

          const newLogs = [
            `[✓] Phase ${prev + 1} finalized successfully`,
            `[→] Entering Phase ${next + 1}: ${steps[next]?.title}`,
            `[⚙] TOOL_EXECUTION: sandbox_validate_syntax(target="tokenBucketRateLimiter.ts")`,
            `[✓] TypeScript compile passed: 0 errors, 100% strict compliance`,
          ]
          setLogs((l) => [...l, ...newLogs])
          return next
        } else {
          setIsRunning(false)
          setSteps((cur) => cur.map((s) => ({ ...s, status: 'completed', duration: s.duration ?? '3.8s' })))
          setLogs((l) => [
            ...l,
            '[✓] ALL PHASES COMPLETE: Execution pipeline succeeded',
            '[✦] Artifacts generated: Web Preview, TypeScript Code, CSV Benchmark, Research Paper',
          ])
          return prev
        }
      })
    }, 7000)

    return () => clearInterval(stepInterval)
  }, [isRunning, steps])

  // Auto scroll logs
  useEffect(() => {
    logEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [logs])

  const toggleRun = () => {
    setIsRunning(!isRunning)
  }

  const restartAgent = () => {
    setSteps(DEFAULT_STEPS)
    setActiveStepIndex(1)
    setElapsedSeconds(0)
    setLogs([
      '[*] Agent restarted by operator',
      `[→] Target: "${missionTitle}"`,
      '[→] Re-assembling planning graph...',
    ])
    setIsRunning(true)
  }

  const elapsedFormatted = `${Math.floor(elapsedSeconds / 60)}m ${String(elapsedSeconds % 60).padStart(2, '0')}s`

  return (
    <div className="space-y-6">
      {/* Canvas Top Bar */}
      <div className="rounded-xl border border-border bg-card p-5">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-purple-600 text-white shadow-sm">
              <Sparkles size={20} className={isRunning ? 'animate-spin' : ''} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-bold text-foreground">{missionTitle}</h2>
                <span
                  className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[11px] font-semibold ${
                    isRunning
                      ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400'
                      : activeStepIndex >= steps.length - 1
                        ? 'bg-blue-500/10 text-blue-600 dark:text-blue-400'
                        : 'bg-muted text-muted-foreground'
                  }`}
                >
                  <span className={`h-1.5 w-1.5 rounded-full ${isRunning ? 'animate-ping bg-emerald-500' : 'bg-current'}`} />
                  {isRunning ? 'Agent Executing' : activeStepIndex >= steps.length - 1 ? 'Mission Succeeded' : 'Paused'}
                </span>
              </div>
              <p className="text-xs text-muted-foreground mt-0.5 flex items-center gap-2">
                <span className="flex items-center gap-1">
                  <Clock size={12} /> Elapsed: {elapsedFormatted}
                </span>
                <span>·</span>
                <span>Active Model: Claude 3.7 Sonnet</span>
                <span>·</span>
                <span>Sandbox: Isolated Web Worker</span>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={toggleRun}
              className="text-xs h-8"
            >
              {isRunning ? <Pause size={13} className="mr-1" /> : <Play size={13} className="mr-1" />}
              {isRunning ? 'Pause' : 'Resume'}
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={restartAgent}
              className="text-xs h-8"
            >
              <RotateCcw size={13} className="mr-1" />
              Rerun
            </Button>
            <Button
              variant={showArtifacts ? 'outline' : 'default'}
              size="sm"
              onClick={() => setShowArtifacts(!showArtifacts)}
              className="text-xs h-8"
            >
              <Eye size={13} className="mr-1" />
              {showArtifacts ? 'Hide Output Viewer' : 'View Generated Artifacts'}
            </Button>
          </div>
        </div>
      </div>

      {/* Artifact Viewer Section (when opened) */}
      {showArtifacts && (
        <OutputArtifactViewer onClose={() => setShowArtifacts(false)} />
      )}

      {/* Two Column Execution Canvas: Steps & Live Logs */}
      <div className="grid gap-6 lg:grid-cols-12">
        {/* Left Column: 5-Step Pipeline */}
        <div className="rounded-xl border border-border bg-card p-5 lg:col-span-6 space-y-4">
          <div className="flex items-center justify-between border-b border-border pb-3">
            <h3 className="text-sm font-semibold text-foreground flex items-center gap-2">
              <Layers size={16} className="text-primary" />
              Autonomous Pipeline Progression
            </h3>
            <span className="text-xs font-semibold tabular-nums text-muted-foreground">
              Step {Math.min(activeStepIndex + 1, steps.length)} of {steps.length}
            </span>
          </div>

          <div className="space-y-4 relative">
            {steps.map((step, idx) => {
              const Icon = step.icon
              const isPast = idx < activeStepIndex
              const isCurrent = idx === activeStepIndex && isRunning
              const isDone = idx <= activeStepIndex && !isRunning && activeStepIndex === steps.length - 1

              return (
                <div key={step.id} className="flex items-start gap-3.5 relative">
                  {/* Connecting Line */}
                  {idx < steps.length - 1 && (
                    <div
                      className={`absolute left-4 top-8 w-0.5 h-12 -ml-[1px] transition-colors ${
                        isPast ? 'bg-primary' : 'bg-muted'
                      }`}
                    />
                  )}

                  {/* Icon Indicator */}
                  <div
                    className={`h-8 w-8 rounded-full flex items-center justify-center shrink-0 z-10 transition-all ${
                      isCurrent
                        ? 'ring-4 ring-primary/20 bg-primary text-primary-foreground shadow-sm'
                        : isPast || isDone
                          ? 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400'
                          : 'bg-muted text-muted-foreground'
                    }`}
                  >
                    {isPast || isDone ? (
                      <CheckCircle2 size={16} />
                    ) : (
                      <Icon size={14} className={isCurrent ? 'animate-pulse' : ''} />
                    )}
                  </div>

                  {/* Step Info */}
                  <div className="min-w-0 flex-1 pt-0.5">
                    <div className="flex items-center justify-between gap-2">
                      <h4
                        className={`text-xs font-semibold ${
                          isCurrent
                            ? 'text-primary'
                            : isPast || isDone
                              ? 'text-foreground'
                              : 'text-muted-foreground'
                        }`}
                      >
                        {step.title}
                      </h4>
                      {step.duration && (
                        <span className="text-[10px] text-muted-foreground tabular-nums">
                          {step.duration}
                        </span>
                      )}
                    </div>
                    <p className="text-[11px] text-muted-foreground mt-0.5 leading-relaxed">
                      {step.detail}
                    </p>
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        {/* Right Column: Live Terminal Log Console */}
        <div className="rounded-xl border border-border bg-slate-950 p-4 lg:col-span-6 flex flex-col font-mono text-xs">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3 mb-3 text-slate-400">
            <div className="flex items-center gap-2">
              <Terminal size={14} className="text-cyan-400" />
              <span className="font-semibold text-slate-200">Live Agent Console Feed</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-[10px] text-slate-400">STDIN / STDOUT</span>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto space-y-1.5 max-h-[360px] pr-2 text-slate-300">
            {logs.map((log, index) => {
              let color = 'text-slate-300'
              if (log.startsWith('[✓]') || log.includes('COMPLETE')) color = 'text-emerald-400'
              else if (log.startsWith('[→]')) color = 'text-cyan-400'
              else if (log.startsWith('[⚙]')) color = 'text-purple-400'
              else if (log.startsWith('[!]')) color = 'text-amber-400'
              else if (log.startsWith('[*]')) color = 'text-slate-400'

              return (
                <div key={index} className="leading-relaxed flex items-start gap-2">
                  <span className="text-slate-600 select-none text-[10px] pt-0.5">
                    {String(index + 1).padStart(2, '0')}
                  </span>
                  <span className={color}>{log}</span>
                </div>
              )
            })}
            <div ref={logEndRef} />
          </div>

          <div className="border-t border-slate-800/80 pt-3 mt-3 flex items-center justify-between text-[11px] text-slate-500">
            <span>Buffer: {logs.length} events logged</span>
            <span className="text-slate-400">Auto-streaming enabled</span>
          </div>
        </div>
      </div>
    </div>
  )
}
