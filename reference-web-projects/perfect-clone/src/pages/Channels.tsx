import { PageHeader } from "@/components/dashboard/PageHeader";
import { mockDashboardStats } from "@/data/mockData";
import { formatCurrency, formatNumber } from "@/utils/calculations";
import { CHART_COLORS, CHART_GRID_COLOR, CHART_AXIS_COLOR, CHART_TOOLTIP_STYLE, CHART_AXIS_TICK } from "@/utils/chartTheme";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

export default function Channels() {
  const data = mockDashboardStats.topChannels;

  return (
    <div className="space-y-6 animate-fade-in">
      <PageHeader title="Channels" description="Attribution by marketing channel" />

      <div className="bg-card border border-border rounded-xl p-5">
        <h3 className="font-semibold mb-4">Revenue by Channel</h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke={CHART_GRID_COLOR} />
            <XAxis dataKey="name" tick={{ fontSize: 12 }} stroke={CHART_AXIS_COLOR} />
            <YAxis tick={CHART_AXIS_TICK} stroke={CHART_AXIS_COLOR} />
            <Tooltip contentStyle={CHART_TOOLTIP_STYLE} />
            <Bar dataKey="revenue" fill={CHART_COLORS.primary} radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {data.map((ch) => (
          <div key={ch.name} className="bg-card border border-border rounded-xl p-5 hover:border-primary/30 transition-colors">
            <h4 className="font-semibold mb-3">{ch.name}</h4>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Revenue</span>
                <span className="font-medium">{formatCurrency(ch.revenue)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Conversions</span>
                <span className="font-medium">{formatNumber(ch.conversions)}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
