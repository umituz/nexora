import { useState, useMemo, useCallback } from 'react'
import type { ReactNode } from 'react'
import {
  Calendar,
  CheckCircle2,
  FolderKanban,
  MessageSquare,
  Plus,
  Send,
  Sparkles,
  User,
  Users,
  Zap,
} from 'lucide-react'
import { Badge, Button, Input } from '@umituz/web-design-system'
import {
  SQUAD_MEMBERS,
  SQUAD_PROJECTS,
  type MemberStatus,
  type MemberType,
  type SquadMemberItem,
  type SquadProjectItem,
} from './teamData'

interface SquadHubProps {
  onNotify?: (message: string) => void
}

function getStatusIndicator(status: MemberStatus): { label: string; dotClass: string; badgeTone: 'success' | 'info' | 'warning' | 'neutral' } {
  switch (status) {
    case 'active_flight':
      return { label: 'In Flight', dotClass: 'bg-purple-500 animate-pulse', badgeTone: 'info' }
    case 'online':
      return { label: 'Active Online', dotClass: 'bg-emerald-500', badgeTone: 'success' }
    case 'standby':
      return { label: 'Standby', dotClass: 'bg-amber-500', badgeTone: 'warning' }
    case 'away':
      return { label: 'Away', dotClass: 'bg-amber-400', badgeTone: 'warning' }
    case 'offline':
    default:
      return { label: 'Offline', dotClass: 'bg-zinc-400', badgeTone: 'neutral' }
  }
}

export function SquadHub({ onNotify }: SquadHubProps): ReactNode {
  const [members, setMembers] = useState<SquadMemberItem[]>(SQUAD_MEMBERS)
  const [projects, setProjects] = useState<SquadProjectItem[]>(SQUAD_PROJECTS)
  const [activeTab, setActiveTab] = useState<'roster' | 'projects'>('roster')
  const [filterType, setFilterType] = useState<'all' | MemberType>('all')

  // Mission Dispatch Dialog State
  const [dispatchModalOpen, setDispatchModalOpen] = useState(false)
  const [selectedTargetMember, setSelectedTargetMember] = useState<string>(SQUAD_MEMBERS[1].id)
  const [missionTitle, setMissionTitle] = useState('')

  // Metrics
  const metrics = useMemo(() => {
    const totalMembers = members.length
    const aiCount = members.filter((m) => m.type === 'ai_agent').length
    const humanCount = members.filter((m) => m.type === 'human_lead').length
    const totalAssigned = members.reduce((sum, m) => sum + m.assignedTasks, 0)
    const totalDone = members.reduce((sum, m) => sum + m.completedTasks, 0)
    const completionRate = totalAssigned > 0 ? Math.round((totalDone / totalAssigned) * 100) : 100
    const inFlightCount = members.filter((m) => m.status === 'active_flight' || m.status === 'online').length
    return { totalMembers, aiCount, humanCount, completionRate, inFlightCount, totalDone, totalAssigned }
  }, [members])

  const filteredMembers = useMemo(() => {
    if (filterType === 'all') return members
    return members.filter((m) => m.type === filterType)
  }, [members, filterType])

  // Toggle Deliverable in Project
  const toggleDeliverable = useCallback((projectId: string, deliverableIdx: number) => {
    setProjects((prev) =>
      prev.map((proj) => {
        if (proj.id !== projectId) return proj
        const updated = proj.deliverables.map((d, i) => (i === deliverableIdx ? { ...d, done: !d.done } : d))
        const doneCount = updated.filter((d) => d.done).length
        const newProgress = Math.round((doneCount / updated.length) * 100)
        return {
          ...proj,
          deliverables: updated,
          progress: newProgress,
          status: newProgress === 100 ? 'Completed' : 'In Progress',
        }
      }),
    )
  }, [])

  // Handle Dispatch Mission
  const handleDispatchMission = useCallback(() => {
    if (!missionTitle.trim()) return
    const target = members.find((m) => m.id === selectedTargetMember)
    const targetName = target ? target.name : 'Squad'

    setMembers((prev) =>
      prev.map((m) => {
        if (m.id !== selectedTargetMember) return m
        return {
          ...m,
          assignedTasks: m.assignedTasks + 1,
          status: 'active_flight',
          activeMission: missionTitle.trim(),
        }
      }),
    )

    onNotify?.(`Dispatched mission to ${targetName}: "${missionTitle.trim()}"`)
    setMissionTitle('')
    setDispatchModalOpen(false)
  }, [missionTitle, selectedTargetMember, members, onNotify])

  return (
    <div className="space-y-6">
      {/* Top Metric Strip */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="rounded-xl border border-border bg-card p-4">
          <div className="flex items-center justify-between text-muted-foreground text-xs font-medium">
            <span>Squad Capacity</span>
            <Users className="size-4 text-primary" />
          </div>
          <div className="mt-2 text-2xl font-bold tabular-nums">
            {metrics.totalMembers}{' '}
            <span className="text-xs font-normal text-muted-foreground">
              ({metrics.aiCount} AI · {metrics.humanCount} Human)
            </span>
          </div>
          <p className="mt-1 text-xs text-muted-foreground">Hybrid engineering unit</p>
        </div>

        <div className="rounded-xl border border-border bg-card p-4">
          <div className="flex items-center justify-between text-muted-foreground text-xs font-medium">
            <span>In-Flight Missions</span>
            <Zap className="size-4 text-purple-500 animate-pulse" />
          </div>
          <div className="mt-2 text-2xl font-bold tabular-nums text-purple-600 dark:text-purple-400">
            {metrics.inFlightCount} active
          </div>
          <p className="mt-1 text-xs text-muted-foreground">Real-time daemon workers</p>
        </div>

        <div className="rounded-xl border border-border bg-card p-4">
          <div className="flex items-center justify-between text-muted-foreground text-xs font-medium">
            <span>Throughput & Velocity</span>
            <CheckCircle2 className="size-4 text-emerald-500" />
          </div>
          <div className="mt-2 text-2xl font-bold tabular-nums text-emerald-600 dark:text-emerald-400">
            {metrics.completionRate}%
          </div>
          <p className="mt-1 text-xs text-muted-foreground">{metrics.totalDone}/{metrics.totalAssigned} tasks completed</p>
        </div>

        <div className="rounded-xl border border-border bg-card p-4">
          <div className="flex items-center justify-between text-muted-foreground text-xs font-medium">
            <span>Squad Initiatives</span>
            <FolderKanban className="size-4 text-blue-500" />
          </div>
          <div className="mt-2 text-2xl font-bold tabular-nums">{projects.length}</div>
          <p className="mt-1 text-xs text-muted-foreground">Cross-functional tracks</p>
        </div>
      </div>

      {/* Control Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setActiveTab('roster')}
            className={`text-xs font-medium px-3 py-1.5 rounded-lg border transition-colors ${
              activeTab === 'roster'
                ? 'bg-primary text-primary-foreground border-primary'
                : 'border-border text-muted-foreground hover:bg-muted'
            }`}
          >
            Squad Members ({members.length})
          </button>
          <button
            onClick={() => setActiveTab('projects')}
            className={`text-xs font-medium px-3 py-1.5 rounded-lg border transition-colors ${
              activeTab === 'projects'
                ? 'bg-primary text-primary-foreground border-primary'
                : 'border-border text-muted-foreground hover:bg-muted'
            }`}
          >
            Squad Initiatives ({projects.length})
          </button>
        </div>

        <div className="flex items-center gap-2">
          {activeTab === 'roster' && (
            <div className="flex items-center gap-1 bg-muted/40 p-1 rounded-lg border border-border text-xs">
              {(['all', 'ai_agent', 'human_lead'] as const).map((mode) => (
                <button
                  key={mode}
                  onClick={() => setFilterType(mode)}
                  className={`px-2 py-0.5 rounded-md capitalize transition-colors ${
                    filterType === mode
                      ? 'bg-card text-foreground font-semibold shadow-xs'
                      : 'text-muted-foreground hover:text-foreground'
                  }`}
                >
                  {mode === 'all' ? 'All Roles' : mode === 'ai_agent' ? 'AI Specialists' : 'Human Leads'}
                </button>
              ))}
            </div>
          )}

          <Button
            size="sm"
            onClick={() => setDispatchModalOpen(true)}
            className="gap-1.5 text-xs shadow-xs"
          >
            <Send className="size-3.5" /> Dispatch Mission
          </Button>
        </div>
      </div>

      {/* Dispatch Modal / Drawer */}
      {dispatchModalOpen && (
        <div className="rounded-xl border border-primary/40 bg-card p-5 space-y-4 shadow-sm">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Zap className="size-4 text-primary" />
              <h3 className="font-semibold text-sm">Dispatch Rapid Agent or Squad Mission</h3>
            </div>
            <Button
              size="sm"
              variant="ghost"
              onClick={() => setDispatchModalOpen(false)}
              className="text-xs text-muted-foreground h-7"
            >
              Cancel
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-12 gap-3">
            <div className="md:col-span-8">
              <Input
                value={missionTitle}
                onChange={(e) => setMissionTitle(e.target.value)}
                placeholder="e.g. Audit Groq inference latency & run benchmark comparisons"
                aria-label="Mission Title"
                autoFocus
              />
            </div>
            <div className="md:col-span-4 flex items-center gap-2">
              <select
                value={selectedTargetMember}
                onChange={(e) => setSelectedTargetMember(e.target.value)}
                className="w-full text-xs rounded-md border border-border bg-card px-2.5 py-2 text-foreground"
              >
                {members.map((m) => (
                  <option key={m.id} value={m.id}>
                    {m.name} ({m.type === 'ai_agent' ? 'AI Agent' : 'Human Lead'})
                  </option>
                ))}
              </select>
              <Button
                size="sm"
                onClick={handleDispatchMission}
                disabled={!missionTitle.trim()}
                className="shrink-0 gap-1"
              >
                <Plus className="size-3.5" /> Launch
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* View 1: Squad Members Roster */}
      {activeTab === 'roster' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredMembers.map((member) => {
            const statusMeta = getStatusIndicator(member.status)
            const progress = Math.round((member.completedTasks / Math.max(member.assignedTasks, 1)) * 100)

            return (
              <div
                key={member.id}
                className="rounded-xl border border-border bg-card p-5 flex flex-col justify-between space-y-4 transition-all hover:border-primary/50 hover:shadow-xs"
              >
                <div>
                  {/* Card Header */}
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <div className="relative">
                        <div
                          className="size-11 rounded-full flex items-center justify-center font-bold text-white shadow-xs text-sm"
                          style={{ backgroundColor: member.avatarColor }}
                        >
                          {member.avatarInitials}
                        </div>
                        <span
                          className={`absolute bottom-0 right-0 size-3 rounded-full border-2 border-card ${statusMeta.dotClass}`}
                        />
                      </div>
                      <div>
                        <div className="flex items-center gap-1.5">
                          <h4 className="font-semibold text-sm text-foreground">{member.name}</h4>
                          {member.type === 'ai_agent' ? (
                            <span title="Autonomous AI Specialist"><Sparkles className="size-3.5 text-purple-500" /></span>
                          ) : (
                            <span title="Human Team Lead"><User className="size-3.5 text-blue-500" /></span>
                          )}
                        </div>
                        <p className="text-xs text-muted-foreground">{member.role}</p>
                      </div>
                    </div>

                    <Badge tone={statusMeta.badgeTone} className="text-[10px]">
                      {statusMeta.label}
                    </Badge>
                  </div>

                  {/* Active Mission Banner */}
                  {member.activeMission && (
                    <div className="mt-3.5 rounded-lg bg-muted/30 border border-border/60 p-2.5 text-xs">
                      <div className="flex items-center gap-1.5 text-[11px] font-semibold text-foreground">
                        <Zap className="size-3 text-primary" /> Active Mission:
                      </div>
                      <p className="text-muted-foreground mt-0.5 line-clamp-2 italic">
                        &quot;{member.activeMission}&quot;
                      </p>
                    </div>
                  )}

                  {/* Workload Progress Bar */}
                  <div className="mt-4 space-y-1.5">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-muted-foreground">Workload Velocity</span>
                      <span className="font-mono font-medium text-foreground">
                        {member.completedTasks}/{member.assignedTasks} ({progress}%)
                      </span>
                    </div>
                    <div className="h-2 w-full rounded-full bg-muted overflow-hidden">
                      <div
                        className="h-full rounded-full transition-all duration-500"
                        style={{
                          width: `${progress}%`,
                          backgroundColor: member.avatarColor,
                        }}
                      />
                    </div>
                  </div>

                  {/* Specialties Pills */}
                  <div className="mt-3.5 flex flex-wrap gap-1.5">
                    {member.specialties.map((spec, i) => (
                      <span
                        key={i}
                        className="text-[10px] px-2 py-0.5 rounded-full bg-muted/60 text-muted-foreground border border-border/50"
                      >
                        {spec}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Card Actions */}
                <div className="pt-3 border-t border-border flex items-center justify-between gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => {
                      setSelectedTargetMember(member.id)
                      setDispatchModalOpen(true)
                    }}
                    className="flex-1 text-xs h-7 gap-1"
                  >
                    <Send className="size-3" /> Delegate
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => onNotify?.(`Opening direct channel with ${member.name}`)}
                    className="text-xs h-7 gap-1 text-muted-foreground hover:text-foreground"
                  >
                    <MessageSquare className="size-3" /> Chat
                  </Button>
                </div>
              </div>
            )
          })}
        </div>
      )}

      {/* View 2: Squad Projects & Initiatives */}
      {activeTab === 'projects' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {projects.map((proj) => {
            const assignedMembers = members.filter((m) => proj.memberIds.includes(m.id))

            return (
              <div
                key={proj.id}
                className="rounded-xl border border-border bg-card p-5 space-y-4 transition-all hover:border-primary/50"
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <span
                        className="size-3 rounded-full shrink-0"
                        style={{ backgroundColor: proj.color }}
                      />
                      <h4 className="font-semibold text-sm text-foreground">{proj.name}</h4>
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">{proj.description}</p>
                  </div>
                  <Badge
                    tone={proj.status === 'Completed' ? 'success' : 'info'}
                    className="text-[10px] shrink-0"
                  >
                    {proj.status}
                  </Badge>
                </div>

                {/* Progress Metric */}
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-muted-foreground">Milestone Completion</span>
                    <span className="font-mono font-bold" style={{ color: proj.color }}>
                      {proj.progress}%
                    </span>
                  </div>
                  <div className="h-2 w-full rounded-full bg-muted overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all duration-500"
                      style={{
                        width: `${proj.progress}%`,
                        backgroundColor: proj.color,
                      }}
                    />
                  </div>
                </div>

                {/* Deliverables Checklist */}
                <div className="space-y-1.5 rounded-lg bg-muted/20 border border-border/60 p-3">
                  <span className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider">
                    Deliverables ({proj.deliverables.filter((d) => d.done).length}/{proj.deliverables.length})
                  </span>
                  <div className="space-y-1.5 mt-2">
                    {proj.deliverables.map((deliv, dIdx) => (
                      <button
                        key={dIdx}
                        onClick={() => toggleDeliverable(proj.id, dIdx)}
                        className="w-full flex items-center gap-2 text-left text-xs transition-colors hover:text-foreground"
                      >
                        <CheckCircle2
                          className={`size-3.5 shrink-0 transition-colors ${
                            deliv.done ? 'text-emerald-500 fill-emerald-500/20' : 'text-muted-foreground'
                          }`}
                        />
                        <span className={deliv.done ? 'line-through text-muted-foreground' : 'text-foreground'}>
                          {deliv.label}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Project Footer: Member Stacks & Due Date */}
                <div className="pt-3 border-t border-border flex items-center justify-between gap-3 text-xs">
                  <div className="flex items-center gap-2">
                    <span className="text-muted-foreground text-[11px]">Squad:</span>
                    <div className="flex items-center -space-x-1.5">
                      {assignedMembers.map((m) => (
                        <div
                          key={m.id}
                          className="size-6 rounded-full border-2 border-card flex items-center justify-center text-[10px] font-bold text-white shadow-xs"
                          style={{ backgroundColor: m.avatarColor }}
                          title={`${m.name} (${m.role})`}
                        >
                          {m.avatarInitials}
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="flex items-center gap-1.5 text-muted-foreground text-[11px]">
                    <Calendar className="size-3.5" /> Due: <strong className="text-foreground">{proj.dueDate}</strong>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
