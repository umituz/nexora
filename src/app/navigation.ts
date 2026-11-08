import { BarChart3, MessagesSquare } from 'lucide-react'
import type { LucideIcon } from 'lucide-react'

export interface NavItem {
  key: 'chat' | 'usage'
  href: string
  icon: LucideIcon
  group: 'workspace'
}

export const NAV_GROUPS: { id: NavItem['group']; titleKey: string | null }[] = [
  { id: 'workspace', titleKey: null },
]

export const NAV_ITEMS: NavItem[] = [
  { key: 'chat', href: '/app/chat', icon: MessagesSquare, group: 'workspace' },
  { key: 'usage', href: '/app/usage', icon: BarChart3, group: 'workspace' },
]
