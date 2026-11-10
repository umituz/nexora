import { useParams, Link } from "react-router-dom";
import { PageHeader } from "@/components/shared/PageHeader";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { mockErrors, generateTimeSeriesData } from "@/lib/mock-data";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useMemo } from "react";
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import { toast } from "sonner";

export default function ErrorDetailPage() {
  const { id } = useParams<{ id: string }>();
  const error = mockErrors.find((e) => e.id === id) ?? mockErrors[0];
  const trendData = useMemo(() => generateTimeSeriesData(48, error.count / 48, error.count / 96), [error]);

  return (
    <div>
      <Link to="/dashboard/errors" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary mb-4">
        <ArrowLeft className="h-4 w-4" />Back to Errors
      </Link>
      <PageHeader title={error.name} description={error.message}>
        <div className="flex gap-2">
          <Button size="sm" variant="outline" onClick={() => toast.success("Error status updated")}>Resolve</Button>
          <Button size="sm" variant="outline" onClick={() => toast.success("Error ignored")}>Ignore</Button>
        </div>
      </PageHeader>

      <div className="grid lg:grid-cols-3 gap-6 mb-6">
        <div className="rounded-lg border border-border bg-card p-4">
          <p className="text-xs text-muted-foreground mb-1">Status</p>
          <StatusBadge status={error.status} />
        </div>
        <div className="rounded-lg border border-border bg-card p-4">
          <p className="text-xs text-muted-foreground mb-1">Severity</p>
          <StatusBadge status={error.severity} />
        </div>
        <div className="rounded-lg border border-border bg-card p-4">
          <p className="text-xs text-muted-foreground mb-1">Occurrences</p>
          <p className="text-xl font-bold">{error.count}</p>
        </div>
      </div>

      <div className="rounded-lg border border-border bg-card p-4 mb-6">
        <h3 className="text-sm font-semibold mb-4">Error Trend</h3>
        <ResponsiveContainer width="100%" height={200}>
          <AreaChart data={trendData}>
            <XAxis dataKey="time" tick={{ fontSize: 10 }} stroke="hsl(var(--muted-foreground))" tickLine={false} axisLine={false} />
            <YAxis tick={{ fontSize: 10 }} stroke="hsl(var(--muted-foreground))" tickLine={false} axisLine={false} />
            <Tooltip contentStyle={{ backgroundColor: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: 8, fontSize: 12 }} />
            <Area type="monotone" dataKey="value" stroke="hsl(var(--chart-1))" fill="hsl(var(--chart-1))" fillOpacity={0.1} strokeWidth={2} />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        <div className="rounded-lg border border-border bg-card p-4">
          <h3 className="text-sm font-semibold mb-3">Details</h3>
          <dl className="space-y-2 text-sm">
            <div className="flex justify-between"><dt className="text-muted-foreground">Action</dt><dd className="font-mono text-xs">{error.action}</dd></div>
            <div className="flex justify-between"><dt className="text-muted-foreground">Namespace</dt><dd>{error.namespace}</dd></div>
            <div className="flex justify-between"><dt className="text-muted-foreground">First seen</dt><dd>{error.firstSeen}</dd></div>
            <div className="flex justify-between"><dt className="text-muted-foreground">Last seen</dt><dd>{error.lastSeen}</dd></div>
            <div className="flex justify-between"><dt className="text-muted-foreground">Type</dt><dd>{error.errorType}</dd></div>
          </dl>
        </div>
        <div className="rounded-lg border border-border bg-card p-4">
          <h3 className="text-sm font-semibold mb-3">Tags</h3>
          <div className="flex flex-wrap gap-2">
            {error.tags.map((tag) => (
              <span key={tag} className="rounded-full bg-muted px-3 py-1 text-xs font-medium">{tag}</span>
            ))}
          </div>
          <h3 className="text-sm font-semibold mb-3 mt-6">Backtrace</h3>
          <pre className="text-xs text-muted-foreground font-mono bg-muted/50 rounded p-3 overflow-x-auto">
{`${error.action}
  at app/controllers/${error.action.split("#")[0].toLowerCase()}.rb:42
  at middleware/error_handler.rb:15
  at rack/runtime.rb:22`}
          </pre>
        </div>
      </div>
    </div>
  );
}
