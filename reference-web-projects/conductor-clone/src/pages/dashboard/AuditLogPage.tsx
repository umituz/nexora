import { mockAuditLog } from "@/lib/mock-data";
import { formatRelativeTime } from "@/lib/utils";

export default function AuditLogPage() {
  return (
    <div className="space-y-6">
      <div><h1 className="text-2xl font-bold">Audit Log</h1><p className="mt-1 text-sm text-muted-foreground">Track all account activity.</p></div>
      <div className="rounded-lg border bg-card">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead><tr className="border-b text-xs text-muted-foreground">
              <th className="px-4 py-3 text-left font-medium">Action</th>
              <th className="px-4 py-3 text-left font-medium">Actor</th>
              <th className="px-4 py-3 text-left font-medium">Resource</th>
              <th className="px-4 py-3 text-left font-medium">Details</th>
              <th className="px-4 py-3 text-left font-medium">Time</th>
            </tr></thead>
            <tbody>
              {mockAuditLog.map((a) => (
                <tr key={a.id} className="border-b last:border-0 hover:bg-muted/50">
                  <td className="px-4 py-3 font-mono text-xs">{a.action}</td>
                  <td className="px-4 py-3 text-sm">{a.actor}</td>
                  <td className="px-4 py-3 text-sm text-muted-foreground">{a.resource}</td>
                  <td className="px-4 py-3 text-sm text-muted-foreground">{a.details}</td>
                  <td className="px-4 py-3 text-sm text-muted-foreground">{formatRelativeTime(a.timestamp)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
