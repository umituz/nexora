import { useState } from "react";
import { DataTableShell } from "@/components/shared/DataTableShell";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { mockEndUsers } from "@/lib/mock-data";
import { filterBySearch, formatRelativeTime, formatDate } from "@/lib/utils";

export default function EndUsersPage() {
  const [search, setSearch] = useState("");
  const filtered = filterBySearch(mockEndUsers, search, ["email", "companyName"]);

  return (
    <DataTableShell title="End Users" description="Your end-users who have connected QuickBooks Desktop." searchPlaceholder="Search end users..." onSearch={setSearch}>
      <div className="rounded-lg border bg-card">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead><tr className="border-b text-xs text-muted-foreground">
              <th className="px-4 py-3 text-left font-medium">Email</th>
              <th className="px-4 py-3 text-left font-medium">Company</th>
              <th className="px-4 py-3 text-left font-medium">Status</th>
              <th className="px-4 py-3 text-left font-medium">Connections</th>
              <th className="px-4 py-3 text-left font-medium">Created</th>
              <th className="px-4 py-3 text-left font-medium">Last Active</th>
            </tr></thead>
            <tbody>
              {filtered.map((u) => (
                <tr key={u.id} className="border-b last:border-0 hover:bg-muted/50">
                  <td className="px-4 py-3 text-sm font-medium">{u.email}</td>
                  <td className="px-4 py-3 text-sm text-muted-foreground">{u.companyName}</td>
                  <td className="px-4 py-3"><StatusBadge status={u.status} /></td>
                  <td className="px-4 py-3 text-sm">{u.connectionsCount}</td>
                  <td className="px-4 py-3 text-sm text-muted-foreground">{formatDate(u.createdAt)}</td>
                  <td className="px-4 py-3 text-sm text-muted-foreground">{formatRelativeTime(u.lastActiveAt)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </DataTableShell>
  );
}
