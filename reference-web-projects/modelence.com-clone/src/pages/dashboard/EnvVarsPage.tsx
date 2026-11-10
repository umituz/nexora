import { useState } from "react";
import { PageHeader } from "@/components/shared/PageHeader";
import { DataTable } from "@/components/shared/DataTable";
import { CrudModal, DeleteConfirmModal } from "@/components/shared/CrudModal";
import { mockEnvVars, type EnvVar } from "@/lib/mock-data";
import { formatDate, generateId } from "@/lib/utils";
import { storage } from "@/lib/storage";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Plus, Pencil, Trash2 } from "lucide-react";
import { toast } from "sonner";

export default function EnvVarsPage() {
  const [vars, setVars] = useState<EnvVar[]>(() => storage.get("envVars", mockEnvVars));
  const [createOpen, setCreateOpen] = useState(false);
  const [editItem, setEditItem] = useState<EnvVar | null>(null);
  const [deleteItem, setDeleteItem] = useState<EnvVar | null>(null);
  const [form, setForm] = useState({ key: "", value: "", environment: "all" });

  const save = (list: EnvVar[]) => { setVars(list); storage.set("envVars", list); };

  const handleCreate = () => {
    if (!form.key) { toast.error("Key is required"); return; }
    const v: EnvVar = { id: generateId(), key: form.key, value: form.value, environment: form.environment, updatedAt: new Date().toISOString() };
    save([v, ...vars]);
    setCreateOpen(false);
    setForm({ key: "", value: "", environment: "all" });
    toast.success("Variable created");
  };

  const handleEdit = () => {
    if (!editItem) return;
    save(vars.map((v) => v.id === editItem.id ? { ...v, key: form.key, value: form.value, environment: form.environment, updatedAt: new Date().toISOString() } : v));
    setEditItem(null);
    toast.success("Variable updated");
  };

  const handleDelete = () => {
    if (!deleteItem) return;
    save(vars.filter((v) => v.id !== deleteItem.id));
    setDeleteItem(null);
    toast.success("Variable deleted");
  };

  const openEdit = (v: EnvVar) => { setForm({ key: v.key, value: v.value, environment: v.environment }); setEditItem(v); };
  const openCreate = () => { setForm({ key: "", value: "", environment: "all" }); setCreateOpen(true); };

  const formFields = (
    <>
      <div><Label>Key</Label><Input value={form.key} onChange={(e) => setForm((f) => ({ ...f, key: e.target.value }))} placeholder="NODE_ENV" /></div>
      <div><Label>Value</Label><Input value={form.value} onChange={(e) => setForm((f) => ({ ...f, value: e.target.value }))} placeholder="production" /></div>
      <div><Label>Environment</Label><Input value={form.environment} onChange={(e) => setForm((f) => ({ ...f, environment: e.target.value }))} placeholder="all" /></div>
    </>
  );

  return (
    <div className="animate-fade-in">
      <PageHeader title="Environment Variables" description="Environment-specific variables" actions={<Button size="sm" onClick={openCreate}><Plus className="h-4 w-4 mr-1" /> Add Variable</Button>} />
      <DataTable headers={["Key", "Value", "Environment", "Updated", "Actions"]}>
        {vars.map((v) => (
          <tr key={v.id} className="hover:bg-secondary/30 transition-colors">
            <td className="px-4 py-3 font-medium font-mono text-foreground">{v.key}</td>
            <td className="px-4 py-3 text-muted-foreground font-mono text-xs">{v.value}</td>
            <td className="px-4 py-3 text-muted-foreground">{v.environment}</td>
            <td className="px-4 py-3 text-muted-foreground">{formatDate(v.updatedAt)}</td>
            <td className="px-4 py-3">
              <div className="flex items-center gap-1">
                <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => openEdit(v)}><Pencil className="h-3.5 w-3.5" /></Button>
                <Button variant="ghost" size="icon" className="h-7 w-7 text-destructive" onClick={() => setDeleteItem(v)}><Trash2 className="h-3.5 w-3.5" /></Button>
              </div>
            </td>
          </tr>
        ))}
      </DataTable>

      <CrudModal open={createOpen} onClose={() => setCreateOpen(false)} title="Add Variable" onSubmit={handleCreate}>{formFields}</CrudModal>
      <CrudModal open={!!editItem} onClose={() => setEditItem(null)} title="Edit Variable" onSubmit={handleEdit} submitLabel="Update">{formFields}</CrudModal>
      <DeleteConfirmModal open={!!deleteItem} onClose={() => setDeleteItem(null)} onConfirm={handleDelete} itemName={deleteItem?.key ?? ""} />
    </div>
  );
}
