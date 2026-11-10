import { StatsCard } from "@/components/dashboard/StatsCard";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { PageHeader } from "@/components/shared/PageHeader";
import { mockErrors, mockHosts, mockPerformanceActions, mockUptimeMonitors, mockDeploys, generateMultiSeriesData } from "@/lib/mock-data";
import { formatNumber, formatDuration } from "@/lib/calculations";
import { Bug, Gauge, Server, Activity, AlertTriangle, Rocket } from "lucide-react";
import { Link } from "react-router-dom";
import { useMemo } from "react";
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";

export default function DashboardOverview() {
  const chartData = useMemo(() => generateMultiSeriesData(24, { requests: { base: 5000, variance: 2000 }, errors: { base: 50, variance: 30 } }), []);
  const openErrors = mockErrors.filter((e) => e.status === "open").length;
  const criticalHosts = mockHosts.filter((h) => h.status === "critical").length;

  return (
    <div>
      <PageHeader title="Dashboard" description="Application overview for the last 24 hours" />

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <StatsCard title="Open Errors" value={openErrors} icon={Bug} change={{ direction: "up", percentage: 12 }} positive="down" description="vs last 24h" />
        <StatsCard title="Avg Response" value={formatDuration(mockPerformanceActions[0].meanDuration)} icon={Gauge} change={{ direction: "down", percentage: 5.2 }} positive="down" description="vs last 24h" />
        <StatsCard title="Requests" value={formatNumber(125000)} icon={Activity} change={{ direction: "up", percentage: 8.1 }} description="vs last 24h" />
        <StatsCard title="Uptime" value="99.95%" icon={Server} change={{ direction: "stable", percentage: 0 }} description="last 30 days" />
      </div>

      {/* Chart */}
      <div className="rounded-lg border border-border bg-card p-4 mb-6">
        <h3 className="text-sm font-semibold mb-4">Requests & Errors (24h)</h3>
        <ResponsiveContainer width="100%" height={250}>
          <AreaChart data={chartData}>
            <defs>
              <linearGradient id="reqGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="hsl(var(--chart-3))" stopOpacity={0.3} />
                <stop offset="95%" stopColor="hsl(var(--chart-3))" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="errGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="hsl(var(--chart-1))" stopOpacity={0.3} />
                <stop offset="95%" stopColor="hsl(var(--chart-1))" stopOpacity={0} />
              </linearGradient>
            </defs>
            <XAxis dataKey="time" tick={{ fontSize: 11 }} stroke="hsl(var(--muted-foreground))" tickLine={false} axisLine={false} />
            <YAxis tick={{ fontSize: 11 }} stroke="hsl(var(--muted-foreground))" tickLine={false} axisLine={false} />
            <Tooltip contentStyle={{ backgroundColor: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: 8, fontSize: 12 }} />
            <Area type="monotone" dataKey="requests" stroke="hsl(var(--chart-3))" fill="url(#reqGrad)" strokeWidth={2} />
            <Area type="monotone" dataKey="errors" stroke="hsl(var(--chart-1))" fill="url(#errGrad)" strokeWidth={2} />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Recent Errors */}
        <div className="rounded-lg border border-border bg-card p-4">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-semibold">Recent Errors</h3>
            <Link to="/dashboard/errors" className="text-xs text-primary hover:underline">View all →</Link>
          </div>
          <div className="space-y-3">
            {mockErrors.slice(0, 5).map((err) => (
              <Link to={`/dashboard/errors/${err.id}`} key={err.id} className="flex items-center justify-between py-2 border-b border-border last:border-0 hover:bg-accent/50 -mx-2 px-2 rounded">
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-medium truncate">{err.name}</p>
                  <p className="text-xs text-muted-foreground truncate">{err.action}</p>
                </div>
                <div className="flex items-center gap-3 shrink-0">
                  <span className="text-xs text-muted-foreground">{err.count}×</span>
                  <StatusBadge status={err.severity} />
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* Recent Deploys */}
        <div className="rounded-lg border border-border bg-card p-4">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-semibold">Recent Deploys</h3>
            <Link to="/dashboard/deploys" className="text-xs text-primary hover:underline">View all →</Link>
          </div>
          <div className="space-y-3">
            {mockDeploys.map((dep) => (
              <div key={dep.id} className="flex items-center justify-between py-2 border-b border-border last:border-0">
                <div className="flex items-center gap-3">
                  <Rocket className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <p className="text-sm font-medium">{dep.version}</p>
                    <p className="text-xs text-muted-foreground">{dep.description}</p>
                  </div>
                </div>
                <StatusBadge status={dep.status} />
              </div>
            ))}
          </div>
        </div>

        {/* Hosts */}
        <div className="rounded-lg border border-border bg-card p-4">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-semibold">Host Status</h3>
            <Link to="/dashboard/hosts" className="text-xs text-primary hover:underline">View all →</Link>
          </div>
          <div className="space-y-3">
            {mockHosts.map((host) => (
              <Link to={`/dashboard/hosts/${host.id}`} key={host.id} className="flex items-center justify-between py-2 border-b border-border last:border-0 hover:bg-accent/50 -mx-2 px-2 rounded">
                <div className="flex items-center gap-3">
                  <Server className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm font-medium font-mono">{host.hostname}</span>
                </div>
                <div className="flex items-center gap-4">
                  <span className="text-xs text-muted-foreground">CPU {host.cpuUsage}%</span>
                  <StatusBadge status={host.status} />
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* Uptime */}
        <div className="rounded-lg border border-border bg-card p-4">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-semibold">Uptime Monitors</h3>
            <Link to="/dashboard/uptime" className="text-xs text-primary hover:underline">View all →</Link>
          </div>
          <div className="space-y-3">
            {mockUptimeMonitors.map((mon) => (
              <Link to={`/dashboard/uptime/${mon.id}`} key={mon.id} className="flex items-center justify-between py-2 border-b border-border last:border-0 hover:bg-accent/50 -mx-2 px-2 rounded">
                <div>
                  <p className="text-sm font-medium">{mon.name}</p>
                  <p className="text-xs text-muted-foreground">{mon.url}</p>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-xs text-muted-foreground">{mon.uptime30d}%</span>
                  <StatusBadge status={mon.status} />
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
