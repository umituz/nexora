import { useData } from "@/contexts/DataContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatNumber, calculatePercentage } from "@/lib/calculations";
import { Users, Mail, Megaphone, TrendingUp, Sparkles, Send, Linkedin, Shield } from "lucide-react";
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";
import { Link } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";

export default function DashboardPage() {
  const { analytics, campaigns, leads, inboxMessages, linkedinAccounts, proxies } = useData();
  const activeCampaigns = campaigns.filter((c) => c.status === "active").length;
  const unreadMessages = inboxMessages.filter((m) => m.unread).length;
  const connectedAccounts = linkedinAccounts.filter((a) => a.status === "connected").length;
  const totalDailyUsed = linkedinAccounts.reduce((s, a) => s + a.usedToday, 0);
  const totalDailyLimit = linkedinAccounts.reduce((s, a) => s + a.dailyLimit, 0);
  const activeProxies = proxies.filter((p) => p.status === "active").length;

  const stats = [
    { label: "Total Leads", value: formatNumber(leads.length), icon: Users, change: +12, color: "text-info" },
    { label: "Active Campaigns", value: activeCampaigns, icon: Megaphone, change: +3, color: "text-primary" },
    { label: "Messages Sent", value: formatNumber(analytics.totalSent), icon: Send, change: +8, color: "text-success" },
    { label: "Reply Rate", value: `${analytics.replyRate}%`, icon: TrendingUp, change: +2.3, color: "text-warning" },
    { label: "Acceptance Rate", value: `${analytics.acceptanceRate}%`, icon: Sparkles, change: +5.1, color: "text-primary" },
    { label: "Unread Messages", value: unreadMessages, icon: Mail, change: -4, color: "text-destructive" },
  ];

  const statusColor: Record<string, string> = {
    draft: "bg-secondary text-muted-foreground",
    active: "bg-success/10 text-success",
    paused: "bg-warning/10 text-warning",
    completed: "bg-info/10 text-info",
    archived: "bg-muted text-muted-foreground",
  };

  const leadStatusColor: Record<string, string> = {
    new: "bg-info/10 text-info",
    contacted: "bg-primary/10 text-primary",
    replied: "bg-success/10 text-success",
    interested: "bg-warning/10 text-warning",
    not_interested: "bg-destructive/10 text-destructive",
    converted: "bg-success/10 text-success",
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold">Dashboard</h1>
        <p className="text-muted-foreground">Overview of your outreach performance</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
        {stats.map((s) => (
          <Card key={s.label}>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <s.icon className={`h-5 w-5 ${s.color}`} />
                <span className={`text-xs font-medium ${s.change >= 0 ? "text-success" : "text-destructive"}`}>
                  {s.change >= 0 ? "+" : ""}{s.change}%
                </span>
              </div>
              <p className="mt-2 text-2xl font-bold">{s.value}</p>
              <p className="text-xs text-muted-foreground">{s.label}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Outreach Activity (30 days)</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={analytics.dailyStats}>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                  <XAxis dataKey="date" tick={{ fontSize: 11 }} className="text-muted-foreground" tickFormatter={(v) => v.slice(5)} />
                  <YAxis tick={{ fontSize: 11 }} className="text-muted-foreground" />
                  <Tooltip contentStyle={{ backgroundColor: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: 8, color: "hsl(var(--foreground))" }} />
                  <Area type="monotone" dataKey="sent" stroke="hsl(var(--primary))" fill="hsl(var(--primary) / 0.2)" strokeWidth={2} name="Sent" />
                  <Area type="monotone" dataKey="replies" stroke="hsl(var(--success))" fill="hsl(var(--success) / 0.2)" strokeWidth={2} name="Replies" />
                  <Area type="monotone" dataKey="accepted" stroke="hsl(var(--info))" fill="hsl(var(--info) / 0.2)" strokeWidth={2} name="Accepted" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Campaign Performance</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {analytics.campaignPerformance.map((cp) => (
                <div key={cp.campaignId} className="flex items-center justify-between">
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">{cp.campaignName}</p>
                    <p className="text-xs text-muted-foreground">{cp.sent} sent · {cp.replies} replies</p>
                  </div>
                  <div className="ml-4 flex items-center gap-2">
                    <div className="w-24 h-2 rounded-full bg-secondary overflow-hidden">
                      <div className="h-full rounded-full bg-primary" style={{ width: `${cp.replyRate}%` }} />
                    </div>
                    <span className="text-sm font-medium w-12 text-right">{cp.replyRate}%</span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <Card>
          <CardHeader className="flex-row items-center justify-between">
            <CardTitle className="text-base">Recent Campaigns</CardTitle>
            <Link to="/campaigns" className="text-xs text-primary hover:underline">View all</Link>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {campaigns.slice(0, 5).map((c) => (
                <Link key={c.id} to={`/campaigns/${c.id}`} className="flex items-center justify-between hover:bg-secondary/50 -mx-2 px-2 py-1.5 rounded-lg transition-colors">
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium truncate">{c.name}</p>
                    <p className="text-xs text-muted-foreground">{c.sentCount} sent · {c.repliedCount} replies</p>
                  </div>
                  <Badge className={`${statusColor[c.status]} border-0 text-[10px]`}>{c.status}</Badge>
                </Link>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex-row items-center justify-between">
            <CardTitle className="text-base">Recent Leads</CardTitle>
            <Link to="/leads" className="text-xs text-primary hover:underline">View all</Link>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {leads.slice(0, 5).map((l) => (
                <Link key={l.id} to={`/leads/${l.id}`} className="flex items-center gap-3 hover:bg-secondary/50 -mx-2 px-2 py-1.5 rounded-lg transition-colors">
                  <img src={l.avatar} alt="" className="h-8 w-8 rounded-full bg-secondary" />
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium truncate">{l.firstName} {l.lastName}</p>
                    <p className="text-xs text-muted-foreground truncate">{l.title} at {l.company}</p>
                  </div>
                  <Badge className={`${leadStatusColor[l.status]} border-0 text-[10px]`}>{l.status}</Badge>
                </Link>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Account Status</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <Linkedin className="h-4 w-4 text-primary" />
                <div className="flex-1">
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-muted-foreground">Connected Accounts</span>
                    <span className="font-medium">{connectedAccounts}/{linkedinAccounts.length}</span>
                  </div>
                </div>
              </div>
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-muted-foreground">Daily Limit Used</span>
                  <span className="font-medium">{totalDailyUsed}/{totalDailyLimit}</span>
                </div>
                <Progress value={totalDailyLimit > 0 ? calculatePercentage(totalDailyUsed, totalDailyLimit) : 0} className="h-2" />
              </div>
              <div className="flex items-center gap-3">
                <Mail className="h-4 w-4 text-info" />
                <div className="flex-1 flex justify-between text-sm">
                  <span className="text-muted-foreground">Pending Invites</span>
                  <span className="font-medium">{linkedinAccounts.reduce((s, a) => s + a.pendingInvites, 0)}</span>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Shield className="h-4 w-4 text-success" />
                <div className="flex-1 flex justify-between text-sm">
                  <span className="text-muted-foreground">Active Proxies</span>
                  <span className="font-medium">{activeProxies}/{proxies.length}</span>
                </div>
              </div>
              <div className="pt-2 border-t border-border space-y-2">
                {linkedinAccounts.map((acc) => (
                  <div key={acc.id} className="flex items-center gap-2 text-xs">
                    <img src={acc.avatar} alt="" className="h-5 w-5 rounded-full bg-secondary" />
                    <span className="flex-1 truncate">{acc.name}</span>
                    <span className="text-muted-foreground">{acc.usedToday}/{acc.dailyLimit}</span>
                    <div className={`h-1.5 w-1.5 rounded-full ${acc.status === "connected" ? "bg-success" : acc.status === "warming_up" ? "bg-warning" : "bg-destructive"}`} />
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Top Templates</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {analytics.topPerformingTemplates.map((t) => (
                <div key={t.templateId} className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium">{t.templateName}</p>
                    <p className="text-xs text-muted-foreground">{t.usageCount} uses</p>
                  </div>
                  <span className="text-sm font-bold text-success">{t.replyRate}%</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex-row items-center justify-between">
            <CardTitle className="text-base">Recent Inbox</CardTitle>
            <Link to="/inbox" className="text-xs text-primary hover:underline">View all</Link>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {inboxMessages.filter((m) => !m.archived).slice(0, 5).map((m) => (
                <div key={m.id} className="flex items-center gap-3">
                  <img src={m.leadAvatar} alt="" className="h-8 w-8 rounded-full bg-secondary" />
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium truncate">{m.leadName}</p>
                    <p className="text-xs text-muted-foreground truncate">{m.messages[m.messages.length - 1]?.content}</p>
                  </div>
                  {m.unread && <div className="h-2 w-2 rounded-full bg-primary shrink-0" />}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}