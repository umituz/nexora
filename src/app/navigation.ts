import { BarChart3, FolderKanban, MessagesSquare } from 'lucide-react'
import type { LucideIcon } from 'lucide-react'

export interface NavItem {
  key: 'chat' | 'projects' | 'usage'
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
  { key: 'usage', href: '/app/usage', icon: BarChart3, group: 'workspace' },
]
