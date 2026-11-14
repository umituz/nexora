export type DocumentFormat = 'PDF' | 'MD' | 'JSON' | 'CSV'
export type DocumentCategory = 'architecture' | 'finops' | 'security' | 'api_specs' | 'legal' | 'research'

export interface VaultDocumentItem {
  id: string
  name: string
  format: DocumentFormat
  size: string
  updatedAt: string
  category: DocumentCategory
  tags: string[]
  vectorChunks: number
  aiSummary: string
  keyEntities: string[]
  color: string
}

export const VAULT_DOCUMENTS: VaultDocumentItem[] = [
  {
    id: 'doc-arch-v2',
    name: 'Nexora-Architecture-Specification-v2.pdf',
    format: 'PDF',
    size: '1.8 MB',
    updatedAt: 'Today, 10:15 AM',
    category: 'architecture',
    tags: ['cloudflare-workers', 'pgvector', 'neon-postgres', 'single-origin'],
    vectorChunks: 48,
    aiSummary: 'Specifies single-origin Cloudflare Worker topology, Neon Postgres pgvector HNSW KNN retrieval, and SSE local streaming engine.',
    keyEntities: ['Cloudflare ASSETS', 'Neon DB', 'Hono API', 'Groq Provider'],
    color: '#EF4444',
  },
  {
    id: 'doc-finops-ledger',
    name: 'FinOps-Inference-Billing-Q1.csv',
    format: 'CSV',
    size: '420 KB',
    updatedAt: 'Yesterday, 16:20',
    category: 'finops',
    tags: ['token-accounting', 'groq-lpu', 'openai-rates', 'cost-allocation'],
    vectorChunks: 14,
    aiSummary: 'Itemized consumption ledger across 382M inference tokens; identifies $54.90/mo potential savings via idle tier downgrades.',
    keyEntities: ['AmEx Auto-Debit', 'Groq Tier 3', 'Neon Compute Units', 'Model Router'],
    color: '#10B981',
  },
  {
    id: 'doc-sec-rotation',
    name: 'Zero-Trust-Secret-Rotation-Policy.md',
    format: 'MD',
    size: '180 KB',
    updatedAt: 'Nov 12, 2026',
    category: 'security',
    tags: ['cve-mitigation', 'secret-lifecycle', 'hmac-sha256', 'rbac'],
    vectorChunks: 8,
    aiSummary: 'Standard operating procedure for automated API key lifecycle, Cloudflare Secrets rotation, and webhook signature verification.',
    keyEntities: ['BetterAuth Secret', 'HMAC Signatures', 'CVE Scanner', 'API Keys'],
    color: '#3B82F6',
  },
  {
    id: 'doc-api-openapi',
    name: 'Nexora-API-v2-OpenAPI-Spec.json',
    format: 'JSON',
    size: '890 KB',
    updatedAt: 'Nov 10, 2026',
    category: 'api_specs',
    tags: ['openapi-3.1', 'hono-client', 'sse-protocol', 'rate-limiting'],
    vectorChunks: 32,
    aiSummary: 'Machine-readable OpenAPI contract covering 48 endpoints across chat streaming, agent queues, and document indexing APIs.',
    keyEntities: ['/api/chat/:id/stream', '/api/automations', '/api/models', '/api/tasks'],
    color: '#F59E0B',
  },
  {
    id: 'doc-legal-sla',
    name: 'Enterprise-Master-SLA-Agreement-2026.pdf',
    format: 'PDF',
    size: '2.4 MB',
    updatedAt: 'Nov 04, 2026',
    category: 'legal',
    tags: ['sla-99.95', 'data-protection', 'gdpr', 'compliance'],
    vectorChunks: 64,
    aiSummary: '99.95% availability guarantee, p95 edge latency thresholds (<250ms), and automated credit reimbursement provisions for downtime.',
    keyEntities: ['Service Level Guarantee', 'Data Processor Addendum', 'Audit Rights'],
    color: '#EF4444',
  },
  {
    id: 'doc-research-bench',
    name: 'Deep-Research-Model-Benchmark-Study.md',
    format: 'MD',
    size: '540 KB',
    updatedAt: 'Nov 01, 2026',
    category: 'research',
    tags: ['benchmark-radar', 'arena-elo', 'coding-evals', 'math-reasoning'],
    vectorChunks: 22,
    aiSummary: 'Comparative analysis of 12 state-of-the-art LLMs across coding speed, context window retention, and reasoning accuracy.',
    keyEntities: ['Claude 3.5 Sonnet', 'GPT-4o', 'Llama 3.3 70B', 'DeepSeek V3'],
    color: '#8B5CF6',
  },
]
