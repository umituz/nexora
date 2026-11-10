import { useState } from "react";
import { DataTableShell } from "@/components/shared/DataTableShell";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { Button } from "@/components/ui/button";
import { mockConnections } from "@/lib/mock-data";
import { filterBySearch, formatRelativeTime, formatNumber } from "@/lib/utils";
import { Plus } from "lucide-react";

export default function ConnectionsPage() {
  const [search, setSearch] = useState("");
  const filtered = filterBySearch(mockConnections, search, ["companyName", "companyFile", "status"]);

  return (
    <DataTableShell title="Connections" description="Manage your QuickBooks Desktop connections." searchPlaceholder="Search connections..." onSearch={setSearch} actions={<Button className="gradient-mint shadow-mint"><Plus className="mr-2 h-4 w-4" />New Connection</Button>}>
      <div className="rounded-lg border bg-card">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead><tr className="border-b text-xs text-muted-foreground">
              <th className="px-4 py-3 text-left font-medium">Company</th>
              <th className="px-4 py-3 text-left font-medium">Status</th>
              <th className="px-4 py-3 text-left font-medium">QB Version</th>
              <th className="px-4 py-3 text-left font-medium">Last Sync</th>
              <th className="px-4 py-3 text-right font-medium">Requests</th>
              <th className="px-4 py-3 text-right font-medium">Errors</th>
            </tr></thead>
            <tbody>
              {filtered.map((c) => (
                <tr key={c.id} className="border-b last:border-0 hover:bg-muted/50 cursor-pointer">
                  <td className="px-4 py-3"><div><p className="text-sm font-medium">{c.companyName}</p><p className="text-xs text-muted-foreground">{c.endUserId}</p></div></td>
                  <td className="px-4 py-3"><StatusBadge status={c.status} /></td>
                  <td className="px-4 py-3 text-sm text-muted-foreground">{c.qbVersion}</td>
                  <td className="px-4 py-3 text-sm text-muted-foreground">{formatRelativeTime(c.lastSyncAt)}</td>
                  <td className="px-4 py-3 text-right text-sm">{formatNumber(c.requestCount)}</td>
                  <td className="px-4 py-3 text-right text-sm">{c.errorCount}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </DataTableShell>
  );
}
