import { mockAnalyticsData } from "@/data/mock-data";
import { formatCurrency, formatNumber } from "@/lib/calculations";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line } from "recharts";

const COLORS = ["hsl(152,69%,40%)", "hsl(210,100%,52%)", "hsl(38,92%,50%)", "hsl(280,65%,60%)"];

export default function AnalyticsPage() {
  const d = mockAnalyticsData;
  return (
    <div className="space-y-6">
      <h1 className="font-heading text-2xl font-bold">Analytics</h1>
      <div className="grid gap-6 lg:grid-cols-2">
        <div className="rounded-xl border border-border bg-card p-4"><h3 className="font-heading text-sm font-semibold">Revenue by Month</h3><div className="mt-4 h-64"><ResponsiveContainer width="100%" height="100%"><BarChart data={d.revenueByMonth}><XAxis dataKey="month" tick={{fontSize:12}} stroke="hsl(var(--muted-foreground))" /><YAxis tick={{fontSize:12}} stroke="hsl(var(--muted-foreground))" /><Tooltip /><Bar dataKey="revenue" fill="hsl(var(--primary))" radius={[4,4,0,0]} /></BarChart></ResponsiveContainer></div></div>
        <div className="rounded-xl border border-border bg-card p-4"><h3 className="font-heading text-sm font-semibold">Conversations by Channel</h3><div className="mt-4 h-64"><ResponsiveContainer width="100%" height="100%"><PieChart><Pie data={d.conversationsByChannel} dataKey="count" nameKey="channel" cx="50%" cy="50%" outerRadius={80} label>{d.conversationsByChannel.map((_,i)=><Cell key={i} fill={COLORS[i%COLORS.length]} />)}</Pie><Tooltip /></PieChart></ResponsiveContainer></div></div>
        <div className="rounded-xl border border-border bg-card p-4 lg:col-span-2"><h3 className="font-heading text-sm font-semibold">Daily Conversations</h3><div className="mt-4 h-64"><ResponsiveContainer width="100%" height="100%"><LineChart data={d.dailyConversations}><XAxis dataKey="date" tick={{fontSize:12}} stroke="hsl(var(--muted-foreground))" /><YAxis tick={{fontSize:12}} stroke="hsl(var(--muted-foreground))" /><Tooltip /><Line type="monotone" dataKey="count" stroke="hsl(var(--primary))" strokeWidth={2} /></LineChart></ResponsiveContainer></div></div>
      </div>
    </div>
  );
}
