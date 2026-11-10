import { PageHeader } from "@/components/dashboard/PageHeader";
import { StatCard } from "@/components/dashboard/StatCard";
import { mockChartData, mockDashboardStats } from "@/data/mockData";
import { formatCurrency, formatNumber, formatPercent } from "@/utils/calculations";
import { BarChart3, TrendingUp, Users, DollarSign } from "lucide-react";
import { CHART_COLORS, CHART_GRID_COLOR, CHART_AXIS_COLOR, CHART_TOOLTIP_STYLE, CHART_AXIS_TICK, dateTickFormatter } from "@/utils/chartTheme";
import { AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from "recharts";

export default function Analytics() {
  const pieData = mockDashboardStats.topChannels.map((c) => ({ name: c.name, value: c.conversions }));

  return (
    <div className="space-y-6 animate-fade-in">
      <PageHeader title="Analytics" description="Deep dive into your metrics and performance" />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="Total Revenue" value={formatCurrency(mockDashboardStats.revenue.grossRevenue)} change={12.5} icon={<DollarSign className="h-5 w-5" />} />
        <StatCard title="Total Trials" value={formatNumber(mockDashboardStats.conversion.totalTrials)} change={15.2} icon={<Users className="h-5 w-5" />} />
        <StatCard title="Avg Trial Length" value={`${mockDashboardStats.conversion.avgTrialLength}d`} icon={<BarChart3 className="h-5 w-5" />} />
        <StatCard title="Churn Rate" value={formatPercent(mockDashboardStats.revenue.churnRate)} change={-1.2} icon={<TrendingUp className="h-5 w-5" />} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="bg-card border border-border rounded-xl p-5">
          <h3 className="font-semibold mb-4">Daily Trials & Conversions</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={mockChartData}>
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
          <h3 className="font-semibold mb-4">Conversions by Channel</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie data={pieData} cx="50%" cy="50%" innerRadius={60} outerRadius={100} paddingAngle={3} dataKey="value">
                {pieData.map((_, i) => (
                  <Cell key={i} fill={CHART_COLORS.palette[i % CHART_COLORS.palette.length]} />
                ))}
              </Pie>
              <Tooltip contentStyle={CHART_TOOLTIP_STYLE} />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="bg-card border border-border rounded-xl p-5">
        <h3 className="font-semibold mb-4">Revenue Trend</h3>
        <ResponsiveContainer width="100%" height={300}>
          <AreaChart data={mockChartData}>
            <defs>
              <linearGradient id="analyticsGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={CHART_COLORS.primary} stopOpacity={0.3} />
                <stop offset="95%" stopColor={CHART_COLORS.primary} stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke={CHART_GRID_COLOR} />
            <XAxis dataKey="date" tick={CHART_AXIS_TICK} stroke={CHART_AXIS_COLOR} tickFormatter={dateTickFormatter} />
            <YAxis tick={CHART_AXIS_TICK} stroke={CHART_AXIS_COLOR} />
            <Tooltip contentStyle={CHART_TOOLTIP_STYLE} />
            <Area type="monotone" dataKey="revenue" stroke={CHART_COLORS.primary} fillOpacity={1} fill="url(#analyticsGrad)" />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
