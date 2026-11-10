import { PageHeader } from "@/components/shared/PageHeader";
import { StatCard } from "@/components/shared/StatCard";
import { mockMetrics } from "@/lib/mock-data";
import { LineChart, Line, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

export default function MetricsPage() {
  return (
    <div className="animate-fade-in">
      <PageHeader title="Metrics" description="Application performance metrics" />
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
        {mockMetrics.map((m) => (
          <StatCard key={m.name} title={m.name} value={`${m.value}${m.unit === "%" ? "%" : ` ${m.unit}`}`} change={m.change} />
        ))}
      </div>
      <div className="grid lg:grid-cols-2 gap-6">
        {mockMetrics.slice(0, 4).map((m) => (
          <div key={m.name} className="bg-card border border-border rounded-lg p-5">
            <h3 className="font-semibold text-foreground mb-4">{m.name}</h3>
            <div className="h-48">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={m.data}>
                  <XAxis dataKey="time" tick={{ fontSize: 10 }} stroke="hsl(var(--muted-foreground))" />
                  <YAxis tick={{ fontSize: 10 }} stroke="hsl(var(--muted-foreground))" />
                  <Tooltip />
                  <Line type="monotone" dataKey="value" stroke="hsl(var(--primary))" strokeWidth={2} dot={false} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
