import { DataTableShell } from "@/components/shared/DataTableShell";
import { mockRequestLogs } from "@/lib/mock-data";
import { formatRelativeTime, formatDuration } from "@/lib/utils";

export default function LogsPage() {
  const sorted = [...mockRequestLogs].sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());

  return (
    <DataTableShell title="Logs" description="Detailed activity logs.">
      <div className="rounded-lg border bg-card">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead><tr className="border-b text-xs text-muted-foreground">
              <th className="px-4 py-3 text-left font-medium">Timestamp</th>
              <th className="px-4 py-3 text-left font-medium">Method</th>
              <th className="px-4 py-3 text-left font-medium">Endpoint</th>
              <th className="px-4 py-3 text-left font-medium">Status</th>
              <th className="px-4 py-3 text-left font-medium">Duration</th>
              <th className="px-4 py-3 text-left font-medium">End User</th>
            </tr></thead>
            <tbody>
              {sorted.slice(0, 30).map((r) => (
                <tr key={r.id} className="border-b last:border-0 hover:bg-muted/50 font-mono text-xs">
                  <td className="px-4 py-3 text-muted-foreground">{formatRelativeTime(r.timestamp)}</td>
                  <td className="px-4 py-3">{r.method}</td>
                  <td className="px-4 py-3">{r.endpoint}</td>
                  <td className="px-4 py-3"><span className={r.statusCode < 400 ? "text-emerald-500" : "text-red-500"}>{r.statusCode}</span></td>
                  <td className="px-4 py-3 text-muted-foreground">{formatDuration(r.duration)}</td>
                  <td className="px-4 py-3 text-muted-foreground">{r.endUserId}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </DataTableShell>
  );
}
