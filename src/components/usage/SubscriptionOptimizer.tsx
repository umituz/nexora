import { useMemo, useState } from 'react'
import type { ReactNode } from 'react'
import {
  AlertTriangle,
  Bell,
  BellOff,
  DollarSign,
  Plus,
  ShieldAlert,
  Sparkles,
  TrendingDown,
  Trash2,
} from 'lucide-react'
import { Button, Input, NativeSelect } from '@umituz/web-design-system'

export interface AISubscription {
  id: string
  name: string
  provider: string
  category: 'LLM API' | 'IDE / Copilot' | 'Multimodal' | 'Cloud Infra' | 'Voice / TTS'
  priceMonthly: number
  billingCycle: 'monthly' | 'yearly'
  nextBillingDate: string
  status: 'active' | 'paused' | 'cancelled'
  expensive: boolean
  cancelReminder: boolean
  utilizationScore: number // 0 - 100%
}

const INITIAL_SUBSCRIPTIONS: AISubscription[] = [
  {
    id: 'sub-1',
    name: 'OpenAI API Tier 4',
    provider: 'OpenAI',
    category: 'LLM API',
    priceMonthly: 120.0,
    billingCycle: 'monthly',
    nextBillingDate: '2026-11-28',
    status: 'active',
    expensive: true,
    cancelReminder: true,
    utilizationScore: 84,
  },
  {
    id: 'sub-2',
    name: 'Anthropic Claude Scale',
    provider: 'Anthropic',
    category: 'LLM API',
    priceMonthly: 160.0,
    billingCycle: 'monthly',
    nextBillingDate: '2026-12-01',
    status: 'active',
    expensive: true,
    cancelReminder: false,
    utilizationScore: 92,
  },
  {
    id: 'sub-3',
    name: 'Cursor Pro Team',
    provider: 'Anysphere',
    category: 'IDE / Copilot',
    priceMonthly: 40.0,
    billingCycle: 'monthly',
    nextBillingDate: '2026-12-05',
    status: 'active',
    expensive: false,
    cancelReminder: false,
    utilizationScore: 78,
  },
  {
    id: 'sub-4',
    name: 'ElevenLabs Creator',
    provider: 'ElevenLabs',
    category: 'Voice / TTS',
    priceMonthly: 22.0,
    billingCycle: 'monthly',
    nextBillingDate: '2026-11-20',
    status: 'active',
    expensive: false,
    cancelReminder: true,
    utilizationScore: 35, // low utilization
  },
  {
    id: 'sub-5',
    name: 'Midjourney Mega Plan',
    provider: 'Midjourney',
    category: 'Multimodal',
    priceMonthly: 60.0,
    billingCycle: 'monthly',
    nextBillingDate: '2026-11-25',
    status: 'active',
    expensive: true,
    cancelReminder: true,
    utilizationScore: 24, // low utilization leak!
  },
  {
    id: 'sub-6',
    name: 'GitHub Copilot Business',
    provider: 'GitHub',
    category: 'IDE / Copilot',
    priceMonthly: 19.0,
    billingCycle: 'monthly',
    nextBillingDate: '2026-12-10',
    status: 'active',
    expensive: false,
    cancelReminder: false,
    utilizationScore: 88,
  },
]

export function SubscriptionOptimizer(): ReactNode {
  const [subscriptions, setSubscriptions] = useState<AISubscription[]>(INITIAL_SUBSCRIPTIONS)
  const [filter, setFilter] = useState<'all' | 'expensive' | 'lowUtilization'>('all')
  const [showAddModal, setShowAddModal] = useState(false)

  // New subscription state
  const [newName, setNewName] = useState('')
  const [newProvider, setNewProvider] = useState('')
  const [newPrice, setNewPrice] = useState('20')
  const [newCategory, setNewCategory] = useState<AISubscription['category']>('LLM API')

  const totalMonthly = useMemo(
    () => subscriptions.filter((s) => s.status === 'active').reduce((sum, s) => sum + s.priceMonthly, 0),
    [subscriptions],
  )
  const totalAnnual = totalMonthly * 12
  const expensiveCount = subscriptions.filter((s) => s.expensive && s.status === 'active').length
  const lowUtilizationCount = subscriptions.filter((s) => s.utilizationScore < 40 && s.status === 'active').length

  const filtered = useMemo(() => {
    return subscriptions.filter((s) => {
      if (filter === 'expensive') return s.expensive
      if (filter === 'lowUtilization') return s.utilizationScore < 40
      return true
    })
  }, [subscriptions, filter])

  const toggleReminder = (id: string) => {
    setSubscriptions((prev) =>
      prev.map((s) => (s.id === id ? { ...s, cancelReminder: !s.cancelReminder } : s)),
    )
  }

  const deleteSub = (id: string) => {
    setSubscriptions((prev) => prev.filter((s) => s.id !== id))
  }

  const handleAddSubscription = () => {
    if (!newName.trim()) return
    const price = parseFloat(newPrice) || 0
    const newSub: AISubscription = {
      id: `sub-${Date.now()}`,
      name: newName.trim(),
      provider: newProvider.trim() || 'Custom Provider',
      category: newCategory,
      priceMonthly: price,
      billingCycle: 'monthly',
      nextBillingDate: new Date(Date.now() + 30 * 86400000).toISOString().split('T')[0] ?? '2026-12-15',
      status: 'active',
      expensive: price >= 50,
      cancelReminder: false,
      utilizationScore: 80,
    }
    setSubscriptions((prev) => [newSub, ...prev])
    setNewName('')
    setNewProvider('')
    setNewPrice('20')
    setShowAddModal(false)
  }

  return (
    <div className="space-y-6">
      {/* Top Telemetry KPI Cards */}
      <div className="grid gap-4 sm:grid-cols-4">
        <div className="rounded-xl border border-border bg-card p-5">
          <div className="flex items-center justify-between text-xs text-muted-foreground font-medium uppercase tracking-wider">
            <span>Total AI Monthly</span>
            <DollarSign size={14} className="text-primary" />
          </div>
          <p className="mt-2 text-2xl font-bold tabular-nums text-foreground">${totalMonthly.toFixed(2)}</p>
          <p className="mt-1 text-xs text-muted-foreground">Projected: ${totalAnnual.toFixed(2)}/yr</p>
        </div>

        <div className="rounded-xl border border-border bg-card p-5">
          <div className="flex items-center justify-between text-xs text-muted-foreground font-medium uppercase tracking-wider">
            <span>Cost Leaks Flagged</span>
            <AlertTriangle size={14} className="text-amber-500" />
          </div>
          <p className="mt-2 text-2xl font-bold tabular-nums text-amber-500">{expensiveCount}</p>
          <p className="mt-1 text-xs text-muted-foreground">Subscriptions &gt; $50/mo</p>
        </div>

        <div className="rounded-xl border border-border bg-card p-5">
          <div className="flex items-center justify-between text-xs text-muted-foreground font-medium uppercase tracking-wider">
            <span>Underutilized Tools</span>
            <ShieldAlert size={14} className="text-rose-500" />
          </div>
          <p className="mt-2 text-2xl font-bold tabular-nums text-rose-500">{lowUtilizationCount}</p>
          <p className="mt-1 text-xs text-muted-foreground">&lt; 40% monthly utilization</p>
        </div>

        <div className="rounded-xl border border-border bg-card p-5">
          <div className="flex items-center justify-between text-xs text-muted-foreground font-medium uppercase tracking-wider">
            <span>Est. Monthly Savings</span>
            <TrendingDown size={14} className="text-emerald-500" />
          </div>
          <p className="mt-2 text-2xl font-bold tabular-nums text-emerald-600 dark:text-emerald-400">$82.00/mo</p>
          <p className="mt-1 text-xs text-muted-foreground">By consolidating underutilized tiers</p>
        </div>
      </div>

      {/* AI Cost Optimizer Insight Banner (inspired by OpenClaw) */}
      <div className="rounded-xl border border-primary/30 bg-gradient-to-r from-primary/5 via-card to-emerald-500/5 p-5 space-y-3">
        <div className="flex items-start gap-3">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
            <Sparkles size={18} />
          </div>
          <div className="space-y-1">
            <h3 className="text-sm font-semibold text-foreground">AI Cost Optimization Recommendations</h3>
            <p className="text-xs text-muted-foreground leading-relaxed">
              OpenClaw analysis detected <strong>Midjourney ($60/mo)</strong> and <strong>ElevenLabs ($22/mo)</strong> have fallen below 35% utilization over the past 30 days. Downgrading or consolidating these into on-demand API tokens would reclaim <strong className="text-emerald-600 dark:text-emerald-400">$82.00/mo ($984/yr)</strong>.
            </p>
          </div>
        </div>
      </div>

      {/* Subscription Table Controls */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-1.5">
          <button
            type="button"
            onClick={() => setFilter('all')}
            className={`rounded-lg px-3 py-1.5 text-xs font-medium transition-colors ${
              filter === 'all'
                ? 'bg-primary text-primary-foreground shadow-sm'
                : 'bg-muted/70 text-muted-foreground hover:bg-muted hover:text-foreground'
            }`}
          >
            All Subscriptions ({subscriptions.length})
          </button>
          <button
            type="button"
            onClick={() => setFilter('expensive')}
            className={`rounded-lg px-3 py-1.5 text-xs font-medium transition-colors ${
              filter === 'expensive'
                ? 'bg-primary text-primary-foreground shadow-sm'
                : 'bg-muted/70 text-muted-foreground hover:bg-muted hover:text-foreground'
            }`}
          >
            High Cost ({expensiveCount})
          </button>
          <button
            type="button"
            onClick={() => setFilter('lowUtilization')}
            className={`rounded-lg px-3 py-1.5 text-xs font-medium transition-colors ${
              filter === 'lowUtilization'
                ? 'bg-primary text-primary-foreground shadow-sm'
                : 'bg-muted/70 text-muted-foreground hover:bg-muted hover:text-foreground'
            }`}
          >
            Underutilized Leaks ({lowUtilizationCount})
          </button>
        </div>

        <Button size="sm" onClick={() => setShowAddModal(!showAddModal)} className="text-xs h-8">
          <Plus size={13} className="mr-1" />
          Track AI Tool
        </Button>
      </div>

      {/* Add Subscription Form (when toggled) */}
      {showAddModal && (
        <div className="rounded-xl border border-border bg-card p-5 space-y-4">
          <h3 className="text-sm font-semibold text-foreground">Track New AI SaaS / API Subscription</h3>
          <div className="grid gap-3 sm:grid-cols-4">
            <Input
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              placeholder="Subscription Name (e.g. Cursor Pro)"
              aria-label="Subscription Name"
              className="h-9 text-xs"
            />
            <Input
              value={newProvider}
              onChange={(e) => setNewProvider(e.target.value)}
              placeholder="Provider (e.g. OpenAI, Anthropic)"
              aria-label="Provider"
              className="h-9 text-xs"
            />
            <Input
              value={newPrice}
              onChange={(e) => setNewPrice(e.target.value)}
              placeholder="Monthly Price ($)"
              type="number"
              aria-label="Monthly Price"
              className="h-9 text-xs"
            />
            <NativeSelect
              value={newCategory}
              onChange={(e) => setNewCategory(e.target.value as AISubscription['category'])}
              options={[
                { value: 'LLM API', label: 'LLM API' },
                { value: 'IDE / Copilot', label: 'IDE / Copilot' },
                { value: 'Multimodal', label: 'Multimodal' },
                { value: 'Cloud Infra', label: 'Cloud Infra' },
                { value: 'Voice / TTS', label: 'Voice / TTS' },
              ]}
              aria-label="Category"
            />
          </div>
          <div className="flex justify-end gap-2">
            <Button variant="outline" size="sm" onClick={() => setShowAddModal(false)} className="text-xs h-8">
              Cancel
            </Button>
            <Button size="sm" onClick={handleAddSubscription} className="text-xs h-8">
              Save Subscription
            </Button>
          </div>
        </div>
      )}

      {/* Subscriptions Table */}
      <div className="overflow-x-auto rounded-xl border border-border bg-card">
        <table className="w-full text-left text-xs">
          <thead>
            <tr className="border-b border-border text-muted-foreground font-semibold">
              <th className="py-3 pl-4 pr-3">Subscription</th>
              <th className="py-3 px-3">Category</th>
              <th className="py-3 px-3">Monthly Cost</th>
              <th className="py-3 px-3">Utilization</th>
              <th className="py-3 px-3">Next Renewal</th>
              <th className="py-3 px-3 text-center">Cancel Reminder</th>
              <th className="py-3 pr-4 pl-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border/60">
            {filtered.map((sub) => (
              <tr key={sub.id} className="hover:bg-muted/30 transition-colors">
                <td className="py-3 pl-4 pr-3">
                  <div className="flex items-center gap-2">
                    <div>
                      <div className="flex items-center gap-2 font-semibold text-foreground">
                        <span>{sub.name}</span>
                        {sub.expensive && (
                          <span className="rounded bg-rose-500/10 px-1.5 py-0.5 text-[9px] font-bold text-rose-500 uppercase">
                            High Cost
                          </span>
                        )}
                      </div>
                      <span className="text-[11px] text-muted-foreground">{sub.provider}</span>
                    </div>
                  </div>
                </td>
                <td className="py-3 px-3">
                  <span className="rounded-md bg-muted px-2 py-0.5 text-[10px] font-medium text-foreground">
                    {sub.category}
                  </span>
                </td>
                <td className="py-3 px-3 font-bold tabular-nums text-foreground">
                  ${sub.priceMonthly.toFixed(2)}/mo
                </td>
                <td className="py-3 px-3">
                  <div className="space-y-1 max-w-[120px]">
                    <div className="flex items-center justify-between text-[10px]">
                      <span className={sub.utilizationScore < 40 ? 'text-rose-500 font-bold' : 'text-muted-foreground'}>
                        {sub.utilizationScore}% active
                      </span>
                    </div>
                    <div className="h-1.5 w-full overflow-hidden rounded-full bg-muted">
                      <div
                        className={`h-full rounded-full ${
                          sub.utilizationScore < 40
                            ? 'bg-rose-500'
                            : sub.utilizationScore < 70
                              ? 'bg-amber-500'
                              : 'bg-emerald-500'
                        }`}
                        style={{ width: `${sub.utilizationScore}%` }}
                      />
                    </div>
                  </div>
                </td>
                <td className="py-3 px-3 tabular-nums text-muted-foreground">
                  {sub.nextBillingDate}
                </td>
                <td className="py-3 px-3 text-center">
                  <button
                    type="button"
                    onClick={() => toggleReminder(sub.id)}
                    className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[11px] font-medium transition-colors ${
                      sub.cancelReminder
                        ? 'bg-primary/10 text-primary border border-primary/30'
                        : 'text-muted-foreground hover:bg-muted'
                    }`}
                  >
                    {sub.cancelReminder ? <Bell size={12} /> : <BellOff size={12} />}
                    <span>{sub.cancelReminder ? 'Reminder Set' : 'Off'}</span>
                  </button>
                </td>
                <td className="py-3 pr-4 pl-3 text-right">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => deleteSub(sub.id)}
                    className="h-7 w-7 text-muted-foreground hover:text-destructive"
                    title="Remove"
                  >
                    <Trash2 size={12} />
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
