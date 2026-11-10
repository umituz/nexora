import { PageHeader } from "@/components/shared/PageHeader";
import { StatCard } from "@/components/shared/StatCard";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { mockProjects, mockDeployments, mockMetrics, mockLogs } from "@/lib/mock-data";
import { formatNumber, timeAgo } from "@/lib/utils";
import { FolderOpen, Rocket, BarChart3, Users, AlertTriangle } from "lucide-react";
import { Link } from "react-router-dom";
import { DASHBOARD_NAV } from "@/lib/constants";
import { LineChart, Line, ResponsiveContainer, Tooltip, XAxis } from "recharts";

export default function DashboardOverview() {
  const responseTimeMetric = mockMetrics[0];

  return (
    <div className="animate-fade-in">
      <PageHeader title="Dashboard" description="Overview of your platform" />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatCard title="Projects" value={mockProjects.filter(p => p.status === "active").length} icon={<FolderOpen className="h-5 w-5" />} subtitle="active" />
        <StatCard title="Deployments" value={mockDeployments.length} icon={<Rocket className="h-5 w-5" />} subtitle="this week" />
        <StatCard title="Avg Response" value={`${responseTimeMetric.value}ms`} icon={<BarChart3 className="h-5 w-5" />} change={responseTimeMetric.change} />
        <StatCard title="Active Users" value={formatNumber(mockMetrics[5].value)} icon={<Users className="h-5 w-5" />} change={mockMetrics[5].change} />
      </div>

      {/* Response Time Chart */}
      <div className="bg-card border border-border rounded-lg p-5 mb-8">
        <h3 className="font-semibold text-foreground mb-4">Response Time (24h)</h3>
        <div className="h-48">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={responseTimeMetric.data}>
              <XAxis dataKey="time" tick={{ fontSize: 11 }} stroke="hsl(var(--muted-foreground))" />
              <Tooltip />
              <Line type="monotone" dataKey="value" stroke="hsl(var(--primary))" strokeWidth={2} dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Recent Deployments */}
        <div className="bg-card border border-border rounded-lg p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-foreground">Recent Deployments</h3>
            <Link to={DASHBOARD_NAV.deployments} className="text-xs text-primary hover:underline">View all</Link>
          </div>
          <div className="space-y-3">
            {mockDeployments.slice(0, 4).map((d) => (
              <div key={d.id} className="flex items-center justify-between text-sm">
                <div>
                  <p className="font-medium text-foreground">{d.version}</p>
                  <p className="text-xs text-muted-foreground">{d.projectName} → {d.environment}</p>
                </div>
                <div className="flex items-center gap-2">
                  <StatusBadge status={d.status} />
                  <span className="text-xs text-muted-foreground">{timeAgo(d.createdAt)}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Logs */}
        <div className="bg-card border border-border rounded-lg p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-foreground">Recent Logs</h3>
            <Link to={DASHBOARD_NAV.logs} className="text-xs text-primary hover:underline">View all</Link>
          </div>
          <div className="space-y-2">
            {mockLogs.slice(0, 6).map((log) => (
              <div key={log.id} className="flex items-start gap-2 text-xs font-mono">
                <StatusBadge status={log.level} />
                <span className="text-muted-foreground truncate flex-1">{log.message}</span>
                <span className="text-muted-foreground shrink-0">{timeAgo(log.timestamp)}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
