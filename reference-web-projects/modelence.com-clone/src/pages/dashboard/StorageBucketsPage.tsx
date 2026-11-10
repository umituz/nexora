import { useState } from "react";
import { PageHeader } from "@/components/shared/PageHeader";
import { DataTable } from "@/components/shared/DataTable";
import { CrudModal, DeleteConfirmModal } from "@/components/shared/CrudModal";
import { mockStorageBuckets, type StorageBucket } from "@/lib/mock-data";
import { formatBytes, formatDate, generateId } from "@/lib/utils";
import { storage } from "@/lib/storage";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Plus, Trash2 } from "lucide-react";
import { toast } from "sonner";

export default function StorageBucketsPage() {
  const [buckets, setBuckets] = useState<StorageBucket[]>(() => storage.get("storageBuckets", mockStorageBuckets));
  const [createOpen, setCreateOpen] = useState(false);
  const [deleteItem, setDeleteItem] = useState<StorageBucket | null>(null);
  const [form, setForm] = useState({ name: "", isPublic: false });

  const save = (list: StorageBucket[]) => { setBuckets(list); storage.set("storageBuckets", list); };

  const handleCreate = () => {
    if (!form.name) { toast.error("Name is required"); return; }
    const b: StorageBucket = { id: generateId(), name: form.name, fileCount: 0, sizeBytes: 0, isPublic: form.isPublic, createdAt: new Date().toISOString() };
    save([b, ...buckets]);
    setCreateOpen(false);
    setForm({ name: "", isPublic: false });
    toast.success("Bucket created");
  };

  const handleDelete = () => {
    if (!deleteItem) return;
    save(buckets.filter((b) => b.id !== deleteItem.id));
    setDeleteItem(null);
    toast.success("Bucket deleted");
  };

  return (
    <div className="animate-fade-in">
      <PageHeader title="Storage Buckets" description="File storage buckets" actions={<Button size="sm" onClick={() => { setForm({ name: "", isPublic: false }); setCreateOpen(true); }}><Plus className="h-4 w-4 mr-1" /> Create Bucket</Button>} />
      <DataTable headers={["Name", "Files", "Size", "Public", "Created", "Actions"]}>
        {buckets.map((b) => (
          <tr key={b.id} className="hover:bg-secondary/30 transition-colors">
            <td className="px-4 py-3 font-medium text-foreground">{b.name}</td>
            <td className="px-4 py-3 text-muted-foreground">{b.fileCount}</td>
            <td className="px-4 py-3 text-muted-foreground">{formatBytes(b.sizeBytes)}</td>
            <td className="px-4 py-3 text-muted-foreground">{b.isPublic ? "Yes" : "No"}</td>
            <td className="px-4 py-3 text-muted-foreground">{formatDate(b.createdAt)}</td>
            <td className="px-4 py-3">
              <Button variant="ghost" size="icon" className="h-7 w-7 text-destructive" onClick={() => setDeleteItem(b)}><Trash2 className="h-3.5 w-3.5" /></Button>
            </td>
          </tr>
        ))}
      </DataTable>

      <CrudModal open={createOpen} onClose={() => setCreateOpen(false)} title="Create Bucket" onSubmit={handleCreate}>
        <div><Label>Bucket Name</Label><Input value={form.name} onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))} placeholder="my-bucket" /></div>
        <div className="flex items-center justify-between">
          <div><Label>Public Access</Label><p className="text-xs text-muted-foreground">Allow public access to files</p></div>
          <Switch checked={form.isPublic} onCheckedChange={(v) => setForm((f) => ({ ...f, isPublic: v }))} />
        </div>
      </CrudModal>
      <DeleteConfirmModal open={!!deleteItem} onClose={() => setDeleteItem(null)} onConfirm={handleDelete} itemName={deleteItem?.name ?? ""} />
    </div>
  );
}
