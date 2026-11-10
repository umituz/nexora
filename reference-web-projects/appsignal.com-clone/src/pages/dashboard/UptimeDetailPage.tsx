import { useParams, Link } from "react-router-dom";
import { mockUptimeMonitors, generateTimeSeriesData } from "@/lib/mock-data";
import { PageHeader } from "@/components/shared/PageHeader";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { ArrowLeft } from "lucide-react";
import { useMemo } from "react";
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";

export default function UptimeDetailPage() {
  const { id } = useParams<{ id: string }>();
  const monitor = mockUptimeMonitors.find((m) => m.id === id) ?? mockUptimeMonitors[0];
  const chartData = useMemo(() => generateTimeSeriesData(48, monitor.responseTime, monitor.responseTime * 0.5), [monitor]);

  return (
    <div>
      <Link to="/dashboard/uptime" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary mb-4"><ArrowLeft className="h-4 w-4" />Back</Link>
      <PageHeader title={monitor.name} description={monitor.url}><StatusBadge status={monitor.status} /></PageHeader>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {[{ l: "Uptime (30d)", v: `${monitor.uptime30d}%` }, { l: "Response Time", v: `${monitor.responseTime}ms` }, { l: "Check Interval", v: `${monitor.checkInterval}s` }, { l: "SSL Expiry", v: monitor.sslExpiry }].map((s) => (
          <div key={s.l} className="rounded-lg border border-border bg-card p-4"><p className="text-xs text-muted-foreground mb-1">{s.l}</p><p className="text-xl font-bold font-mono">{s.v}</p></div>
        ))}
      </div>
      <div className="rounded-lg border border-border bg-card p-4">
        <h3 className="text-sm font-semibold mb-4">Response Time</h3>
        <ResponsiveContainer width="100%" height={250}>
          <AreaChart data={chartData}>
            <XAxis dataKey="time" tick={{ fontSize: 10 }} stroke="hsl(var(--muted-foreground))" tickLine={false} axisLine={false} />
            <YAxis tick={{ fontSize: 10 }} stroke="hsl(var(--muted-foreground))" tickLine={false} axisLine={false} />
            <Tooltip contentStyle={{ backgroundColor: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: 8, fontSize: 12 }} />
            <Area type="monotone" dataKey="value" stroke="hsl(var(--chart-2))" fill="hsl(var(--chart-2))" fillOpacity={0.1} strokeWidth={2} />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
