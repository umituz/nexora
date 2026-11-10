import { PageHeader } from "@/components/shared/PageHeader";
import { DataTable } from "@/components/shared/DataTable";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { mockInvitations } from "@/lib/mock-data";
import { formatDate } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

export default function InvitationsPage() {
  return (
    <div className="animate-fade-in">
      <PageHeader title="Invitations" description="Pending team invitations" actions={<Button size="sm"><Plus className="h-4 w-4 mr-1" /> Send Invite</Button>} />
      <DataTable headers={["Email", "Role", "Invited By", "Status", "Sent", "Expires"]}>
        {mockInvitations.map((inv) => (
          <tr key={inv.id} className="hover:bg-secondary/30 transition-colors">
            <td className="px-4 py-3 text-foreground">{inv.email}</td>
            <td className="px-4 py-3 text-muted-foreground capitalize">{inv.role}</td>
            <td className="px-4 py-3 text-muted-foreground">{inv.invitedBy}</td>
            <td className="px-4 py-3"><StatusBadge status={inv.status} /></td>
            <td className="px-4 py-3 text-muted-foreground">{formatDate(inv.createdAt)}</td>
            <td className="px-4 py-3 text-muted-foreground">{formatDate(inv.expiresAt)}</td>
          </tr>
        ))}
      </DataTable>
    </div>
  );
}
