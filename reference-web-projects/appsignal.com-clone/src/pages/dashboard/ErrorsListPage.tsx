import { PageHeader } from "@/components/shared/PageHeader";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { mockErrors } from "@/lib/mock-data";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useState } from "react";

export default function ErrorsListPage() {
  const [filter, setFilter] = useState<string>("all");
  const filtered = filter === "all" ? mockErrors : mockErrors.filter((e) => e.status === filter);

  return (
    <div>
      <PageHeader title="Errors" description="Track and manage application errors">
        <div className="flex gap-2">
          {["all", "open", "closed", "ignored"].map((f) => (
            <Button key={f} size="sm" variant={filter === f ? "default" : "outline"} onClick={() => setFilter(f)} className="capitalize">{f}</Button>
          ))}
        </div>
      </PageHeader>
      <div className="rounded-lg border border-border bg-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead><tr className="border-b border-border bg-muted/50">
              <th className="text-left px-4 py-3 font-medium">Error</th>
              <th className="text-left px-4 py-3 font-medium hidden md:table-cell">Action</th>
              <th className="text-left px-4 py-3 font-medium">Count</th>
              <th className="text-left px-4 py-3 font-medium hidden sm:table-cell">Last Seen</th>
              <th className="text-left px-4 py-3 font-medium">Status</th>
              <th className="text-left px-4 py-3 font-medium">Severity</th>
            </tr></thead>
            <tbody>
              {filtered.map((err) => (
                <tr key={err.id} className="border-b border-border hover:bg-accent/50 transition-colors">
                  <td className="px-4 py-3"><Link to={`/dashboard/errors/${err.id}`} className="font-medium text-primary hover:underline">{err.name}</Link><p className="text-xs text-muted-foreground truncate max-w-[200px]">{err.message}</p></td>
                  <td className="px-4 py-3 font-mono text-xs text-muted-foreground hidden md:table-cell">{err.action}</td>
                  <td className="px-4 py-3 font-mono">{err.count}</td>
                  <td className="px-4 py-3 text-muted-foreground hidden sm:table-cell">{err.lastSeen}</td>
                  <td className="px-4 py-3"><StatusBadge status={err.status} /></td>
                  <td className="px-4 py-3"><StatusBadge status={err.severity} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
