import { APP_NAME } from "@/constants/app";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { mockStatusComponents, mockStatusIncidents } from "@/lib/mock-data";
import { Link } from "react-router-dom";

export default function PublicStatusPage() {
  const groups = [...new Set(mockStatusComponents.map((c) => c.group))];
  const allOperational = mockStatusComponents.every((c) => c.status === "operational");

  return (
    <div className="py-20">
      <div className="container max-w-3xl">
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center gap-2 font-bold text-xl mb-4">
            <span className="text-primary">⬡</span>
            <span>{APP_NAME}</span>
          </Link>
          <h1 className="text-3xl font-bold">System Status</h1>
        </div>

        <div className={`rounded-lg border p-4 mb-8 text-center ${allOperational ? "border-emerald-400/30 bg-emerald-400/5" : "border-yellow-400/30 bg-yellow-400/5"}`}>
          <p className={`font-semibold text-lg ${allOperational ? "text-emerald-400" : "text-yellow-400"}`}>
            {allOperational ? "All Systems Operational" : "Some Systems Experiencing Issues"}
          </p>
        </div>

        {groups.map((group) => (
          <div key={group} className="mb-6">
            <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground mb-3">{group}</h3>
            <div className="space-y-2">
              {mockStatusComponents.filter((c) => c.group === group).map((comp) => (
                <div key={comp.id} className="flex items-center justify-between rounded-lg border border-border bg-card px-4 py-3">
                  <span className="text-sm">{comp.name}</span>
                  <StatusBadge status={comp.status} />
                </div>
              ))}
            </div>
          </div>
        ))}

        <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground mb-3 mt-10">Recent Incidents</h3>
        <div className="space-y-4">
          {mockStatusIncidents.map((incident) => (
            <div key={incident.id} className="rounded-lg border border-border bg-card p-5">
              <div className="flex items-center justify-between mb-3">
                <h4 className="font-semibold text-sm">{incident.title}</h4>
                <StatusBadge status={incident.status} />
              </div>
              {incident.updates.map((update, i) => (
                <div key={i} className="border-l-2 border-border pl-3 mb-2">
                  <p className="text-xs font-medium capitalize">{update.status}</p>
                  <p className="text-xs text-muted-foreground">{update.message}</p>
                  <p className="text-[10px] text-muted-foreground mt-1">{new Date(update.timestamp).toLocaleString()}</p>
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
