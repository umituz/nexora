import { useState } from "react";
import { PageHeader } from "@/components/shared/PageHeader";
import { DataTable } from "@/components/shared/DataTable";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { SearchInput, useSearch } from "@/components/shared/SearchInput";
import { CrudModal, DeleteConfirmModal } from "@/components/shared/CrudModal";
import { mockProjects, type Project } from "@/lib/mock-data";
import { formatDate, generateId } from "@/lib/utils";
import { storage } from "@/lib/storage";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Plus, Pencil, Trash2 } from "lucide-react";
import { toast } from "sonner";

export default function ProjectsPage() {
  const [projects, setProjects] = useState<Project[]>(() => storage.get("projects", mockProjects));
  const [createOpen, setCreateOpen] = useState(false);
  const [editItem, setEditItem] = useState<Project | null>(null);
  const [deleteItem, setDeleteItem] = useState<Project | null>(null);
  const [form, setForm] = useState({ name: "", description: "", region: "us-east-1" });

  const { query, setQuery, filtered } = useSearch(projects, (p, q) =>
    p.name.toLowerCase().includes(q) || p.slug.toLowerCase().includes(q)
  );

  const save = (list: Project[]) => { setProjects(list); storage.set("projects", list); };

  const handleCreate = () => {
    if (!form.name) { toast.error("Name is required"); return; }
    const p: Project = {
      id: generateId(), name: form.name, slug: form.name.toLowerCase().replace(/\s+/g, "-"),
      description: form.description, status: "active", createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(), environmentCount: 0, region: form.region,
    };
    save([p, ...projects]);
    setCreateOpen(false);
    setForm({ name: "", description: "", region: "us-east-1" });
    toast.success("Project created");
  };

  const handleEdit = () => {
    if (!editItem || !form.name) { toast.error("Name is required"); return; }
    save(projects.map((p) => p.id === editItem.id ? { ...p, name: form.name, description: form.description, region: form.region, updatedAt: new Date().toISOString() } : p));
    setEditItem(null);
    toast.success("Project updated");
  };

  const handleDelete = () => {
    if (!deleteItem) return;
    save(projects.filter((p) => p.id !== deleteItem.id));
    setDeleteItem(null);
    toast.success("Project deleted");
  };

  const openEdit = (p: Project) => { setForm({ name: p.name, description: p.description, region: p.region }); setEditItem(p); };
  const openCreate = () => { setForm({ name: "", description: "", region: "us-east-1" }); setCreateOpen(true); };

  const formFields = (
    <>
      <div><Label>Name</Label><Input value={form.name} onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))} placeholder="Project name" /></div>
      <div><Label>Description</Label><Textarea value={form.description} onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))} placeholder="Description" rows={3} /></div>
      <div><Label>Region</Label><Input value={form.region} onChange={(e) => setForm((f) => ({ ...f, region: e.target.value }))} placeholder="us-east-1" /></div>
    </>
  );

  return (
    <div className="animate-fade-in">
      <PageHeader title="Projects" description="Manage your projects" actions={<Button size="sm" onClick={openCreate}><Plus className="h-4 w-4 mr-1" /> New Project</Button>} />
      <div className="mb-4 max-w-sm"><SearchInput placeholder="Search projects..." value={query} onChange={setQuery} /></div>
      <DataTable headers={["Name", "Status", "Region", "Environments", "Updated", "Actions"]}>
        {filtered.map((p) => (
          <tr key={p.id} className="hover:bg-secondary/30 transition-colors">
            <td className="px-4 py-3"><p className="font-medium text-foreground">{p.name}</p><p className="text-xs text-muted-foreground">{p.description}</p></td>
            <td className="px-4 py-3"><StatusBadge status={p.status} /></td>
            <td className="px-4 py-3 text-muted-foreground">{p.region}</td>
            <td className="px-4 py-3 text-muted-foreground">{p.environmentCount}</td>
            <td className="px-4 py-3 text-muted-foreground">{formatDate(p.updatedAt)}</td>
            <td className="px-4 py-3">
              <div className="flex items-center gap-1">
                <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => openEdit(p)}><Pencil className="h-3.5 w-3.5" /></Button>
                <Button variant="ghost" size="icon" className="h-7 w-7 text-destructive" onClick={() => setDeleteItem(p)}><Trash2 className="h-3.5 w-3.5" /></Button>
              </div>
            </td>
          </tr>
        ))}
      </DataTable>

      <CrudModal open={createOpen} onClose={() => setCreateOpen(false)} title="Create Project" onSubmit={handleCreate}>{formFields}</CrudModal>
      <CrudModal open={!!editItem} onClose={() => setEditItem(null)} title="Edit Project" onSubmit={handleEdit} submitLabel="Update">{formFields}</CrudModal>
      <DeleteConfirmModal open={!!deleteItem} onClose={() => setDeleteItem(null)} onConfirm={handleDelete} itemName={deleteItem?.name ?? ""} />
    </div>
  );
}
