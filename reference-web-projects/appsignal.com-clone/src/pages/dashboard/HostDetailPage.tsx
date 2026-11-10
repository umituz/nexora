import { useParams, Link } from "react-router-dom";
import { mockHosts, generateMultiSeriesData } from "@/lib/mock-data";
import { PageHeader } from "@/components/shared/PageHeader";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { ArrowLeft } from "lucide-react";
import { useMemo } from "react";
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";

export default function HostDetailPage() {
  const { id } = useParams<{ id: string }>();
  const host = mockHosts.find((h) => h.id === id) ?? mockHosts[0];
  const cpuData = useMemo(() => generateMultiSeriesData(48, { cpu: { base: host.cpuUsage, variance: 20 }, memory: { base: host.memoryUsage, variance: 10 } }), [host]);

  return (
    <div>
      <Link to="/dashboard/hosts" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary mb-4"><ArrowLeft className="h-4 w-4" />Back</Link>
      <PageHeader title={host.hostname} description={`${host.os} · ${host.cores} cores · ${host.totalMemory}GB RAM`}>
        <StatusBadge status={host.status} />
      </PageHeader>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {[
          { label: "CPU Usage", value: `${host.cpuUsage}%` },
          { label: "Memory Usage", value: `${host.memoryUsage}%` },
          { label: "Disk Usage", value: `${host.diskUsage}%` },
          { label: "Load Average", value: host.loadAvg.join(", ") },
        ].map((s) => (
          <div key={s.label} className="rounded-lg border border-border bg-card p-4">
            <p className="text-xs text-muted-foreground mb-1">{s.label}</p>
            <p className="text-xl font-bold font-mono">{s.value}</p>
          </div>
        ))}
      </div>
      <div className="rounded-lg border border-border bg-card p-4">
        <h3 className="text-sm font-semibold mb-4">CPU & Memory (48h)</h3>
        <ResponsiveContainer width="100%" height={300}>
          <AreaChart data={cpuData}>
            <XAxis dataKey="time" tick={{ fontSize: 10 }} stroke="hsl(var(--muted-foreground))" tickLine={false} axisLine={false} />
            <YAxis tick={{ fontSize: 10 }} stroke="hsl(var(--muted-foreground))" tickLine={false} axisLine={false} domain={[0, 100]} />
            <Tooltip contentStyle={{ backgroundColor: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: 8, fontSize: 12 }} />
            <Area type="monotone" dataKey="cpu" stroke="hsl(var(--chart-1))" fill="hsl(var(--chart-1))" fillOpacity={0.1} strokeWidth={2} name="CPU" />
            <Area type="monotone" dataKey="memory" stroke="hsl(var(--chart-3))" fill="hsl(var(--chart-3))" fillOpacity={0.1} strokeWidth={2} name="Memory" />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
