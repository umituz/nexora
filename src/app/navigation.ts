import {
  BarChart3,
  BookOpen,
  Bot,
  Brain,
  FileCode2,
  FolderKanban,
  KeyRound,
  Layers,
  LayoutDashboard,
  ListTodo,
  MonitorSmartphone,
  MessagesSquare,
  Radar,
  ScrollText,
  Settings,
  Sparkles,
  Telescope,
  Webhook,
  Workflow,
  Zap,
} from 'lucide-react'
import type { LucideIcon } from 'lucide-react'

export interface NavItem {
  key:
    | 'overview'
    | 'chat'
    | 'projects'
    | 'memories'
    | 'agents'
    | 'knowledge'
    | 'research'
    | 'watchlist'
    | 'code'
    | 'studio'
    | 'models'
    | 'usage'
    | 'requests'
    | 'tasks'
    | 'apiKeys'
    | 'sessions'
    | 'webhooks'
    | 'automations'
    | 'activity'
    | 'settings'
  href: string
  icon: LucideIcon
  group: 'workspace' | 'system'
}

export const NAV_GROUPS: { id: NavItem['group']; titleKey: string | null }[] = [
  { id: 'workspace', titleKey: null },
  { id: 'system', titleKey: 'nav.groups.system' },
]

export const NAV_ITEMS: NavItem[] = [
  { key: 'overview', href: '/app/overview', icon: LayoutDashboard, group: 'workspace' },
  { key: 'chat', href: '/app/chat', icon: MessagesSquare, group: 'workspace' },
  { key: 'projects', href: '/app/projects', icon: FolderKanban, group: 'workspace' },
  { key: 'memories', href: '/app/memories', icon: Brain, group: 'workspace' },
  { key: 'agents', href: '/app/agents', icon: Bot, group: 'workspace' },
  { key: 'knowledge', href: '/app/knowledge', icon: BookOpen, group: 'workspace' },
  { key: 'research', href: '/app/research', icon: Telescope, group: 'workspace' },
  { key: 'watchlist', href: '/app/watchlist', icon: Radar, group: 'workspace' },
  { key: 'code', href: '/app/code', icon: FileCode2, group: 'workspace' },
  { key: 'studio', href: '/app/studio', icon: Sparkles, group: 'workspace' },
  { key: 'models', href: '/app/models', icon: Layers, group: 'workspace' },
  { key: 'usage', href: '/app/usage', icon: BarChart3, group: 'workspace' },
  { key: 'requests', href: '/app/requests', icon: Zap, group: 'workspace' },
  { key: 'tasks', href: '/app/tasks', icon: ListTodo, group: 'system' },
  { key: 'apiKeys', href: '/app/api-keys', icon: KeyRound, group: 'system' },
  { key: 'sessions', href: '/app/sessions', icon: MonitorSmartphone, group: 'system' },
  { key: 'webhooks', href: '/app/webhooks', icon: Webhook, group: 'system' },
  { key: 'automations', href: '/app/automations', icon: Workflow, group: 'system' },
  { key: 'activity', href: '/app/activity', icon: ScrollText, group: 'system' },
  { key: 'settings', href: '/app/settings', icon: Settings, group: 'system' },
]

export const NOTIFICATIONS_ROUTE = '/app/notifications'
