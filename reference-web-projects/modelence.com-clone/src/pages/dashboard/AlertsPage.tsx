import { useState } from "react";
import { PageHeader } from "@/components/shared/PageHeader";
import { DataTable } from "@/components/shared/DataTable";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { CrudModal, DeleteConfirmModal } from "@/components/shared/CrudModal";
import { mockAlerts, type Alert } from "@/lib/mock-data";
import { formatDate, generateId } from "@/lib/utils";
import { cn, getSeverityColor } from "@/lib/utils";
import { storage } from "@/lib/storage";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus, Pencil, Trash2, BellOff, Bell } from "lucide-react";
import { toast } from "sonner";

export default function AlertsPage() {
  const [alerts, setAlerts] = useState<Alert[]>(() => storage.get("alerts", mockAlerts));
  const [createOpen, setCreateOpen] = useState(false);
  const [editItem, setEditItem] = useState<Alert | null>(null);
  const [deleteItem, setDeleteItem] = useState<Alert | null>(null);
  const [form, setForm] = useState({ name: "", condition: "", severity: "warning" as Alert["severity"] });

  const save = (list: Alert[]) => { setAlerts(list); storage.set("alerts", list); };

  const handleCreate = () => {
    if (!form.name || !form.condition) { toast.error("Name and condition required"); return; }
    const a: Alert = {
      id: generateId(), name: form.name, condition: form.condition, status: "active",
      severity: form.severity, lastTriggered: null, createdAt: new Date().toISOString(),
    };
    save([a, ...alerts]);
    setCreateOpen(false);
    setForm({ name: "", condition: "", severity: "warning" });
    toast.success("Alert created");
  };

  const handleEdit = () => {
    if (!editItem) return;
    save(alerts.map((a) => a.id === editItem.id ? { ...a, name: form.name, condition: form.condition, severity: form.severity } : a));
    setEditItem(null);
    toast.success("Alert updated");
  };

  const handleDelete = () => {
    if (!deleteItem) return;
    save(alerts.filter((a) => a.id !== deleteItem.id));
    setDeleteItem(null);
    toast.success("Alert deleted");
  };

  const toggleMute = (a: Alert) => {
    const newStatus = a.status === "muted" ? "active" : "muted";
    save(alerts.map((x) => x.id === a.id ? { ...x, status: newStatus } : x));
    toast.success(`Alert ${newStatus}`);
  };

  const openEdit = (a: Alert) => { setForm({ name: a.name, condition: a.condition, severity: a.severity }); setEditItem(a); };
  const openCreate = () => { setForm({ name: "", condition: "", severity: "warning" }); setCreateOpen(true); };

  const formFields = (
    <>
      <div><Label>Name</Label><Input value={form.name} onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))} placeholder="Alert name" /></div>
      <div><Label>Condition</Label><Input value={form.condition} onChange={(e) => setForm((f) => ({ ...f, condition: e.target.value }))} placeholder="error_rate > 5%" /></div>
      <div>
        <Label>Severity</Label>
        <Select value={form.severity} onValueChange={(v) => setForm((f) => ({ ...f, severity: v as Alert["severity"] }))}>
          <SelectTrigger><SelectValue /></SelectTrigger>
          <SelectContent><SelectItem value="critical">Critical</SelectItem><SelectItem value="warning">Warning</SelectItem><SelectItem value="info">Info</SelectItem></SelectContent>
        </Select>
      </div>
    </>
  );

  return (
    <div className="animate-fade-in">
      <PageHeader title="Alerts" description="Monitoring alerts" actions={<Button size="sm" onClick={openCreate}><Plus className="h-4 w-4 mr-1" /> Create Alert</Button>} />
      <DataTable headers={["Name", "Condition", "Severity", "Status", "Last Triggered", "Created", "Actions"]}>
        {alerts.map((a) => (
          <tr key={a.id} className="hover:bg-secondary/30 transition-colors">
            <td className="px-4 py-3 font-medium text-foreground">{a.name}</td>
            <td className="px-4 py-3 text-muted-foreground font-mono text-xs">{a.condition}</td>
            <td className="px-4 py-3"><span className={cn("px-2 py-0.5 rounded-full text-xs font-medium capitalize", getSeverityColor(a.severity))}>{a.severity}</span></td>
            <td className="px-4 py-3"><StatusBadge status={a.status} /></td>
            <td className="px-4 py-3 text-muted-foreground">{a.lastTriggered ? formatDate(a.lastTriggered) : "Never"}</td>
            <td className="px-4 py-3 text-muted-foreground">{formatDate(a.createdAt)}</td>
            <td className="px-4 py-3">
              <div className="flex items-center gap-1">
                <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => toggleMute(a)} title={a.status === "muted" ? "Unmute" : "Mute"}>
                  {a.status === "muted" ? <Bell className="h-3.5 w-3.5" /> : <BellOff className="h-3.5 w-3.5" />}
                </Button>
                <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => openEdit(a)}><Pencil className="h-3.5 w-3.5" /></Button>
                <Button variant="ghost" size="icon" className="h-7 w-7 text-destructive" onClick={() => setDeleteItem(a)}><Trash2 className="h-3.5 w-3.5" /></Button>
              </div>
            </td>
          </tr>
        ))}
      </DataTable>

      <CrudModal open={createOpen} onClose={() => setCreateOpen(false)} title="Create Alert" onSubmit={handleCreate}>{formFields}</CrudModal>
      <CrudModal open={!!editItem} onClose={() => setEditItem(null)} title="Edit Alert" onSubmit={handleEdit} submitLabel="Update">{formFields}</CrudModal>
      <DeleteConfirmModal open={!!deleteItem} onClose={() => setDeleteItem(null)} onConfirm={handleDelete} itemName={deleteItem?.name ?? ""} />
    </div>
  );
}
