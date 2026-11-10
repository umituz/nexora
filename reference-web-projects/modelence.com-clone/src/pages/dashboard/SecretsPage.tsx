import { useState } from "react";
import { PageHeader } from "@/components/shared/PageHeader";
import { DataTable } from "@/components/shared/DataTable";
import { CrudModal, DeleteConfirmModal } from "@/components/shared/CrudModal";
import { mockSecrets, type Secret } from "@/lib/mock-data";
import { formatDate, generateId } from "@/lib/utils";
import { storage } from "@/lib/storage";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Plus, Trash2 } from "lucide-react";
import { toast } from "sonner";

export default function SecretsPage() {
  const [secrets, setSecrets] = useState<Secret[]>(() => storage.get("secrets", mockSecrets));
  const [createOpen, setCreateOpen] = useState(false);
  const [deleteItem, setDeleteItem] = useState<Secret | null>(null);
  const [form, setForm] = useState({ key: "", environment: "all" });

  const save = (list: Secret[]) => { setSecrets(list); storage.set("secrets", list); };

  const handleCreate = () => {
    if (!form.key) { toast.error("Key is required"); return; }
    const s: Secret = { id: generateId(), key: form.key, environment: form.environment, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() };
    save([s, ...secrets]);
    setCreateOpen(false);
    setForm({ key: "", environment: "all" });
    toast.success("Secret created");
  };

  const handleDelete = () => {
    if (!deleteItem) return;
    save(secrets.filter((s) => s.id !== deleteItem.id));
    setDeleteItem(null);
    toast.success("Secret deleted");
  };

  return (
    <div className="animate-fade-in">
      <PageHeader title="Secrets" description="Encrypted secret values" actions={<Button size="sm" onClick={() => { setForm({ key: "", environment: "all" }); setCreateOpen(true); }}><Plus className="h-4 w-4 mr-1" /> Add Secret</Button>} />
      <DataTable headers={["Key", "Environment", "Created", "Updated", "Actions"]}>
        {secrets.map((s) => (
          <tr key={s.id} className="hover:bg-secondary/30 transition-colors">
            <td className="px-4 py-3 font-medium font-mono text-foreground">{s.key}</td>
            <td className="px-4 py-3 text-muted-foreground">{s.environment}</td>
            <td className="px-4 py-3 text-muted-foreground">{formatDate(s.createdAt)}</td>
            <td className="px-4 py-3 text-muted-foreground">{formatDate(s.updatedAt)}</td>
            <td className="px-4 py-3">
              <Button variant="ghost" size="icon" className="h-7 w-7 text-destructive" onClick={() => setDeleteItem(s)}><Trash2 className="h-3.5 w-3.5" /></Button>
            </td>
          </tr>
        ))}
      </DataTable>

      <CrudModal open={createOpen} onClose={() => setCreateOpen(false)} title="Add Secret" onSubmit={handleCreate}>
        <div><Label>Key</Label><Input value={form.key} onChange={(e) => setForm((f) => ({ ...f, key: e.target.value }))} placeholder="SECRET_KEY" /></div>
        <div><Label>Value</Label><Input type="password" placeholder="••••••••" /></div>
        <div><Label>Environment</Label><Input value={form.environment} onChange={(e) => setForm((f) => ({ ...f, environment: e.target.value }))} placeholder="all" /></div>
      </CrudModal>
      <DeleteConfirmModal open={!!deleteItem} onClose={() => setDeleteItem(null)} onConfirm={handleDelete} itemName={deleteItem?.key ?? ""} />
    </div>
  );
}
