import type { ReactNode } from 'react'
import { Link, useParams } from 'react-router'
import { MessageSquarePlus, Trash2 } from 'lucide-react'
import { Button } from '@umituz/web-design-system'
import type { ConversationRow } from '@/data/chatTypes'
import { useT } from '@/i18n'

interface ConversationListProps {
  conversations: ConversationRow[]
  onDelete: (id: string) => void
}

export function ConversationList({ conversations, onDelete }: ConversationListProps): ReactNode {
  const t = useT()
  const { conversationId } = useParams()

  return (
    <div className="flex h-full flex-col">
      <div className="p-3">
        <Button asChild variant="outline" className="w-full justify-start gap-2">
          <Link to="/app/chat">
            <MessageSquarePlus size={16} aria-hidden="true" />
            {t('chat.newConversation')}
          </Link>
        </Button>
      </div>
      <nav className="flex-1 space-y-0.5 overflow-y-auto px-2 pb-3" aria-label={t('chat.conversations')}>
        {conversations.map((conversation) => (
          <div key={conversation.id} className="group relative">
            <Link
              to={`/app/chat/${conversation.id}`}
              className={`block truncate rounded-lg px-3 py-2 pr-8 text-sm transition-colors ${
                conversation.id === conversationId
                  ? 'bg-accent font-medium text-accent-foreground'
                  : 'text-muted-foreground hover:bg-muted hover:text-foreground'
              }`}
            >
              {conversation.title || t('chat.untitled')}
            </Link>
            <button
              type="button"
              onClick={() => onDelete(conversation.id)}
              className="absolute right-1.5 top-1/2 hidden -translate-y-1/2 rounded p-1 text-muted-foreground hover:bg-destructive/10 hover:text-destructive group-hover:block"
              aria-label={t('common.delete')}
              title={t('common.delete')}
            >
              <Trash2 size={13} aria-hidden="true" />
            </button>
          </div>
        ))}
        {conversations.length === 0 && (
          <div className="px-3 py-8 text-center">
            <p className="text-sm font-medium text-foreground">{t('chat.noConversations')}</p>
            <p className="mt-1 text-xs text-muted-foreground">{t('chat.noConversationsHint')}</p>
          </div>
        )}
      </nav>
    </div>
  )
}
