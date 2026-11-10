import { useState } from "react";
import { mockTeam, type TeamMember } from "@/lib/mock-data";
import { formatDate, timeAgo, generateId } from "@/lib/calculations";
import { getFromStorage, setToStorage } from "@/lib/storage";
import { STORAGE_KEYS } from "@/constants/app";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus, Trash2 } from "lucide-react";
import { toast } from "sonner";

export default function TeamPage() {
  const [members, setMembers] = useState<TeamMember[]>(() =>
    getFromStorage<TeamMember[]>(STORAGE_KEYS.TEAM_MEMBERS, mockTeam)
  );
  const [dialogOpen, setDialogOpen] = useState(false);
  const [newMember, setNewMember] = useState({ name: "", email: "", role: "member" as TeamMember["role"] });

  const save = (updated: TeamMember[]) => {
    setMembers(updated);
    setToStorage(STORAGE_KEYS.TEAM_MEMBERS, updated);
  };

  const handleInvite = () => {
    if (!newMember.name || !newMember.email) { toast.error("Fill all fields"); return; }
    const member: TeamMember = {
      id: generateId(),
      name: newMember.name,
      email: newMember.email,
      role: newMember.role,
      avatar: newMember.name.split(" ").map((w) => w[0]).join("").toUpperCase(),
      joinedAt: new Date().toISOString(),
      lastActive: new Date().toISOString(),
    };
    save([...members, member]);
    setNewMember({ name: "", email: "", role: "member" });
    setDialogOpen(false);
    toast.success(`Invited ${member.name}`);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-end">
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button><Plus className="mr-2 h-4 w-4" /> Invite Member</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader><DialogTitle>Invite Team Member</DialogTitle></DialogHeader>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>Name</Label>
                <Input value={newMember.name} onChange={(e) => setNewMember({ ...newMember, name: e.target.value })} />
              </div>
              <div className="space-y-2">
                <Label>Email</Label>
                <Input type="email" value={newMember.email} onChange={(e) => setNewMember({ ...newMember, email: e.target.value })} />
              </div>
              <div className="space-y-2">
                <Label>Role</Label>
                <Select value={newMember.role} onValueChange={(v) => setNewMember({ ...newMember, role: v as TeamMember["role"] })}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="admin">Admin</SelectItem>
                    <SelectItem value="member">Member</SelectItem>
                    <SelectItem value="viewer">Viewer</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <Button onClick={handleInvite} className="w-full">Send Invitation</Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardContent className="pt-6">
          <div className="space-y-4">
            {members.map((m) => (
              <div key={m.id} className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Avatar className="h-9 w-9">
                    <AvatarFallback className="bg-primary/10 text-primary text-xs">{m.avatar}</AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="text-sm font-medium">{m.name}</p>
                    <p className="text-xs text-muted-foreground">{m.email}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Badge variant="outline" className="capitalize">{m.role}</Badge>
                  <span className="text-xs text-muted-foreground hidden sm:inline">{timeAgo(m.lastActive)}</span>
                  {m.role !== "owner" && (
                    <Button size="icon" variant="ghost" onClick={() => { save(members.filter((x) => x.id !== m.id)); toast.success("Removed"); }}>
                      <Trash2 className="h-3 w-3 text-destructive" />
                    </Button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
