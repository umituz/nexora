import { useState } from "react";
import { PageHeader } from "@/components/shared/PageHeader";
import { DataTable } from "@/components/shared/DataTable";
import { CrudModal, DeleteConfirmModal } from "@/components/shared/CrudModal";
import { mockApiKeys, type ApiKey } from "@/lib/mock-data";
import { formatDate, timeAgo, generateId } from "@/lib/utils";
import { storage } from "@/lib/storage";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Plus, Trash2, Copy } from "lucide-react";
import { toast } from "sonner";

export default function ApiKeysPage() {
  const [keys, setKeys] = useState<ApiKey[]>(() => storage.get("apiKeys", mockApiKeys));
  const [createOpen, setCreateOpen] = useState(false);
  const [deleteItem, setDeleteItem] = useState<ApiKey | null>(null);
  const [form, setForm] = useState({ name: "", permissions: ["read"] as string[] });

  const save = (list: ApiKey[]) => { setKeys(list); storage.set("apiKeys", list); };

  const handleCreate = () => {
    if (!form.name) { toast.error("Name is required"); return; }
    const k: ApiKey = {
      id: generateId(), name: form.name, prefix: `mk_${Math.random().toString(36).slice(2, 6)}_`,
      permissions: form.permissions, lastUsed: null, createdAt: new Date().toISOString(), expiresAt: null,
    };
    save([k, ...keys]);
    setCreateOpen(false);
    setForm({ name: "", permissions: ["read"] });
    toast.success("API key created");
  };

  const handleDelete = () => {
    if (!deleteItem) return;
    save(keys.filter((k) => k.id !== deleteItem.id));
    setDeleteItem(null);
    toast.success("API key deleted");
  };

  const togglePermission = (perm: string) => {
    setForm((f) => ({
      ...f,
      permissions: f.permissions.includes(perm) ? f.permissions.filter((p) => p !== perm) : [...f.permissions, perm],
    }));
  };

  return (
    <div className="animate-fade-in">
      <PageHeader title="API Keys" description="Manage API keys" actions={<Button size="sm" onClick={() => { setForm({ name: "", permissions: ["read"] }); setCreateOpen(true); }}><Plus className="h-4 w-4 mr-1" /> Create Key</Button>} />
      <DataTable headers={["Name", "Prefix", "Permissions", "Last Used", "Created", "Expires", "Actions"]}>
        {keys.map((k) => (
          <tr key={k.id} className="hover:bg-secondary/30 transition-colors">
            <td className="px-4 py-3 font-medium text-foreground">{k.name}</td>
            <td className="px-4 py-3 text-muted-foreground font-mono text-xs">
              <span className="inline-flex items-center gap-1">{k.prefix}•••
                <button onClick={() => { navigator.clipboard.writeText(k.prefix + "mock-key"); toast.success("Copied"); }} className="text-muted-foreground hover:text-foreground"><Copy className="h-3 w-3" /></button>
              </span>
            </td>
            <td className="px-4 py-3"><div className="flex flex-wrap gap-1">{k.permissions.map((p) => <span key={p} className="px-1.5 py-0.5 bg-secondary text-xs rounded text-muted-foreground">{p}</span>)}</div></td>
            <td className="px-4 py-3 text-muted-foreground">{k.lastUsed ? timeAgo(k.lastUsed) : "Never"}</td>
            <td className="px-4 py-3 text-muted-foreground">{formatDate(k.createdAt)}</td>
            <td className="px-4 py-3 text-muted-foreground">{k.expiresAt ? formatDate(k.expiresAt) : "Never"}</td>
            <td className="px-4 py-3">
              <Button variant="ghost" size="icon" className="h-7 w-7 text-destructive" onClick={() => setDeleteItem(k)}><Trash2 className="h-3.5 w-3.5" /></Button>
            </td>
          </tr>
        ))}
      </DataTable>

      <CrudModal open={createOpen} onClose={() => setCreateOpen(false)} title="Create API Key" onSubmit={handleCreate}>
        <div><Label>Name</Label><Input value={form.name} onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))} placeholder="My API Key" /></div>
        <div>
          <Label className="mb-2 block">Permissions</Label>
          {["read", "write", "delete", "deploy"].map((perm) => (
            <label key={perm} className="flex items-center gap-2 py-1 text-sm">
              <Checkbox checked={form.permissions.includes(perm)} onCheckedChange={() => togglePermission(perm)} />
              <span className="capitalize">{perm}</span>
            </label>
          ))}
        </div>
      </CrudModal>
      <DeleteConfirmModal open={!!deleteItem} onClose={() => setDeleteItem(null)} onConfirm={handleDelete} itemName={deleteItem?.name ?? ""} />
    </div>
  );
}
