import { mockTeamMembers, type TeamMember } from "@/data/mock-data";
import { useLocalStorage } from "@/hooks/use-local-storage";
import { cn } from "@/lib/utils";

export default function SettingsTeamPage() {
  const [members] = useLocalStorage<TeamMember[]>("dmchamp_team", mockTeamMembers);
  const roleColors: Record<string, string> = { owner: "bg-primary/10 text-primary", admin: "bg-warning/10 text-warning", member: "bg-secondary text-muted-foreground" };
  return (
    <div className="space-y-6">
      <h1 className="font-heading text-2xl font-bold">Team</h1>
      <div className="space-y-3">
        {members.map((m) => (
          <div key={m.id} className="flex items-center gap-4 rounded-xl border border-border bg-card p-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-sm font-bold text-primary">{m.name.split(" ").map((n) => n[0]).join("")}</div>
            <div className="flex-1"><p className="font-medium">{m.name}</p><p className="text-xs text-muted-foreground">{m.email}</p></div>
            <span className={cn("rounded-full px-2 py-0.5 text-xs font-medium capitalize", roleColors[m.role])}>{m.role}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
