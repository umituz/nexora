import { PageHeader } from "@/components/shared/PageHeader";
import { generateMultiSeriesData } from "@/lib/mock-data";
import { useMemo, useState } from "react";
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell } from "recharts";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

const COLORS = ["hsl(var(--chart-1))", "hsl(var(--chart-2))", "hsl(var(--chart-3))", "hsl(var(--chart-4))", "hsl(var(--chart-5))"];

export default function CustomDashboardPage() {
  const [widgets] = useState([
    { id: "w1", title: "Error Rate by Namespace", type: "area" as const },
    { id: "w2", title: "Request Distribution", type: "bar" as const },
    { id: "w3", title: "Error Distribution", type: "pie" as const },
    { id: "w4", title: "Memory Usage Trend", type: "area" as const },
  ]);

  const areaData = useMemo(() => generateMultiSeriesData(24, { web: { base: 2.5, variance: 1.5 }, api: { base: 1.2, variance: 0.8 }, background: { base: 0.5, variance: 0.3 } }), []);
  const barData = useMemo(() => generateMultiSeriesData(12, { GET: { base: 5000, variance: 2000 }, POST: { base: 2000, variance: 800 }, PUT: { base: 500, variance: 200 }, DELETE: { base: 100, variance: 50 } }), []);
  const pieData = [
    { name: "NoMethodError", value: 35 },
    { name: "TimeoutError", value: 25 },
    { name: "RecordNotFound", value: 20 },
    { name: "ConnectionError", value: 12 },
    { name: "Other", value: 8 },
  ];
  const memData = useMemo(() => generateMultiSeriesData(48, { used: { base: 65, variance: 15 }, cached: { base: 20, variance: 5 } }), []);

  return (
    <div>
      <PageHeader title="Custom Dashboard" description="Build your own monitoring dashboard">
        <Button size="sm" onClick={() => toast.success("Widget added")}>Add Widget</Button>
      </PageHeader>
      <div className="grid lg:grid-cols-2 gap-6">
        <div className="rounded-lg border border-border bg-card p-4">
          <h3 className="text-sm font-semibold mb-4">{widgets[0].title}</h3>
          <ResponsiveContainer width="100%" height={250}>
            <AreaChart data={areaData}>
              <XAxis dataKey="time" tick={{ fontSize: 10 }} stroke="hsl(var(--muted-foreground))" tickLine={false} axisLine={false} />
              <YAxis tick={{ fontSize: 10 }} stroke="hsl(var(--muted-foreground))" tickLine={false} axisLine={false} />
              <Tooltip contentStyle={{ backgroundColor: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: 8, fontSize: 12 }} />
              <Area type="monotone" dataKey="web" stroke={COLORS[0]} fill={COLORS[0]} fillOpacity={0.1} strokeWidth={2} />
              <Area type="monotone" dataKey="api" stroke={COLORS[2]} fill={COLORS[2]} fillOpacity={0.1} strokeWidth={2} />
              <Area type="monotone" dataKey="background" stroke={COLORS[1]} fill={COLORS[1]} fillOpacity={0.1} strokeWidth={2} />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        <div className="rounded-lg border border-border bg-card p-4">
          <h3 className="text-sm font-semibold mb-4">{widgets[1].title}</h3>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={barData}>
              <XAxis dataKey="time" tick={{ fontSize: 10 }} stroke="hsl(var(--muted-foreground))" tickLine={false} axisLine={false} />
              <YAxis tick={{ fontSize: 10 }} stroke="hsl(var(--muted-foreground))" tickLine={false} axisLine={false} />
              <Tooltip contentStyle={{ backgroundColor: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: 8, fontSize: 12 }} />
              <Bar dataKey="GET" fill={COLORS[2]} radius={[2, 2, 0, 0]} />
              <Bar dataKey="POST" fill={COLORS[0]} radius={[2, 2, 0, 0]} />
              <Bar dataKey="PUT" fill={COLORS[1]} radius={[2, 2, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="rounded-lg border border-border bg-card p-4">
          <h3 className="text-sm font-semibold mb-4">{widgets[2].title}</h3>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie data={pieData} cx="50%" cy="50%" innerRadius={60} outerRadius={90} paddingAngle={3} dataKey="value">
                {pieData.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
              </Pie>
              <Tooltip contentStyle={{ backgroundColor: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: 8, fontSize: 12 }} />
            </PieChart>
          </ResponsiveContainer>
          <div className="flex flex-wrap gap-3 justify-center mt-2">
            {pieData.map((d, i) => (
              <span key={d.name} className="flex items-center gap-1.5 text-xs text-muted-foreground">
                <span className="h-2 w-2 rounded-full" style={{ backgroundColor: COLORS[i % COLORS.length] }} />
                {d.name}
              </span>
            ))}
          </div>
        </div>

        <div className="rounded-lg border border-border bg-card p-4">
          <h3 className="text-sm font-semibold mb-4">{widgets[3].title}</h3>
          <ResponsiveContainer width="100%" height={250}>
            <AreaChart data={memData}>
              <XAxis dataKey="time" tick={{ fontSize: 10 }} stroke="hsl(var(--muted-foreground))" tickLine={false} axisLine={false} />
              <YAxis tick={{ fontSize: 10 }} stroke="hsl(var(--muted-foreground))" tickLine={false} axisLine={false} domain={[0, 100]} />
              <Tooltip contentStyle={{ backgroundColor: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: 8, fontSize: 12 }} />
              <Area type="monotone" dataKey="used" stroke={COLORS[3]} fill={COLORS[3]} fillOpacity={0.1} strokeWidth={2} stackId="1" />
              <Area type="monotone" dataKey="cached" stroke={COLORS[4]} fill={COLORS[4]} fillOpacity={0.1} strokeWidth={2} stackId="1" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
