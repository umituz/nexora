import { PageHeader } from "@/components/dashboard/PageHeader";
import { StatCard } from "@/components/dashboard/StatCard";
import { mockDashboardStats, mockChartData } from "@/data/mockData";
import { formatCurrency, formatPercent } from "@/utils/calculations";
import { DollarSign, TrendingUp, Percent } from "lucide-react";
import { CHART_COLORS, CHART_GRID_COLOR, CHART_AXIS_COLOR, CHART_TOOLTIP_STYLE, CHART_AXIS_TICK, dateTickFormatter } from "@/utils/chartTheme";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

export default function Revenue() {
  const { revenue } = mockDashboardStats;

  return (
    <div className="space-y-6 animate-fade-in">
      <PageHeader title="Revenue" description="Track your revenue growth and metrics" />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="MRR" value={formatCurrency(revenue.mrr)} change={revenue.mrrGrowth} icon={<DollarSign className="h-5 w-5" />} />
        <StatCard title="ARR" value={formatCurrency(revenue.arr)} change={revenue.mrrGrowth} icon={<TrendingUp className="h-5 w-5" />} />
        <StatCard title="Net Revenue" value={formatCurrency(revenue.netRevenue)} icon={<DollarSign className="h-5 w-5" />} />
        <StatCard title="ARPU" value={formatCurrency(revenue.arpu)} icon={<Percent className="h-5 w-5" />} />
      </div>

      <div className="bg-card border border-border rounded-xl p-5">
        <h3 className="font-semibold mb-4">Revenue Over Time</h3>
        <ResponsiveContainer width="100%" height={350}>
          <AreaChart data={mockChartData}>
            <defs>
              <linearGradient id="revGrad2" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={CHART_COLORS.primary} stopOpacity={0.3} />
                <stop offset="95%" stopColor={CHART_COLORS.primary} stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke={CHART_GRID_COLOR} />
            <XAxis dataKey="date" tick={CHART_AXIS_TICK} stroke={CHART_AXIS_COLOR} tickFormatter={dateTickFormatter} />
            <YAxis tick={CHART_AXIS_TICK} stroke={CHART_AXIS_COLOR} />
            <Tooltip contentStyle={CHART_TOOLTIP_STYLE} />
            <Area type="monotone" dataKey="revenue" stroke={CHART_COLORS.primary} fillOpacity={1} fill="url(#revGrad2)" />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
