import { PageHeader } from "@/components/shared/PageHeader";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { mockUptimeMonitors } from "@/lib/mock-data";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

export default function UptimeMonitoringPage() {
  return (
    <div>
      <PageHeader title="Uptime Monitoring" description="Monitor endpoint availability">
        <Button size="sm" onClick={() => toast.success("Monitor created")}>Add Monitor</Button>
      </PageHeader>
      <div className="space-y-3">
        {mockUptimeMonitors.map((m) => (
          <Link key={m.id} to={`/dashboard/uptime/${m.id}`} className="block rounded-lg border border-border bg-card p-4 hover:border-primary/30 transition-colors">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <h3 className="font-semibold text-sm">{m.name}</h3>
                <p className="text-xs text-muted-foreground font-mono">{m.url}</p>
              </div>
              <div className="flex items-center gap-4">
                <span className="text-xs text-muted-foreground">{m.responseTime}ms</span>
                <span className="text-xs text-muted-foreground">{m.uptime30d}%</span>
                <StatusBadge status={m.status} />
              </div>
            </div>
            <div className="flex gap-2 mt-2">{m.regions.map((r) => <span key={r} className="rounded bg-muted px-2 py-0.5 text-[10px]">{r}</span>)}</div>
          </Link>
        ))}
      </div>
    </div>
  );
}
