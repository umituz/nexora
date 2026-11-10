import { useData } from "@/contexts/DataContext";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Plus, MoreHorizontal, Trash2 } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useState } from "react";
import { generateId, getInitials, timeAgo } from "@/lib/calculations";
import type { TeamMember } from "@/lib/mock-data";

const roleColors: Record<string, string> = {
  owner: "bg-primary/10 text-primary",
  admin: "bg-info/10 text-info",
  member: "bg-success/10 text-success",
  viewer: "bg-secondary text-muted-foreground",
};

export default function TeamPage() {
  const { teamMembers, setTeamMembers } = useData();
  const [showInvite, setShowInvite] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", role: "member" as TeamMember["role"] });

  const handleInvite = () => {
    if (!form.name || !form.email) return;
    setTeamMembers((prev) => [
      ...prev,
      {
        id: generateId(), ...form,
        avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${form.name.replace(/\s/g, "")}`,
        linkedinAccounts: [], lastActiveAt: new Date().toISOString(),
        joinedAt: new Date().toISOString(), status: "invited",
      },
    ]);
    setForm({ name: "", email: "", role: "member" });
    setShowInvite(false);
  };

  const handleRemove = (id: string) => {
    setTeamMembers((prev) => prev.filter((m) => m.id !== id));
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Team</h1>
          <p className="text-muted-foreground">{teamMembers.length} members</p>
        </div>
        <Dialog open={showInvite} onOpenChange={setShowInvite}>
          <DialogTrigger asChild><Button><Plus className="mr-2 h-4 w-4" /> Invite Member</Button></DialogTrigger>
          <DialogContent>
            <DialogHeader><DialogTitle>Invite Team Member</DialogTitle></DialogHeader>
            <div className="space-y-3">
              <div><Label>Name</Label><Input value={form.name} onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))} /></div>
              <div><Label>Email</Label><Input value={form.email} onChange={(e) => setForm((p) => ({ ...p, email: e.target.value }))} type="email" /></div>
              <div>
                <Label>Role</Label>
                <Select value={form.role} onValueChange={(v) => setForm((p) => ({ ...p, role: v as TeamMember["role"] }))}>
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

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {teamMembers.map((m) => (
          <Card key={m.id}>
            <CardContent className="p-5">
              <div className="flex items-center gap-3">
                <Avatar className="h-10 w-10">
                  <AvatarImage src={m.avatar} />
                  <AvatarFallback className="bg-primary text-primary-foreground text-xs">{getInitials(m.name)}</AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold truncate">{m.name}</p>
                  <p className="text-xs text-muted-foreground">{m.email}</p>
                </div>
                {m.role !== "owner" && (
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild><button className="rounded p-1 hover:bg-secondary"><MoreHorizontal className="h-4 w-4" /></button></DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => handleRemove(m.id)} className="text-destructive"><Trash2 className="mr-2 h-4 w-4" /> Remove</DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                )}
              </div>
              <div className="mt-3 flex items-center gap-2">
                <Badge className={`${roleColors[m.role]} border-0 text-xs`}>{m.role}</Badge>
                {m.status === "invited" && <Badge variant="outline" className="text-xs">Pending</Badge>}
              </div>
              <div className="mt-3 text-xs text-muted-foreground">
                <span>{m.linkedinAccounts.length} accounts · Last active {timeAgo(m.lastActiveAt)}</span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
