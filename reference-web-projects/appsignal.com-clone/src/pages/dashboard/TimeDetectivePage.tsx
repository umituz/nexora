import { PageHeader } from "@/components/shared/PageHeader";
import { generateMultiSeriesData, mockErrors, mockPerformanceActions, mockDeploys } from "@/lib/mock-data";
import { formatDuration } from "@/lib/calculations";
import { useMemo, useState } from "react";
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, ReferenceLine } from "recharts";
import { Button } from "@/components/ui/button";
import { StatusBadge } from "@/components/shared/StatusBadge";

export default function TimeDetectivePage() {
  const [timeRange, setTimeRange] = useState("24h");
  const points = timeRange === "6h" ? 36 : timeRange === "24h" ? 48 : 96;

  const chartData = useMemo(() => generateMultiSeriesData(points, {
    response_time: { base: 300, variance: 150 },
    error_count: { base: 10, variance: 8 },
    throughput: { base: 3000, variance: 1500 },
  }), [points]);

  return (
    <div>
      <PageHeader title="Time Detective" description="Correlate events across your application timeline">
        <div className="flex gap-1">
          {["6h", "24h", "48h"].map((t) => (
            <Button key={t} size="sm" variant={timeRange === t ? "default" : "outline"} onClick={() => setTimeRange(t)}>{t}</Button>
          ))}
        </div>
      </PageHeader>

      <div className="rounded-lg border border-border bg-card p-4 mb-6">
        <h3 className="text-sm font-semibold mb-2">Response Time & Errors with Deploy Markers</h3>
        <ResponsiveContainer width="100%" height={300}>
          <AreaChart data={chartData}>
            <XAxis dataKey="time" tick={{ fontSize: 10 }} stroke="hsl(var(--muted-foreground))" tickLine={false} axisLine={false} />
            <YAxis tick={{ fontSize: 10 }} stroke="hsl(var(--muted-foreground))" tickLine={false} axisLine={false} />
            <Tooltip contentStyle={{ backgroundColor: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: 8, fontSize: 12 }} />
            <Area type="monotone" dataKey="response_time" stroke="hsl(var(--chart-3))" fill="hsl(var(--chart-3))" fillOpacity={0.1} strokeWidth={2} name="Response Time (ms)" />
            <Area type="monotone" dataKey="error_count" stroke="hsl(var(--chart-1))" fill="hsl(var(--chart-1))" fillOpacity={0.1} strokeWidth={2} name="Errors" />
            {mockDeploys.slice(0, 2).map((dep, i) => (
              <ReferenceLine key={dep.id} x={chartData[Math.floor(points * (0.3 + i * 0.3))]?.time} stroke="hsl(var(--chart-4))" strokeDasharray="3 3" label={{ value: dep.version, position: "top", fontSize: 10, fill: "hsl(var(--muted-foreground))" }} />
            ))}
          </AreaChart>
        </ResponsiveContainer>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        <div className="rounded-lg border border-border bg-card p-4">
          <h3 className="text-sm font-semibold mb-3">Timeline Events</h3>
          <div className="space-y-3">
            {[
              { time: "14:30", event: `Deploy ${mockDeploys[0].version}`, type: "deploy" as const },
              { time: "14:32", event: `Error spike: ${mockErrors[0].name}`, type: "error" as const },
              { time: "14:35", event: `Slow action: ${mockPerformanceActions[1].action} (${formatDuration(mockPerformanceActions[1].p95Duration)})`, type: "performance" as const },
              { time: "14:40", event: "CPU spike on worker-prod-01 (95%)", type: "host" as const },
              { time: "14:45", event: "Error rate normalized", type: "info" as const },
            ].map((ev, i) => (
              <div key={i} className="flex items-start gap-3 text-sm">
                <span className="text-xs text-muted-foreground font-mono w-12 shrink-0">{ev.time}</span>
                <div className="flex-1">
                  <span>{ev.event}</span>
                </div>
                <StatusBadge status={ev.type === "error" ? "critical" : ev.type === "deploy" ? "success" : ev.type === "performance" ? "warning" : ev.type === "host" ? "critical" : "active"} />
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-lg border border-border bg-card p-4">
          <h3 className="text-sm font-semibold mb-3">Correlation Insights</h3>
          <div className="space-y-4">
            {[
              { title: "Deploy → Error Spike", desc: `Deploy ${mockDeploys[0].version} correlates with a 300% increase in NoMethodError`, severity: "critical" },
              { title: "Error → Performance", desc: "Error spike caused increased response times across web namespace", severity: "warning" },
              { title: "CPU → Queue Backup", desc: "High CPU on worker-prod-01 led to background job queue buildup", severity: "warning" },
            ].map((insight, i) => (
              <div key={i} className="border-l-2 border-primary pl-3">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-sm font-medium">{insight.title}</span>
                  <StatusBadge status={insight.severity} />
                </div>
                <p className="text-xs text-muted-foreground">{insight.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
