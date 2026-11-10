import { PageHeader } from "@/components/shared/PageHeader";
import { mockApps } from "@/lib/mock-data";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { formatNumber, formatDuration } from "@/lib/calculations";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

export default function AppsPage() {
  return (
    <div>
      <PageHeader title="Apps" description="Manage your monitored applications">
        <Button size="sm" onClick={() => toast.success("App created")}>Add App</Button>
      </PageHeader>
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {mockApps.map((app) => (
          <div key={app.id} className="rounded-lg border border-border bg-card p-5">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-semibold text-sm">{app.name}</h3>
              <StatusBadge status={app.status} />
            </div>
            <div className="flex gap-2 mb-3">
              <span className="rounded bg-muted px-2 py-0.5 text-[10px]">{app.environment}</span>
              <span className="rounded bg-muted px-2 py-0.5 text-[10px]">{app.language}</span>
              <span className="rounded bg-muted px-2 py-0.5 text-[10px]">{app.framework}</span>
            </div>
            <div className="grid grid-cols-3 gap-2 text-xs">
              <div><span className="text-muted-foreground block">Errors (24h)</span><span className="font-semibold">{app.errorCount24h}</span></div>
              <div><span className="text-muted-foreground block">Requests</span><span className="font-semibold">{formatNumber(app.requestCount24h)}</span></div>
              <div><span className="text-muted-foreground block">Avg Response</span><span className="font-semibold">{formatDuration(app.avgResponseTime)}</span></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
