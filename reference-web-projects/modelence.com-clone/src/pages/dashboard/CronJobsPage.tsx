import { useState } from "react";
import { PageHeader } from "@/components/shared/PageHeader";
import { DataTable } from "@/components/shared/DataTable";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { CrudModal, DeleteConfirmModal } from "@/components/shared/CrudModal";
import { mockCronJobs, type CronJob } from "@/lib/mock-data";
import { formatDateTime, generateId } from "@/lib/utils";
import { storage } from "@/lib/storage";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Plus, Pencil, Trash2, Pause, Play } from "lucide-react";
import { toast } from "sonner";

export default function CronJobsPage() {
  const [jobs, setJobs] = useState<CronJob[]>(() => storage.get("cronJobs", mockCronJobs));
  const [createOpen, setCreateOpen] = useState(false);
  const [editItem, setEditItem] = useState<CronJob | null>(null);
  const [deleteItem, setDeleteItem] = useState<CronJob | null>(null);
  const [form, setForm] = useState({ name: "", schedule: "", handler: "" });

  const save = (list: CronJob[]) => { setJobs(list); storage.set("cronJobs", list); };

  const handleCreate = () => {
    if (!form.name || !form.schedule || !form.handler) { toast.error("All fields are required"); return; }
    const j: CronJob = {
      id: generateId(), name: form.name, schedule: form.schedule, handler: form.handler,
      status: "active", lastRun: null, nextRun: new Date(Date.now() + 86400000).toISOString(),
      createdAt: new Date().toISOString(),
    };
    save([j, ...jobs]);
    setCreateOpen(false);
    setForm({ name: "", schedule: "", handler: "" });
    toast.success("Cron job created");
  };

  const handleEdit = () => {
    if (!editItem) return;
    save(jobs.map((j) => j.id === editItem.id ? { ...j, name: form.name, schedule: form.schedule, handler: form.handler } : j));
    setEditItem(null);
    toast.success("Cron job updated");
  };

  const handleDelete = () => {
    if (!deleteItem) return;
    save(jobs.filter((j) => j.id !== deleteItem.id));
    setDeleteItem(null);
    toast.success("Cron job deleted");
  };

  const toggleStatus = (j: CronJob) => {
    const newStatus = j.status === "active" ? "paused" : "active";
    save(jobs.map((x) => x.id === j.id ? { ...x, status: newStatus } : x));
    toast.success(`Cron job ${newStatus}`);
  };

  const openEdit = (j: CronJob) => { setForm({ name: j.name, schedule: j.schedule, handler: j.handler }); setEditItem(j); };
  const openCreate = () => { setForm({ name: "", schedule: "", handler: "" }); setCreateOpen(true); };

  const formFields = (
    <>
      <div><Label>Name</Label><Input value={form.name} onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))} placeholder="Job name" /></div>
      <div><Label>Schedule (cron expression)</Label><Input value={form.schedule} onChange={(e) => setForm((f) => ({ ...f, schedule: e.target.value }))} placeholder="0 0 * * *" /></div>
      <div><Label>Handler</Label><Input value={form.handler} onChange={(e) => setForm((f) => ({ ...f, handler: e.target.value }))} placeholder="module/function" /></div>
    </>
  );

  return (
    <div className="animate-fade-in">
      <PageHeader title="Cron Jobs" description="Scheduled tasks" actions={<Button size="sm" onClick={openCreate}><Plus className="h-4 w-4 mr-1" /> New Job</Button>} />
      <DataTable headers={["Name", "Schedule", "Handler", "Status", "Last Run", "Next Run", "Actions"]}>
        {jobs.map((j) => (
          <tr key={j.id} className="hover:bg-secondary/30 transition-colors">
            <td className="px-4 py-3 font-medium text-foreground">{j.name}</td>
            <td className="px-4 py-3 text-muted-foreground font-mono text-xs">{j.schedule}</td>
            <td className="px-4 py-3 text-muted-foreground font-mono text-xs">{j.handler}</td>
            <td className="px-4 py-3"><StatusBadge status={j.status} /></td>
            <td className="px-4 py-3 text-muted-foreground">{j.lastRun ? formatDateTime(j.lastRun) : "—"}</td>
            <td className="px-4 py-3 text-muted-foreground">{formatDateTime(j.nextRun)}</td>
            <td className="px-4 py-3">
              <div className="flex items-center gap-1">
                <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => toggleStatus(j)} title={j.status === "active" ? "Pause" : "Resume"}>
                  {j.status === "active" ? <Pause className="h-3.5 w-3.5" /> : <Play className="h-3.5 w-3.5" />}
                </Button>
                <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => openEdit(j)}><Pencil className="h-3.5 w-3.5" /></Button>
                <Button variant="ghost" size="icon" className="h-7 w-7 text-destructive" onClick={() => setDeleteItem(j)}><Trash2 className="h-3.5 w-3.5" /></Button>
              </div>
            </td>
          </tr>
        ))}
      </DataTable>

      <CrudModal open={createOpen} onClose={() => setCreateOpen(false)} title="Create Cron Job" onSubmit={handleCreate}>{formFields}</CrudModal>
      <CrudModal open={!!editItem} onClose={() => setEditItem(null)} title="Edit Cron Job" onSubmit={handleEdit} submitLabel="Update">{formFields}</CrudModal>
      <DeleteConfirmModal open={!!deleteItem} onClose={() => setDeleteItem(null)} onConfirm={handleDelete} itemName={deleteItem?.name ?? ""} />
    </div>
  );
}
