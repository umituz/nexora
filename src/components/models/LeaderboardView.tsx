import { useMemo, useState } from 'react'
import type { ReactNode } from 'react'
import {
  ArrowDownRight,
  ArrowUpRight,
  Crown,
  Flame,
  Globe2,
  Lock,
  Minus,
} from 'lucide-react'
import { Input } from '@umituz/web-design-system'
import { LEADERBOARD_DATA, type LeaderboardItem } from './benchmarkData'

export function LeaderboardView(): ReactNode {
  const [search, setSearch] = useState('')
  const [selectedCategory, setSelectedCategory] = useState<string>('all')

  const categories = ['all', 'Reasoning', 'Coding', 'Vision', 'Lightweight', 'General']

  const filtered = useMemo(() => {
    return LEADERBOARD_DATA.filter((item) => {
      const matchesSearch =
        item.modelName.toLowerCase().includes(search.toLowerCase()) ||
        item.provider.toLowerCase().includes(search.toLowerCase())
      const matchesCat = selectedCategory === 'all' || item.category === selectedCategory
      return matchesSearch && matchesCat
    })
  }, [search, selectedCategory])

  return (
    <div className="space-y-6">
      {/* Top 3 Metric Highlights */}
      <div className="grid gap-4 sm:grid-cols-3">
        <div className="rounded-xl border border-primary/20 bg-card p-4">
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <span>Overall #1 Leader</span>
            <Crown size={15} className="text-amber-500" />
          </div>
          <p className="mt-2 text-lg font-bold text-foreground">Claude 3.7 Sonnet</p>
          <p className="mt-0.5 text-xs text-muted-foreground">Arena Elo 1368 · 93.8% HumanEval</p>
        </div>

        <div className="rounded-xl border border-border bg-card p-4">
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <span>Best Open-Weights</span>
            <Globe2 size={15} className="text-emerald-500" />
          </div>
          <p className="mt-2 text-lg font-bold text-foreground">DeepSeek R1</p>
          <p className="mt-0.5 text-xs text-muted-foreground">Arena Elo 1335 · 91.0% HumanEval</p>
        </div>

        <div className="rounded-xl border border-border bg-card p-4">
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <span>Best Throughput & Value</span>
            <Flame size={15} className="text-rose-500" />
          </div>
          <p className="mt-2 text-lg font-bold text-foreground">Gemini 2.0 Flash</p>
          <p className="mt-0.5 text-xs text-muted-foreground">$0.15/M input · 1M Context Window</p>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-wrap gap-1.5">
          {categories.map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => setSelectedCategory(cat)}
              className={`rounded-lg px-3 py-1.5 text-xs font-medium transition-colors ${
                selectedCategory === cat
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-muted/70 text-muted-foreground hover:bg-muted hover:text-foreground'
              }`}
            >
              {cat === 'all' ? 'All Models' : cat}
            </button>
          ))}
        </div>

        <div className="relative w-full sm:w-64">
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search leaderboard…"
            aria-label="Search leaderboard"
            className="h-9 text-xs"
          />
        </div>
      </div>

      {/* Leaderboard Table */}
      <div className="overflow-x-auto rounded-xl border border-border bg-card">
        <table className="w-full text-left text-xs">
          <thead>
            <tr className="border-b border-border text-muted-foreground">
              <th className="py-3 pl-4 pr-2 font-medium">Rank</th>
              <th className="py-3 px-3 font-medium">Model</th>
              <th className="py-3 px-3 font-medium">Category</th>
              <th className="py-3 px-3 font-semibold text-right">Arena Elo</th>
              <th className="py-3 px-3 font-medium text-right">HumanEval</th>
              <th className="py-3 px-3 font-medium text-right">MMLU</th>
              <th className="py-3 px-3 font-medium text-right">MATH</th>
              <th className="py-3 px-3 font-medium text-right">Context</th>
              <th className="py-3 pr-4 pl-3 font-medium text-right">Pricing (In/Out)</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border/60">
            {filtered.map((item: LeaderboardItem) => (
              <tr key={item.id} className="transition-colors hover:bg-muted/30">
                <td className="py-3 pl-4 pr-2 font-medium">
                  <div className="flex items-center gap-1.5">
                    <span
                      className={`flex h-6 w-6 items-center justify-center rounded-full text-[11px] font-bold ${
                        item.rank === 1
                          ? 'bg-amber-500/15 text-amber-600 dark:text-amber-400'
                          : item.rank === 2
                            ? 'bg-slate-300/40 text-slate-700 dark:text-slate-300'
                            : item.rank === 3
                              ? 'bg-amber-700/15 text-amber-700 dark:text-amber-500'
                              : 'text-muted-foreground'
                      }`}
                    >
                      {item.rank}
                    </span>
                    {item.rankChange > 0 ? (
                      <span className="flex items-center text-[10px] font-semibold text-emerald-600 dark:text-emerald-400">
                        <ArrowUpRight size={12} />
                        {item.rankChange}
                      </span>
                    ) : item.rankChange < 0 ? (
                      <span className="flex items-center text-[10px] font-semibold text-rose-500">
                        <ArrowDownRight size={12} />
                        {Math.abs(item.rankChange)}
                      </span>
                    ) : (
                      <span className="flex items-center text-[10px] text-muted-foreground">
                        <Minus size={10} />
                      </span>
                    )}
                  </div>
                </td>
                <td className="py-3 px-3">
                  <div>
                    <div className="flex items-center gap-1.5 font-semibold text-foreground">
                      <span>{item.modelName}</span>
                      {item.openWeights ? (
                        <span title="Open Weights" className="text-emerald-600 dark:text-emerald-400">
                          <Globe2 size={12} />
                        </span>
                      ) : (
                        <span title="Proprietary API" className="text-muted-foreground">
                          <Lock size={12} />
                        </span>
                      )}
                    </div>
                    <span className="text-[11px] text-muted-foreground">{item.provider}</span>
                  </div>
                </td>
                <td className="py-3 px-3">
                  <span className="rounded-md bg-muted px-2 py-0.5 text-[10px] font-medium text-foreground">
                    {item.category}
                  </span>
                </td>
                <td className="py-3 px-3 text-right font-bold tabular-nums text-foreground">{item.arenaElo}</td>
                <td className="py-3 px-3 text-right font-medium tabular-nums">{item.humanEval}%</td>
                <td className="py-3 px-3 text-right font-medium tabular-nums">{item.mmlu}%</td>
                <td className="py-3 px-3 text-right font-medium tabular-nums">{item.mathScore}%</td>
                <td className="py-3 px-3 text-right font-medium tabular-nums text-muted-foreground">
                  {item.contextWindow}
                </td>
                <td className="py-3 pr-4 pl-3 text-right tabular-nums text-muted-foreground">
                  {item.inputCost} · {item.outputCost}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
