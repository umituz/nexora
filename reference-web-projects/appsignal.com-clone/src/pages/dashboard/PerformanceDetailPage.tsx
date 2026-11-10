import { useParams, Link } from "react-router-dom";
import { PageHeader } from "@/components/shared/PageHeader";
import { mockPerformanceActions, generateTimeSeriesData } from "@/lib/mock-data";
import { formatDuration } from "@/lib/calculations";
import { ArrowLeft } from "lucide-react";
import { useMemo } from "react";
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";

export default function PerformanceDetailPage() {
  const { id } = useParams<{ id: string }>();
  const action = mockPerformanceActions.find((a) => a.id === id) ?? mockPerformanceActions[0];
  const chartData = useMemo(() => generateTimeSeriesData(48, action.meanDuration, action.meanDuration * 0.5), [action]);

  return (
    <div>
      <Link to="/dashboard/performance" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary mb-4"><ArrowLeft className="h-4 w-4" />Back</Link>
      <PageHeader title={action.action} description={`${action.method} · Last request: ${action.lastRequest}`} />
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {[
          { label: "Mean Duration", value: formatDuration(action.meanDuration) },
          { label: "P90 Duration", value: formatDuration(action.p90Duration) },
          { label: "P95 Duration", value: formatDuration(action.p95Duration) },
          { label: "Throughput", value: `${action.throughput} rpm` },
        ].map((s) => (
          <div key={s.label} className="rounded-lg border border-border bg-card p-4">
            <p className="text-xs text-muted-foreground mb-1">{s.label}</p>
            <p className="text-xl font-bold font-mono">{s.value}</p>
          </div>
        ))}
      </div>
      <div className="rounded-lg border border-border bg-card p-4">
        <h3 className="text-sm font-semibold mb-4">Response Time Trend</h3>
        <ResponsiveContainer width="100%" height={300}>
          <AreaChart data={chartData}>
            <XAxis dataKey="time" tick={{ fontSize: 10 }} stroke="hsl(var(--muted-foreground))" tickLine={false} axisLine={false} />
            <YAxis tick={{ fontSize: 10 }} stroke="hsl(var(--muted-foreground))" tickLine={false} axisLine={false} />
            <Tooltip contentStyle={{ backgroundColor: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: 8, fontSize: 12 }} />
            <Area type="monotone" dataKey="value" stroke="hsl(var(--chart-3))" fill="hsl(var(--chart-3))" fillOpacity={0.1} strokeWidth={2} />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
