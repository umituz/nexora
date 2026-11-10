import { useState } from "react";
import { PageHeader } from "@/components/shared/PageHeader";
import { DataTable } from "@/components/shared/DataTable";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { CrudModal, DeleteConfirmModal } from "@/components/shared/CrudModal";
import { mockTeamMembers, type TeamMember } from "@/lib/mock-data";
import { formatDate, getInitials, generateId } from "@/lib/utils";
import { storage } from "@/lib/storage";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { UserPlus, Pencil, Trash2 } from "lucide-react";
import { toast } from "sonner";

export default function TeamMembersPage() {
  const [members, setMembers] = useState<TeamMember[]>(() => storage.get("teamMembers", mockTeamMembers));
  const [createOpen, setCreateOpen] = useState(false);
  const [editItem, setEditItem] = useState<TeamMember | null>(null);
  const [deleteItem, setDeleteItem] = useState<TeamMember | null>(null);
  const [form, setForm] = useState({ name: "", email: "", role: "member" as TeamMember["role"] });

  const save = (list: TeamMember[]) => { setMembers(list); storage.set("teamMembers", list); };

  const handleCreate = () => {
    if (!form.name || !form.email) { toast.error("Name and email are required"); return; }
    const m: TeamMember = {
      id: generateId(), name: form.name, email: form.email, role: form.role,
      status: "invited", joinedAt: new Date().toISOString(), avatarUrl: "",
    };
    save([...members, m]);
    setCreateOpen(false);
    setForm({ name: "", email: "", role: "member" });
    toast.success("Invitation sent");
  };

  const handleEdit = () => {
    if (!editItem) return;
    save(members.map((m) => m.id === editItem.id ? { ...m, name: form.name, email: form.email, role: form.role } : m));
    setEditItem(null);
    toast.success("Member updated");
  };

  const handleDelete = () => {
    if (!deleteItem) return;
    save(members.filter((m) => m.id !== deleteItem.id));
    setDeleteItem(null);
    toast.success("Member removed");
  };

  const openEdit = (m: TeamMember) => { setForm({ name: m.name, email: m.email, role: m.role }); setEditItem(m); };
  const openCreate = () => { setForm({ name: "", email: "", role: "member" }); setCreateOpen(true); };

  const formFields = (
    <>
      <div><Label>Name</Label><Input value={form.name} onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))} placeholder="Full name" /></div>
      <div><Label>Email</Label><Input type="email" value={form.email} onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))} placeholder="email@example.com" /></div>
      <div>
        <Label>Role</Label>
        <Select value={form.role} onValueChange={(v) => setForm((f) => ({ ...f, role: v as TeamMember["role"] }))}>
          <SelectTrigger><SelectValue /></SelectTrigger>
          <SelectContent><SelectItem value="admin">Admin</SelectItem><SelectItem value="member">Member</SelectItem><SelectItem value="viewer">Viewer</SelectItem></SelectContent>
        </Select>
      </div>
    </>
  );

  return (
    <div className="animate-fade-in">
      <PageHeader title="Team Members" description="Manage team" actions={<Button size="sm" onClick={openCreate}><UserPlus className="h-4 w-4 mr-1" /> Invite</Button>} />
      <DataTable headers={["Member", "Role", "Status", "Joined", "Actions"]}>
        {members.map((m) => (
          <tr key={m.id} className="hover:bg-secondary/30 transition-colors">
            <td className="px-4 py-3">
              <div className="flex items-center gap-3">
                <Avatar className="h-8 w-8"><AvatarFallback className="bg-primary/10 text-primary text-xs">{getInitials(m.name)}</AvatarFallback></Avatar>
                <div><p className="font-medium text-foreground">{m.name}</p><p className="text-xs text-muted-foreground">{m.email}</p></div>
              </div>
            </td>
            <td className="px-4 py-3 text-muted-foreground capitalize">{m.role}</td>
            <td className="px-4 py-3"><StatusBadge status={m.status} /></td>
            <td className="px-4 py-3 text-muted-foreground">{formatDate(m.joinedAt)}</td>
            <td className="px-4 py-3">
              <div className="flex items-center gap-1">
                <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => openEdit(m)}><Pencil className="h-3.5 w-3.5" /></Button>
                {m.role !== "owner" && <Button variant="ghost" size="icon" className="h-7 w-7 text-destructive" onClick={() => setDeleteItem(m)}><Trash2 className="h-3.5 w-3.5" /></Button>}
              </div>
            </td>
          </tr>
        ))}
      </DataTable>

      <CrudModal open={createOpen} onClose={() => setCreateOpen(false)} title="Invite Member" onSubmit={handleCreate} submitLabel="Send Invite">{formFields}</CrudModal>
      <CrudModal open={!!editItem} onClose={() => setEditItem(null)} title="Edit Member" onSubmit={handleEdit} submitLabel="Update">{formFields}</CrudModal>
      <DeleteConfirmModal open={!!deleteItem} onClose={() => setDeleteItem(null)} onConfirm={handleDelete} itemName={deleteItem?.name ?? ""} />
    </div>
  );
}
