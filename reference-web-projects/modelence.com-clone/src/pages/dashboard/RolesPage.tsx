import { useState } from "react";
import { PageHeader } from "@/components/shared/PageHeader";
import { DataTable } from "@/components/shared/DataTable";
import { CrudModal, DeleteConfirmModal } from "@/components/shared/CrudModal";
import { mockRoles, type Role } from "@/lib/mock-data";
import { formatDate, generateId } from "@/lib/utils";
import { storage } from "@/lib/storage";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Plus, Pencil, Trash2 } from "lucide-react";
import { toast } from "sonner";

const allPermissions = ["read", "write", "delete", "deploy", "manage_users", "manage_billing", "manage_settings", "manage_environments"];

export default function RolesPage() {
  const [roles, setRoles] = useState<Role[]>(() => storage.get("roles", mockRoles));
  const [createOpen, setCreateOpen] = useState(false);
  const [editItem, setEditItem] = useState<Role | null>(null);
  const [deleteItem, setDeleteItem] = useState<Role | null>(null);
  const [form, setForm] = useState({ name: "", description: "", permissions: [] as string[] });

  const save = (list: Role[]) => { setRoles(list); storage.set("roles", list); };

  const togglePerm = (perm: string) => {
    setForm((f) => ({
      ...f,
      permissions: f.permissions.includes(perm) ? f.permissions.filter((p) => p !== perm) : [...f.permissions, perm],
    }));
  };

  const handleCreate = () => {
    if (!form.name) { toast.error("Name is required"); return; }
    const r: Role = { id: generateId(), name: form.name, description: form.description, permissions: form.permissions, userCount: 0, createdAt: new Date().toISOString() };
    save([...roles, r]);
    setCreateOpen(false);
    setForm({ name: "", description: "", permissions: [] });
    toast.success("Role created");
  };

  const handleEdit = () => {
    if (!editItem) return;
    save(roles.map((r) => r.id === editItem.id ? { ...r, name: form.name, description: form.description, permissions: form.permissions } : r));
    setEditItem(null);
    toast.success("Role updated");
  };

  const handleDelete = () => {
    if (!deleteItem) return;
    save(roles.filter((r) => r.id !== deleteItem.id));
    setDeleteItem(null);
    toast.success("Role deleted");
  };

  const openEdit = (r: Role) => { setForm({ name: r.name, description: r.description, permissions: [...r.permissions] }); setEditItem(r); };
  const openCreate = () => { setForm({ name: "", description: "", permissions: [] }); setCreateOpen(true); };

  const formFields = (
    <>
      <div><Label>Name</Label><Input value={form.name} onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))} placeholder="Role name" /></div>
      <div><Label>Description</Label><Textarea value={form.description} onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))} placeholder="Role description" rows={2} /></div>
      <div>
        <Label className="mb-2 block">Permissions</Label>
        <div className="grid grid-cols-2 gap-2">
          {allPermissions.map((perm) => (
            <label key={perm} className="flex items-center gap-2 text-sm">
              <Checkbox checked={form.permissions.includes(perm)} onCheckedChange={() => togglePerm(perm)} />
              <span className="capitalize">{perm.replace(/_/g, " ")}</span>
            </label>
          ))}
        </div>
      </div>
    </>
  );

  return (
    <div className="animate-fade-in">
      <PageHeader title="Roles" description="User roles and permissions" actions={<Button size="sm" onClick={openCreate}><Plus className="h-4 w-4 mr-1" /> Create Role</Button>} />
      <DataTable headers={["Role", "Description", "Permissions", "Users", "Created", "Actions"]}>
        {roles.map((r) => (
          <tr key={r.id} className="hover:bg-secondary/30 transition-colors">
            <td className="px-4 py-3 font-medium text-foreground capitalize">{r.name}</td>
            <td className="px-4 py-3 text-muted-foreground">{r.description}</td>
            <td className="px-4 py-3"><div className="flex flex-wrap gap-1">{r.permissions.map((p) => <span key={p} className="px-1.5 py-0.5 bg-secondary text-xs rounded text-muted-foreground">{p}</span>)}</div></td>
            <td className="px-4 py-3 text-muted-foreground">{r.userCount}</td>
            <td className="px-4 py-3 text-muted-foreground">{formatDate(r.createdAt)}</td>
            <td className="px-4 py-3">
              <div className="flex items-center gap-1">
                <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => openEdit(r)}><Pencil className="h-3.5 w-3.5" /></Button>
                <Button variant="ghost" size="icon" className="h-7 w-7 text-destructive" onClick={() => setDeleteItem(r)}><Trash2 className="h-3.5 w-3.5" /></Button>
              </div>
            </td>
          </tr>
        ))}
      </DataTable>

      <CrudModal open={createOpen} onClose={() => setCreateOpen(false)} title="Create Role" onSubmit={handleCreate}>{formFields}</CrudModal>
      <CrudModal open={!!editItem} onClose={() => setEditItem(null)} title="Edit Role" onSubmit={handleEdit} submitLabel="Update">{formFields}</CrudModal>
      <DeleteConfirmModal open={!!deleteItem} onClose={() => setDeleteItem(null)} onConfirm={handleDelete} itemName={deleteItem?.name ?? ""} />
    </div>
  );
}
