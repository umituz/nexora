import { DataTableShell } from "@/components/shared/DataTableShell";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { Button } from "@/components/ui/button";
import { mockSupportTickets } from "@/lib/mock-data";
import { formatRelativeTime } from "@/lib/utils";
import { Plus } from "lucide-react";

export default function DashboardSupportPage() {
  return (
    <DataTableShell title="Support Tickets" description="Get help from our team." actions={<Button className="gradient-mint shadow-mint"><Plus className="mr-2 h-4 w-4" />New Ticket</Button>}>
      <div className="rounded-lg border bg-card">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead><tr className="border-b text-xs text-muted-foreground">
              <th className="px-4 py-3 text-left font-medium">Subject</th>
              <th className="px-4 py-3 text-left font-medium">Priority</th>
              <th className="px-4 py-3 text-left font-medium">Status</th>
              <th className="px-4 py-3 text-left font-medium">Messages</th>
              <th className="px-4 py-3 text-left font-medium">Updated</th>
            </tr></thead>
            <tbody>
              {mockSupportTickets.map((t) => (
                <tr key={t.id} className="border-b last:border-0 hover:bg-muted/50">
                  <td className="px-4 py-3 text-sm font-medium">{t.subject}</td>
                  <td className="px-4 py-3"><StatusBadge status={t.priority} /></td>
                  <td className="px-4 py-3"><StatusBadge status={t.status} /></td>
                  <td className="px-4 py-3 text-sm">{t.messages}</td>
                  <td className="px-4 py-3 text-sm text-muted-foreground">{formatRelativeTime(t.updatedAt)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </DataTableShell>
  );
}
