export type WorkflowStatus = 'done' | 'running' | 'pending' | 'failed'

export interface WorkflowStepItem {
  id: string
  label: string
  status: WorkflowStatus
  detail: string
  duration?: string
  logs?: string[]
}

export interface WorkflowRunItem {
  id: string
  templateId?: string
  name: string
  description: string
  category: string
  icon: string
  color: string
  status: WorkflowStatus
  triggeredAt: string
  totalDuration?: string
  steps: WorkflowStepItem[]
}

export interface WorkflowTemplateItem {
  id: string
  name: string
  description: string
  category: 'finance' | 'productivity' | 'code' | 'security' | 'daily'
  stepsCount: number
  estimatedTime: string
  icon: string
  color: string
  runsCount: number
  defaultSteps: { label: string; detail: string }[]
}

export const WORKFLOW_TEMPLATES: WorkflowTemplateItem[] = [
  {
    id: 'wf-subscription-audit',
    name: 'Subscription & FinOps Audit',
    description: 'Scans all active AI providers and SaaS subscriptions, flags billing anomalies, and schedules cancellation reminders.',
    category: 'finance',
    stepsCount: 4,
    estimatedTime: '~1.8s',
    icon: 'CreditCard',
    color: '#3B82F6',
    runsCount: 38,
    defaultSteps: [
      { label: 'Fetch active provider telemetry', detail: 'Scan OpenAI, Anthropic, Groq, Neon & Cloudflare meters' },
      { label: 'Analyze per-token billing patterns', detail: 'Compute anomalous spikes & identify unused tier seats' },
      { label: 'Verify cancellation policies & deadlines', detail: 'Check renewal dates and draft notification triggers' },
      { label: 'Generate executive FinOps cost report', detail: 'Export actionable markdown summary with savings targets' },
    ],
  },
  {
    id: 'wf-morning-brief',
    name: 'Morning Executive Briefing',
    description: 'Synthesizes overnight repo activities, critical GitHub issues, pending agent missions, and priority calendar deadlines.',
    category: 'daily',
    stepsCount: 5,
    estimatedTime: '~2.4s',
    icon: 'Sun',
    color: '#F59E0B',
    runsCount: 142,
    defaultSteps: [
      { label: 'Sync repo activity & PR approvals', detail: 'Query active branches, latest deployments, and CI/CD results' },
      { label: 'Aggregate agent task queues', detail: 'Identify succeeded, failed, and waiting background workers' },
      { label: 'Scan incoming dispatch alerts', detail: 'Prioritize urgent system webhooks and messages' },
      { label: 'Analyze compute quota remaining', detail: 'Verify daily token usage limits against threshold' },
      { label: 'Assemble executive morning memo', detail: 'Deliver concise actionable digest to workspace overview' },
    ],
  },
  {
    id: 'wf-security-sweep',
    name: 'Codebase Security & Bug Sweep',
    description: 'Automated AST vulnerability sweep, secret leakage detection, dependency CVE audits, and patch generation.',
    category: 'security',
    stepsCount: 4,
    estimatedTime: '~4.2s',
    icon: 'ShieldCheck',
    color: '#EF4444',
    runsCount: 64,
    defaultSteps: [
      { label: 'Scan package tree for known CVEs', detail: 'Inspect package-lock.json against national vulnerability db' },
      { label: 'AST secret & token leak detection', detail: 'Search source tree for unmasked API tokens, bearer keys, or env leaks' },
      { label: 'SQL & injection pattern verification', detail: 'Validate parameterized Drizzle schemas and sanitize inputs' },
      { label: 'Compile security posture certificate', detail: 'Generate green audit badge and mitigation checklist' },
    ],
  },
  {
    id: 'wf-pr-triage',
    name: 'PR Review & AI Triage Sprint',
    description: 'Inspects incoming pull requests, runs autonomous diff reviews, checks test coverage deltas, and generates structured comments.',
    category: 'code',
    stepsCount: 4,
    estimatedTime: '~3.1s',
    icon: 'GitPullRequest',
    color: '#8B5CF6',
    runsCount: 89,
    defaultSteps: [
      { label: 'Extract PR git diff & changed hunks', detail: 'Parse AST syntactic modifications across frontend & backend' },
      { label: 'Execute unit test regression pass', detail: 'Verify zero breaking changes against test suite specs' },
      { label: 'Evaluate code style & performance footprint', detail: 'Check bundle size impact and lint standards compliance' },
      { label: 'Draft human-readable review memo', detail: 'Formulate approval or revision requests with code suggestions' },
    ],
  },
  {
    id: 'wf-weekly-synthesis',
    name: 'Weekly Executive Synthesis',
    description: 'Aggregates weekly task velocities, compute spend efficiency, knowledge base growth, and milestone achievements.',
    category: 'productivity',
    stepsCount: 4,
    estimatedTime: '~2.9s',
    icon: 'BarChart3',
    color: '#10B981',
    runsCount: 29,
    defaultSteps: [
      { label: 'Aggregate multi-agent completion logs', detail: 'Evaluate 7-day throughput across all active agents' },
      { label: 'Calculate team productivity index', detail: 'Benchmark against preceding rolling periods (+14% delta)' },
      { label: 'Highlight operational blockers', detail: 'Flag recurring task retry loops or rate-limit throttles' },
      { label: 'Generate PDF/Markdown executive recap', detail: 'Publish summary to workspace documentation vault' },
    ],
  },
]

export const INITIAL_WORKFLOW_RUNS: WorkflowRunItem[] = [
  {
    id: 'run-8921',
    templateId: 'wf-subscription-audit',
    name: 'Subscription & FinOps Audit',
    description: 'Periodic audit of active AI model subscriptions and provider seats',
    category: 'finance',
    icon: 'CreditCard',
    color: '#3B82F6',
    status: 'done',
    triggeredAt: '12 minutes ago',
    totalDuration: '1.74s',
    steps: [
      {
        id: 's1',
        label: 'Fetch active provider telemetry',
        status: 'done',
        detail: 'Queried 5 active provider accounts; 14 inference keys mapped',
        duration: '320ms',
        logs: ['[OK] Connected to Groq API meters', '[OK] Neon serverless consumption retrieved (0.42 CU avg)', '[OK] OpenAI-compatible endpoints synced'],
      },
      {
        id: 's2',
        label: 'Analyze per-token billing patterns',
        status: 'done',
        detail: 'Detected 2 overprovisioned subscriptions totaling $54.90/mo potential savings',
        duration: '540ms',
        logs: ['[FLAG] Model Claude 3.5 Sonnet backup key idle for 18 days', '[FLAG] Midjourney Pro seat unassigned'],
      },
      {
        id: 's3',
        label: 'Verify cancellation policies & deadlines',
        status: 'done',
        detail: 'Scheduled automatic review alerts for upcoming billing renewal on Nov 22',
        duration: '410ms',
        logs: ['[ACTION] Created calendar reminder for Nov 20, 09:00 UTC', '[ACTION] Webhook notification dispatched to FinOps channel'],
      },
      {
        id: 's4',
        label: 'Generate executive FinOps cost report',
        status: 'done',
        detail: 'Saved artifact: /reports/finops-audit-2026-11.md',
        duration: '470ms',
        logs: ['[OUTPUT] Markdown report generated with 4 itemized recommendations'],
      },
    ],
  },
  {
    id: 'run-8920',
    templateId: 'wf-morning-brief',
    name: 'Morning Executive Briefing',
    description: 'Daily operational status compile across repo, CI, and agent queues',
    category: 'daily',
    icon: 'Sun',
    color: '#F59E0B',
    status: 'done',
    triggeredAt: '3 hours ago',
    totalDuration: '2.31s',
    steps: [
      {
        id: 's1',
        label: 'Sync repo activity & PR approvals',
        status: 'done',
        detail: '3 commits landed on main; branch coverage 98.4%',
        duration: '480ms',
      },
      {
        id: 's2',
        label: 'Aggregate agent task queues',
        status: 'done',
        detail: '33 unit tests passed; 0 failed queue jobs',
        duration: '620ms',
      },
      {
        id: 's3',
        label: 'Scan incoming dispatch alerts',
        status: 'done',
        detail: 'All upstream services nominal; latency p95 184ms',
        duration: '390ms',
      },
      {
        id: 's4',
        label: 'Analyze compute quota remaining',
        status: 'done',
        detail: '3.8M tokens remaining in daily quota allowance',
        duration: '410ms',
      },
      {
        id: 's5',
        label: 'Assemble executive morning memo',
        status: 'done',
        detail: 'Daily brief broadcast to dashboard banner',
        duration: '410ms',
      },
    ],
  },
  {
    id: 'run-8919',
    templateId: 'wf-security-sweep',
    name: 'Codebase Security & Bug Sweep',
    description: 'Automated vulnerability triage and secret scanning',
    category: 'security',
    icon: 'ShieldCheck',
    color: '#EF4444',
    status: 'running',
    triggeredAt: 'Just now',
    totalDuration: 'In progress...',
    steps: [
      {
        id: 's1',
        label: 'Scan package tree for known CVEs',
        status: 'done',
        detail: 'Zero known vulnerabilities discovered across 237 npm dependencies',
        duration: '890ms',
        logs: ['[OK] npm audit exit code 0', '[OK] Drizzle ORM and Vite security advisories checked'],
      },
      {
        id: 's2',
        label: 'AST secret & token leak detection',
        status: 'running',
        detail: 'Scanning 148 source files for hardcoded cryptographic keys and credentials...',
        duration: '1.42s',
        logs: ['[INSPECT] src/components/ ... clean', '[INSPECT] api/ai/ ... clean', '[INSPECT] scripts/ ... scanning'],
      },
      {
        id: 's3',
        label: 'SQL & injection pattern verification',
        status: 'pending',
        detail: 'Queued to inspect parameterized queries in drizzle.config.ts and schema routes',
      },
      {
        id: 's4',
        label: 'Compile security posture certificate',
        status: 'pending',
        detail: 'Will publish cryptographically signed audit badge upon completion',
      },
    ],
  },
  {
    id: 'run-8918',
    templateId: 'wf-pr-triage',
    name: 'PR Review & AI Triage Sprint',
    description: 'Automated PR verification and regression check',
    category: 'code',
    icon: 'GitPullRequest',
    color: '#8B5CF6',
    status: 'failed',
    triggeredAt: 'Yesterday, 18:42',
    totalDuration: '1.24s (Interrupted)',
    steps: [
      {
        id: 's1',
        label: 'Extract PR git diff & changed hunks',
        status: 'done',
        detail: 'Diff loaded: +412 / -88 lines in 6 files',
        duration: '310ms',
      },
      {
        id: 's2',
        label: 'Execute unit test regression pass',
        status: 'failed',
        detail: 'Timeout waiting for external sandbox runner container after 3 attempts',
        duration: '930ms',
        logs: ['[ERROR] Container sandbox connection refused: 504 Gateway Timeout', '[RETRY] Retried on secondary runner worker... failed'],
      },
      {
        id: 's3',
        label: 'Evaluate code style & performance footprint',
        status: 'pending',
        detail: 'Skipped due to upstream step failure',
      },
      {
        id: 's4',
        label: 'Draft human-readable review memo',
        status: 'pending',
        detail: 'Skipped due to upstream step failure',
      },
    ],
  },
]
