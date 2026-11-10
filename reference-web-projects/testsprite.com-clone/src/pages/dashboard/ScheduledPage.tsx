import { useState } from "react";
import { MOCK_SCHEDULED_TESTS, MOCK_PROJECTS, type ScheduledTest } from "@/data/mock";
import { useLocalStorage } from "@/hooks/useLocalStorage";
import { getStatusBg, formatRelativeTime, generateId } from "@/utils/calculations";
import { Plus, Trash2, Pause, Play } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";

const PRESETS = [
  { label: "Every 6 hours", cron: "0 */6 * * *" },
  { label: "Daily at midnight", cron: "0 0 * * *" },
  { label: "Weekly on Monday", cron: "0 8 * * 1" },
  { label: "Hourly", cron: "0 * * * *" },
];

export default function ScheduledPage() {
  const [scheduled, setScheduled] = useLocalStorage<ScheduledTest[]>("ts_scheduled", MOCK_SCHEDULED_TESTS);
  const [open, setOpen] = useState(false);
  const [draft, setDraft] = useState({ projectId: MOCK_PROJECTS[0].id, name: "", frequency: PRESETS[0].label });

  const create = () => {
    if (!draft.name.trim()) { toast.error("Name is required"); return; }
    const project = MOCK_PROJECTS.find((p) => p.id === draft.projectId);
    const preset = PRESETS.find((p) => p.label === draft.frequency) ?? PRESETS[0];
    const next = new Date(Date.now() + 6 * 60 * 60 * 1000).toISOString();
    const st: ScheduledTest = {
      id: `st-${generateId()}`,
      projectId: draft.projectId,
      projectName: project?.name ?? "Unknown",
      cron: preset.cron,
      frequency: preset.label,
      nextRun: next,
      lastRun: new Date().toISOString(),
      status: "active",
      testListId: `tl-${generateId()}`,
      testListName: draft.name,
    };
    setScheduled([st, ...scheduled]);
    setDraft({ projectId: MOCK_PROJECTS[0].id, name: "", frequency: PRESETS[0].label });
    setOpen(false);
    toast.success("Schedule created");
  };

  const remove = (id: string) => {
    setScheduled(scheduled.filter((s) => s.id !== id));
    toast.success("Schedule removed");
  };

  const toggle = (id: string) => {
    setScheduled(scheduled.map((s) => s.id === id ? { ...s, status: s.status === "active" ? "paused" : "active" } : s));
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button size="sm" className="gradient-primary text-primary-foreground gap-1"><Plus size={14} /> New Schedule</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader><DialogTitle className="font-heading">Create Schedule</DialogTitle></DialogHeader>
            <div className="space-y-3">
              <Input placeholder="Test list name" value={draft.name} onChange={(e) => setDraft({ ...draft, name: e.target.value })} />
              <Select value={draft.projectId} onValueChange={(v) => setDraft({ ...draft, projectId: v })}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {MOCK_PROJECTS.map((p) => <SelectItem key={p.id} value={p.id}>{p.name}</SelectItem>)}
                </SelectContent>
              </Select>
              <Select value={draft.frequency} onValueChange={(v) => setDraft({ ...draft, frequency: v })}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {PRESETS.map((p) => <SelectItem key={p.label} value={p.label}>{p.label}</SelectItem>)}
                </SelectContent>
              </Select>
              <Button onClick={create} className="w-full gradient-primary text-primary-foreground">Create</Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="space-y-4">
        {scheduled.map((st) => (
          <div key={st.id} className="glass-card p-5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="min-w-0">
                <h3 className="font-heading font-semibold text-sm">{st.testListName}</h3>
                <p className="text-xs text-muted-foreground">{st.projectName} · {st.frequency}</p>
                <p className="text-xs text-muted-foreground mt-1">Cron: <code className="bg-muted px-1 rounded">{st.cron}</code></p>
              </div>
              <div className="flex sm:flex-col items-end gap-2">
                <span className={`status-badge ${getStatusBg(st.status)}`}>{st.status}</span>
                <div className="text-xs text-muted-foreground">Next: {formatRelativeTime(st.nextRun)}</div>
                <div className="flex gap-2">
                  <button onClick={() => toggle(st.id)} className="text-muted-foreground hover:text-foreground">
                    {st.status === "active" ? <Pause size={14} /> : <Play size={14} />}
                  </button>
                  <button onClick={() => remove(st.id)} className="text-destructive hover:opacity-80"><Trash2 size={14} /></button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
