import { useState } from "react";
import { PageHeader } from "@/components/shared/PageHeader";
import { DataTable } from "@/components/shared/DataTable";
import { CrudModal, DeleteConfirmModal } from "@/components/shared/CrudModal";
import { mockCollections, type DatabaseCollection } from "@/lib/mock-data";
import { formatBytes, formatNumber, formatDate, generateId } from "@/lib/utils";
import { storage } from "@/lib/storage";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Plus, Trash2 } from "lucide-react";
import { toast } from "sonner";

export default function CollectionsPage() {
  const [collections, setCollections] = useState<DatabaseCollection[]>(() => storage.get("collections", mockCollections));
  const [createOpen, setCreateOpen] = useState(false);
  const [deleteItem, setDeleteItem] = useState<DatabaseCollection | null>(null);
  const [name, setName] = useState("");

  const save = (list: DatabaseCollection[]) => { setCollections(list); storage.set("collections", list); };

  const handleCreate = () => {
    if (!name) { toast.error("Name is required"); return; }
    const c: DatabaseCollection = { id: generateId(), name, documentCount: 0, sizeBytes: 0, indexCount: 0, createdAt: new Date().toISOString() };
    save([c, ...collections]);
    setCreateOpen(false);
    setName("");
    toast.success("Collection created");
  };

  const handleDelete = () => {
    if (!deleteItem) return;
    save(collections.filter((c) => c.id !== deleteItem.id));
    setDeleteItem(null);
    toast.success("Collection deleted");
  };

  return (
    <div className="animate-fade-in">
      <PageHeader title="Collections" description="Manage database collections" actions={<Button size="sm" onClick={() => { setName(""); setCreateOpen(true); }}><Plus className="h-4 w-4 mr-1" /> New Collection</Button>} />
      <DataTable headers={["Name", "Documents", "Size", "Indexes", "Created", "Actions"]}>
        {collections.map((c) => (
          <tr key={c.id} className="hover:bg-secondary/30 transition-colors">
            <td className="px-4 py-3 font-medium font-mono text-foreground">{c.name}</td>
            <td className="px-4 py-3 text-muted-foreground">{formatNumber(c.documentCount)}</td>
            <td className="px-4 py-3 text-muted-foreground">{formatBytes(c.sizeBytes)}</td>
            <td className="px-4 py-3 text-muted-foreground">{c.indexCount}</td>
            <td className="px-4 py-3 text-muted-foreground">{formatDate(c.createdAt)}</td>
            <td className="px-4 py-3">
              <Button variant="ghost" size="icon" className="h-7 w-7 text-destructive" onClick={() => setDeleteItem(c)}><Trash2 className="h-3.5 w-3.5" /></Button>
            </td>
          </tr>
        ))}
      </DataTable>

      <CrudModal open={createOpen} onClose={() => setCreateOpen(false)} title="Create Collection" onSubmit={handleCreate}>
        <div><Label>Collection Name</Label><Input value={name} onChange={(e) => setName(e.target.value)} placeholder="my_collection" /></div>
      </CrudModal>
      <DeleteConfirmModal open={!!deleteItem} onClose={() => setDeleteItem(null)} onConfirm={handleDelete} itemName={deleteItem?.name ?? ""} />
    </div>
  );
}
