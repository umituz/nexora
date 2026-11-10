import { useState } from "react";
import { PageHeader } from "@/components/shared/PageHeader";
import { DataTable } from "@/components/shared/DataTable";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { SearchInput, useSearch } from "@/components/shared/SearchInput";
import { CrudModal, DeleteConfirmModal } from "@/components/shared/CrudModal";
import { mockAuthUsers, type AuthUser } from "@/lib/mock-data";
import { formatDate, timeAgo, generateId } from "@/lib/utils";
import { storage } from "@/lib/storage";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus, Pencil, Trash2 } from "lucide-react";
import { toast } from "sonner";

export default function AuthUsersPage() {
  const [users, setUsers] = useState<AuthUser[]>(() => storage.get("authUsers", mockAuthUsers));
  const [createOpen, setCreateOpen] = useState(false);
  const [editItem, setEditItem] = useState<AuthUser | null>(null);
  const [deleteItem, setDeleteItem] = useState<AuthUser | null>(null);
  const [form, setForm] = useState({ name: "", email: "", role: "member", provider: "email" });

  const { query, setQuery, filtered } = useSearch(users, (u, q) => u.email.toLowerCase().includes(q) || u.name.toLowerCase().includes(q));
  const save = (list: AuthUser[]) => { setUsers(list); storage.set("authUsers", list); };

  const handleCreate = () => {
    if (!form.name || !form.email) { toast.error("Name and email are required"); return; }
    const u: AuthUser = {
      id: generateId(), email: form.email, name: form.name, role: form.role,
      status: "pending", lastLogin: new Date().toISOString(), createdAt: new Date().toISOString(), provider: form.provider,
    };
    save([u, ...users]);
    setCreateOpen(false);
    setForm({ name: "", email: "", role: "member", provider: "email" });
    toast.success("User created");
  };

  const handleEdit = () => {
    if (!editItem) return;
    save(users.map((u) => u.id === editItem.id ? { ...u, name: form.name, email: form.email, role: form.role } : u));
    setEditItem(null);
    toast.success("User updated");
  };

  const handleDelete = () => {
    if (!deleteItem) return;
    save(users.filter((u) => u.id !== deleteItem.id));
    setDeleteItem(null);
    toast.success("User deleted");
  };

  const openEdit = (u: AuthUser) => { setForm({ name: u.name, email: u.email, role: u.role, provider: u.provider }); setEditItem(u); };
  const openCreate = () => { setForm({ name: "", email: "", role: "member", provider: "email" }); setCreateOpen(true); };

  const formFields = (
    <>
      <div><Label>Name</Label><Input value={form.name} onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))} placeholder="Full name" /></div>
      <div><Label>Email</Label><Input type="email" value={form.email} onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))} placeholder="email@example.com" /></div>
      <div>
        <Label>Role</Label>
        <Select value={form.role} onValueChange={(v) => setForm((f) => ({ ...f, role: v }))}>
          <SelectTrigger><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="admin">Admin</SelectItem>
            <SelectItem value="member">Member</SelectItem>
            <SelectItem value="viewer">Viewer</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </>
  );

  return (
    <div className="animate-fade-in">
      <PageHeader title="Users" description="Manage authenticated users" actions={<Button size="sm" onClick={openCreate}><Plus className="h-4 w-4 mr-1" /> Add User</Button>} />
      <div className="mb-4 max-w-sm"><SearchInput placeholder="Search users..." value={query} onChange={setQuery} /></div>
      <DataTable headers={["User", "Role", "Provider", "Status", "Last Login", "Created", "Actions"]}>
        {filtered.map((u) => (
          <tr key={u.id} className="hover:bg-secondary/30 transition-colors">
            <td className="px-4 py-3"><p className="font-medium text-foreground">{u.name}</p><p className="text-xs text-muted-foreground">{u.email}</p></td>
            <td className="px-4 py-3 text-muted-foreground capitalize">{u.role}</td>
            <td className="px-4 py-3 text-muted-foreground capitalize">{u.provider}</td>
            <td className="px-4 py-3"><StatusBadge status={u.status} /></td>
            <td className="px-4 py-3 text-muted-foreground">{timeAgo(u.lastLogin)}</td>
            <td className="px-4 py-3 text-muted-foreground">{formatDate(u.createdAt)}</td>
            <td className="px-4 py-3">
              <div className="flex items-center gap-1">
                <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => openEdit(u)}><Pencil className="h-3.5 w-3.5" /></Button>
                <Button variant="ghost" size="icon" className="h-7 w-7 text-destructive" onClick={() => setDeleteItem(u)}><Trash2 className="h-3.5 w-3.5" /></Button>
              </div>
            </td>
          </tr>
        ))}
      </DataTable>

      <CrudModal open={createOpen} onClose={() => setCreateOpen(false)} title="Add User" onSubmit={handleCreate}>{formFields}</CrudModal>
      <CrudModal open={!!editItem} onClose={() => setEditItem(null)} title="Edit User" onSubmit={handleEdit} submitLabel="Update">{formFields}</CrudModal>
      <DeleteConfirmModal open={!!deleteItem} onClose={() => setDeleteItem(null)} onConfirm={handleDelete} itemName={deleteItem?.name ?? ""} />
    </div>
  );
}
