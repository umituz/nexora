import { DataTableShell } from "@/components/shared/DataTableShell";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { Button } from "@/components/ui/button";
import { mockTeamMembers } from "@/lib/mock-data";
import { formatDate, formatRelativeTime } from "@/lib/utils";
import { UserPlus } from "lucide-react";

export default function TeamPage() {
  return (
    <DataTableShell title="Team" description="Manage team members." actions={<Button className="gradient-mint shadow-mint"><UserPlus className="mr-2 h-4 w-4" />Invite Member</Button>}>
      <div className="rounded-lg border bg-card">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead><tr className="border-b text-xs text-muted-foreground">
              <th className="px-4 py-3 text-left font-medium">Name</th>
              <th className="px-4 py-3 text-left font-medium">Email</th>
              <th className="px-4 py-3 text-left font-medium">Role</th>
              <th className="px-4 py-3 text-left font-medium">Joined</th>
              <th className="px-4 py-3 text-left font-medium">Last Active</th>
            </tr></thead>
            <tbody>
              {mockTeamMembers.map((m) => (
                <tr key={m.id} className="border-b last:border-0 hover:bg-muted/50">
                  <td className="px-4 py-3 text-sm font-medium">{m.name}</td>
                  <td className="px-4 py-3 text-sm text-muted-foreground">{m.email}</td>
                  <td className="px-4 py-3"><StatusBadge status={m.role === "owner" ? "active" : m.role} /></td>
                  <td className="px-4 py-3 text-sm text-muted-foreground">{formatDate(m.joinedAt)}</td>
                  <td className="px-4 py-3 text-sm text-muted-foreground">{formatRelativeTime(m.lastActiveAt)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </DataTableShell>
  );
}
