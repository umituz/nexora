import { useState } from 'react'
import type { ReactNode } from 'react'
import {
  ArrowDownToLine,
  Check,
  Code2,
  Copy,
  ExternalLink,
  Eye,
  FileSpreadsheet,
  FileText,
  Globe,
  ShieldCheck,
} from 'lucide-react'
import { Button } from '@umituz/web-design-system'
import { SAMPLE_OUTPUTS, type AgentOutputData } from './outputTypes'

interface OutputArtifactViewerProps {
  initialArtifactKey?: string
  onClose?: () => void
}

export function OutputArtifactViewer({ initialArtifactKey = 'landingPage', onClose }: OutputArtifactViewerProps): ReactNode {
  const [selectedKey, setSelectedKey] = useState<string>(initialArtifactKey)
  const [copied, setCopied] = useState(false)

  const output: AgentOutputData = SAMPLE_OUTPUTS[selectedKey] ?? SAMPLE_OUTPUTS.landingPage!

  const handleCopy = () => {
    let textToCopy = ''
    if (output.type === 'code' && output.codeContent) {
      textToCopy = output.codeContent.code
    } else if (output.type === 'webpage' && output.webContent) {
      textToCopy = output.webContent.html
    } else if (output.type === 'spreadsheet' && output.spreadsheetContent) {
      const header = output.spreadsheetContent.columns.join(',')
      const rows = output.spreadsheetContent.rows.map((r) => r.join(',')).join('\n')
      textToCopy = `${header}\n${rows}`
    } else if (output.type === 'research' && output.documentContent) {
      textToCopy = output.documentContent.markdown
    }
    void navigator.clipboard.writeText(textToCopy)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const handleDownload = () => {
    let filename = 'output.txt'
    let content = ''
    let mime = 'text/plain'

    if (output.type === 'code' && output.codeContent) {
      filename = output.codeContent.filename
      content = output.codeContent.code
      mime = 'text/typescript'
    } else if (output.type === 'webpage' && output.webContent) {
      filename = 'preview.html'
      content = output.webContent.html
      mime = 'text/html'
    } else if (output.type === 'spreadsheet' && output.spreadsheetContent) {
      filename = output.spreadsheetContent.filename
      const header = output.spreadsheetContent.columns.join(',')
      const rows = output.spreadsheetContent.rows.map((r) => r.join(',')).join('\n')
      content = `${header}\n${rows}`
      mime = 'text/csv'
    } else if (output.type === 'research' && output.documentContent) {
      filename = 'research-report.md'
      content = output.documentContent.markdown
      mime = 'text/markdown'
    }

    const blob = new Blob([content], { type: mime })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = filename
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  return (
    <div className="rounded-xl border border-border bg-card shadow-sm flex flex-col overflow-hidden">
      {/* Top Selector & Toolbar */}
      <div className="flex flex-wrap items-center justify-between border-b border-border bg-muted/30 px-4 py-3 gap-3">
        <div className="flex flex-wrap items-center gap-1.5">
          <button
            type="button"
            onClick={() => setSelectedKey('landingPage')}
            className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-medium transition-colors ${
              selectedKey === 'landingPage'
                ? 'bg-primary text-primary-foreground'
                : 'text-muted-foreground hover:bg-muted hover:text-foreground'
            }`}
          >
            <Globe size={13} />
            <span>Web Sandbox</span>
          </button>
          <button
            type="button"
            onClick={() => setSelectedKey('codeRefactor')}
            className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-medium transition-colors ${
              selectedKey === 'codeRefactor'
                ? 'bg-primary text-primary-foreground'
                : 'text-muted-foreground hover:bg-muted hover:text-foreground'
            }`}
          >
            <Code2 size={13} />
            <span>Code Artifact</span>
          </button>
          <button
            type="button"
            onClick={() => setSelectedKey('spreadsheetData')}
            className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-medium transition-colors ${
              selectedKey === 'spreadsheetData'
                ? 'bg-primary text-primary-foreground'
                : 'text-muted-foreground hover:bg-muted hover:text-foreground'
            }`}
          >
            <FileSpreadsheet size={13} />
            <span>Spreadsheet / CSV</span>
          </button>
          <button
            type="button"
            onClick={() => setSelectedKey('researchReport')}
            className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-medium transition-colors ${
              selectedKey === 'researchReport'
                ? 'bg-primary text-primary-foreground'
                : 'text-muted-foreground hover:bg-muted hover:text-foreground'
            }`}
          >
            <FileText size={13} />
            <span>Research Whitepaper</span>
          </button>
        </div>

        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={handleCopy} className="text-xs h-7">
            {copied ? <Check size={12} className="text-emerald-500 mr-1" /> : <Copy size={12} className="mr-1" />}
            {copied ? 'Copied' : 'Copy'}
          </Button>
          <Button variant="outline" size="sm" onClick={handleDownload} className="text-xs h-7">
            <ArrowDownToLine size={12} className="mr-1" />
            Download
          </Button>
          {onClose && (
            <Button variant="ghost" size="sm" onClick={onClose} className="text-xs h-7">
              Close
            </Button>
          )}
        </div>
      </div>

      {/* Artifact Header Info */}
      <div className="px-5 py-3 border-b border-border/60 bg-card flex items-center justify-between text-xs">
        <div className="flex items-center gap-2">
          <span className="font-semibold text-foreground">{output.title}</span>
          <span className="text-muted-foreground">·</span>
          <span className="text-muted-foreground uppercase text-[10px] tracking-wider font-medium">
            Format: {output.type}
          </span>
        </div>
        <span className="text-muted-foreground tabular-nums">
          {(output.sizeBytes / 1024).toFixed(1)} KB
        </span>
      </div>

      {/* Output Content Body */}
      <div className="p-5 max-h-[580px] overflow-y-auto">
        {/* WEBPAGE OUTPUT */}
        {output.type === 'webpage' && output.webContent && (
          <div className="space-y-3">
            <div className="rounded-lg border border-border overflow-hidden bg-slate-950 p-4">
              <div
                dangerouslySetInnerHTML={{ __html: output.webContent.html }}
                className="w-full"
              />
            </div>
            <p className="text-[11px] text-muted-foreground flex items-center gap-1.5">
              <Eye size={12} />
              Sandboxed live interactive preview rendered directly in the workspace canvas.
            </p>
          </div>
        )}

        {/* CODE OUTPUT */}
        {output.type === 'code' && output.codeContent && (
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs text-muted-foreground px-1">
              <span className="font-mono text-foreground font-medium">{output.codeContent.filename}</span>
              <span className="uppercase text-[10px]">{output.codeContent.language}</span>
            </div>
            <pre className="overflow-x-auto rounded-lg border border-border bg-muted/40 p-4 font-mono text-xs leading-relaxed text-foreground">
              <code>{output.codeContent.code}</code>
            </pre>
          </div>
        )}

        {/* SPREADSHEET OUTPUT */}
        {output.type === 'spreadsheet' && output.spreadsheetContent && (
          <div className="space-y-3">
            <div className="overflow-x-auto rounded-lg border border-border">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-border bg-muted/50 text-muted-foreground font-semibold">
                    {output.spreadsheetContent.columns.map((col, idx) => (
                      <th key={idx} className="py-2.5 px-3 whitespace-nowrap">
                        {col}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/60">
                  {output.spreadsheetContent.rows.map((row, rIdx) => (
                    <tr key={rIdx} className="hover:bg-muted/30 transition-colors">
                      {row.map((val, cIdx) => (
                        <td
                          key={cIdx}
                          className={`py-2 px-3 whitespace-nowrap ${
                            typeof val === 'number' ? 'tabular-nums font-mono text-right' : 'font-medium'
                          }`}
                        >
                          {val}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className="text-[11px] text-muted-foreground">
              Showing {output.spreadsheetContent.rows.length} records. Ready for instant CSV export or pipeline streaming.
            </p>
          </div>
        )}

        {/* RESEARCH DOCUMENT OUTPUT */}
        {output.type === 'research' && output.documentContent && (
          <div className="space-y-5">
            <div className="space-y-3 leading-relaxed text-xs text-foreground">
              <div className="prose dark:prose-invert max-w-none text-xs">
                <div className="whitespace-pre-line leading-relaxed font-sans">
                  {output.documentContent.markdown}
                </div>
              </div>
            </div>

            {output.documentContent.citations && output.documentContent.citations.length > 0 && (
              <div className="rounded-lg border border-border bg-muted/20 p-4 space-y-2.5">
                <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
                  <ShieldCheck size={14} className="text-emerald-500" />
                  Verified Citations & Grounding Sources ({output.documentContent.citations.length})
                </h4>
                <div className="grid gap-2 sm:grid-cols-2">
                  {output.documentContent.citations.map((cit) => (
                    <a
                      key={cit.id}
                      href={cit.url}
                      target="_blank"
                      rel="noreferrer"
                      className="rounded-md border border-border bg-card p-2.5 transition-colors hover:border-primary/50 block space-y-1"
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-mono text-primary font-medium">{cit.domain}</span>
                        <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-bold">
                          {cit.reliabilityScore}% trust
                        </span>
                      </div>
                      <p className="text-[11px] font-medium text-foreground truncate">{cit.title}</p>
                      <span className="text-[10px] text-muted-foreground flex items-center gap-1">
                        View source <ExternalLink size={9} />
                      </span>
                    </a>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
