import { PageHeader } from "@/components/shared/PageHeader";
import { generateMultiSeriesData } from "@/lib/mock-data";
import { useMemo } from "react";
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, BarChart, Bar } from "recharts";

export default function MetricDashboardsPage() {
  const reqData = useMemo(() => generateMultiSeriesData(24, { web: { base: 3000, variance: 1500 }, api: { base: 5000, variance: 2000 }, background: { base: 1000, variance: 500 } }), []);
  const latData = useMemo(() => generateMultiSeriesData(24, { p50: { base: 120, variance: 40 }, p90: { base: 450, variance: 150 }, p95: { base: 800, variance: 300 } }), []);

  return (
    <div>
      <PageHeader title="Metric Dashboards" description="Visualize key application metrics" />
      <div className="grid lg:grid-cols-2 gap-6">
        {[
          { title: "Requests by Namespace", data: reqData, keys: [{ k: "web", c: "--chart-1" }, { k: "api", c: "--chart-3" }, { k: "background", c: "--chart-2" }] },
          { title: "Response Time Percentiles", data: latData, keys: [{ k: "p50", c: "--chart-2" }, { k: "p90", c: "--chart-3" }, { k: "p95", c: "--chart-1" }] },
        ].map((chart) => (
          <div key={chart.title} className="rounded-lg border border-border bg-card p-4">
            <h3 className="text-sm font-semibold mb-4">{chart.title}</h3>
            <ResponsiveContainer width="100%" height={250}>
              <AreaChart data={chart.data}>
                <XAxis dataKey="time" tick={{ fontSize: 10 }} stroke="hsl(var(--muted-foreground))" tickLine={false} axisLine={false} />
                <YAxis tick={{ fontSize: 10 }} stroke="hsl(var(--muted-foreground))" tickLine={false} axisLine={false} />
                <Tooltip contentStyle={{ backgroundColor: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: 8, fontSize: 12 }} />
                {chart.keys.map((s) => <Area key={s.k} type="monotone" dataKey={s.k} stroke={`hsl(var(${s.c}))`} fill={`hsl(var(${s.c}))`} fillOpacity={0.1} strokeWidth={2} />)}
              </AreaChart>
            </ResponsiveContainer>
          </div>
        ))}
      </div>
    </div>
  );
}
