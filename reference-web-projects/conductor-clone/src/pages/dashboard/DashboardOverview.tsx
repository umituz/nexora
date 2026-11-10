import { Link } from "react-router-dom";
import { StatCard } from "@/components/shared/StatCard";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { mockDashboardStats, mockConnections, mockUsageData, mockErrorLogs } from "@/lib/mock-data";
import { formatNumber, formatRelativeTime, formatPercentage } from "@/lib/utils";
import { Activity, AlertTriangle, Link as LinkIcon, Users, BarChart3, Clock, Zap, Database } from "lucide-react";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";

export default function DashboardOverview() {
  const stats = mockDashboardStats;

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold">Dashboard</h1>
        <p className="mt-1 text-sm text-muted-foreground">Overview of your Conductor account.</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard title="Total Connections" value={stats.totalConnections} icon={<LinkIcon className="h-4 w-4" />} trend={{ value: 12, positive: true }} description={`${stats.activeConnections} active`} />
        <StatCard title="Requests Today" value={formatNumber(stats.requestsToday)} icon={<Activity className="h-4 w-4" />} trend={{ value: 8, positive: true }} description={`${formatNumber(stats.totalRequests)} total`} />
        <StatCard title="Error Rate" value={formatPercentage(stats.errorRate)} icon={<AlertTriangle className="h-4 w-4" />} trend={{ value: 0.2, positive: false }} description="Last 24 hours" />
        <StatCard title="Avg Response Time" value={`${stats.avgResponseTime}ms`} icon={<Clock className="h-4 w-4" />} trend={{ value: 5, positive: true }} description="Last 24 hours" />
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="col-span-2 rounded-lg border bg-card p-6">
          <h3 className="text-sm font-semibold">API Requests (30 days)</h3>
          <div className="mt-4 h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={mockUsageData}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="date" tick={{ fontSize: 10 }} stroke="hsl(var(--muted-foreground))" tickFormatter={(v) => v.slice(5)} />
                <YAxis tick={{ fontSize: 10 }} stroke="hsl(var(--muted-foreground))" />
                <Tooltip contentStyle={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: 8, fontSize: 12 }} />
                <Line type="monotone" dataKey="requests" stroke="hsl(var(--primary))" strokeWidth={2} dot={false} />
                <Line type="monotone" dataKey="errors" stroke="hsl(var(--destructive))" strokeWidth={1} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="rounded-lg border bg-card p-6">
          <h3 className="text-sm font-semibold">Recent Errors</h3>
          <div className="mt-4 space-y-3">
            {mockErrorLogs.slice(0, 4).map((err) => (
              <div key={err.id} className="rounded-md border p-3">
                <p className="text-xs font-medium">{err.code}</p>
                <p className="mt-1 text-xs text-muted-foreground">{err.message}</p>
                <p className="mt-1 text-xs text-muted-foreground">{formatRelativeTime(err.timestamp)}</p>
              </div>
            ))}
            <Link to="/dashboard/errors" className="block text-center text-xs text-primary hover:underline">View all errors →</Link>
          </div>
        </div>
      </div>

      <div className="rounded-lg border bg-card">
        <div className="flex items-center justify-between border-b p-4">
          <h3 className="text-sm font-semibold">Connections</h3>
          <Link to="/dashboard/connections" className="text-xs text-primary hover:underline">View all →</Link>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead><tr className="border-b text-xs text-muted-foreground">
              <th className="px-4 py-3 text-left font-medium">Company</th>
              <th className="px-4 py-3 text-left font-medium">Status</th>
              <th className="px-4 py-3 text-left font-medium">QB Version</th>
              <th className="px-4 py-3 text-left font-medium">Last Sync</th>
              <th className="px-4 py-3 text-right font-medium">Requests</th>
            </tr></thead>
            <tbody>
              {mockConnections.slice(0, 5).map((conn) => (
                <tr key={conn.id} className="border-b last:border-0 hover:bg-muted/50">
                  <td className="px-4 py-3 text-sm font-medium">{conn.companyName}</td>
                  <td className="px-4 py-3"><StatusBadge status={conn.status} /></td>
                  <td className="px-4 py-3 text-sm text-muted-foreground">{conn.qbVersion}</td>
                  <td className="px-4 py-3 text-sm text-muted-foreground">{formatRelativeTime(conn.lastSyncAt)}</td>
                  <td className="px-4 py-3 text-right text-sm">{formatNumber(conn.requestCount)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
