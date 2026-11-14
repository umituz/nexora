import { useState, useMemo, useCallback } from 'react'
import type { ReactNode } from 'react'
import {
  AlertCircle,
  BarChart3,
  CheckCircle2,
  ChevronDown,
  ChevronRight,
  Clock,
  CreditCard,
  GitPullRequest,
  Loader2,
  Play,
  RotateCcw,
  ShieldCheck,
  Sparkles,
  Sun,
  Terminal,
} from 'lucide-react'
import { Badge, Button } from '@umituz/web-design-system'
import {
  INITIAL_WORKFLOW_RUNS,
  WORKFLOW_TEMPLATES,
  type WorkflowRunItem,
  type WorkflowStatus,
  type WorkflowStepItem,
  type WorkflowTemplateItem,
} from './workflowData'

interface WorkflowCanvasProps {
  onNotify?: (message: string) => void
}

function getWorkflowIcon(iconName: string): ReactNode {
  switch (iconName) {
    case 'CreditCard':
      return <CreditCard className="size-4" />
    case 'Sun':
      return <Sun className="size-4" />
    case 'ShieldCheck':
      return <ShieldCheck className="size-4" />
    case 'GitPullRequest':
      return <GitPullRequest className="size-4" />
    case 'BarChart3':
      return <BarChart3 className="size-4" />
    default:
      return <Sparkles className="size-4" />
  }
}

function getStatusBadge(status: WorkflowStatus): ReactNode {
  switch (status) {
    case 'done':
      return (
        <Badge tone="success" className="bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
          <CheckCircle2 className="size-3 mr-1" /> Completed
        </Badge>
      )
    case 'running':
      return (
        <Badge tone="info" className="bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20 animate-pulse">
          <Loader2 className="size-3 mr-1 animate-spin" /> In Progress
        </Badge>
      )
    case 'failed':
      return (
        <Badge tone="danger" className="bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/20">
          <AlertCircle className="size-3 mr-1" /> Failed
        </Badge>
      )
    case 'pending':
    default:
      return (
        <Badge tone="neutral" className="bg-muted text-muted-foreground">
          <Clock className="size-3 mr-1" /> Queued
        </Badge>
      )
  }
}

export function WorkflowCanvas({ onNotify }: WorkflowCanvasProps): ReactNode {
  const [runs, setRuns] = useState<WorkflowRunItem[]>(INITIAL_WORKFLOW_RUNS)
  const [selectedRunId, setSelectedRunId] = useState<string>(INITIAL_WORKFLOW_RUNS[0].id)
  const [categoryFilter, setCategoryFilter] = useState<string>('all')
  const [expandedSteps, setExpandedSteps] = useState<Record<string, boolean>>({
    's1': true,
    's2': true,
  })

  const selectedRun = useMemo(() => {
    return runs.find((r) => r.id === selectedRunId) || runs[0]
  }, [runs, selectedRunId])

  // Summary Metrics
  const stats = useMemo(() => {
    const total = runs.length
    const running = runs.filter((r) => r.status === 'running').length
    const completed = runs.filter((r) => r.status === 'done').length
    const successRate = total > 0 ? Math.round((completed / total) * 100) : 100
    return { total, running, completed, successRate }
  }, [runs])

  const filteredTemplates = useMemo(() => {
    if (categoryFilter === 'all') return WORKFLOW_TEMPLATES
    return WORKFLOW_TEMPLATES.filter((t) => t.category === categoryFilter)
  }, [categoryFilter])

  // Toggle Step Log Accordion
  const toggleStepLogs = useCallback((stepId: string) => {
    setExpandedSteps((prev) => ({
      ...prev,
      [stepId]: !prev[stepId],
    }))
  }, [])

  // Launch a new workflow run from template
  const launchWorkflow = useCallback((template: WorkflowTemplateItem) => {
    const newRunId = `run-${Date.now().toString().slice(-4)}`
    const initialSteps: WorkflowStepItem[] = template.defaultSteps.map((s, idx) => ({
      id: `step-${Date.now()}-${idx}`,
      label: s.label,
      status: idx === 0 ? 'running' : 'pending',
      detail: s.detail,
      duration: idx === 0 ? 'Evaluating...' : undefined,
      logs: idx === 0 ? ['[START] Initiated automated workflow execution...'] : undefined,
    }))

    const newRun: WorkflowRunItem = {
      id: newRunId,
      templateId: template.id,
      name: template.name,
      description: template.description,
      category: template.category,
      icon: template.icon,
      color: template.color,
      status: 'running',
      triggeredAt: 'Just now',
      totalDuration: 'Running...',
      steps: initialSteps,
    }

    setRuns((prev) => [newRun, ...prev])
    setSelectedRunId(newRunId)
    onNotify?.(`Launched workflow: ${template.name}`)

    // Progressive step simulation
    let currentStepIdx = 0
    const advanceNext = () => {
      if (currentStepIdx >= template.defaultSteps.length) {
        // Mark whole workflow done
        setRuns((prevRuns) =>
          prevRuns.map((r) => {
            if (r.id !== newRunId) return r
            return {
              ...r,
              status: 'done',
              totalDuration: `${(1.2 + Math.random() * 1.5).toFixed(2)}s`,
            }
          }),
        )
        onNotify?.(`Workflow completed: ${template.name}`)
        return
      }

      setRuns((prevRuns) =>
        prevRuns.map((r) => {
          if (r.id !== newRunId) return r
          const updatedSteps = r.steps.map((st, i) => {
            if (i === currentStepIdx) {
              return {
                ...st,
                status: 'done' as WorkflowStatus,
                duration: `${Math.round(200 + Math.random() * 400)}ms`,
                logs: [
                  ...(st.logs || []),
                  `[OK] Completed execution phase with zero errors`,
                  `[STATE] Verified state transitions and telemetry`,
                ],
              }
            }
            if (i === currentStepIdx + 1) {
              return {
                ...st,
                status: 'running' as WorkflowStatus,
                duration: 'Processing...',
                logs: [`[INSPECT] Running step logic...`],
              }
            }
            return st
          })
          return { ...r, steps: updatedSteps }
        }),
      )

      currentStepIdx++
      setTimeout(advanceNext, 1200)
    }

    setTimeout(advanceNext, 1200)
  }, [onNotify])

  // Retry failed step
  const retryStep = useCallback((stepId: string) => {
    if (!selectedRun) return
    onNotify?.('Retrying failed workflow phase with fallback worker container...')

    setRuns((prevRuns) =>
      prevRuns.map((r) => {
        if (r.id !== selectedRun.id) return r
        const updatedSteps = r.steps.map((st) => {
          if (st.id === stepId) {
            return {
              ...st,
              status: 'running' as WorkflowStatus,
              duration: 'Retrying on worker pool...',
              logs: [...(st.logs || []), '[RETRY] Container sandbox provisioned successfully', '[INFO] Re-executing regression check suite...'],
            }
          }
          return st
        })
        return { ...r, status: 'running', steps: updatedSteps }
      }),
    )

    setTimeout(() => {
      setRuns((prevRuns) =>
        prevRuns.map((r) => {
          if (r.id !== selectedRun.id) return r
          const updatedSteps = r.steps.map((st) => {
            if (st.id === stepId) {
              return {
                ...st,
                status: 'done' as WorkflowStatus,
                duration: '610ms',
                logs: [...(st.logs || []), '[SUCCESS] Sandbox execution exited 0 with 33 passing specs'],
              }
            }
            if (st.status === 'pending') {
              return {
                ...st,
                status: 'done' as WorkflowStatus,
                duration: '220ms',
                logs: ['[OK] Successfully completed queued downstream pipeline'],
              }
            }
            return st
          })
          return {
            ...r,
            status: 'done',
            totalDuration: '2.84s (Recovered)',
            steps: updatedSteps,
          }
        }),
      )
      onNotify?.('Workflow recovered and successfully finished!')
    }, 1500)
  }, [selectedRun, onNotify])

  return (
    <div className="space-y-6">
      {/* Top Metric Bar */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="rounded-xl border border-border bg-card p-4">
          <div className="flex items-center justify-between text-muted-foreground text-xs font-medium">
            <span>Total Executions</span>
            <Sparkles className="size-4 text-primary" />
          </div>
          <div className="mt-2 text-2xl font-bold tabular-nums">{stats.total}</div>
          <p className="mt-1 text-xs text-muted-foreground">Orchestrated pipelines</p>
        </div>

        <div className="rounded-xl border border-border bg-card p-4">
          <div className="flex items-center justify-between text-muted-foreground text-xs font-medium">
            <span>In Flight</span>
            <Loader2 className="size-4 text-blue-500 animate-spin" />
          </div>
          <div className="mt-2 text-2xl font-bold tabular-nums text-blue-500">{stats.running}</div>
          <p className="mt-1 text-xs text-muted-foreground">Active agent processes</p>
        </div>

        <div className="rounded-xl border border-border bg-card p-4">
          <div className="flex items-center justify-between text-muted-foreground text-xs font-medium">
            <span>Pipeline Success Rate</span>
            <CheckCircle2 className="size-4 text-emerald-500" />
          </div>
          <div className="mt-2 text-2xl font-bold tabular-nums text-emerald-500">{stats.successRate}%</div>
          <p className="mt-1 text-xs text-muted-foreground">Reliable multi-step runs</p>
        </div>

        <div className="rounded-xl border border-border bg-card p-4">
          <div className="flex items-center justify-between text-muted-foreground text-xs font-medium">
            <span>Avg Pipeline Latency</span>
            <Clock className="size-4 text-muted-foreground" />
          </div>
          <div className="mt-2 text-2xl font-bold tabular-nums">2.14s</div>
          <p className="mt-1 text-xs text-muted-foreground">P95 autonomous run time</p>
        </div>
      </div>

      {/* Main Split Layout: Left Execution Canvas & Pipeline Inspector / Right Recent History */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Side: Active Workflow Live Canvas & Inspector (7 Cols) */}
        <div className="lg:col-span-7 space-y-4">
          <div className="rounded-xl border border-border bg-card overflow-hidden">
            {/* Run Header */}
            <div className="p-5 border-b border-border bg-muted/20">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div
                    className="size-10 rounded-lg flex items-center justify-center text-white shadow-sm"
                    style={{ backgroundColor: selectedRun.color }}
                  >
                    {getWorkflowIcon(selectedRun.icon)}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="font-semibold text-base text-foreground">{selectedRun.name}</h3>
                      <span className="text-xs text-muted-foreground font-mono">[{selectedRun.id}]</span>
                    </div>
                    <p className="text-xs text-muted-foreground mt-0.5">{selectedRun.description}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {getStatusBadge(selectedRun.status)}
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      const tpl = WORKFLOW_TEMPLATES.find((t) => t.name === selectedRun.name) || WORKFLOW_TEMPLATES[0]
                      launchWorkflow(tpl)
                    }}
                    className="gap-1.5 text-xs"
                  >
                    <RotateCcw className="size-3.5" /> Re-execute
                  </Button>
                </div>
              </div>

              <div className="mt-4 flex flex-wrap items-center gap-4 text-xs text-muted-foreground pt-3 border-t border-border/50">
                <span className="flex items-center gap-1.5">
                  <Clock className="size-3.5" /> Triggered: <strong className="text-foreground">{selectedRun.triggeredAt}</strong>
                </span>
                <span className="flex items-center gap-1.5">
                  <Sparkles className="size-3.5" /> Duration: <strong className="text-foreground">{selectedRun.totalDuration || 'Pending'}</strong>
                </span>
                <span className="flex items-center gap-1.5">
                  <Badge variant="outline" className="text-[10px] uppercase font-mono tracking-wider">
                    {selectedRun.category}
                  </Badge>
                </span>
              </div>
            </div>

            {/* Step-by-Step Execution Pipeline */}
            <div className="p-5 space-y-6">
              <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-2">
                <Terminal className="size-4 text-primary" /> Execution Flow & Diagnostics
              </h4>

              <div className="space-y-4 relative before:absolute before:left-4 before:top-3 before:bottom-3 before:w-0.5 before:bg-border">
                {selectedRun.steps.map((step, idx) => {
                  const isExpanded = !!expandedSteps[step.id]
                  return (
                    <div key={step.id} className="relative flex items-start gap-3.5 pl-0.5 group">
                      {/* Step Circle Indicator */}
                      <div className="relative z-10 shrink-0">
                        {step.status === 'done' ? (
                          <div className="size-7 rounded-full bg-emerald-500/10 border-2 border-emerald-500 text-emerald-500 flex items-center justify-center bg-card">
                            <CheckCircle2 className="size-3.5" />
                          </div>
                        ) : step.status === 'running' ? (
                          <div className="size-7 rounded-full bg-blue-500/10 border-2 border-blue-500 text-blue-500 flex items-center justify-center bg-card animate-pulse">
                            <Loader2 className="size-3.5 animate-spin" />
                          </div>
                        ) : step.status === 'failed' ? (
                          <div className="size-7 rounded-full bg-rose-500/10 border-2 border-rose-500 text-rose-500 flex items-center justify-center bg-card">
                            <AlertCircle className="size-3.5" />
                          </div>
                        ) : (
                          <div className="size-7 rounded-full bg-muted border-2 border-border text-muted-foreground flex items-center justify-center bg-card">
                            <span className="text-[10px] font-bold">{idx + 1}</span>
                          </div>
                        )}
                      </div>

                      {/* Step Body */}
                      <div className="flex-1 rounded-lg border border-border/70 bg-card p-3.5 shadow-xs transition-colors hover:border-primary/40">
                        <div className="flex items-start justify-between gap-2">
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="text-xs font-semibold text-foreground">{step.label}</span>
                              {step.duration && (
                                <span className="text-[10px] px-1.5 py-0.5 rounded-sm font-mono bg-muted text-muted-foreground">
                                  {step.duration}
                                </span>
                              )}
                            </div>
                            <p className="text-xs text-muted-foreground mt-0.5">{step.detail}</p>
                          </div>

                          <div className="flex items-center gap-1.5 shrink-0">
                            {step.status === 'failed' && (
                              <Button
                                size="sm"
                                variant="destructive"
                                onClick={() => retryStep(step.id)}
                                className="h-6 px-2 text-[11px] gap-1"
                              >
                                <RotateCcw className="size-3" /> Retry Step
                              </Button>
                            )}

                            {step.logs && step.logs.length > 0 && (
                              <Button
                                size="sm"
                                variant="ghost"
                                onClick={() => toggleStepLogs(step.id)}
                                className="h-6 px-2 text-xs text-muted-foreground hover:text-foreground"
                              >
                                {isExpanded ? <ChevronDown className="size-3.5" /> : <ChevronRight className="size-3.5" />}
                              </Button>
                            )}
                          </div>
                        </div>

                        {/* Step Logs Drawer */}
                        {isExpanded && step.logs && (
                          <div className="mt-3 rounded-md bg-zinc-950 p-2.5 font-mono text-[11px] text-zinc-300 border border-zinc-800 space-y-1">
                            {step.logs.map((log, lIdx) => (
                              <div
                                key={lIdx}
                                className={
                                  log.includes('[ERROR]') || log.includes('[FLAG]')
                                    ? 'text-rose-400'
                                    : log.includes('[OK]') || log.includes('[SUCCESS]')
                                    ? 'text-emerald-400'
                                    : 'text-zinc-400'
                                }
                              >
                                {log}
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          </div>
        </div>

        {/* Right Side: Execution History & Template Quick Launch (5 Cols) */}
        <div className="lg:col-span-5 space-y-4">
          {/* Recent Runs List */}
          <div className="rounded-xl border border-border bg-card p-4 space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold text-sm">Recent Runs</h3>
              <span className="text-xs text-muted-foreground font-mono">{runs.length} recorded</span>
            </div>

            <div className="space-y-2">
              {runs.map((r) => {
                const isSelected = r.id === selectedRun.id
                return (
                  <button
                    key={r.id}
                    onClick={() => setSelectedRunId(r.id)}
                    className={`w-full text-left p-3 rounded-lg border transition-all flex items-center justify-between gap-3 ${
                      isSelected
                        ? 'border-primary bg-primary/5 shadow-xs'
                        : 'border-border/60 hover:bg-muted/40 hover:border-border'
                    }`}
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <div
                        className="size-8 rounded-md flex items-center justify-center text-white shrink-0"
                        style={{ backgroundColor: r.color }}
                      >
                        {getWorkflowIcon(r.icon)}
                      </div>
                      <div className="min-w-0 truncate">
                        <div className="font-medium text-xs text-foreground truncate">{r.name}</div>
                        <div className="text-[11px] text-muted-foreground truncate">{r.triggeredAt} · {r.totalDuration}</div>
                      </div>
                    </div>
                    <div className="shrink-0">{getStatusBadge(r.status)}</div>
                  </button>
                )
              })}
            </div>
          </div>

          {/* Quick Trigger Preset Cards */}
          <div className="rounded-xl border border-border bg-card p-4 space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold text-sm">Automated Workflows</h3>
              <div className="flex items-center gap-1">
                {(['all', 'finance', 'security', 'daily'] as const).map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setCategoryFilter(cat)}
                    className={`text-[10px] px-2 py-0.5 rounded-md font-medium capitalize transition-colors ${
                      categoryFilter === cat
                        ? 'bg-primary text-primary-foreground'
                        : 'text-muted-foreground hover:bg-muted'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-2.5">
              {filteredTemplates.map((template) => (
                <div
                  key={template.id}
                  className="rounded-lg border border-border/80 bg-muted/20 p-3 flex items-start justify-between gap-3 transition-colors hover:border-primary/50"
                >
                  <div className="flex items-start gap-2.5">
                    <div
                      className="size-8 rounded-md flex items-center justify-center text-white shrink-0 mt-0.5"
                      style={{ backgroundColor: template.color }}
                    >
                      {getWorkflowIcon(template.icon)}
                    </div>
                    <div>
                      <h4 className="font-semibold text-xs text-foreground">{template.name}</h4>
                      <p className="text-[11px] text-muted-foreground line-clamp-2 mt-0.5">
                        {template.description}
                      </p>
                      <div className="flex items-center gap-2 mt-2 text-[10px] text-muted-foreground">
                        <span>{template.stepsCount} phases</span>
                        <span>•</span>
                        <span>{template.estimatedTime}</span>
                        <span>•</span>
                        <span>{template.runsCount} runs</span>
                      </div>
                    </div>
                  </div>

                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => launchWorkflow(template)}
                    className="shrink-0 text-xs h-7 px-2.5 gap-1 hover:border-primary hover:text-primary"
                  >
                    <Play className="size-3 fill-current" /> Run
                  </Button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
