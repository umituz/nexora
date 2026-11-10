import { PageHeader } from "@/components/shared/PageHeader";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { mockStatusComponents, mockStatusIncidents } from "@/lib/mock-data";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

export default function StatusPageDashboard() {
  const groups = [...new Set(mockStatusComponents.map((c) => c.group))];
  const allOperational = mockStatusComponents.every((c) => c.status === "operational");

  return (
    <div>
      <PageHeader title="Status Page" description="Public status page for your services">
        <Button size="sm" onClick={() => toast.success("Status page updated")}>Update Status</Button>
      </PageHeader>

      <div className={`rounded-lg border p-4 mb-6 ${allOperational ? "border-emerald-400/30 bg-emerald-400/5" : "border-yellow-400/30 bg-yellow-400/5"}`}>
        <p className={`font-semibold ${allOperational ? "text-emerald-400" : "text-yellow-400"}`}>
          {allOperational ? "All Systems Operational" : "Some Systems Experiencing Issues"}
        </p>
      </div>

      {groups.map((group) => (
        <div key={group} className="mb-6">
          <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground mb-3">{group}</h3>
          <div className="space-y-2">
            {mockStatusComponents.filter((c) => c.group === group).map((comp) => (
              <div key={comp.id} className="flex items-center justify-between rounded-lg border border-border bg-card px-4 py-3">
                <span className="text-sm font-medium">{comp.name}</span>
                <StatusBadge status={comp.status} />
              </div>
            ))}
          </div>
        </div>
      ))}

      <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground mb-3 mt-8">Recent Incidents</h3>
      <div className="space-y-4">
        {mockStatusIncidents.map((incident) => (
          <div key={incident.id} className="rounded-lg border border-border bg-card p-5">
            <div className="flex items-center justify-between mb-3">
              <h4 className="font-semibold text-sm">{incident.title}</h4>
              <StatusBadge status={incident.status} />
            </div>
            <div className="space-y-3">
              {incident.updates.map((update, i) => (
                <div key={i} className="border-l-2 border-border pl-3">
                  <p className="text-xs font-medium capitalize">{update.status}</p>
                  <p className="text-xs text-muted-foreground">{update.message}</p>
                  <p className="text-[10px] text-muted-foreground mt-1">{new Date(update.timestamp).toLocaleString()}</p>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
