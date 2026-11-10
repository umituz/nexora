import { PageHeader } from "@/components/shared/PageHeader";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { mockDeploys } from "@/lib/mock-data";
import { Rocket } from "lucide-react";

export default function DeploysPage() {
  return (
    <div>
      <PageHeader title="Deploys" description="Track deployment history and impact" />
      <div className="space-y-3">
        {mockDeploys.map((dep) => (
          <div key={dep.id} className="rounded-lg border border-border bg-card p-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div className="flex items-center gap-3">
                <Rocket className="h-5 w-5 text-muted-foreground shrink-0" />
                <div>
                  <h3 className="font-semibold text-sm">{dep.version} <span className="font-normal text-muted-foreground">— {dep.description}</span></h3>
                  <p className="text-xs text-muted-foreground">by {dep.deployer} · {new Date(dep.timestamp).toLocaleDateString()} · {dep.duration}s · {dep.changes} changes</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="flex gap-2 text-xs">
                  <span className={dep.markers.errors > 0 ? "text-red-400" : "text-emerald-400"}>Errors: {dep.markers.errors > 0 ? "+" : ""}{dep.markers.errors}</span>
                  <span className={dep.markers.performance > 0 ? "text-red-400" : "text-emerald-400"}>Perf: {dep.markers.performance > 0 ? "+" : ""}{dep.markers.performance}ms</span>
                </div>
                <StatusBadge status={dep.status} />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
