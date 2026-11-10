import { BarChart3, Users, MessageSquare, Megaphone, ArrowUp, ArrowDown, TrendingUp } from "lucide-react";
import { MOCK_CAMPAIGNS, MOCK_CONTACTS, MOCK_CONVERSATIONS, MOCK_ANALYTICS } from "@/lib/mock-data";
import { aggregateAnalytics, formatNumber, formatCurrency } from "@/lib/calculations";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, CartesianGrid } from "recharts";

export default function DashboardOverview() {
  const analytics = aggregateAnalytics(MOCK_ANALYTICS);
  const activeContacts = MOCK_CONTACTS.filter((c) => c.status === "active").length;
  const activeCampaigns = MOCK_CAMPAIGNS.filter((c) => c.status === "active").length;
  const unreadConversations = MOCK_CONVERSATIONS.filter((c) => c.unread).length;

  const stats = [
    { label: "Total Sent", value: formatNumber(analytics.totalSent), icon: Megaphone, change: "+12.5%", up: true },
    { label: "Delivery Rate", value: `${analytics.avgDeliveryRate}%`, icon: BarChart3, change: "+2.1%", up: true },
    { label: "Reply Rate", value: `${analytics.avgReplyRate}%`, icon: MessageSquare, change: "+5.3%", up: true },
    { label: "Active Contacts", value: formatNumber(activeContacts), icon: Users, change: "+8", up: true },
  ];

  const recentChartData = MOCK_ANALYTICS.slice(-14).map((d) => ({
    date: d.date.slice(5),
    Sent: d.sent,
    Delivered: d.delivered,
    Replied: d.replied,
  }));

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-heading font-bold text-foreground">Dashboard</h1>
        <p className="text-muted-foreground text-sm">Welcome back! Here's your SMS marketing overview.</p>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((s) => (
          <Card key={s.label}>
            <CardContent className="p-5">
              <div className="flex items-center justify-between mb-3">
                <s.icon className="w-5 h-5 text-muted-foreground" />
                <span className={`flex items-center gap-1 text-xs font-medium ${s.up ? "text-success" : "text-destructive"}`}>
                  {s.up ? <ArrowUp className="w-3 h-3" /> : <ArrowDown className="w-3 h-3" />}
                  {s.change}
                </span>
              </div>
              <p className="text-2xl font-heading font-bold text-foreground">{s.value}</p>
              <p className="text-xs text-muted-foreground mt-1">{s.label}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2">
          <CardHeader><CardTitle className="text-base">Message Performance (Last 14 days)</CardTitle></CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={recentChartData}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                <XAxis dataKey="date" className="text-xs" tick={{ fill: "hsl(var(--muted-foreground))" }} />
                <YAxis className="text-xs" tick={{ fill: "hsl(var(--muted-foreground))" }} />
                <Tooltip contentStyle={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: "8px" }} />
                <Area type="monotone" dataKey="Sent" stroke="hsl(var(--primary))" fill="hsl(var(--primary) / 0.1)" strokeWidth={2} />
                <Area type="monotone" dataKey="Delivered" stroke="hsl(var(--success))" fill="hsl(var(--success) / 0.1)" strokeWidth={2} />
                <Area type="monotone" dataKey="Replied" stroke="hsl(var(--info))" fill="hsl(var(--info) / 0.1)" strokeWidth={2} />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle className="text-base">Quick Stats</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between p-3 bg-secondary rounded-lg">
              <span className="text-sm text-muted-foreground">Active Campaigns</span>
              <span className="font-semibold text-foreground">{activeCampaigns}</span>
            </div>
            <div className="flex items-center justify-between p-3 bg-secondary rounded-lg">
              <span className="text-sm text-muted-foreground">Unread Messages</span>
              <span className="font-semibold text-foreground">{unreadConversations}</span>
            </div>
            <div className="flex items-center justify-between p-3 bg-secondary rounded-lg">
              <span className="text-sm text-muted-foreground">Opt-Outs Today</span>
              <span className="font-semibold text-foreground">{analytics.totalOptOuts}</span>
            </div>
            <div className="flex items-center justify-between p-3 bg-secondary rounded-lg">
              <span className="text-sm text-muted-foreground">Credits Left</span>
              <span className="font-semibold text-foreground">4,250</span>
            </div>
            <div className="flex items-center justify-between p-3 bg-primary/10 rounded-lg">
              <span className="text-sm text-primary font-medium">Monthly Savings</span>
              <span className="font-semibold text-primary">{formatCurrency(1250)}</span>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader><CardTitle className="text-base">Recent Campaigns</CardTitle></CardHeader>
          <CardContent>
            <div className="space-y-3">
              {MOCK_CAMPAIGNS.slice(0, 4).map((c) => (
                <div key={c.id} className="flex items-center justify-between p-3 bg-secondary rounded-lg">
                  <div>
                    <p className="text-sm font-medium text-foreground">{c.name}</p>
                    <p className="text-xs text-muted-foreground">{formatNumber(c.sentCount)} sent · {formatNumber(c.repliedCount)} replies</p>
                  </div>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    c.status === "active" ? "bg-success/10 text-success" :
                    c.status === "completed" ? "bg-info/10 text-info" :
                    c.status === "paused" ? "bg-warning/10 text-warning" :
                    "bg-muted text-muted-foreground"
                  }`}>{c.status}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle className="text-base">Recent Conversations</CardTitle></CardHeader>
          <CardContent>
            <div className="space-y-3">
              {MOCK_CONVERSATIONS.slice(0, 4).map((c) => (
                <div key={c.id} className="flex items-center justify-between p-3 bg-secondary rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                      <span className="text-xs font-semibold text-primary">{c.contactName.split(" ").map(n => n[0]).join("")}</span>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-foreground">{c.contactName}</p>
                      <p className="text-xs text-muted-foreground truncate max-w-[200px]">{c.messages[c.messages.length - 1]?.body}</p>
                    </div>
                  </div>
                  {c.unread && <span className="w-2 h-2 rounded-full bg-primary" />}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
