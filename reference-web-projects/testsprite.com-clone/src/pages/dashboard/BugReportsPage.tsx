import { useState } from "react";
import { MOCK_BUG_REPORTS, type BugReport } from "@/data/mock";
import { getStatusBg, getSeverityBg, formatRelativeTime, generateId } from "@/utils/calculations";
import { useLocalStorage } from "@/hooks/useLocalStorage";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Plus } from "lucide-react";
import { toast } from "sonner";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export default function BugReportsPage() {
  const [bugs, setBugs] = useLocalStorage<BugReport[]>("ts_bugs", MOCK_BUG_REPORTS);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [newBug, setNewBug] = useState({ title: "", severity: "medium" as BugReport["severity"], description: "" });

  const handleCreate = () => {
    if (!newBug.title) { toast.error("Title is required"); return; }
    const bug: BugReport = {
      id: `bug-${generateId()}`, projectId: "proj-1", title: newBug.title, severity: newBug.severity,
      status: "open", assignee: "Unassigned", createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(), description: newBug.description, testCaseId: "",
    };
    setBugs([bug, ...bugs]);
    setNewBug({ title: "", severity: "medium", description: "" });
    setDialogOpen(false);
    toast.success("Bug report created");
  };

  const updateStatus = (id: string, status: BugReport["status"]) => {
    setBugs(bugs.map((b) => b.id === id ? { ...b, status, updatedAt: new Date().toISOString() } : b));
    toast.success("Status updated");
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button size="sm" className="gradient-primary text-primary-foreground gap-1"><Plus size={14} /> Report Bug</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader><DialogTitle className="font-heading">Report Bug</DialogTitle></DialogHeader>
            <div className="space-y-3">
              <Input placeholder="Bug title" value={newBug.title} onChange={(e) => setNewBug({ ...newBug, title: e.target.value })} />
              <Input placeholder="Description" value={newBug.description} onChange={(e) => setNewBug({ ...newBug, description: e.target.value })} />
              <Select value={newBug.severity} onValueChange={(v) => setNewBug({ ...newBug, severity: v as BugReport["severity"] })}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="critical">Critical</SelectItem>
                  <SelectItem value="high">High</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="low">Low</SelectItem>
                </SelectContent>
              </Select>
              <Button onClick={handleCreate} className="w-full gradient-primary text-primary-foreground">Create</Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {bugs.map((bug) => (
        <div key={bug.id} className="glass-card p-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <h3 className="text-sm font-medium">{bug.title}</h3>
              <p className="text-xs text-muted-foreground">{bug.description}</p>
              <p className="text-xs text-muted-foreground mt-1">{bug.assignee} · {formatRelativeTime(bug.createdAt)}</p>
            </div>
            <div className="flex items-center gap-2">
              <span className={`status-badge ${getSeverityBg(bug.severity)}`}>{bug.severity}</span>
              <Select value={bug.status} onValueChange={(v) => updateStatus(bug.id, v as BugReport["status"])}>
                <SelectTrigger className="h-7 text-xs w-28"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="open">Open</SelectItem>
                  <SelectItem value="in-progress">In Progress</SelectItem>
                  <SelectItem value="resolved">Resolved</SelectItem>
                  <SelectItem value="closed">Closed</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
