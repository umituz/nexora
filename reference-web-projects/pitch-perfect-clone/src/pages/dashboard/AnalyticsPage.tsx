import { MOCK_ANALYTICS } from "@/lib/mock-data";
import { aggregateAnalytics, formatNumber } from "@/lib/calculations";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, LineChart, Line } from "recharts";

export default function AnalyticsPage() {
  const analytics = aggregateAnalytics(MOCK_ANALYTICS);
  const chartData = MOCK_ANALYTICS.map((d) => ({ date: d.date.slice(5), ...d }));

  return (
    <div className="space-y-6 animate-fade-in">
      <div><h1 className="text-2xl font-heading font-bold text-foreground">Analytics</h1><p className="text-sm text-muted-foreground">Track your SMS performance</p></div>
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "Total Sent", value: formatNumber(analytics.totalSent) },
          { label: "Total Delivered", value: formatNumber(analytics.totalDelivered) },
          { label: "Avg Delivery Rate", value: `${analytics.avgDeliveryRate}%` },
          { label: "Avg Reply Rate", value: `${analytics.avgReplyRate}%` },
        ].map((s) => (
          <Card key={s.label}><CardContent className="p-5"><p className="text-2xl font-heading font-bold text-foreground">{s.value}</p><p className="text-xs text-muted-foreground mt-1">{s.label}</p></CardContent></Card>
        ))}
      </div>
      <div className="grid lg:grid-cols-2 gap-6">
        <Card><CardHeader><CardTitle className="text-base">Messages Sent</CardTitle></CardHeader><CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={chartData}><CartesianGrid strokeDasharray="3 3" className="stroke-border" /><XAxis dataKey="date" tick={{fill:"hsl(var(--muted-foreground))",fontSize:12}} /><YAxis tick={{fill:"hsl(var(--muted-foreground))",fontSize:12}} /><Tooltip /><Bar dataKey="sent" fill="hsl(var(--primary))" radius={[4,4,0,0]} /></BarChart>
          </ResponsiveContainer>
        </CardContent></Card>
        <Card><CardHeader><CardTitle className="text-base">Reply Rate Trend</CardTitle></CardHeader><CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={chartData.map(d=>({...d,replyRate:d.delivered>0?Math.round(d.replied/d.delivered*100):0}))}><CartesianGrid strokeDasharray="3 3" className="stroke-border" /><XAxis dataKey="date" tick={{fill:"hsl(var(--muted-foreground))",fontSize:12}} /><YAxis tick={{fill:"hsl(var(--muted-foreground))",fontSize:12}} /><Tooltip /><Line type="monotone" dataKey="replyRate" stroke="hsl(var(--primary))" strokeWidth={2} dot={false} /></LineChart>
          </ResponsiveContainer>
        </CardContent></Card>
      </div>
    </div>
  );
}
