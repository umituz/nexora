import { useState } from "react";
import { PageHeader } from "@/components/shared/PageHeader";
import { DataTable } from "@/components/shared/DataTable";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { CrudModal, DeleteConfirmModal } from "@/components/shared/CrudModal";
import { mockDomains, type Domain } from "@/lib/mock-data";
import { formatDate, generateId } from "@/lib/utils";
import { storage } from "@/lib/storage";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Plus, Trash2 } from "lucide-react";
import { toast } from "sonner";

export default function DomainsPage() {
  const [domains, setDomains] = useState<Domain[]>(() => storage.get("domains", mockDomains));
  const [createOpen, setCreateOpen] = useState(false);
  const [deleteItem, setDeleteItem] = useState<Domain | null>(null);
  const [form, setForm] = useState({ domain: "", environment: "production" });

  const save = (list: Domain[]) => { setDomains(list); storage.set("domains", list); };

  const handleCreate = () => {
    if (!form.domain) { toast.error("Domain is required"); return; }
    const d: Domain = {
      id: generateId(), domain: form.domain, status: "pending", ssl: false,
      createdAt: new Date().toISOString(), environment: form.environment,
    };
    save([d, ...domains]);
    setCreateOpen(false);
    setForm({ domain: "", environment: "production" });
    toast.success("Domain added — DNS verification pending");
  };

  const handleDelete = () => {
    if (!deleteItem) return;
    save(domains.filter((d) => d.id !== deleteItem.id));
    setDeleteItem(null);
    toast.success("Domain removed");
  };

  return (
    <div className="animate-fade-in">
      <PageHeader title="Domains" description="Custom domains" actions={<Button size="sm" onClick={() => { setForm({ domain: "", environment: "production" }); setCreateOpen(true); }}><Plus className="h-4 w-4 mr-1" /> Add Domain</Button>} />
      <DataTable headers={["Domain", "Environment", "SSL", "Status", "Created", "Actions"]}>
        {domains.map((d) => (
          <tr key={d.id} className="hover:bg-secondary/30 transition-colors">
            <td className="px-4 py-3 font-medium text-foreground">{d.domain}</td>
            <td className="px-4 py-3 text-muted-foreground">{d.environment}</td>
            <td className="px-4 py-3 text-muted-foreground">{d.ssl ? "✓" : "✗"}</td>
            <td className="px-4 py-3"><StatusBadge status={d.status} /></td>
            <td className="px-4 py-3 text-muted-foreground">{formatDate(d.createdAt)}</td>
            <td className="px-4 py-3">
              <Button variant="ghost" size="icon" className="h-7 w-7 text-destructive" onClick={() => setDeleteItem(d)}><Trash2 className="h-3.5 w-3.5" /></Button>
            </td>
          </tr>
        ))}
      </DataTable>

      <CrudModal open={createOpen} onClose={() => setCreateOpen(false)} title="Add Domain" onSubmit={handleCreate}>
        <div><Label>Domain</Label><Input value={form.domain} onChange={(e) => setForm((f) => ({ ...f, domain: e.target.value }))} placeholder="app.example.com" /></div>
        <div><Label>Environment</Label><Input value={form.environment} onChange={(e) => setForm((f) => ({ ...f, environment: e.target.value }))} placeholder="production" /></div>
      </CrudModal>
      <DeleteConfirmModal open={!!deleteItem} onClose={() => setDeleteItem(null)} onConfirm={handleDelete} itemName={deleteItem?.domain ?? ""} />
    </div>
  );
}
