import { useState } from "react";
import { PageHeader } from "@/components/shared/PageHeader";
import { DataTable } from "@/components/shared/DataTable";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { SearchInput, useSearch } from "@/components/shared/SearchInput";
import { CrudModal, DeleteConfirmModal } from "@/components/shared/CrudModal";
import { mockEnvironments, type Environment } from "@/lib/mock-data";
import { formatDate, generateId } from "@/lib/utils";
import { storage } from "@/lib/storage";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus, Pencil, Trash2 } from "lucide-react";
import { toast } from "sonner";

export default function EnvironmentsPage() {
  const [envs, setEnvs] = useState<Environment[]>(() => storage.get("environments", mockEnvironments));
  const [createOpen, setCreateOpen] = useState(false);
  const [editItem, setEditItem] = useState<Environment | null>(null);
  const [deleteItem, setDeleteItem] = useState<Environment | null>(null);
  const [form, setForm] = useState({ name: "", type: "sandbox" as Environment["type"], size: "Micro", region: "us-east-1" });

  const { query, setQuery, filtered } = useSearch(envs, (e, q) => e.name.toLowerCase().includes(q) || e.type.includes(q));
  const save = (list: Environment[]) => { setEnvs(list); storage.set("environments", list); };

  const handleCreate = () => {
    if (!form.name) { toast.error("Name is required"); return; }
    const env: Environment = {
      id: generateId(), projectId: "p1", name: form.name, type: form.type,
      status: "stopped", url: `https://${form.name.toLowerCase().replace(/\s+/g, "-")}.example.com`,
      createdAt: new Date().toISOString(), size: form.size, region: form.region,
    };
    save([env, ...envs]);
    setCreateOpen(false);
    setForm({ name: "", type: "sandbox", size: "Micro", region: "us-east-1" });
    toast.success("Environment created");
  };

  const handleEdit = () => {
    if (!editItem || !form.name) return;
    save(envs.map((e) => e.id === editItem.id ? { ...e, name: form.name, type: form.type, size: form.size, region: form.region } : e));
    setEditItem(null);
    toast.success("Environment updated");
  };

  const handleDelete = () => {
    if (!deleteItem) return;
    save(envs.filter((e) => e.id !== deleteItem.id));
    setDeleteItem(null);
    toast.success("Environment deleted");
  };

  const openEdit = (e: Environment) => { setForm({ name: e.name, type: e.type, size: e.size, region: e.region }); setEditItem(e); };
  const openCreate = () => { setForm({ name: "", type: "sandbox", size: "Micro", region: "us-east-1" }); setCreateOpen(true); };

  const formFields = (
    <>
      <div><Label>Name</Label><Input value={form.name} onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))} placeholder="Environment name" /></div>
      <div>
        <Label>Type</Label>
        <Select value={form.type} onValueChange={(v) => setForm((f) => ({ ...f, type: v as Environment["type"] }))}>
          <SelectTrigger><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="production">Production</SelectItem>
            <SelectItem value="staging">Staging</SelectItem>
            <SelectItem value="sandbox">Sandbox</SelectItem>
            <SelectItem value="local">Local</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div><Label>Size</Label><Input value={form.size} onChange={(e) => setForm((f) => ({ ...f, size: e.target.value }))} /></div>
      <div><Label>Region</Label><Input value={form.region} onChange={(e) => setForm((f) => ({ ...f, region: e.target.value }))} /></div>
    </>
  );

  return (
    <div className="animate-fade-in">
      <PageHeader title="Environments" description="Manage deployment environments" actions={<Button size="sm" onClick={openCreate}><Plus className="h-4 w-4 mr-1" /> New Environment</Button>} />
      <div className="mb-4 max-w-sm"><SearchInput placeholder="Search environments..." value={query} onChange={setQuery} /></div>
      <DataTable headers={["Name", "Type", "Status", "Size", "Region", "Created", "Actions"]}>
        {filtered.map((e) => (
          <tr key={e.id} className="hover:bg-secondary/30 transition-colors">
            <td className="px-4 py-3 font-medium text-foreground">{e.name}</td>
            <td className="px-4 py-3"><StatusBadge status={e.type} /></td>
            <td className="px-4 py-3"><StatusBadge status={e.status} /></td>
            <td className="px-4 py-3 text-muted-foreground">{e.size}</td>
            <td className="px-4 py-3 text-muted-foreground">{e.region}</td>
            <td className="px-4 py-3 text-muted-foreground">{formatDate(e.createdAt)}</td>
            <td className="px-4 py-3">
              <div className="flex items-center gap-1">
                <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => openEdit(e)}><Pencil className="h-3.5 w-3.5" /></Button>
                <Button variant="ghost" size="icon" className="h-7 w-7 text-destructive" onClick={() => setDeleteItem(e)}><Trash2 className="h-3.5 w-3.5" /></Button>
              </div>
            </td>
          </tr>
        ))}
      </DataTable>

      <CrudModal open={createOpen} onClose={() => setCreateOpen(false)} title="Create Environment" onSubmit={handleCreate}>{formFields}</CrudModal>
      <CrudModal open={!!editItem} onClose={() => setEditItem(null)} title="Edit Environment" onSubmit={handleEdit} submitLabel="Update">{formFields}</CrudModal>
      <DeleteConfirmModal open={!!deleteItem} onClose={() => setDeleteItem(null)} onConfirm={handleDelete} itemName={deleteItem?.name ?? ""} />
    </div>
  );
}
