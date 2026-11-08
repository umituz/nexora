import { useCallback, useEffect, useRef, useState } from 'react'
import type { ChangeEvent, ReactNode } from 'react'
import { useNavigate, useParams } from 'react-router'
import { apiFetch } from '@umituz/web-hono/client'
import { usePageTitle } from '@umituz/web-dashboard'
import { Button, NativeSelect } from '@umituz/web-design-system'
import type { NativeSelectOption } from '@umituz/web-design-system'
import { Bot, Paperclip } from 'lucide-react'
import type { PublicToolCall } from '@shared/ai/contracts'
import type { AttachmentRow, ConversationRow, MessageRow, StreamHandle } from '@/data/chatTypes'
import { store, useCollection } from '@/data/store'
import { resolveToolCall, streamChat } from '@/lib/sse'
import { AttachmentChips } from '@/components/chat/AttachmentChips'
import { Composer } from '@/components/chat/Composer'
import { ConversationList } from '@/components/chat/ConversationList'
import { MessageBubble, type ChatMessageView } from '@/components/chat/MessageBubble'
import { ModelPicker } from '@/components/chat/ModelPicker'
import { useT } from '@/i18n'

function toView(row: MessageRow): ChatMessageView {
  return {
    id: row.id,
    role: row.role === 'assistant' ? 'assistant' : 'user',
    content: row.content,
    reasoning: row.reasoning ?? '',
    status: row.status,
    error: row.error,
    usage: row.usage,
  }
}

function toViews(rows: MessageRow[]): ChatMessageView[] {
  return rows.filter((row) => row.role !== 'tool').map(toView)
}

export default function ChatPage(): ReactNode {
  const t = useT()
  const navigate = useNavigate()
  const { conversationId } = useParams()
  const conversations = useCollection('conversations')
  const models = useCollection('models')
  const projects = useCollection('projects')
  const agents = useCollection('agents')

  const [messages, setMessages] = useState<ChatMessageView[]>([])
  const [attachments, setAttachments] = useState<AttachmentRow[]>([])
  const [toolCallRows, setToolCallRows] = useState<PublicToolCall[]>([])
  const [attachmentError, setAttachmentError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [input, setInput] = useState('')
  const [streaming, setStreaming] = useState(false)
  const [resolving, setResolving] = useState(false)
  const [editing, setEditing] = useState<ChatMessageView | null>(null)
  const [selectedModelId, setSelectedModelId] = useState<string | null>(null)
  const handleRef = useRef<StreamHandle | null>(null)
  const streamingConversationRef = useRef<string | null>(null)
  const stoppedRef = useRef(false)
  const threadRef = useRef<HTMLDivElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  usePageTitle(t('nav.items.chat'))

  const active = conversations.find((row) => row.id === conversationId)
  const boundAgent = agents.find((row) => row.id === active?.agentId)

  useEffect(() => {
    const chatModels = models.filter((model) => model.outputTypes.includes('text'))
    setSelectedModelId(
      active?.modelId ?? boundAgent?.modelId ?? chatModels.find((model) => model.isDefault)?.id ?? chatModels[0]?.id ?? null,
    )
  }, [active?.modelId, active?.agentId, agents, boundAgent?.modelId, models])

  useEffect(() => {
    if (!conversationId) {
      setMessages([])
      setAttachments([])
      setToolCallRows([])
      return
    }
    setEditing(null)
    if (streamingConversationRef.current === conversationId) return
    let alive = true
    setLoading(true)
    Promise.all([
      apiFetch<MessageRow[]>(`/api/conversations/${conversationId}/messages`),
      apiFetch<AttachmentRow[]>(`/api/conversations/${conversationId}/attachments`),
      apiFetch<PublicToolCall[]>(`/api/conversations/${conversationId}/tool-calls`),
    ])
      .then(([messageRows, attachmentRows, toolCallData]) => {
        if (!alive) return
        setMessages(toViews(messageRows))
        setAttachments(attachmentRows)
        setToolCallRows(toolCallData)
      })
      .catch(() => {
        if (alive) {
          setMessages([])
          setAttachments([])
          setToolCallRows([])
        }
      })
      .finally(() => {
        if (alive) setLoading(false)
      })
    return () => {
      alive = false
      handleRef.current?.abort()
    }
  }, [conversationId])

  useEffect(() => {
    const el = threadRef.current
    if (el) el.scrollTop = el.scrollHeight
  }, [messages])

  const patchLast = useCallback((patch: Partial<ChatMessageView>) => {
    setMessages((prev) => {
      if (prev.length === 0) return prev
      const next = [...prev]
      next[next.length - 1] = { ...next[next.length - 1], ...patch }
      return next
    })
  }, [])

  const appendDelta = useCallback((channel: 'answer' | 'reasoning', text: string) => {
    setMessages((prev) => {
      if (prev.length === 0) return prev
      const next = [...prev]
      const last = next[next.length - 1]
      next[next.length - 1] =
        channel === 'reasoning'
          ? { ...last, reasoning: last.reasoning + text }
          : { ...last, content: last.content + text }
      return next
    })
  }, [])

  const refreshThread = useCallback(async (id: string) => {
    const [rows, calls] = await Promise.all([
      apiFetch<MessageRow[]>(`/api/conversations/${id}/messages`).catch(() => null),
      apiFetch<PublicToolCall[]>(`/api/conversations/${id}/tool-calls`).catch(() => null),
    ])
    if (rows) setMessages(toViews(rows))
    if (calls) setToolCallRows(calls)
  }, [])

  const runStream = useCallback(
    async (conversationRow: ConversationRow, content: string | null, mode: 'append' | 'regenerate' = 'append') => {
      setStreaming(true)
      setInput('')
      setEditing(null)
      streamingConversationRef.current = conversationRow.id
      setMessages(() => [
        ...(mode === 'append'
          ? [{ id: `local-${Date.now()}`, role: 'user' as const, content: content ?? '', reasoning: '', status: 'complete' as const, error: null, usage: null }]
          : []),
        { id: 'streaming', role: 'assistant', content: '', reasoning: '', status: 'streaming', error: null, usage: null },
      ])

      const handle = streamChat(
        conversationRow.id,
        { mode, ...(mode === 'append' ? { content: content ?? undefined } : {}), modelId: selectedModelId ?? undefined },
        {
          onDelta: appendDelta,
          onUsage: (usage) => patchLast({ usage }),
          onError: (code, message) => patchLast({ status: 'error', error: { code, message } }),
          onDone: (messageId) => patchLast({ id: messageId, status: 'complete' }),
          onToolCall: (toolCall) => {
            setToolCallRows((prev) => [...prev, toolCall])
            patchLast({ status: 'complete' })
          },
        },
      )
      handleRef.current = handle
      try {
        await handle.promise.catch(() => undefined)
      } finally {
        handleRef.current = null
        streamingConversationRef.current = null
        setStreaming(false)
        await store.refresh(['conversations', 'usage', 'usageBreakdown'])
        if (stoppedRef.current) {
          stoppedRef.current = false
        } else if (conversationId === conversationRow.id) {
          await refreshThread(conversationRow.id)
        }
      }
    },
    [appendDelta, conversationId, patchLast, refreshThread, selectedModelId],
  )

  const resolveToolApproval = useCallback(
    async (toolCallId: string, approved: boolean) => {
      if (!active || streaming || resolving) return
      setResolving(true)
      setStreaming(true)
      streamingConversationRef.current = active.id
      setMessages((prev) => [
        ...prev,
        { id: 'streaming', role: 'assistant', content: '', reasoning: '', status: 'streaming', error: null, usage: null },
      ])

      try {
        await resolveToolCall(active.id, toolCallId, approved, {
          onDelta: appendDelta,
          onUsage: (usage) => patchLast({ usage }),
          onError: (code, message) => patchLast({ status: 'error', error: { code, message } }),
          onDone: (messageId) => patchLast({ id: messageId, status: 'complete' }),
        })
      } catch {
        return
      } finally {
        streamingConversationRef.current = null
        setStreaming(false)
        setResolving(false)
        await store.refresh(['conversations', 'usage', 'usageBreakdown'])
        if (conversationId === active.id) await refreshThread(active.id)
      }
    },
    [active, appendDelta, conversationId, patchLast, refreshThread, resolving, streaming],
  )

  const changeAgent = useCallback(
    async (agentId: string) => {
      if (!active) return
      try {
        await apiFetch(`/api/conversations/${active.id}`, { method: 'PATCH', json: { agentId: agentId || null } })
        await store.refresh(['conversations'])
      } catch {
        return
      }
    },
    [active],
  )

  const editAndResend = useCallback(
    async (message: ChatMessageView, content: string) => {
      if (!active) return
      try {
        const updated = await apiFetch<MessageRow>(`/api/conversations/${active.id}/messages/${message.id}/edit`, {
          method: 'POST',
          json: { content },
        })
        const index = messages.findIndex((row) => row.id === message.id)
        if (index >= 0) {
          setMessages((prev) => prev.slice(0, index + 1).map((row, i) => (i === index ? toView(updated) : row)))
        }
        await runStream(active, null, 'regenerate')
      } catch {
        setEditing(null)
        setInput('')
      }
    },
    [active, messages, runStream],
  )

  const send = useCallback(async () => {
    const content = input.trim()
    if (content.length === 0 || streaming) return

    if (editing) {
      await editAndResend(editing, content)
      return
    }

    if (active) {
      await runStream(active, content)
      return
    }

    try {
      const created = await apiFetch<ConversationRow>('/api/conversations', {
        method: 'POST',
        json: { modelId: selectedModelId },
      })
      await store.refresh(['conversations'])
      navigate(`/app/chat/${created.id}`)
      await runStream(created, content)
    } catch {
      patchLast({ status: 'error', error: { code: 'request_failed', message: t('chat.sendFailed') } })
    }
  }, [active, editAndResend, editing, input, navigate, patchLast, runStream, selectedModelId, streaming, t])

  const startEdit = useCallback((message: ChatMessageView) => {
    setEditing(message)
    setInput(message.content)
  }, [])

  const cancelEdit = useCallback(() => {
    setEditing(null)
    setInput('')
  }, [])

  const regenerate = useCallback(() => {
    if (streaming || !active) return
    const hasUser = messages.some((message) => message.role === 'user')
    if (hasUser) void runStream(active, null, 'regenerate')
  }, [active, messages, runStream, streaming])

  const stop = useCallback(async () => {
    const conversation = active
    const last = messages[messages.length - 1]
    handleRef.current?.abort()
    patchLast({ status: 'stopped' })
    if (!conversation || !last || last.role !== 'assistant') return
    stoppedRef.current = true
    try {
      const row = await apiFetch<MessageRow>(`/api/conversations/${conversation.id}/stop`, {
        method: 'POST',
        json: {
          answer: last.content,
          ...(last.reasoning ? { reasoning: last.reasoning } : {}),
          ...(selectedModelId ? { modelId: selectedModelId } : {}),
        },
      })
      patchLast({ id: row.id, status: row.status, reasoning: row.reasoning ?? '' })
    } catch {
      stoppedRef.current = false
    }
  }, [active, messages, patchLast, selectedModelId])

  const removeConversation = useCallback(
    async (id: string) => {
      try {
        await apiFetch(`/api/conversations/${id}`, { method: 'DELETE' })
        await store.refresh(['conversations'])
        if (id === conversationId) navigate('/app/chat')
      } catch {
        return
      }
    },
    [conversationId, navigate],
  )

  const changeProject = useCallback(
    async (projectId: string) => {
      if (!active) return
      try {
        await apiFetch(`/api/conversations/${active.id}`, { method: 'PATCH', json: { projectId: projectId || null } })
        await store.refresh(['conversations'])
      } catch {
        return
      }
    },
    [active],
  )

  const uploadAttachment = useCallback(
    async (file: File) => {
      if (!active) return
      setAttachmentError(null)
      const form = new FormData()
      form.append('file', file)
      const res = await fetch(`/api/conversations/${active.id}/attachments`, { method: 'POST', body: form })
      if (!res.ok) {
        const body = (await res.json().catch(() => null)) as { error?: string } | null
        setAttachmentError(body?.error ?? t('chat.attachmentUploadFailed'))
        return
      }
      const row = (await res.json()) as AttachmentRow
      setAttachments((prev) => [...prev, row])
    },
    [active, t],
  )

  const onFilesPicked = useCallback(
    async (event: ChangeEvent<HTMLInputElement>) => {
      const files = event.target.files
      event.target.value = ''
      if (!files || files.length === 0) return
      for (const file of Array.from(files)) await uploadAttachment(file)
    },
    [uploadAttachment],
  )

  const removeAttachment = useCallback(async (id: string) => {
    try {
      await apiFetch(`/api/attachments/${id}`, { method: 'DELETE' })
      setAttachments((prev) => prev.filter((row) => row.id !== id))
    } catch {
      return
    }
  }, [])

  const lastAssistantComplete =
    messages.length > 0 && messages[messages.length - 1].role === 'assistant' && messages[messages.length - 1].status === 'complete'

  return (
    <div className="nexora-fill flex overflow-hidden rounded-xl border border-border bg-background">
      <aside className="hidden w-64 shrink-0 border-r border-border lg:block">
        <ConversationList conversations={conversations} onDelete={(id) => void removeConversation(id)} />
      </aside>
      <div className="flex min-w-0 flex-1 flex-col">
        <div className="flex items-center justify-between gap-4 border-b border-border px-4 py-3">
          <div className="min-w-0">
            <h1 className="truncate text-sm font-semibold">{active?.title || t('chat.untitled')}</h1>
          </div>
          <div className="flex shrink-0 items-center gap-3">
            {active && (
              <NativeSelect
                value={active.projectId ?? ''}
                onChange={(event) => void changeProject(event.target.value)}
                disabled={streaming}
                aria-label={t('projects.project')}
                className="h-9 max-w-44 text-xs"
                options={[
                  { value: '', label: t('projects.none') },
                  ...projects.map(
                    (project): NativeSelectOption => ({ value: project.id, label: project.name }),
                  ),
                ]}
              />
            )}
            {active && agents.length > 0 && (
              <div className="relative">
                <Bot
                  size={12}
                  aria-hidden="true"
                  className="pointer-events-none absolute left-2.5 top-1/2 z-10 -translate-y-1/2 text-muted-foreground"
                />
                <NativeSelect
                  value={active.agentId ?? ''}
                  onChange={(event) => void changeAgent(event.target.value)}
                  disabled={streaming}
                  aria-label={t('chat.agent')}
                  className="h-9 max-w-44 pl-7 text-xs"
                  options={[
                    { value: '', label: t('chat.noAgent') },
                    ...agents.map(
                      (agent): NativeSelectOption => ({ value: agent.id, label: agent.name }),
                    ),
                  ]}
                />
              </div>
            )}
            <div className="w-56">
              <ModelPicker models={models} value={selectedModelId} onChange={setSelectedModelId} disabled={streaming} />
            </div>
          </div>
        </div>

        <div ref={threadRef} className="flex-1 space-y-6 overflow-y-auto px-4 py-6">
          {loading && <p className="text-center text-sm text-muted-foreground">{t('common.loading')}</p>}
          {!loading && messages.length === 0 && (
            <div className="flex h-full flex-col items-center justify-center text-center">
              <span className="nexora-brand-mark mb-4 flex h-12 w-12 items-center justify-center rounded-xl text-lg font-bold">
                N
              </span>
              <h2 className="text-lg font-semibold">{t('chat.emptyTitle')}</h2>
              <p className="mt-1 text-sm text-muted-foreground">{t('chat.emptyHint')}</p>
            </div>
          )}
          {messages.map((message, index) => (
            <MessageBubble
              key={message.id}
              message={message}
              conversationId={active?.id}
              canRegenerate={lastAssistantComplete && index === messages.length - 1}
              onRegenerate={regenerate}
              canEdit={!streaming && !editing && message.role === 'user'}
              onEdit={() => startEdit(message)}
              toolCalls={toolCallRows.filter((call) => call.messageId === message.id)}
              onResolveToolCall={(id, approved) => void resolveToolApproval(id, approved)}
              resolving={resolving}
            />
          ))}
        </div>

        <div className="border-t border-border px-4 py-3">
          {editing && (
            <div className="mb-2 flex items-center justify-between rounded-lg border border-border bg-muted/50 px-3 py-1.5 text-xs text-muted-foreground">
              <span>{t('chat.editingMessage')}</span>
              <button type="button" onClick={cancelEdit} className="rounded px-1.5 py-0.5 font-medium hover:bg-muted hover:text-foreground">
                {t('common.cancel')}
              </button>
            </div>
          )}
          <AttachmentChips attachments={attachments} onRemove={(id) => void removeAttachment(id)} />
          {attachmentError && <p className="mb-2 text-xs text-destructive">{attachmentError}</p>}
          <input
            ref={fileInputRef}
            type="file"
            multiple
            className="hidden"
            onChange={(event) => void onFilesPicked(event)}
            aria-label={t('chat.attach')}
          />
          <Composer
            value={input}
            onChange={setInput}
            onSend={() => void send()}
            onStop={stop}
            streaming={streaming}
            startSlot={
              <Button
                variant="ghost"
                size="icon"
                onClick={() => fileInputRef.current?.click()}
                disabled={!active || streaming}
                aria-label={t('chat.attach')}
                title={t('chat.attach')}
              >
                <Paperclip size={16} aria-hidden="true" />
              </Button>
            }
          />
        </div>
      </div>
    </div>
  )
}
