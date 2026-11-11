import { mockAgents, mockAnalyticsData, mockConversations, mockAppointments } from "@/data/mock-data";
import { useAuth } from "@/hooks/use-auth";
import { formatCurrency, formatNumber, calculateConversionRate } from "@/lib/calculations";
import { BarChart3, Bot, Calendar, DollarSign, MessageSquare, TrendingUp, Users, Zap } from "lucide-react";
import { Link } from "react-router-dom";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, LineChart, Line } from "recharts";

export default function DashboardPage() {
  const { user } = useAuth();
  const data = mockAnalyticsData;
  const recentConversations = mockConversations.filter((c) => c.status === "active").slice(0, 3);
  const upcomingAppointments = mockAppointments.filter((a) => a.status === "scheduled").slice(0, 3);

  const stats = [
    { label: "Total Revenue", value: formatCurrency(data.overview.totalRevenue), icon: DollarSign, change: "+18.2%" },
    { label: "Conversations", value: formatNumber(data.overview.totalConversations), icon: MessageSquare, change: "+12.5%" },
    { label: "Conversions", value: formatNumber(data.overview.totalConversionsCount), icon: TrendingUp, change: "+24.3%" },
    { label: "Active Agents", value: data.overview.activeAgents.toString(), icon: Bot, change: "0%" },
    { label: "Contacts", value: formatNumber(data.overview.totalContacts), icon: Users, change: "+8.7%" },
    { label: "Avg Response", value: `${data.overview.avgResponseTime}s`, icon: Zap, change: "-15%" },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-heading text-2xl font-bold">Welcome back, {user?.name?.split(" ")[0]}</h1>
        <p className="text-sm text-muted-foreground">Here's what's happening with your AI agents.</p>
      </div>

      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
        {stats.map((s) => (
          <div key={s.label} className="rounded-xl border border-border bg-card p-4">
            <div className="flex items-center justify-between">
              <span className="text-xs text-muted-foreground">{s.label}</span>
              <s.icon className="h-4 w-4 text-primary" />
            </div>
            <p className="mt-2 font-heading text-xl font-bold">{s.value}</p>
            <p className={`text-xs ${s.change.startsWith("+") ? "text-primary" : s.change.startsWith("-") ? "text-primary" : "text-muted-foreground"}`}>{s.change} vs last month</p>
          </div>
        ))}
      </div>

      {/* Credits */}
      <div className="rounded-xl border border-border bg-card p-4">
        <div className="flex items-center justify-between">
          <h3 className="font-heading text-sm font-semibold">Credits Usage</h3>
          <span className="text-sm text-muted-foreground">{data.overview.creditsUsed}/{data.overview.creditsTotal}</span>
        </div>
        <div className="mt-2 h-2 rounded-full bg-secondary">
          <div className="h-full rounded-full bg-gradient-primary" style={{ width: `${(data.overview.creditsUsed / data.overview.creditsTotal) * 100}%` }} />
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Revenue Chart */}
        <div className="rounded-xl border border-border bg-card p-4">
          <h3 className="font-heading text-sm font-semibold">Revenue Trend</h3>
          <div className="mt-4 h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data.revenueByMonth}>
                <XAxis dataKey="month" tick={{ fontSize: 12 }} stroke="hsl(var(--muted-foreground))" />
                <YAxis tick={{ fontSize: 12 }} stroke="hsl(var(--muted-foreground))" />
                <Tooltip contentStyle={{ backgroundColor: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: "8px" }} />
                <Bar dataKey="revenue" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Daily Conversations */}
        <div className="rounded-xl border border-border bg-card p-4">
          <h3 className="font-heading text-sm font-semibold">Daily Conversations</h3>
          <div className="mt-4 h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={data.dailyConversations}>
                <XAxis dataKey="date" tick={{ fontSize: 12 }} stroke="hsl(var(--muted-foreground))" />
                <YAxis tick={{ fontSize: 12 }} stroke="hsl(var(--muted-foreground))" />
                <Tooltip contentStyle={{ backgroundColor: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: "8px" }} />
                <Line type="monotone" dataKey="count" stroke="hsl(var(--primary))" strokeWidth={2} dot={{ fill: "hsl(var(--primary))" }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Recent Conversations */}
        <div className="rounded-xl border border-border bg-card p-4">
          <div className="flex items-center justify-between">
            <h3 className="font-heading text-sm font-semibold">Active Conversations</h3>
            <Link to="/dashboard/conversations" className="text-xs text-primary hover:underline">View all</Link>
          </div>
          <div className="mt-4 space-y-3">
            {recentConversations.map((c) => (
              <Link key={c.id} to={`/dashboard/conversations/${c.id}`} className="flex items-center gap-3 rounded-lg p-2 transition-colors hover:bg-secondary">
                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary/10 text-xs font-bold text-primary">
                  {c.contactName.split(" ").map((n) => n[0]).join("")}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium">{c.contactName}</p>
                  <p className="truncate text-xs text-muted-foreground">{c.lastMessage}</p>
                </div>
                {!c.isRead && <div className="h-2 w-2 rounded-full bg-primary" />}
              </Link>
            ))}
          </div>
        </div>

        {/* Upcoming Appointments */}
        <div className="rounded-xl border border-border bg-card p-4">
          <div className="flex items-center justify-between">
            <h3 className="font-heading text-sm font-semibold">Upcoming Appointments</h3>
            <Link to="/dashboard/appointments" className="text-xs text-primary hover:underline">View all</Link>
          </div>
          <div className="mt-4 space-y-3">
            {upcomingAppointments.map((a) => (
              <div key={a.id} className="flex items-center gap-3 rounded-lg p-2">
                <Calendar className="h-5 w-5 text-primary" />
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-medium">{a.contactName}</p>
                  <p className="text-xs text-muted-foreground">{a.date} at {a.time} · {a.duration}min</p>
                </div>
                <span className="rounded-full bg-accent px-2 py-0.5 text-xs text-accent-foreground">{a.agentName}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
