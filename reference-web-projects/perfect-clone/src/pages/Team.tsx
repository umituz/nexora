import { PageHeader } from "@/components/dashboard/PageHeader";
import { StatusBadge } from "@/components/dashboard/StatusBadge";
import { mockTeam } from "@/data/mockData";
import { Button } from "@/components/ui/button";
import { Plus, UserCog } from "lucide-react";

export default function Team() {
  return (
    <div className="space-y-6 animate-fade-in">
      <PageHeader title="Team" description="Manage team members and roles" actions={<Button size="sm" className="gradient-bg"><Plus className="h-4 w-4 mr-1" />Invite Member</Button>} />
      <div className="space-y-3">
        {mockTeam.map((m) => (
          <div key={m.id} className="bg-card border border-border rounded-xl p-5 flex items-center gap-4">
            <div className="w-10 h-10 rounded-full gradient-bg flex items-center justify-center shrink-0">
              <span className="text-sm font-bold text-primary-foreground">{m.name.charAt(0)}</span>
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <p className="font-medium">{m.name}</p>
                <StatusBadge status={m.status} />
              </div>
              <p className="text-sm text-muted-foreground">{m.email}</p>
            </div>
            <span className="text-sm capitalize text-muted-foreground">{m.role}</span>
            <p className="text-xs text-muted-foreground hidden sm:block">Last active: {new Date(m.lastActive).toLocaleDateString()}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
