import { DataTableShell } from "@/components/shared/DataTableShell";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { mockRequestLogs } from "@/lib/mock-data";
import { formatRelativeTime, formatDuration } from "@/lib/utils";
import { useState } from "react";
import { filterBySearch } from "@/lib/utils";

export default function RequestsPage() {
  const [search, setSearch] = useState("");
  const sorted = [...mockRequestLogs].sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
  const filtered = filterBySearch(sorted, search, ["endpoint", "method", "objectType"]);

  return (
    <DataTableShell title="Requests" description="View all API requests." searchPlaceholder="Search requests..." onSearch={setSearch}>
      <div className="rounded-lg border bg-card">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead><tr className="border-b text-xs text-muted-foreground">
              <th className="px-4 py-3 text-left font-medium">Method</th>
              <th className="px-4 py-3 text-left font-medium">Endpoint</th>
              <th className="px-4 py-3 text-left font-medium">Status</th>
              <th className="px-4 py-3 text-left font-medium">Duration</th>
              <th className="px-4 py-3 text-left font-medium">Object</th>
              <th className="px-4 py-3 text-left font-medium">Time</th>
            </tr></thead>
            <tbody>
              {filtered.slice(0, 25).map((r) => (
                <tr key={r.id} className="border-b last:border-0 hover:bg-muted/50">
                  <td className="px-4 py-3"><span className="rounded bg-muted px-1.5 py-0.5 font-mono text-xs">{r.method}</span></td>
                  <td className="px-4 py-3 font-mono text-sm">{r.endpoint}</td>
                  <td className="px-4 py-3"><StatusBadge status={r.statusCode < 400 ? "success" : "error"} /></td>
                  <td className="px-4 py-3 text-sm text-muted-foreground">{formatDuration(r.duration)}</td>
                  <td className="px-4 py-3 text-sm">{r.objectType}</td>
                  <td className="px-4 py-3 text-sm text-muted-foreground">{formatRelativeTime(r.timestamp)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </DataTableShell>
  );
}
