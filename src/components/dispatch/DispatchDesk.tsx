import { useState, useMemo, useCallback } from 'react'
import type { ReactNode } from 'react'
import {
  AlertTriangle,
  ArrowRight,
  CheckCircle2,
  Clock,
  Inbox,
  ListPlus,
  Loader2,
  Mail,
  Search,
  Send,
  Sparkles,
  Star,
} from 'lucide-react'
import { Badge, Button, Input, Textarea } from '@umituz/web-design-system'
import {
  INITIAL_DISPATCH_MESSAGES,
  type DispatchMessage,
  type DraftReply,
} from './dispatchData'

interface DispatchDeskProps {
  onNotify?: (message: string) => void
}

function getUrgencyBadge(score: number): { label: string; tone: 'danger' | 'warning' | 'info' | 'neutral' } {
  if (score >= 8) return { label: `Urgency ${score}/10 · Critical`, tone: 'danger' }
  if (score >= 6) return { label: `Urgency ${score}/10 · Elevated`, tone: 'warning' }
  return { label: `Urgency ${score}/10 · Routine`, tone: 'info' }
}

export function DispatchDesk({ onNotify }: DispatchDeskProps): ReactNode {
  const [messages, setMessages] = useState<DispatchMessage[]>(INITIAL_DISPATCH_MESSAGES)
  const [selectedMessageId, setSelectedMessageId] = useState<string>(INITIAL_DISPATCH_MESSAGES[0].id)
  const [filter, setFilter] = useState<'all' | 'unread' | 'starred' | 'important' | 'finance'>('all')
  const [searchQuery, setSearchQuery] = useState('')

  // Reply Draft State
  const [replyText, setReplyText] = useState(
    INITIAL_DISPATCH_MESSAGES[0].aiAnalysis.draftReplies[0]?.content || '',
  )
  const [sendingReply, setSendingReply] = useState(false)
  const [convertedTasks, setConvertedTasks] = useState<Record<string, boolean>>({})

  const selectedMessage = useMemo(() => {
    return messages.find((m) => m.id === selectedMessageId) || messages[0]
  }, [messages, selectedMessageId])

  // Select message & update reply draft
  const handleSelectMessage = useCallback((msg: DispatchMessage) => {
    setSelectedMessageId(msg.id)
    if (!msg.read) {
      setMessages((prev) => prev.map((m) => (m.id === msg.id ? { ...m, read: true } : m)))
    }
    setReplyText(msg.aiAnalysis.draftReplies[0]?.content || '')
  }, [])

  // Filtered List
  const filteredMessages = useMemo(() => {
    return messages.filter((m) => {
      if (filter === 'unread' && m.read) return false
      if (filter === 'starred' && !m.starred) return false
      if (filter === 'important' && !m.important) return false
      if (filter === 'finance' && m.category !== 'finance') return false
      if (searchQuery.trim().length > 0) {
        const q = searchQuery.toLowerCase()
        return (
          m.subject.toLowerCase().includes(q) ||
          m.from.toLowerCase().includes(q) ||
          m.body.toLowerCase().includes(q)
        )
      }
      return true
    })
  }, [messages, filter, searchQuery])

  // Toggle Star
  const toggleStar = useCallback((id: string, e?: React.MouseEvent) => {
    e?.stopPropagation()
    setMessages((prev) =>
      prev.map((m) => (m.id === id ? { ...m, starred: !m.starred } : m)),
    )
  }, [])

  // Apply preset draft
  const applyPresetReply = useCallback((draft: DraftReply) => {
    setReplyText(draft.content)
  }, [])

  // Convert extracted task to system task
  const convertToTask = useCallback(
    (taskLabel: string) => {
      setConvertedTasks((prev) => ({ ...prev, [taskLabel]: true }))
      onNotify?.(`Task extracted: "${taskLabel}" added to queue`)
    },
    [onNotify],
  )

  // Send reply
  const handleSendReply = useCallback(() => {
    if (!replyText.trim()) return
    setSendingReply(true)
    setTimeout(() => {
      setSendingReply(false)
      onNotify?.(`Reply dispatched to ${selectedMessage.from}`)
      setReplyText('')
    }, 900)
  }, [replyText, selectedMessage, onNotify])

  // Unread Count
  const unreadCount = useMemo(() => messages.filter((m) => !m.read).length, [messages])

  return (
    <div className="space-y-4">
      {/* Top Banner / Triage Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="rounded-xl border border-border bg-card p-4">
          <div className="flex items-center justify-between text-muted-foreground text-xs font-medium">
            <span>Inbound Signals</span>
            <Inbox className="size-4 text-primary" />
          </div>
          <div className="mt-2 text-2xl font-bold tabular-nums">{messages.length}</div>
          <p className="mt-1 text-xs text-muted-foreground">{unreadCount} unread items</p>
        </div>

        <div className="rounded-xl border border-border bg-card p-4">
          <div className="flex items-center justify-between text-muted-foreground text-xs font-medium">
            <span>Action Required</span>
            <AlertTriangle className="size-4 text-amber-500" />
          </div>
          <div className="mt-2 text-2xl font-bold tabular-nums text-amber-500">
            {messages.filter((m) => m.category === 'action_required').length}
          </div>
          <p className="mt-1 text-xs text-muted-foreground">Pending your signoff</p>
        </div>

        <div className="rounded-xl border border-border bg-card p-4">
          <div className="flex items-center justify-between text-muted-foreground text-xs font-medium">
            <span>High Urgency (≥8/10)</span>
            <Sparkles className="size-4 text-rose-500" />
          </div>
          <div className="mt-2 text-2xl font-bold tabular-nums text-rose-500">
            {messages.filter((m) => m.aiAnalysis.urgencyScore >= 8).length}
          </div>
          <p className="mt-1 text-xs text-muted-foreground">Prioritized by AI</p>
        </div>

        <div className="rounded-xl border border-border bg-card p-4">
          <div className="flex items-center justify-between text-muted-foreground text-xs font-medium">
            <span>AI Drafts Available</span>
            <CheckCircle2 className="size-4 text-emerald-500" />
          </div>
          <div className="mt-2 text-2xl font-bold tabular-nums text-emerald-500">100%</div>
          <p className="mt-1 text-xs text-muted-foreground">Pre-generated replies ready</p>
        </div>
      </div>

      {/* Split 2-Column Desk: Left Message List / Right AI Triage Canvas */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left List Pane (5 cols) */}
        <div className="lg:col-span-5 rounded-xl border border-border bg-card overflow-hidden flex flex-col h-[750px]">
          {/* Search & Filter Header */}
          <div className="p-3 border-b border-border space-y-2.5 bg-muted/20">
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 size-3.5 text-muted-foreground" />
              <Input
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search messages, RFCs, invoices..."
                className="pl-8 text-xs h-8"
              />
            </div>

            <div className="flex items-center gap-1 overflow-x-auto pb-1 text-xs">
              {(
                [
                  { id: 'all', label: 'All' },
                  { id: 'unread', label: `Unread (${unreadCount})` },
                  { id: 'starred', label: 'Starred' },
                  { id: 'important', label: 'Urgent' },
                  { id: 'finance', label: 'FinOps' },
                ] as const
              ).map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setFilter(tab.id)}
                  className={`text-[11px] px-2.5 py-1 rounded-md font-medium whitespace-nowrap transition-colors ${
                    filter === tab.id
                      ? 'bg-primary text-primary-foreground'
                      : 'text-muted-foreground hover:bg-muted'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          {/* Messages Feed */}
          <div className="flex-1 overflow-y-auto divide-y divide-border/60">
            {filteredMessages.length === 0 ? (
              <div className="p-8 text-center text-muted-foreground text-xs space-y-2">
                <Mail className="size-8 mx-auto opacity-30" />
                <p>No messages match the current filter.</p>
              </div>
            ) : (
              filteredMessages.map((msg) => {
                const isSelected = msg.id === selectedMessage.id
                return (
                  <button
                    key={msg.id}
                    onClick={() => handleSelectMessage(msg)}
                    className={`w-full text-left p-3.5 transition-colors flex items-start gap-3 ${
                      isSelected
                        ? 'bg-primary/5 border-l-2 border-primary'
                        : 'hover:bg-muted/40'
                    }`}
                  >
                    {/* Avatar */}
                    <div
                      className="size-8 rounded-full flex items-center justify-center text-xs font-bold text-white shrink-0 shadow-xs mt-0.5"
                      style={{ backgroundColor: msg.avatarColor }}
                    >
                      {msg.avatar}
                    </div>

                    {/* Meta & Subject */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-1">
                        <span
                          className={`text-xs truncate ${
                            !msg.read ? 'font-bold text-foreground' : 'font-medium text-foreground/80'
                          }`}
                        >
                          {msg.from}
                        </span>
                        <span className="text-[10px] text-muted-foreground shrink-0">{msg.receivedAt}</span>
                      </div>

                      <div
                        className={`text-xs truncate mt-0.5 ${
                          !msg.read ? 'font-semibold text-foreground' : 'text-muted-foreground'
                        }`}
                      >
                        {msg.subject}
                      </div>

                      <p className="text-[11px] text-muted-foreground/80 truncate mt-0.5">
                        {msg.preview}
                      </p>

                      <div className="mt-2 flex items-center gap-1.5">
                        {msg.category === 'action_required' && (
                          <span className="text-[10px] px-1.5 py-0.2 rounded bg-amber-500/10 text-amber-600 dark:text-amber-400 font-mono">
                            Action
                          </span>
                        )}
                        {msg.category === 'finance' && (
                          <span className="text-[10px] px-1.5 py-0.2 rounded bg-rose-500/10 text-rose-600 dark:text-rose-400 font-mono">
                            FinOps
                          </span>
                        )}
                        <span className="text-[10px] text-muted-foreground font-mono">
                          Score {msg.aiAnalysis.urgencyScore}/10
                        </span>
                      </div>
                    </div>

                    {/* Star & Unread Dot */}
                    <div className="flex flex-col items-center gap-2 shrink-0">
                      <span
                        onClick={(e) => toggleStar(msg.id, e)}
                        className="cursor-pointer text-muted-foreground hover:text-amber-500"
                      >
                        <Star
                          className={`size-3.5 ${
                            msg.starred ? 'fill-amber-400 text-amber-500' : ''
                          }`}
                        />
                      </span>
                      {!msg.read && <span className="size-2 rounded-full bg-primary" />}
                    </div>
                  </button>
                )
              })
            )}
          </div>
        </div>

        {/* Right Detail Pane (7 cols) */}
        <div className="lg:col-span-7 space-y-4">
          <div className="rounded-xl border border-border bg-card p-5 space-y-5">
            {/* Message Header */}
            <div className="flex flex-wrap items-start justify-between gap-3 pb-4 border-b border-border">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <h3 className="font-semibold text-base text-foreground">{selectedMessage.subject}</h3>
                </div>
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <span className="font-medium text-foreground">{selectedMessage.from}</span>
                  <span>&lt;{selectedMessage.fromEmail}&gt;</span>
                  <span>•</span>
                  <span>{selectedMessage.receivedAt}</span>
                </div>
              </div>

              <div className="flex items-center gap-1.5">
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => toggleStar(selectedMessage.id)}
                  className="h-8 px-2"
                >
                  <Star
                    className={`size-4 ${
                      selectedMessage.starred ? 'fill-amber-400 text-amber-500' : 'text-muted-foreground'
                    }`}
                  />
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() =>
                    setMessages((prev) =>
                      prev.map((m) =>
                        m.id === selectedMessage.id ? { ...m, read: !m.read } : m,
                      ),
                    )
                  }
                  className="h-8 text-xs"
                >
                  {selectedMessage.read ? 'Mark Unread' : 'Mark Read'}
                </Button>
              </div>
            </div>

            {/* AI Triage & Analysis Card */}
            <div className="rounded-xl border border-primary/30 bg-primary/5 p-4 space-y-3">
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <Sparkles className="size-4 text-primary" />
                  <span className="font-semibold text-xs text-foreground">
                    Aria AI Triage & Intelligence
                  </span>
                </div>
                <Badge tone={getUrgencyBadge(selectedMessage.aiAnalysis.urgencyScore).tone} className="text-[10px]">
                  {getUrgencyBadge(selectedMessage.aiAnalysis.urgencyScore).label}
                </Badge>
              </div>

              <p className="text-xs text-foreground/90 leading-relaxed">
                {selectedMessage.aiAnalysis.summary}
              </p>

              {/* Extracted Tasks with 1-Click Conversion */}
              <div className="space-y-1.5 pt-2 border-t border-primary/20">
                <span className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider">
                  Extracted Action Items
                </span>
                <div className="space-y-1.5 mt-1">
                  {selectedMessage.aiAnalysis.extractedTasks.map((task, tIdx) => {
                    const isConverted = !!convertedTasks[task]
                    return (
                      <div
                        key={tIdx}
                        className="flex items-center justify-between gap-2 rounded-lg bg-card/80 border border-border/60 p-2 text-xs"
                      >
                        <span className="text-foreground">{task}</span>
                        <Button
                          size="sm"
                          variant="ghost"
                          disabled={isConverted}
                          onClick={() => convertToTask(task)}
                          className="h-6 px-2 text-[10px] gap-1 shrink-0 text-primary hover:text-primary"
                        >
                          {isConverted ? (
                            <>
                              <CheckCircle2 className="size-3 text-emerald-500" /> Queued
                            </>
                          ) : (
                            <>
                              <ListPlus className="size-3" /> Add to Tasks
                            </>
                          )}
                        </Button>
                      </div>
                    )
                  })}
                </div>
              </div>
            </div>

            {/* Message Body */}
            <div className="rounded-lg border border-border/60 bg-muted/20 p-4 font-sans text-xs leading-relaxed text-foreground whitespace-pre-line">
              {selectedMessage.body}
            </div>

            {/* AI Quick Reply Studio */}
            <div className="space-y-3 pt-4 border-t border-border">
              <div className="flex items-center justify-between">
                <h4 className="font-semibold text-xs text-foreground flex items-center gap-1.5">
                  <Send className="size-3.5 text-primary" /> AI Response Drafter
                </h4>
                <span className="text-[11px] text-muted-foreground">
                  Select a template or edit freely
                </span>
              </div>

              {/* Preset Chips */}
              <div className="flex flex-wrap gap-1.5">
                {selectedMessage.aiAnalysis.draftReplies.map((draft, dIdx) => (
                  <button
                    key={dIdx}
                    onClick={() => applyPresetReply(draft)}
                    className="text-[11px] px-2.5 py-1 rounded-md border border-border bg-card hover:bg-accent text-foreground transition-colors font-medium flex items-center gap-1"
                  >
                    <Sparkles className="size-3 text-purple-500" />
                    {draft.label}
                  </button>
                ))}
              </div>

              {/* Editable Textarea */}
              <Textarea
                value={replyText}
                onChange={(e) => setReplyText(e.target.value)}
                rows={5}
                placeholder="Compose reply..."
                className="font-sans text-xs"
              />

              <div className="flex items-center justify-between gap-2 pt-1">
                <div className="flex items-center gap-1 text-[11px] text-muted-foreground">
                  <Clock className="size-3.5" /> Direct email dispatch via Cloudflare Worker
                </div>
                <Button
                  size="sm"
                  onClick={handleSendReply}
                  disabled={!replyText.trim() || sendingReply}
                  className="gap-1.5 text-xs shadow-xs"
                >
                  {sendingReply ? (
                    <>
                      <Loader2 className="size-3.5 animate-spin" /> Dispatching...
                    </>
                  ) : (
                    <>
                      <Send className="size-3.5" /> Dispatch Reply <ArrowRight className="size-3" />
                    </>
                  )}
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
