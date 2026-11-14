import { useState, useMemo, useCallback } from 'react'
import type { ReactNode } from 'react'
import {
  BookOpen,
  CheckCircle2,
  Database,
  FileCode,
  FileSpreadsheet,
  FileText,
  Layers,
  Search,
  Sparkles,
  Tag,
} from 'lucide-react'
import { Badge, Button, Input } from '@umituz/web-design-system'
import {
  VAULT_DOCUMENTS,
  type DocumentFormat,
  type VaultDocumentItem,
} from './knowledgeVaultData'

interface DocumentVaultProps {
  onNotify?: (message: string) => void
  onNewDocument?: () => void
}

function getFormatIcon(format: DocumentFormat): ReactNode {
  switch (format) {
    case 'PDF':
      return <FileText className="size-4 text-rose-500" />
    case 'CSV':
      return <FileSpreadsheet className="size-4 text-emerald-500" />
    case 'JSON':
      return <FileCode className="size-4 text-amber-500" />
    case 'MD':
    default:
      return <BookOpen className="size-4 text-blue-500" />
  }
}

export function DocumentVault({ onNotify, onNewDocument }: DocumentVaultProps): ReactNode {
  const [docs, setDocs] = useState<VaultDocumentItem[]>(VAULT_DOCUMENTS)
  const [selectedCategory, setSelectedCategory] = useState<string>('all')
  const [selectedFormat, setSelectedFormat] = useState<string>('all')
  const [searchQuery, setSearchQuery] = useState('')

  // Semantic Query Modal State
  const [queryModalOpen, setQueryModalOpen] = useState(false)
  const [targetDoc, setTargetDoc] = useState<VaultDocumentItem>(VAULT_DOCUMENTS[0])
  const [semanticQuery, setSemanticQuery] = useState('')
  const [queryResult, setQueryResult] = useState<{ answer: string; chunk: string; score: number } | null>(null)
  const [isQuerying, setIsQuerying] = useState(false)

  // Top Metrics
  const metrics = useMemo(() => {
    const totalDocs = docs.length
    const totalChunks = docs.reduce((sum, d) => sum + d.vectorChunks, 0)
    const categoriesCount = new Set(docs.map((d) => d.category)).size
    return { totalDocs, totalChunks, categoriesCount }
  }, [docs])

  // Filtered Documents
  const filteredDocs = useMemo(() => {
    return docs.filter((doc) => {
      if (selectedCategory !== 'all' && doc.category !== selectedCategory) return false
      if (selectedFormat !== 'all' && doc.format !== selectedFormat) return false
      if (searchQuery.trim().length > 0) {
        const q = searchQuery.toLowerCase()
        return (
          doc.name.toLowerCase().includes(q) ||
          doc.aiSummary.toLowerCase().includes(q) ||
          doc.tags.some((t) => t.toLowerCase().includes(q)) ||
          doc.keyEntities.some((e) => e.toLowerCase().includes(q))
        )
      }
      return true
    })
  }, [docs, selectedCategory, selectedFormat, searchQuery])

  // Open Semantic Query
  const openSemanticQuery = useCallback((doc: VaultDocumentItem) => {
    setTargetDoc(doc)
    setSemanticQuery('')
    setQueryResult(null)
    setQueryModalOpen(true)
  }, [])

  // Execute Semantic Query
  const executeSemanticQuery = useCallback(() => {
    if (!semanticQuery.trim()) return
    setIsQuerying(true)
    setTimeout(() => {
      setIsQuerying(false)
      setQueryResult({
        score: Math.round(91 + Math.random() * 7),
        chunk: `[Chunk #3 of ${targetDoc.name}] ... ${targetDoc.aiSummary} Verified zero breaking changes across interfaces and signed by automated verification key.`,
        answer: `Based on ${targetDoc.name}, the policy guarantees strict adherence to specifications with automated validation pipelines and cryptographic integrity checks.`,
      })
      onNotify?.(`Semantic match found in ${targetDoc.name}`)
    }, 600)
  }, [semanticQuery, targetDoc, onNotify])

  // Re-index Document
  const handleReindex = useCallback(
    (id: string) => {
      setDocs((prev) =>
        prev.map((d) =>
          d.id === id ? { ...d, vectorChunks: d.vectorChunks + 2, updatedAt: 'Just now' } : d,
        ),
      )
      onNotify?.('Re-vectorized document chunks with pgvector HNSW index')
    },
    [onNotify],
  )

  return (
    <div className="space-y-6">
      {/* Top Metric Strip */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="rounded-xl border border-border bg-card p-4">
          <div className="flex items-center justify-between text-muted-foreground text-xs font-medium">
            <span>Knowledge Vault</span>
            <BookOpen className="size-4 text-primary" />
          </div>
          <div className="mt-2 text-2xl font-bold tabular-nums">{metrics.totalDocs}</div>
          <p className="mt-1 text-xs text-muted-foreground">Cataloged operational documents</p>
        </div>

        <div className="rounded-xl border border-border bg-card p-4">
          <div className="flex items-center justify-between text-muted-foreground text-xs font-medium">
            <span>Vector Chunks (KNN)</span>
            <Database className="size-4 text-purple-500" />
          </div>
          <div className="mt-2 text-2xl font-bold tabular-nums text-purple-600 dark:text-purple-400">
            {metrics.totalChunks}
          </div>
          <p className="mt-1 text-xs text-muted-foreground">Pgvector embeddings mapped</p>
        </div>

        <div className="rounded-xl border border-border bg-card p-4">
          <div className="flex items-center justify-between text-muted-foreground text-xs font-medium">
            <span>Knowledge Domains</span>
            <Layers className="size-4 text-blue-500" />
          </div>
          <div className="mt-2 text-2xl font-bold tabular-nums">{metrics.categoriesCount}</div>
          <p className="mt-1 text-xs text-muted-foreground">Architecture, Legal, FinOps</p>
        </div>

        <div className="rounded-xl border border-border bg-card p-4">
          <div className="flex items-center justify-between text-muted-foreground text-xs font-medium">
            <span>Retrieval Accuracy</span>
            <CheckCircle2 className="size-4 text-emerald-500" />
          </div>
          <div className="mt-2 text-2xl font-bold tabular-nums text-emerald-600 dark:text-emerald-400">
            96.8%
          </div>
          <p className="mt-1 text-xs text-muted-foreground">Cosine similarity confidence</p>
        </div>
      </div>

      {/* Control & Search Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs">
          {(
            [
              { id: 'all', label: 'All Domains' },
              { id: 'architecture', label: 'Architecture' },
              { id: 'finops', label: 'FinOps' },
              { id: 'security', label: 'Security' },
              { id: 'api_specs', label: 'API Specs' },
              { id: 'legal', label: 'Legal' },
              { id: 'research', label: 'Research' },
            ] as const
          ).map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`text-[11px] px-2.5 py-1 rounded-md font-medium whitespace-nowrap transition-colors ${
                selectedCategory === cat.id
                  ? 'bg-primary text-primary-foreground'
                  : 'text-muted-foreground hover:bg-muted'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1 bg-muted/40 p-1 rounded-lg border border-border text-xs">
            {(['all', 'PDF', 'MD', 'CSV', 'JSON'] as const).map((fmt) => (
              <button
                key={fmt}
                onClick={() => setSelectedFormat(fmt)}
                className={`px-2 py-0.5 rounded-md text-[11px] font-medium transition-colors ${
                  selectedFormat === fmt
                    ? 'bg-card text-foreground shadow-xs'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                {fmt}
              </button>
            ))}
          </div>

          {onNewDocument && (
            <Button size="sm" onClick={onNewDocument} className="text-xs gap-1">
              Add Document
            </Button>
          )}
        </div>
      </div>

      {/* Search Input */}
      <div className="relative">
        <Search className="absolute left-3 top-3 size-4 text-muted-foreground" />
        <Input
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Semantic search by document topic, tags (#pgvector, #zero-trust), or content summary..."
          className="pl-9 text-xs"
        />
      </div>

      {/* Semantic Query Modal Sandbox */}
      {queryModalOpen && (
        <div className="rounded-xl border border-primary/40 bg-card p-5 space-y-4 shadow-sm">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Sparkles className="size-4 text-primary" />
              <h3 className="font-semibold text-sm">
                Semantic AI Retrieval: <span className="font-mono">{targetDoc.name}</span>
              </h3>
            </div>
            <Button
              size="sm"
              variant="ghost"
              onClick={() => setQueryModalOpen(false)}
              className="text-xs text-muted-foreground h-7"
            >
              Close
            </Button>
          </div>

          <div className="flex items-center gap-2">
            <Input
              value={semanticQuery}
              onChange={(e) => setSemanticQuery(e.target.value)}
              placeholder="Ask any question about this document (e.g. What is the SLA guarantee?)"
              className="text-xs"
              autoFocus
            />
            <Button
              size="sm"
              onClick={executeSemanticQuery}
              disabled={!semanticQuery.trim() || isQuerying}
              className="shrink-0 text-xs"
            >
              {isQuerying ? 'Searching...' : 'Run Query'}
            </Button>
          </div>

          {queryResult && (
            <div className="space-y-3 pt-2">
              <div className="rounded-lg bg-primary/5 border border-primary/20 p-3 space-y-1.5">
                <div className="flex items-center justify-between text-xs font-semibold text-foreground">
                  <span className="flex items-center gap-1.5">
                    <Sparkles className="size-3.5 text-primary" /> AI Synthesis
                  </span>
                  <Badge tone="success" className="text-[10px]">
                    {queryResult.score}% KNN Match
                  </Badge>
                </div>
                <p className="text-xs text-foreground/90">{queryResult.answer}</p>
              </div>

              <div className="rounded-lg bg-zinc-950 border border-zinc-800 p-3 font-mono text-[11px] text-zinc-300">
                <span className="text-zinc-500 block text-[10px] uppercase font-bold mb-1">
                  Retrieved Chunk Excerpt
                </span>
                {queryResult.chunk}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Document Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredDocs.map((doc) => (
          <div
            key={doc.id}
            className="rounded-xl border border-border bg-card p-5 flex flex-col justify-between space-y-4 transition-all hover:border-primary/50 hover:shadow-xs"
          >
            <div className="space-y-3">
              {/* Document Card Header */}
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="size-10 rounded-lg bg-muted flex items-center justify-center shrink-0 border border-border">
                    {getFormatIcon(doc.format)}
                  </div>
                  <div className="min-w-0">
                    <h4 className="font-semibold text-xs text-foreground truncate" title={doc.name}>
                      {doc.name}
                    </h4>
                    <div className="flex items-center gap-2 text-[11px] text-muted-foreground mt-0.5">
                      <span>{doc.format}</span>
                      <span>•</span>
                      <span>{doc.size}</span>
                      <span>•</span>
                      <span>{doc.vectorChunks} chunks</span>
                    </div>
                  </div>
                </div>

                <Badge variant="outline" className="text-[10px] uppercase font-mono tracking-wider">
                  {doc.category}
                </Badge>
              </div>

              {/* AI Summary Block */}
              <div className="rounded-lg bg-muted/20 border border-border/60 p-3 text-xs leading-relaxed text-muted-foreground">
                <div className="flex items-center gap-1 text-[11px] font-semibold text-foreground mb-1">
                  <Sparkles className="size-3 text-primary" /> Aria AI Summary:
                </div>
                {doc.aiSummary}
              </div>

              {/* Entity & Tag Chips */}
              <div className="flex flex-wrap items-center gap-1.5 pt-1">
                {doc.tags.map((tag, i) => (
                  <span
                    key={i}
                    className="text-[10px] px-2 py-0.5 rounded-full bg-primary/5 text-primary border border-primary/20 flex items-center gap-1"
                  >
                    <Tag className="size-2.5" />
                    #{tag}
                  </span>
                ))}
              </div>
            </div>

            {/* Document Footer Actions */}
            <div className="pt-3 border-t border-border flex items-center justify-between gap-2 text-xs">
              <span className="text-[11px] text-muted-foreground">
                Updated {doc.updatedAt}
              </span>

              <div className="flex items-center gap-1.5">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => openSemanticQuery(doc)}
                  className="h-7 text-xs px-2.5 gap-1 hover:border-primary hover:text-primary"
                >
                  <Sparkles className="size-3" /> Query
                </Button>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => handleReindex(doc.id)}
                  className="h-7 text-xs px-2 text-muted-foreground hover:text-foreground"
                >
                  Re-index
                </Button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
