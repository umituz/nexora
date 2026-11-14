export type MemberType = 'ai_agent' | 'human_lead'
export type MemberStatus = 'online' | 'active_flight' | 'standby' | 'away' | 'offline'

export interface SquadMemberItem {
  id: string
  name: string
  role: string
  type: MemberType
  avatarInitials: string
  avatarColor: string
  status: MemberStatus
  specialties: string[]
  assignedTasks: number
  completedTasks: number
  activeMission?: string
}

export interface SquadProjectItem {
  id: string
  name: string
  description: string
  category: 'architecture' | 'finops' | 'ai_core' | 'security'
  status: 'In Progress' | 'Planning' | 'Completed'
  progress: number
  color: string
  dueDate: string
  memberIds: string[]
  deliverables: { label: string; done: boolean }[]
}

export const SQUAD_MEMBERS: SquadMemberItem[] = [
  {
    id: 'sm-sarah',
    name: 'Sarah Chen',
    role: 'Staff Product Architect',
    type: 'human_lead',
    avatarInitials: 'SC',
    avatarColor: '#3B82F6',
    status: 'online',
    specialties: ['Distributed Systems', 'Product Strategy', 'Domain Driven Design'],
    assignedTasks: 8,
    completedTasks: 6,
    activeMission: 'Reviewing Q4 Architecture RFC & Agent Topology',
  },
  {
    id: 'sm-aria',
    name: 'Aria Codex',
    role: 'Lead Autonomous Engineer',
    type: 'ai_agent',
    avatarInitials: 'AC',
    avatarColor: '#8B5CF6',
    status: 'active_flight',
    specialties: ['Full-Stack TypeScript', 'Refactoring', 'AST Code Generation'],
    assignedTasks: 16,
    completedTasks: 14,
    activeMission: 'Migrating vector store schema & running AST bug sweeps',
  },
  {
    id: 'sm-jordan',
    name: 'Jordan Lee',
    role: 'Principal UX & Design System',
    type: 'human_lead',
    avatarInitials: 'JL',
    avatarColor: '#10B981',
    status: 'online',
    specialties: ['Design Tokens', 'Micro-interactions', 'Accessibility'],
    assignedTasks: 6,
    completedTasks: 5,
    activeMission: 'Aligning dark mode liquid-glass tokens in web-design-system',
  },
  {
    id: 'sm-finops',
    name: 'FinOps Sentry',
    role: 'Compute & Cost Leak Optimizer',
    type: 'ai_agent',
    avatarInitials: 'FS',
    avatarColor: '#F59E0B',
    status: 'active_flight',
    specialties: ['Token Metering', 'LLM Provider Benchmarking', 'Cost Allocation'],
    assignedTasks: 10,
    completedTasks: 9,
    activeMission: 'Scanning Claude 3.5 & OpenAI token rates for arbitrage opportunities',
  },
  {
    id: 'sm-mike',
    name: 'Mike Rodriguez',
    role: 'Principal Infra & Cloudflare Lead',
    type: 'human_lead',
    avatarInitials: 'MR',
    avatarColor: '#06B6D4',
    status: 'away',
    specialties: ['Cloudflare Workers', 'Neon Postgres', 'Edge Runtime'],
    assignedTasks: 11,
    completedTasks: 8,
    activeMission: 'Configuring Neon connection pooling with cf-ship deploy',
  },
  {
    id: 'sm-sentinel',
    name: 'Vulnerability Sentinel',
    role: 'Zero-Trust & CVE Security Auditor',
    type: 'ai_agent',
    avatarInitials: 'VS',
    avatarColor: '#EF4444',
    status: 'standby',
    specialties: ['CVE Audit', 'Secret Rotation', 'Prompt Injection Defense'],
    assignedTasks: 7,
    completedTasks: 7,
    activeMission: 'Standby for scheduled nightly AST security run',
  },
]

export const SQUAD_PROJECTS: SquadProjectItem[] = [
  {
    id: 'sp-design-system',
    name: 'Full-Stack Architecture & Design System 2.0',
    description: 'Harmonize tokens, responsive components, and agent status visualizers across all web pages.',
    category: 'architecture',
    status: 'In Progress',
    progress: 72,
    color: '#3B82F6',
    dueDate: 'Nov 28, 2026',
    memberIds: ['sm-sarah', 'sm-jordan', 'sm-aria'],
    deliverables: [
      { label: 'Token schema harmonization', done: true },
      { label: 'Component accessibility pass', done: true },
      { label: 'Agent status indicator kit', done: true },
      { label: 'Cross-browser responsive validation', done: false },
    ],
  },
  {
    id: 'sp-finops-guardrails',
    name: 'Autonomous FinOps & Token Leak Guardrails',
    description: 'Implement real-time spend alarms, automated model tier downgrades, and idle subscription cancellation alerts.',
    category: 'finops',
    status: 'In Progress',
    progress: 88,
    color: '#F59E0B',
    dueDate: 'Nov 20, 2026',
    memberIds: ['sm-finops', 'sm-mike'],
    deliverables: [
      { label: 'Telemetry stream scraper', done: true },
      { label: 'Per-workspace quota limiter', done: true },
      { label: 'Idle seat detection algorithm', done: true },
      { label: 'Automatic invoice reconciliation', done: false },
    ],
  },
  {
    id: 'sp-pgvector-graph',
    name: 'Pgvector Embeddings & Knowledge Graph Engine',
    description: 'Scale multi-tenant document chunking, KNN semantic search queries, and cross-reference citations.',
    category: 'ai_core',
    status: 'In Progress',
    progress: 45,
    color: '#8B5CF6',
    dueDate: 'Dec 05, 2026',
    memberIds: ['sm-aria', 'sm-sarah', 'sm-mike'],
    deliverables: [
      { label: 'Chunking parser with AST support', done: true },
      { label: 'Vector index tuning (HNSW vs IVFFlat)', done: true },
      { label: 'Semantic citation backlink renderer', done: false },
      { label: 'Hybrid BM25 + dense retrieval fusion', done: false },
    ],
  },
  {
    id: 'sp-zero-trust',
    name: 'Continuous Zero-Trust & Secret Rotation Protocol',
    description: 'Automated secret rotation on Cloudflare Secrets and cryptographic validation of external webhooks.',
    category: 'security',
    status: 'Completed',
    progress: 100,
    color: '#10B981',
    dueDate: 'Nov 12, 2026',
    memberIds: ['sm-sentinel', 'sm-mike'],
    deliverables: [
      { label: 'Automated key lifecycle audit', done: true },
      { label: 'Zero-trust webhook signing headers', done: true },
      { label: 'Encrypted storage of agent credentials', done: true },
    ],
  },
]
