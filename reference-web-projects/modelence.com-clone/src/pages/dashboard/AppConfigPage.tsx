import { useState } from "react";
import { PageHeader } from "@/components/shared/PageHeader";
import { DataTable } from "@/components/shared/DataTable";
import { CrudModal, DeleteConfirmModal } from "@/components/shared/CrudModal";
import { mockAppConfigs, type AppConfig } from "@/lib/mock-data";
import { formatDate, generateId } from "@/lib/utils";
import { storage } from "@/lib/storage";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus, Pencil, Trash2 } from "lucide-react";
import { toast } from "sonner";

export default function AppConfigPage() {
  const [configs, setConfigs] = useState<AppConfig[]>(() => storage.get("appConfigs", mockAppConfigs));
  const [createOpen, setCreateOpen] = useState(false);
  const [editItem, setEditItem] = useState<AppConfig | null>(null);
  const [deleteItem, setDeleteItem] = useState<AppConfig | null>(null);
  const [form, setForm] = useState({ key: "", value: "", type: "string" as AppConfig["type"], environment: "all" });

  const save = (list: AppConfig[]) => { setConfigs(list); storage.set("appConfigs", list); };

  const handleCreate = () => {
    if (!form.key) { toast.error("Key is required"); return; }
    const c: AppConfig = { id: generateId(), key: form.key, value: form.value, type: form.type, environment: form.environment, updatedAt: new Date().toISOString() };
    save([c, ...configs]);
    setCreateOpen(false);
    setForm({ key: "", value: "", type: "string", environment: "all" });
    toast.success("Config created");
  };

  const handleEdit = () => {
    if (!editItem) return;
    save(configs.map((c) => c.id === editItem.id ? { ...c, key: form.key, value: form.value, type: form.type, environment: form.environment, updatedAt: new Date().toISOString() } : c));
    setEditItem(null);
    toast.success("Config updated");
  };

  const handleDelete = () => {
    if (!deleteItem) return;
    save(configs.filter((c) => c.id !== deleteItem.id));
    setDeleteItem(null);
    toast.success("Config deleted");
  };

  const openEdit = (c: AppConfig) => { setForm({ key: c.key, value: c.value, type: c.type, environment: c.environment }); setEditItem(c); };
  const openCreate = () => { setForm({ key: "", value: "", type: "string", environment: "all" }); setCreateOpen(true); };

  const formFields = (
    <>
      <div><Label>Key</Label><Input value={form.key} onChange={(e) => setForm((f) => ({ ...f, key: e.target.value }))} placeholder="app.settingName" /></div>
      <div><Label>Value</Label><Input value={form.value} onChange={(e) => setForm((f) => ({ ...f, value: e.target.value }))} placeholder="value" /></div>
      <div>
        <Label>Type</Label>
        <Select value={form.type} onValueChange={(v) => setForm((f) => ({ ...f, type: v as AppConfig["type"] }))}>
          <SelectTrigger><SelectValue /></SelectTrigger>
          <SelectContent><SelectItem value="string">String</SelectItem><SelectItem value="number">Number</SelectItem><SelectItem value="boolean">Boolean</SelectItem><SelectItem value="json">JSON</SelectItem></SelectContent>
        </Select>
      </div>
      <div><Label>Environment</Label><Input value={form.environment} onChange={(e) => setForm((f) => ({ ...f, environment: e.target.value }))} placeholder="all" /></div>
    </>
  );

  return (
    <div className="animate-fade-in">
      <PageHeader title="App Configuration" description="Dynamic configuration values" actions={<Button size="sm" onClick={openCreate}><Plus className="h-4 w-4 mr-1" /> Add Config</Button>} />
      <DataTable headers={["Key", "Value", "Type", "Environment", "Updated", "Actions"]}>
        {configs.map((c) => (
          <tr key={c.id} className="hover:bg-secondary/30 transition-colors">
            <td className="px-4 py-3 font-medium font-mono text-foreground">{c.key}</td>
            <td className="px-4 py-3 text-muted-foreground font-mono text-xs max-w-[200px] truncate">{c.value}</td>
            <td className="px-4 py-3 text-muted-foreground">{c.type}</td>
            <td className="px-4 py-3 text-muted-foreground">{c.environment}</td>
            <td className="px-4 py-3 text-muted-foreground">{formatDate(c.updatedAt)}</td>
            <td className="px-4 py-3">
              <div className="flex items-center gap-1">
                <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => openEdit(c)}><Pencil className="h-3.5 w-3.5" /></Button>
                <Button variant="ghost" size="icon" className="h-7 w-7 text-destructive" onClick={() => setDeleteItem(c)}><Trash2 className="h-3.5 w-3.5" /></Button>
              </div>
            </td>
          </tr>
        ))}
      </DataTable>

      <CrudModal open={createOpen} onClose={() => setCreateOpen(false)} title="Add Config" onSubmit={handleCreate}>{formFields}</CrudModal>
      <CrudModal open={!!editItem} onClose={() => setEditItem(null)} title="Edit Config" onSubmit={handleEdit} submitLabel="Update">{formFields}</CrudModal>
      <DeleteConfirmModal open={!!deleteItem} onClose={() => setDeleteItem(null)} onConfirm={handleDelete} itemName={deleteItem?.key ?? ""} />
    </div>
  );
}
