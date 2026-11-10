import { PageHeader } from "@/components/shared/PageHeader";
import { mockTeamMembers } from "@/lib/mock-data";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

export default function TeamMembersPage() {
  return (
    <div>
      <PageHeader title="Team Members" description="Manage your team">
        <Button size="sm" onClick={() => toast.success("Invitation sent")}>Invite Member</Button>
      </PageHeader>
      <div className="rounded-lg border border-border bg-card overflow-hidden">
        <table className="w-full text-sm">
          <thead><tr className="border-b border-border bg-muted/50">
            <th className="text-left px-4 py-3 font-medium">Member</th>
            <th className="text-left px-4 py-3 font-medium hidden sm:table-cell">Role</th>
            <th className="text-left px-4 py-3 font-medium hidden md:table-cell">Last Active</th>
            <th className="text-left px-4 py-3 font-medium">Actions</th>
          </tr></thead>
          <tbody>
            {mockTeamMembers.map((m) => (
              <tr key={m.id} className="border-b border-border">
                <td className="px-4 py-3 flex items-center gap-3">
                  <div className="h-8 w-8 rounded-full bg-primary/10 text-primary flex items-center justify-center text-xs font-semibold">{m.avatar}</div>
                  <div><p className="font-medium">{m.name}</p><p className="text-xs text-muted-foreground">{m.email}</p></div>
                </td>
                <td className="px-4 py-3 capitalize hidden sm:table-cell">{m.role}</td>
                <td className="px-4 py-3 text-muted-foreground hidden md:table-cell">{m.lastActive}</td>
                <td className="px-4 py-3"><Button size="sm" variant="ghost" onClick={() => toast.success("Role updated")}>Edit</Button></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
