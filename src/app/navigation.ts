import { BarChart3, Brain, FolderKanban, MessagesSquare, Sparkles } from 'lucide-react'
import type { LucideIcon } from 'lucide-react'

export interface NavItem {
  key: 'chat' | 'projects' | 'memories' | 'studio' | 'usage'
  href: string
  icon: LucideIcon
  group: 'workspace'
}

export const NAV_GROUPS: { id: NavItem['group']; titleKey: string | null }[] = [
  { id: 'workspace', titleKey: null },
]

export const NAV_ITEMS: NavItem[] = [
  { key: 'chat', href: '/app/chat', icon: MessagesSquare, group: 'workspace' },
  { key: 'projects', href: '/app/projects', icon: FolderKanban, group: 'workspace' },
  { key: 'memories', href: '/app/memories', icon: Brain, group: 'workspace' },
  { key: 'studio', href: '/app/studio', icon: Sparkles, group: 'workspace' },
  { key: 'usage', href: '/app/usage', icon: BarChart3, group: 'workspace' },
]
