import { DataTableShell } from "@/components/shared/DataTableShell";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { mockErrorLogs } from "@/lib/mock-data";
import { formatRelativeTime } from "@/lib/utils";

export default function ErrorsPage() {
  return (
    <DataTableShell title="Error Monitor" description="Track and resolve errors.">
      <div className="rounded-lg border bg-card">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead><tr className="border-b text-xs text-muted-foreground">
              <th className="px-4 py-3 text-left font-medium">Code</th>
              <th className="px-4 py-3 text-left font-medium">Message</th>
              <th className="px-4 py-3 text-left font-medium">Type</th>
              <th className="px-4 py-3 text-left font-medium">Status</th>
              <th className="px-4 py-3 text-left font-medium">End User</th>
              <th className="px-4 py-3 text-left font-medium">Time</th>
            </tr></thead>
            <tbody>
              {mockErrorLogs.map((e) => (
                <tr key={e.id} className="border-b last:border-0 hover:bg-muted/50">
                  <td className="px-4 py-3 font-mono text-xs">{e.code}</td>
                  <td className="px-4 py-3 text-sm">{e.message}</td>
                  <td className="px-4 py-3 text-xs text-muted-foreground">{e.type}</td>
                  <td className="px-4 py-3"><StatusBadge status={e.resolved ? "resolved" : "error"} /></td>
                  <td className="px-4 py-3 text-xs text-muted-foreground">{e.endUserId}</td>
                  <td className="px-4 py-3 text-xs text-muted-foreground">{formatRelativeTime(e.timestamp)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </DataTableShell>
  );
}
