import { PageHeader } from "@/components/shared/PageHeader";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { mockHosts } from "@/lib/mock-data";
import { Link } from "react-router-dom";
import { formatPercentage } from "@/lib/calculations";

export default function HostMonitoringPage() {
  return (
    <div>
      <PageHeader title="Host Monitoring" description="Monitor server health and resource usage" />
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {mockHosts.map((host) => (
          <Link key={host.id} to={`/dashboard/hosts/${host.id}`} className="rounded-lg border border-border bg-card p-5 hover:border-primary/30 transition-colors">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-mono text-sm font-semibold">{host.hostname}</h3>
              <StatusBadge status={host.status} />
            </div>
            <div className="space-y-3">
              {[
                { label: "CPU", value: host.cpuUsage },
                { label: "Memory", value: host.memoryUsage },
                { label: "Disk", value: host.diskUsage },
              ].map((m) => (
                <div key={m.label}>
                  <div className="flex justify-between text-xs mb-1"><span className="text-muted-foreground">{m.label}</span><span>{formatPercentage(m.value, 0)}</span></div>
                  <div className="h-1.5 rounded-full bg-muted overflow-hidden">
                    <div className={`h-full rounded-full transition-all ${m.value > 90 ? "bg-red-400" : m.value > 70 ? "bg-yellow-400" : "bg-emerald-400"}`} style={{ width: `${m.value}%` }} />
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-4 flex justify-between text-xs text-muted-foreground">
              <span>{host.os}</span>
              <span>Up {host.uptime}</span>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
