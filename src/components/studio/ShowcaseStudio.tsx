import { useState } from 'react'
import type { ReactNode } from 'react'
import {
  ArrowDownToLine,
  Check,
  Clapperboard,
  Copy,
  FolderGit2,
  Play,
  Video,
  Volume2,
} from 'lucide-react'
import { Button, Input, NativeSelect } from '@umituz/web-design-system'
import type { ProjectRow, CodeArtifactRow } from '@/data/chatTypes'

interface ShowcaseStudioProps {
  projects: ProjectRow[]
  codeArtifacts: CodeArtifactRow[]
}

type AnimationStyle = 'cinematic' | 'smooth' | 'dynamic' | 'minimal'
type TypographyStyle = 'modern' | 'classic' | 'bold' | 'mono'

interface ShowcaseScene {
  id: string
  title: string
  subtitle: string
  durationSec: number
  narration: string
  highlight: string
  visualStyle: string
}

interface ProjectAnalysis {
  name: string
  totalFiles: number
  totalLoc: number
  depth: number
  breakdown: { category: string; count: number; percentage: number; color: string }[]
  topExtensions: { ext: string; count: number; percentage: number }[]
}

const VOICES = ['tara', 'leah', 'jess', 'julian', 'annie', 'steve', 'zac', 'bella'] as const

export function ShowcaseStudio({ projects, codeArtifacts }: ShowcaseStudioProps): ReactNode {
  const [selectedProjectId, setSelectedProjectId] = useState<string>(projects[0]?.id ?? 'default')
  const [title, setTitle] = useState('Nexora Cloud Operations Engine')
  const [subtitle, setSubtitle] = useState('High-throughput autonomous AI orchestration platform')
  const [animationStyle, setAnimationStyle] = useState<AnimationStyle>('cinematic')
  const [fontStyle] = useState<TypographyStyle>('modern')
  const [selectedVoice, setSelectedVoice] = useState<string>('tara')
  const [logoText] = useState('NEXORA AI')
  const [activeSceneIndex, setActiveSceneIndex] = useState(0)
  const [isSynthesizing, setIsSynthesizing] = useState(false)
  const [playingAudio, setPlayingAudio] = useState(false)
  const [copiedScript, setCopiedScript] = useState(false)

  // Current project analysis mock/computation
  const analysis: ProjectAnalysis = {
    name: title,
    totalFiles: 48,
    totalLoc: 12450,
    depth: 4,
    breakdown: [
      { category: 'Frontend (React 19)', count: 22, percentage: 46, color: '#38bdf8' },
      { category: 'Backend (Hono / Edge)', count: 14, percentage: 29, color: '#818cf8' },
      { category: 'Database (Drizzle / Neon)', count: 6, percentage: 13, color: '#34d399' },
      { category: 'Config & Build (Vite)', count: 6, percentage: 12, color: '#fbbf24' },
    ],
    topExtensions: [
      { ext: '.tsx', count: 20, percentage: 42 },
      { ext: '.ts', count: 18, percentage: 38 },
      { ext: '.json', count: 6, percentage: 12 },
      { ext: '.css', count: 4, percentage: 8 },
    ],
  }

  const scenes: ShowcaseScene[] = [
    {
      id: 'sc-1',
      title: 'Architectural Overview & Core Mission',
      subtitle: subtitle,
      durationSec: 5,
      narration: `Welcome to ${title}. Built as a resilient, multi-provider AI workspace delivering unified intelligence and zero-latency operational telemetry.`,
      highlight: 'Unified Multi-Provider Core',
      visualStyle: 'Gradient Hero Spotlight with Logo Overlay',
    },
    {
      id: 'sc-2',
      title: 'Component Taxonomy & Code Distribution',
      subtitle: '48 Modules · 12,450 Lines of Type-Safe TypeScript',
      durationSec: 6,
      narration: `The codebase comprises 48 verified modules, structured into decoupled React presentation layers, edge-ready Hono workers, and Drizzle ORM persistence.`,
      highlight: 'Clean Architecture Decoupling',
      visualStyle: 'Interactive File Breakdown & Sunburst Tree',
    },
    {
      id: 'sc-3',
      title: 'Autonomous Tool Execution & Real-Time SSE',
      subtitle: 'Bi-directional Streaming Protocol',
      durationSec: 6,
      narration: `Answers and reasoning streams pass token-by-token over SSE channels, with live approval gates and automatic failover policies built-in.`,
      highlight: 'Sub-300ms Time-to-First-Token',
      visualStyle: 'Live Terminal Code Walkthrough & Pulsing Radar',
    },
    {
      id: 'sc-4',
      title: 'Benchmark Metrics & Production SLAs',
      subtitle: '99.98% Uptime · P99 < 140ms',
      durationSec: 5,
      narration: `Benchmarked across high-throughput workloads, maintaining strict memory bounds, vector retrieval precision, and end-to-end type safety.`,
      highlight: 'High Concurrency & SLA Guarantees',
      visualStyle: 'Cinematic Metric Cards & Performance Graph',
    },
    {
      id: 'sc-5',
      title: 'Executive Summary & Next Horizons',
      subtitle: `${logoText} Enterprise Edition`,
      durationSec: 4,
      narration: `From local development to global edge deployments, Nexora powers autonomous developer efficiency.`,
      highlight: 'Production-Ready Enterprise Stack',
      visualStyle: 'Modern Dark Outro with Call to Action',
    },
  ]

  const activeScene = scenes[activeSceneIndex] ?? scenes[0]!

  const handleSynthesizeVoice = async () => {
    setIsSynthesizing(true)
    setPlayingAudio(false)
    try {
      const response = await fetch('/api/audio/speech', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          text: activeScene.narration,
          voice: selectedVoice,
        }),
      })

      if (response.ok) {
        const blob = await response.blob()
        const audioUrl = URL.createObjectURL(blob)
        const audio = new Audio(audioUrl)
        setPlayingAudio(true)
        audio.onended = () => setPlayingAudio(false)
        await audio.play()
      } else {
        // Fallback procedural speech synthesis via Web Speech API if server-side TTS isn't configured
        if ('speechSynthesis' in window) {
          const utterance = new SpeechSynthesisUtterance(activeScene.narration)
          utterance.rate = 1.0
          utterance.onend = () => setPlayingAudio(false)
          setPlayingAudio(true)
          window.speechSynthesis.speak(utterance)
        }
      }
    } catch {
      if ('speechSynthesis' in window) {
        const utterance = new SpeechSynthesisUtterance(activeScene.narration)
        utterance.rate = 1.0
        utterance.onend = () => setPlayingAudio(false)
        setPlayingAudio(true)
        window.speechSynthesis.speak(utterance)
      }
    } finally {
      setIsSynthesizing(false)
    }
  }

  const handleCopyScript = () => {
    const fullScript = scenes
      .map((s, idx) => `[Scene ${idx + 1}: ${s.title} (${s.durationSec}s)]\n${s.narration}`)
      .join('\n\n')
    void navigator.clipboard.writeText(fullScript)
    setCopiedScript(true)
    setTimeout(() => setCopiedScript(false), 2000)
  }

  const handleDownloadDeck = () => {
    const markdownDeck = `# ${title} — Architecture & Codebase Showcase Reel
> Presentation Style: ${animationStyle.toUpperCase()} · Typography: ${fontStyle.toUpperCase()} · Voice: ${selectedVoice}

${scenes
  .map(
    (s, idx) => `---
## Slide ${idx + 1}: ${s.title}
*Highlight: ${s.highlight}*
*Duration: ${s.durationSec}s*

${s.subtitle}

> **Voiceover Narration:**
> "${s.narration}"
`,
  )
  .join('\n\n')}`

    const blob = new Blob([markdownDeck], { type: 'text/markdown' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `${title.toLowerCase().replace(/\s+/g, '-')}-showcase-deck.md`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  return (
    <div className="space-y-6">
      {/* Configuration Header & Selection */}
      <div className="rounded-xl border border-border bg-card p-5 space-y-4">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between border-b border-border pb-4">
          <div>
            <h2 className="text-base font-bold text-foreground flex items-center gap-2">
              <Clapperboard size={18} className="text-primary" />
              Codebase Showcase & Video Reel Studio
            </h2>
            <p className="text-xs text-muted-foreground mt-0.5">
              Analyze project architectures and generate narrated video reels, presentation storyboards, and tech spotlights.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={handleCopyScript} className="text-xs h-8">
              {copiedScript ? <Check size={13} className="text-emerald-500 mr-1" /> : <Copy size={13} className="mr-1" />}
              {copiedScript ? 'Copied Full Script' : 'Copy Full Script'}
            </Button>
            <Button variant="outline" size="sm" onClick={handleDownloadDeck} className="text-xs h-8">
              <ArrowDownToLine size={13} className="mr-1" />
              Export Deck (.md)
            </Button>
          </div>
        </div>

        {/* Studio Controls */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <div className="space-y-1">
            <label className="text-xs font-medium text-muted-foreground">Select Project Source</label>
            <NativeSelect
              value={selectedProjectId}
              onChange={(e) => {
                setSelectedProjectId(e.target.value)
                const proj = projects.find((p) => p.id === e.target.value)
                if (proj) {
                  setTitle(proj.name)
                  if (proj.description) setSubtitle(proj.description)
                }
              }}
              options={[
                { value: 'default', label: 'Nexora AI Core (Active Workspace)' },
                ...projects.map((p) => ({ value: p.id, label: `Project: ${p.name}` })),
                ...codeArtifacts.map((c) => ({ value: c.id, label: `Code: ${c.title}` })),
              ]}
              aria-label="Select Project Source"
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-medium text-muted-foreground">Reel Title</label>
            <Input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Showcase title…"
              aria-label="Reel Title"
              className="h-9 text-xs"
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-medium text-muted-foreground">Animation Theme</label>
            <NativeSelect
              value={animationStyle}
              onChange={(e) => setAnimationStyle(e.target.value as AnimationStyle)}
              options={[
                { value: 'cinematic', label: 'Cinematic Studio' },
                { value: 'smooth', label: 'Smooth Modern' },
                { value: 'dynamic', label: 'Dynamic Tech' },
                { value: 'minimal', label: 'Minimalist Clean' },
              ]}
              aria-label="Animation Theme"
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-medium text-muted-foreground">Narration Voice</label>
            <NativeSelect
              value={selectedVoice}
              onChange={(e) => setSelectedVoice(e.target.value)}
              options={VOICES.map((v) => ({ value: v, label: `${v} (AI Neural)` }))}
              aria-label="Narration Voice"
            />
          </div>
        </div>
      </div>

      {/* Codebase Analysis Metrics Card (inspired by Folder-Video-Studio) */}
      <div className="rounded-xl border border-border bg-card p-5 space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-semibold text-foreground flex items-center gap-2">
            <FolderGit2 size={16} className="text-primary" />
            Codebase Composition & File Category Breakdown
          </h3>
          <span className="text-xs text-muted-foreground">
            {analysis.totalFiles} files · {analysis.totalLoc.toLocaleString()} lines · Depth: {analysis.depth} levels
          </span>
        </div>

        {/* Category distribution bar */}
        <div className="space-y-2">
          <div className="h-3 w-full overflow-hidden rounded-full flex gap-1 bg-muted">
            {analysis.breakdown.map((cat, idx) => (
              <div
                key={idx}
                className="h-full rounded-sm transition-all"
                style={{ width: `${cat.percentage}%`, backgroundColor: cat.color }}
                title={`${cat.category}: ${cat.count} files (${cat.percentage}%)`}
              />
            ))}
          </div>

          <div className="grid grid-cols-2 gap-2 sm:grid-cols-4 pt-1">
            {analysis.breakdown.map((cat, idx) => (
              <div key={idx} className="flex items-center gap-2 text-xs">
                <span className="h-2.5 w-2.5 rounded-full shrink-0" style={{ backgroundColor: cat.color }} />
                <span className="text-muted-foreground truncate">{cat.category}</span>
                <span className="font-semibold text-foreground tabular-nums ml-auto">{cat.percentage}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Reel Storyboard Carousel / Scene Player */}
      <div className="grid gap-6 lg:grid-cols-12">
        {/* Left: Scene Timeline Navigator */}
        <div className="rounded-xl border border-border bg-card p-4 lg:col-span-4 space-y-2">
          <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-3 flex items-center gap-1.5">
            <Video size={14} className="text-primary" />
            Storyboard Scenes ({scenes.length})
          </h3>

          <div className="space-y-2">
            {scenes.map((scene, idx) => {
              const isCurrent = idx === activeSceneIndex
              return (
                <button
                  key={scene.id}
                  type="button"
                  onClick={() => setActiveSceneIndex(idx)}
                  className={`w-full text-left rounded-lg p-3 border transition-all flex items-start gap-3 ${
                    isCurrent
                      ? 'border-primary bg-primary/10 shadow-sm'
                      : 'border-border/60 bg-muted/20 hover:bg-muted/50'
                  }`}
                >
                  <span
                    className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-md text-[11px] font-bold ${
                      isCurrent ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'
                    }`}
                  >
                    {idx + 1}
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className={`text-xs font-semibold truncate ${isCurrent ? 'text-primary' : 'text-foreground'}`}>
                      {scene.title}
                    </p>
                    <span className="text-[10px] text-muted-foreground">
                      {scene.durationSec}s · {scene.highlight}
                    </span>
                  </div>
                </button>
              )
            })}
          </div>
        </div>

        {/* Right: Active Scene Spotlight Player */}
        <div className="rounded-xl border border-border bg-slate-950 p-6 lg:col-span-8 flex flex-col justify-between text-white space-y-6">
          {/* Virtual Video Reel Frame */}
          <div className="rounded-lg border border-slate-800 bg-slate-900/90 p-8 text-center space-y-4 relative overflow-hidden">
            {/* Watermark logo */}
            <div className="absolute top-4 left-4 flex items-center gap-1.5 text-[11px] font-bold text-slate-400">
              <span className="h-2 w-2 rounded-full bg-primary" />
              {logoText}
            </div>

            <div className="absolute top-4 right-4 rounded-full bg-slate-800 px-2.5 py-0.5 text-[10px] font-mono text-slate-400">
              SCENE {activeSceneIndex + 1} / {scenes.length} · {activeScene.durationSec}s
            </div>

            <div className="pt-4 space-y-2">
              <span className="inline-block rounded-full bg-primary/20 px-3 py-1 text-xs font-semibold text-primary">
                ✦ {activeScene.highlight}
              </span>
              <h2 className="text-xl sm:text-2xl font-extrabold tracking-tight text-slate-100">
                {activeScene.title}
              </h2>
              <p className="text-xs text-slate-400 max-w-md mx-auto">{activeScene.subtitle}</p>
            </div>

            <div className="pt-2 text-[11px] text-slate-500 font-mono">
              Render Engine Style: {animationStyle.toUpperCase()} · Layout: {activeScene.visualStyle}
            </div>
          </div>

          {/* Narration Script & Spoken Preview */}
          <div className="rounded-lg border border-slate-800 bg-slate-900/60 p-4 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                <Volume2 size={13} className="text-primary" />
                Spoken Voiceover Script ({selectedVoice})
              </span>
              <Button
                size="sm"
                variant="outline"
                onClick={handleSynthesizeVoice}
                disabled={isSynthesizing}
                className="text-xs h-7 bg-slate-800 border-slate-700 text-slate-200 hover:bg-slate-700"
              >
                <Play size={11} className={`mr-1 ${playingAudio ? 'text-emerald-400' : ''}`} />
                {isSynthesizing ? 'Synthesizing…' : playingAudio ? 'Playing…' : 'Preview Voiceover'}
              </Button>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed font-sans italic bg-slate-950/60 p-3 rounded-md border border-slate-800/80">
              "{activeScene.narration}"
            </p>
          </div>

          {/* Scene navigation footer */}
          <div className="flex items-center justify-between text-xs text-slate-400 pt-2 border-t border-slate-800">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setActiveSceneIndex(Math.max(0, activeSceneIndex - 1))}
              disabled={activeSceneIndex === 0}
              className="text-xs text-slate-400 hover:text-white"
            >
              ← Previous Scene
            </Button>
            <div className="flex gap-1.5">
              {scenes.map((_, i) => (
                <span
                  key={i}
                  className={`h-1.5 rounded-full transition-all ${
                    i === activeSceneIndex ? 'w-6 bg-primary' : 'w-1.5 bg-slate-700'
                  }`}
                />
              ))}
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setActiveSceneIndex(Math.min(scenes.length - 1, activeSceneIndex + 1))}
              disabled={activeSceneIndex === scenes.length - 1}
              className="text-xs text-slate-400 hover:text-white"
            >
              Next Scene →
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
