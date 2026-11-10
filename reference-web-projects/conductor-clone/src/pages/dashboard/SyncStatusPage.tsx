import { DataTableShell } from "@/components/shared/DataTableShell";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { mockSyncJobs } from "@/lib/mock-data";
import { formatRelativeTime } from "@/lib/utils";
import { Progress } from "@/components/ui/progress";

export default function SyncStatusPage() {
  return (
    <DataTableShell title="Sync Status" description="Monitor sync jobs.">
      <div className="rounded-lg border bg-card">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead><tr className="border-b text-xs text-muted-foreground">
              <th className="px-4 py-3 text-left font-medium">Company</th>
              <th className="px-4 py-3 text-left font-medium">Object</th>
              <th className="px-4 py-3 text-left font-medium">Status</th>
              <th className="px-4 py-3 text-left font-medium">Progress</th>
              <th className="px-4 py-3 text-left font-medium">Started</th>
            </tr></thead>
            <tbody>
              {mockSyncJobs.map((j) => (
                <tr key={j.id} className="border-b last:border-0 hover:bg-muted/50">
                  <td className="px-4 py-3 text-sm font-medium">{j.companyName}</td>
                  <td className="px-4 py-3 text-sm">{j.objectType}</td>
                  <td className="px-4 py-3"><StatusBadge status={j.status} /></td>
                  <td className="px-4 py-3 w-40"><Progress value={j.recordsTotal > 0 ? (j.recordsProcessed / j.recordsTotal) * 100 : 0} className="h-2" /><span className="text-xs text-muted-foreground">{j.recordsProcessed}/{j.recordsTotal}</span></td>
                  <td className="px-4 py-3 text-sm text-muted-foreground">{formatRelativeTime(j.startedAt)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </DataTableShell>
  );
}
