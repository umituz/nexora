import { Link } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { mockBots, mockDeployments, generateAnalyticsData } from "@/lib/mock-data";
import { formatNumber, timeAgo, calculateUsagePercentage } from "@/lib/calculations";
import { Progress } from "@/components/ui/progress";
import { Bot, Rocket, MessageSquare, Activity, TrendingUp, TrendingDown } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";

export default function DashboardOverview() {
  const analytics = generateAnalyticsData();
  const activeBots = mockBots.filter((b) => b.status === "active").length;
  const runningDeps = mockDeployments.filter((d) => d.status === "running").length;
  const usagePercent = calculateUsagePercentage(8300, 10000);

  const stats = [
    { label: "Active Bots", value: activeBots, icon: Bot, change: 12, total: mockBots.length },
    { label: "Running Deployments", value: runningDeps, icon: Rocket, change: 5, total: mockDeployments.length },
    { label: "Messages This Month", value: formatNumber(analytics.totalMessages), icon: MessageSquare, change: 18, total: null },
    { label: "Avg Response Time", value: `${analytics.avgResponseTime}s`, icon: Activity, change: -8, total: null },
  ];

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <Card key={stat.label}>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">{stat.label}</CardTitle>
              <stat.icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <div className="flex items-center gap-1 text-xs mt-1">
                {stat.change > 0 ? (
                  <TrendingUp className="h-3 w-3 text-success" />
                ) : (
                  <TrendingDown className="h-3 w-3 text-destructive" />
                )}
                <span className={stat.change > 0 ? "text-success" : "text-destructive"}>
                  {Math.abs(stat.change)}%
                </span>
                <span className="text-muted-foreground">vs last month</span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-4 lg:grid-cols-7">
        <Card className="lg:col-span-4">
          <CardHeader>
            <CardTitle className="text-base">Messages (Last 30 Days)</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={analytics.messagesByDay.slice(-14)}>
                <XAxis dataKey="date" tickFormatter={(d) => d.slice(5)} className="text-xs" />
                <YAxis className="text-xs" />
                <Tooltip />
                <Bar dataKey="count" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="lg:col-span-3">
          <CardHeader>
            <CardTitle className="text-base">Usage</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span className="text-muted-foreground">Messages</span>
                <span>8,300 / 10,000</span>
              </div>
              <Progress value={usagePercent} />
            </div>
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span className="text-muted-foreground">Bots</span>
                <span>{mockBots.length} / 5</span>
              </div>
              <Progress value={calculateUsagePercentage(mockBots.length, 5)} />
            </div>
            <div className="pt-2 border-t">
              <h4 className="text-sm font-medium mb-2">Top Bots</h4>
              {analytics.topBots.slice(0, 3).map((bot) => (
                <div key={bot.name} className="flex justify-between text-sm py-1">
                  <span className="text-muted-foreground">{bot.name}</span>
                  <span>{formatNumber(bot.messages)}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-base">Recent Bots</CardTitle>
          <Link to="/dashboard/bots" className="text-sm text-primary hover:underline">View all</Link>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {mockBots.slice(0, 4).map((bot) => (
              <div key={bot.id} className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="flex h-8 w-8 items-center justify-center rounded-md bg-primary/10 text-sm">
                    🤖
                  </div>
                  <div>
                    <Link to={`/dashboard/bots/${bot.id}`} className="text-sm font-medium hover:text-primary">
                      {bot.name}
                    </Link>
                    <p className="text-xs text-muted-foreground">{bot.platformId} · {timeAgo(bot.lastActive)}</p>
                  </div>
                </div>
                <Badge variant={bot.status === "active" ? "default" : "secondary"}>
                  {bot.status}
                </Badge>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
