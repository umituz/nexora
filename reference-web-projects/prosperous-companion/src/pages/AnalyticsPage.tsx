import { useData } from "@/contexts/DataContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, BarChart, Bar } from "recharts";
import { formatNumber } from "@/lib/calculations";

export default function AnalyticsPage() {
  const { analytics } = useData();
  const stats = [
    { label: "Total Sent", value: formatNumber(analytics.totalSent) },
    { label: "Total Replies", value: formatNumber(analytics.totalReplies) },
    { label: "Reply Rate", value: `${analytics.replyRate}%` },
    { label: "Acceptance Rate", value: `${analytics.acceptanceRate}%` },
    { label: "Conversions", value: formatNumber(analytics.totalConverted) },
    { label: "Conversion Rate", value: `${analytics.conversionRate}%` },
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      <div><h1 className="text-2xl font-bold">Analytics</h1><p className="text-muted-foreground">Detailed performance insights</p></div>
      <div className="grid gap-4 md:grid-cols-3 lg:grid-cols-6">
        {stats.map((s) => (
          <Card key={s.label}><CardContent className="p-4"><p className="text-2xl font-bold">{s.value}</p><p className="text-xs text-muted-foreground">{s.label}</p></CardContent></Card>
        ))}
      </div>
      <div className="grid gap-6 lg:grid-cols-2">
        <Card><CardHeader><CardTitle className="text-base">Activity Over Time</CardTitle></CardHeader>
          <CardContent><div className="h-[300px]"><ResponsiveContainer width="100%" height="100%">
            <AreaChart data={analytics.dailyStats}>
              <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
              <XAxis dataKey="date" tick={{ fontSize: 11 }} tickFormatter={(v) => v.slice(5)} />
              <YAxis tick={{ fontSize: 11 }} />
              <Tooltip contentStyle={{ backgroundColor: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: 8 }} />
              <Area type="monotone" dataKey="sent" stroke="hsl(var(--primary))" fill="hsl(var(--primary) / 0.15)" strokeWidth={2} />
              <Area type="monotone" dataKey="replies" stroke="hsl(var(--success))" fill="hsl(var(--success) / 0.15)" strokeWidth={2} />
              <Area type="monotone" dataKey="accepted" stroke="hsl(var(--info))" fill="hsl(var(--info) / 0.15)" strokeWidth={2} />
            </AreaChart>
          </ResponsiveContainer></div></CardContent>
        </Card>
        <Card><CardHeader><CardTitle className="text-base">Campaign Comparison</CardTitle></CardHeader>
          <CardContent><div className="h-[300px]"><ResponsiveContainer width="100%" height="100%">
            <BarChart data={analytics.campaignPerformance}>
              <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
              <XAxis dataKey="campaignName" tick={{ fontSize: 10 }} />
              <YAxis tick={{ fontSize: 11 }} />
              <Tooltip contentStyle={{ backgroundColor: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: 8 }} />
              <Bar dataKey="sent" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
              <Bar dataKey="replies" fill="hsl(var(--success))" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer></div></CardContent>
        </Card>
      </div>
    </div>
  );
}
