import { useState } from 'react'
import type { ReactNode } from 'react'
import {
  Calendar,
  CheckCircle2,
  Circle,
  Plus,
  Target,
  Trash2,
} from 'lucide-react'
import { Button, Input } from '@umituz/web-design-system'

export interface ProjectMilestoneItem {
  id: string
  label: string
  done: boolean
}

export interface StrategicGoal {
  id: string
  title: string
  category: string
  targetDate: string
  progress: number
  milestones: ProjectMilestoneItem[]
}

const INITIAL_GOALS: StrategicGoal[] = [
  {
    id: 'goal-1',
    title: 'Migrate Vector Embeddings to pgvector & KNN HNSW Indexing',
    category: 'Architecture',
    targetDate: '2026-12-15',
    progress: 75,
    milestones: [
      { id: 'm1', label: 'Schema migration: add vector(1536) column to drizzle schema', done: true },
      { id: 'm2', label: 'Benchmark HNSW index build time vs IVF-FLAT on 50K documents', done: true },
      { id: 'm3', label: 'Integrate hybrid cosine similarity with full-text search', done: true },
      { id: 'm4', label: 'End-to-end load test under 500 concurrent RAG queries', done: false },
    ],
  },
  {
    id: 'goal-2',
    title: 'Autonomous Multi-Agent Sandbox Isolation',
    category: 'Engineering',
    targetDate: '2026-12-30',
    progress: 50,
    milestones: [
      { id: 'm5', label: 'Define subagent message bus protocol and state isolation bounds', done: true },
      { id: 'm6', label: 'Add user-in-the-loop tool approval gates for file writes', done: true },
      { id: 'm7', label: 'Implement AST static safety validator for generated code', done: false },
      { id: 'm8', label: 'Deploy isolated WebAssembly runtime worker', done: false },
    ],
  },
  {
    id: 'goal-3',
    title: 'Cut Operational Model Inference Cost by 35%',
    category: 'FinOps',
    targetDate: '2026-11-30',
    progress: 66,
    milestones: [
      { id: 'm9', label: 'Route low-complexity queries to Gemini 2.0 Flash / Haiku', done: true },
      { id: 'm10', label: 'Implement server-side prompt cache for long system instructions', done: true },
      { id: 'm11', label: 'Flag and cancel underutilized third-party API tiers', done: false },
    ],
  },
]

export function ProjectMilestones(): ReactNode {
  const [goals, setGoals] = useState<StrategicGoal[]>(INITIAL_GOALS)
  const [showNewGoal, setShowNewGoal] = useState(false)
  const [newTitle, setNewTitle] = useState('')
  const [newCategory, setNewCategory] = useState('Engineering')
  const [newTargetDate, setNewTargetDate] = useState('2026-12-31')

  const toggleMilestone = (goalId: string, milestoneId: string) => {
    setGoals((prev) =>
      prev.map((g) => {
        if (g.id !== goalId) return g
        const updatedMilestones = g.milestones.map((m) =>
          m.id === milestoneId ? { ...m, done: !m.done } : m,
        )
        const doneCount = updatedMilestones.filter((m) => m.done).length
        const progress = Math.round((doneCount / updatedMilestones.length) * 100)
        return {
          ...g,
          milestones: updatedMilestones,
          progress,
        }
      }),
    )
  }

  const handleAddGoal = () => {
    if (!newTitle.trim()) return
    const newGoal: StrategicGoal = {
      id: `goal-${Date.now()}`,
      title: newTitle.trim(),
      category: newCategory,
      targetDate: newTargetDate,
      progress: 0,
      milestones: [
        { id: `m-${Date.now()}-1`, label: 'Assemble initial technical specification', done: false },
        { id: `m-${Date.now()}-2`, label: 'Implement core prototype & unit tests', done: false },
      ],
    }
    setGoals((prev) => [newGoal, ...prev])
    setNewTitle('')
    setShowNewGoal(false)
  }

  const deleteGoal = (id: string) => {
    setGoals((prev) => prev.filter((g) => g.id !== id))
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-base font-bold text-foreground flex items-center gap-2">
            <Target size={18} className="text-primary" />
            Strategic Project Goals & Milestone Roadmap
          </h2>
          <p className="text-xs text-muted-foreground mt-0.5">
            Track high-level project goals, technical milestones, and completion telemetry.
          </p>
        </div>

        <Button size="sm" onClick={() => setShowNewGoal(!showNewGoal)} className="text-xs h-8">
          <Plus size={13} className="mr-1" />
          New Strategic Goal
        </Button>
      </div>

      {showNewGoal && (
        <div className="rounded-xl border border-border bg-card p-5 space-y-3">
          <h3 className="text-xs font-semibold text-foreground uppercase tracking-wider">
            Define New Milestone Goal
          </h3>
          <div className="grid gap-3 sm:grid-cols-3">
            <Input
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
              placeholder="Goal Objective (e.g. Zero-Downtime Migration)"
              aria-label="Goal Objective"
              className="h-9 text-xs"
            />
            <Input
              value={newCategory}
              onChange={(e) => setNewCategory(e.target.value)}
              placeholder="Category (e.g. Architecture, FinOps)"
              aria-label="Category"
              className="h-9 text-xs"
            />
            <Input
              value={newTargetDate}
              onChange={(e) => setNewTargetDate(e.target.value)}
              placeholder="Target Date (YYYY-MM-DD)"
              aria-label="Target Date"
              className="h-9 text-xs"
            />
          </div>
          <div className="flex justify-end gap-2 pt-1">
            <Button variant="outline" size="sm" onClick={() => setShowNewGoal(false)} className="text-xs h-7">
              Cancel
            </Button>
            <Button size="sm" onClick={handleAddGoal} className="text-xs h-7">
              Save Goal
            </Button>
          </div>
        </div>
      )}

      {/* Goals Cards List */}
      <div className="space-y-4">
        {goals.map((goal) => (
          <div key={goal.id} className="rounded-xl border border-border bg-card p-5 space-y-4">
            <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="rounded bg-primary/10 px-2 py-0.5 text-[10px] font-bold text-primary uppercase">
                    {goal.category}
                  </span>
                  <span className="text-xs text-muted-foreground flex items-center gap-1">
                    <Calendar size={12} /> Target: {goal.targetDate}
                  </span>
                </div>
                <h3 className="text-sm font-bold text-foreground">{goal.title}</h3>
              </div>

              <div className="flex items-center gap-3">
                <span className="text-sm font-bold tabular-nums text-foreground">
                  {goal.progress}%
                </span>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => deleteGoal(goal.id)}
                  className="h-7 w-7 text-muted-foreground hover:text-destructive"
                  title="Delete goal"
                >
                  <Trash2 size={13} />
                </Button>
              </div>
            </div>

            {/* Progress bar */}
            <div className="h-2 w-full overflow-hidden rounded-full bg-muted">
              <div
                className={`h-full rounded-full transition-all duration-500 ${
                  goal.progress === 100
                    ? 'bg-emerald-500'
                    : goal.progress >= 50
                      ? 'bg-primary'
                      : 'bg-amber-500'
                }`}
                style={{ width: `${goal.progress}%` }}
              />
            </div>

            {/* Milestones Checklist */}
            <div className="space-y-2 pt-1">
              <span className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground block">
                Milestones ({goal.milestones.filter((m) => m.done).length}/{goal.milestones.length})
              </span>
              <div className="space-y-1.5">
                {goal.milestones.map((m) => (
                  <button
                    key={m.id}
                    type="button"
                    onClick={() => toggleMilestone(goal.id, m.id)}
                    className="w-full text-left rounded-lg p-2 transition-colors hover:bg-muted/40 flex items-center gap-2.5"
                  >
                    {m.done ? (
                      <CheckCircle2 size={15} className="text-emerald-500 shrink-0" />
                    ) : (
                      <Circle size={15} className="text-muted-foreground shrink-0" />
                    )}
                    <span
                      className={`text-xs ${
                        m.done ? 'line-through text-muted-foreground' : 'text-foreground font-medium'
                      }`}
                    >
                      {m.label}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
