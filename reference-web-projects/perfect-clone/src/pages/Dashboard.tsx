import { DollarSign, Users, TrendingUp, Zap, CreditCard, BarChart3, ArrowUpRight, ArrowDownRight } from "lucide-react";
import { StatCard } from "@/components/dashboard/StatCard";
import { PageHeader } from "@/components/dashboard/PageHeader";
import { StatusBadge } from "@/components/dashboard/StatusBadge";
import { mockDashboardStats, mockChartData } from "@/data/mockData";
import { formatCurrency, formatPercent, formatNumber } from "@/utils/calculations";
import { CHART_COLORS, CHART_GRID_COLOR, CHART_AXIS_COLOR, CHART_TOOLTIP_STYLE, CHART_AXIS_TICK, dateTickFormatter } from "@/utils/chartTheme";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from "recharts";

export default function Dashboard() {
  const { revenue, conversion } = mockDashboardStats;

  return (
    <div className="space-y-6 animate-fade-in">
      <PageHeader title="Revenue Multiplier Dashboard" description="Overview of your trial conversion performance and revenue growth" />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="Monthly Revenue" value={formatCurrency(revenue.mrr)} change={revenue.mrrGrowth} description="vs last month" icon={<DollarSign className="h-5 w-5" />} />
        <StatCard title="Conversion Rate" value={formatPercent(conversion.conversionRate)} change={8.3} description="vs last month" icon={<TrendingUp className="h-5 w-5" />} />
        <StatCard title="Active Trials" value={formatNumber(conversion.activeTrials)} description={`${conversion.totalTrials} total trials`} icon={<Users className="h-5 w-5" />} />
        <StatCard title="Smart Charge Rate" value={formatPercent(conversion.smartChargeSuccessRate)} change={2.1} description="success rate" icon={<Zap className="h-5 w-5" />} />
      </div>

      {/* Revenue Multiplier Highlight */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-card border border-border rounded-xl p-5 flex flex-col items-center justify-center text-center">
          <p className="text-sm text-muted-foreground mb-1">Trial Conversions</p>
          <p className="text-3xl font-bold gradient-text">+375%</p>
          <p className="text-xs text-muted-foreground mt-1">vs industry average</p>
        </div>
        <div className="bg-card border border-border rounded-xl p-5 flex flex-col items-center justify-center text-center">
          <p className="text-sm text-muted-foreground mb-1">Revenue Captured</p>
          <p className="text-3xl font-bold gradient-text">{formatCurrency(revenue.mrr)}</p>
          <p className="text-xs text-muted-foreground mt-1">this month</p>
        </div>
        <div className="bg-card border border-border rounded-xl p-5 flex flex-col items-center justify-center text-center">
          <p className="text-sm text-muted-foreground mb-1">ROI Multiplier</p>
          <p className="text-3xl font-bold gradient-text">2.8x</p>
          <p className="text-xs text-muted-foreground mt-1">return on investment</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2 bg-card border border-border rounded-xl p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold">Revenue & Conversions</h3>
            <span className="text-xs text-muted-foreground">Last 30 days</span>
          </div>
          <ResponsiveContainer width="100%" height={280}>
            <AreaChart data={mockChartData}>
              <defs>
                <linearGradient id="revGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={CHART_COLORS.primary} stopOpacity={0.3} />
                  <stop offset="95%" stopColor={CHART_COLORS.primary} stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke={CHART_GRID_COLOR} />
              <XAxis dataKey="date" tick={CHART_AXIS_TICK} stroke={CHART_AXIS_COLOR} tickFormatter={dateTickFormatter} />
              <YAxis tick={CHART_AXIS_TICK} stroke={CHART_AXIS_COLOR} />
              <Tooltip contentStyle={CHART_TOOLTIP_STYLE} />
              <Area type="monotone" dataKey="revenue" stroke={CHART_COLORS.primary} fillOpacity={1} fill="url(#revGrad)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-card border border-border rounded-xl p-5">
          <h3 className="font-semibold mb-4">Top Channels</h3>
          <div className="space-y-3">
            {mockDashboardStats.topChannels.map((ch) => (
              <div key={ch.name} className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium">{ch.name}</p>
                  <p className="text-xs text-muted-foreground">{ch.conversions} conversions</p>
                </div>
                <p className="text-sm font-semibold">{formatCurrency(ch.revenue)}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="bg-card border border-border rounded-xl p-5">
          <h3 className="font-semibold mb-4">Trials vs Conversions</h3>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={mockChartData.slice(-14)}>
              <CartesianGrid strokeDasharray="3 3" stroke={CHART_GRID_COLOR} />
              <XAxis dataKey="date" tick={CHART_AXIS_TICK} stroke={CHART_AXIS_COLOR} tickFormatter={dateTickFormatter} />
              <YAxis tick={CHART_AXIS_TICK} stroke={CHART_AXIS_COLOR} />
              <Tooltip contentStyle={CHART_TOOLTIP_STYLE} />
              <Bar dataKey="trials" fill={CHART_COLORS.blue} radius={[4, 4, 0, 0]} />
              <Bar dataKey="conversions" fill={CHART_COLORS.primary} radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-card border border-border rounded-xl p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold">Key Metrics</h3>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="p-3 rounded-lg bg-muted/50">
              <p className="text-xs text-muted-foreground">ARR</p>
              <p className="text-lg font-bold">{formatCurrency(revenue.arr)}</p>
              <div className="flex items-center gap-1 text-xs text-primary">
                <ArrowUpRight className="h-3 w-3" /> {revenue.mrrGrowth}%
              </div>
            </div>
            <div className="p-3 rounded-lg bg-muted/50">
              <p className="text-xs text-muted-foreground">Churn Rate</p>
              <p className="text-lg font-bold">{formatPercent(revenue.churnRate)}</p>
              <div className="flex items-center gap-1 text-xs text-destructive">
                <ArrowDownRight className="h-3 w-3" /> {revenue.churnRate}%
              </div>
            </div>
            <div className="p-3 rounded-lg bg-muted/50">
              <p className="text-xs text-muted-foreground">LTV</p>
              <p className="text-lg font-bold">{formatCurrency(revenue.ltv)}</p>
            </div>
            <div className="p-3 rounded-lg bg-muted/50">
              <p className="text-xs text-muted-foreground">ARPU</p>
              <p className="text-lg font-bold">{formatCurrency(revenue.arpu)}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="bg-card border border-border rounded-xl p-5">
          <h3 className="font-semibold mb-4">Recent Trials</h3>
          <div className="space-y-3">
            {mockDashboardStats.recentTrials.map((t) => (
              <div key={t.id} className="flex items-center justify-between py-2 border-b border-border/50 last:border-0">
                <div>
                  <p className="text-sm font-medium">{t.customerName}</p>
                  <p className="text-xs text-muted-foreground">{t.plan} · {t.daysRemaining}d remaining</p>
                </div>
                <StatusBadge status={t.status} />
              </div>
            ))}
          </div>
        </div>

        <div className="bg-card border border-border rounded-xl p-5">
          <h3 className="font-semibold mb-4">Recent Transactions</h3>
          <div className="space-y-3">
            {mockDashboardStats.recentTransactions.map((t) => (
              <div key={t.id} className="flex items-center justify-between py-2 border-b border-border/50 last:border-0">
                <div>
                  <p className="text-sm font-medium">{t.customerName}</p>
                  <p className="text-xs text-muted-foreground">{t.description}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-semibold">{formatCurrency(t.amount)}</p>
                  <StatusBadge status={t.status} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
