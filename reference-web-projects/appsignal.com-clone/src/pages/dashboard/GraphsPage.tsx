import { PageHeader } from "@/components/shared/PageHeader";
import { generateMultiSeriesData } from "@/lib/mock-data";
import { useMemo, useState } from "react";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend } from "recharts";
import { Button } from "@/components/ui/button";

const COLORS = ["hsl(var(--chart-1))", "hsl(var(--chart-2))", "hsl(var(--chart-3))", "hsl(var(--chart-4))"];

const graphConfigs = [
  { title: "Response Time Overview", series: { mean: { base: 200, variance: 80 }, p90: { base: 500, variance: 200 }, p95: { base: 800, variance: 350 }, p99: { base: 1500, variance: 600 } } },
  { title: "Throughput", series: { web: { base: 4000, variance: 1500 }, api: { base: 7000, variance: 3000 }, background: { base: 1500, variance: 500 } } },
  { title: "Error Rate (%)", series: { web: { base: 0.5, variance: 0.3 }, api: { base: 0.8, variance: 0.5 }, background: { base: 1.2, variance: 0.8 } } },
  { title: "Queue Depth", series: { default: { base: 50, variance: 30 }, critical: { base: 10, variance: 8 }, mailer: { base: 25, variance: 15 } } },
];

export default function GraphsPage() {
  const [timeRange, setTimeRange] = useState("24h");
  const points = timeRange === "1h" ? 12 : timeRange === "6h" ? 36 : timeRange === "24h" ? 48 : 96;

  const datasets = useMemo(
    () => graphConfigs.map((g) => ({ ...g, data: generateMultiSeriesData(points, g.series) })),
    [points]
  );

  return (
    <div>
      <PageHeader title="Graphs" description="Detailed metric visualizations">
        <div className="flex gap-1">
          {["1h", "6h", "24h", "48h"].map((t) => (
            <Button key={t} size="sm" variant={timeRange === t ? "default" : "outline"} onClick={() => setTimeRange(t)}>{t}</Button>
          ))}
        </div>
      </PageHeader>
      <div className="grid lg:grid-cols-2 gap-6">
        {datasets.map((graph) => (
          <div key={graph.title} className="rounded-lg border border-border bg-card p-4">
            <h3 className="text-sm font-semibold mb-4">{graph.title}</h3>
            <ResponsiveContainer width="100%" height={280}>
              <LineChart data={graph.data}>
                <XAxis dataKey="time" tick={{ fontSize: 10 }} stroke="hsl(var(--muted-foreground))" tickLine={false} axisLine={false} />
                <YAxis tick={{ fontSize: 10 }} stroke="hsl(var(--muted-foreground))" tickLine={false} axisLine={false} />
                <Tooltip contentStyle={{ backgroundColor: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: 8, fontSize: 12 }} />
                <Legend wrapperStyle={{ fontSize: 11 }} />
                {Object.keys(graph.series).map((key, i) => (
                  <Line key={key} type="monotone" dataKey={key} stroke={COLORS[i % COLORS.length]} strokeWidth={2} dot={false} />
                ))}
              </LineChart>
            </ResponsiveContainer>
          </div>
        ))}
      </div>
    </div>
  );
}
