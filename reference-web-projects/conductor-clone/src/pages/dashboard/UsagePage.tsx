import { StatCard } from "@/components/shared/StatCard";
import { mockUsageData } from "@/lib/mock-data";
import { BarChart3 } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";

export default function UsagePage() {
  const totalRequests = mockUsageData.reduce((a, b) => a + b.requests, 0);
  const totalErrors = mockUsageData.reduce((a, b) => a + b.errors, 0);

  return (
    <div className="space-y-6">
      <div><h1 className="text-2xl font-bold">Usage</h1><p className="mt-1 text-sm text-muted-foreground">API usage analytics.</p></div>
      <div className="grid gap-4 sm:grid-cols-3">
        <StatCard title="Total Requests (30d)" value={totalRequests.toLocaleString()} icon={<BarChart3 className="h-4 w-4" />} />
        <StatCard title="Total Errors (30d)" value={totalErrors} />
        <StatCard title="Avg Daily" value={Math.round(totalRequests / 30).toLocaleString()} />
      </div>
      <div className="rounded-lg border bg-card p-6">
        <h3 className="text-sm font-semibold">Daily Requests</h3>
        <div className="mt-4 h-80">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={mockUsageData}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis dataKey="date" tick={{ fontSize: 10 }} stroke="hsl(var(--muted-foreground))" tickFormatter={(v) => v.slice(5)} />
              <YAxis tick={{ fontSize: 10 }} stroke="hsl(var(--muted-foreground))" />
              <Tooltip contentStyle={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: 8, fontSize: 12 }} />
              <Bar dataKey="requests" fill="hsl(var(--primary))" radius={[2, 2, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
