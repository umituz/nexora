import { BarChart3, BookOpen, Bot, Brain, FileCode2, FolderKanban, Layers, MessagesSquare, Sparkles, Telescope } from 'lucide-react'
import type { LucideIcon } from 'lucide-react'

export interface NavItem {
  key: 'chat' | 'projects' | 'memories' | 'agents' | 'knowledge' | 'research' | 'code' | 'studio' | 'models' | 'usage'
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
  { key: 'agents', href: '/app/agents', icon: Bot, group: 'workspace' },
  { key: 'knowledge', href: '/app/knowledge', icon: BookOpen, group: 'workspace' },
  { key: 'research', href: '/app/research', icon: Telescope, group: 'workspace' },
  { key: 'code', href: '/app/code', icon: FileCode2, group: 'workspace' },
  { key: 'studio', href: '/app/studio', icon: Sparkles, group: 'workspace' },
  { key: 'models', href: '/app/models', icon: Layers, group: 'workspace' },
  { key: 'usage', href: '/app/usage', icon: BarChart3, group: 'workspace' },
]
