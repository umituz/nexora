import { useState } from "react";
import { MOCK_TEST_CASES, MOCK_PROJECTS, type TestCase } from "@/data/mock";
import { useLocalStorage } from "@/hooks/useLocalStorage";
import { getStatusBg, getSeverityBg, generateId } from "@/utils/calculations";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, Plus, Trash2 } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";

const TYPES: TestCase["type"][] = ["frontend", "backend", "integration", "e2e"];
const PRIORITIES: TestCase["priority"][] = ["critical", "high", "medium", "low"];

export default function TestCasesPage() {
  const [cases, setCases] = useLocalStorage<TestCase[]>("ts_test_cases", MOCK_TEST_CASES);
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [open, setOpen] = useState(false);
  const [draft, setDraft] = useState({
    name: "", description: "", projectId: MOCK_PROJECTS[0].id,
    type: "e2e" as TestCase["type"], priority: "medium" as TestCase["priority"], tags: "",
  });

  const filtered = cases.filter((tc) => {
    const matchSearch = tc.name.toLowerCase().includes(search.toLowerCase());
    const matchType = typeFilter === "all" || tc.type === typeFilter;
    const matchStatus = statusFilter === "all" || tc.status === statusFilter;
    return matchSearch && matchType && matchStatus;
  });

  const create = () => {
    if (!draft.name.trim()) { toast.error("Name is required"); return; }
    const tc: TestCase = {
      id: `tc-${generateId()}`,
      projectId: draft.projectId,
      name: draft.name,
      type: draft.type,
      status: "pending",
      priority: draft.priority,
      lastRun: new Date().toISOString(),
      duration: "—",
      tags: draft.tags.split(",").map((t) => t.trim()).filter(Boolean),
      description: draft.description,
      steps: [],
    };
    setCases([tc, ...cases]);
    setDraft({ name: "", description: "", projectId: MOCK_PROJECTS[0].id, type: "e2e", priority: "medium", tags: "" });
    setOpen(false);
    toast.success("Test case created");
  };

  const remove = (id: string) => {
    setCases(cases.filter((c) => c.id !== id));
    toast.success("Test case removed");
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row gap-3 sm:items-center">
        <div className="relative w-full sm:w-64">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <Input placeholder="Search test cases..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-9" />
        </div>
        <Select value={typeFilter} onValueChange={setTypeFilter}>
          <SelectTrigger className="w-full sm:w-40"><SelectValue placeholder="Type" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Types</SelectItem>
            {TYPES.map((t) => <SelectItem key={t} value={t}>{t}</SelectItem>)}
          </SelectContent>
        </Select>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-full sm:w-40"><SelectValue placeholder="Status" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="passed">Passed</SelectItem>
            <SelectItem value="failed">Failed</SelectItem>
            <SelectItem value="skipped">Skipped</SelectItem>
            <SelectItem value="pending">Pending</SelectItem>
          </SelectContent>
        </Select>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button size="sm" className="gradient-primary text-primary-foreground gap-1 sm:ml-auto"><Plus size={14} /> New Test Case</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader><DialogTitle className="font-heading">Create Test Case</DialogTitle></DialogHeader>
            <div className="space-y-3">
              <Input placeholder="Test case name" value={draft.name} onChange={(e) => setDraft({ ...draft, name: e.target.value })} />
              <Textarea placeholder="Description" value={draft.description} onChange={(e) => setDraft({ ...draft, description: e.target.value })} />
              <Select value={draft.projectId} onValueChange={(v) => setDraft({ ...draft, projectId: v })}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {MOCK_PROJECTS.map((p) => <SelectItem key={p.id} value={p.id}>{p.name}</SelectItem>)}
                </SelectContent>
              </Select>
              <div className="grid grid-cols-2 gap-3">
                <Select value={draft.type} onValueChange={(v) => setDraft({ ...draft, type: v as TestCase["type"] })}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>{TYPES.map((t) => <SelectItem key={t} value={t}>{t}</SelectItem>)}</SelectContent>
                </Select>
                <Select value={draft.priority} onValueChange={(v) => setDraft({ ...draft, priority: v as TestCase["priority"] })}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>{PRIORITIES.map((p) => <SelectItem key={p} value={p}>{p}</SelectItem>)}</SelectContent>
                </Select>
              </div>
              <Input placeholder="Tags (comma-separated)" value={draft.tags} onChange={(e) => setDraft({ ...draft, tags: e.target.value })} />
              <Button onClick={create} className="w-full gradient-primary text-primary-foreground">Create</Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="space-y-3">
        {filtered.map((tc) => (
          <div key={tc.id} className="glass-card p-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div className="flex-1 min-w-0">
                <h3 className="text-sm font-medium">{tc.name}</h3>
                <p className="text-xs text-muted-foreground mt-1">{tc.description}</p>
                <div className="flex flex-wrap gap-1 mt-2">
                  {tc.tags.map((tag) => (
                    <span key={tag} className="text-[10px] px-2 py-0.5 rounded bg-muted text-muted-foreground">{tag}</span>
                  ))}
                </div>
              </div>
              <div className="flex flex-wrap items-center gap-2 shrink-0">
                <span className={`status-badge ${getStatusBg(tc.type === "e2e" ? "info" : tc.type)}`}>{tc.type}</span>
                <span className={`status-badge ${getSeverityBg(tc.priority)}`}>{tc.priority}</span>
                <span className={`status-badge ${getStatusBg(tc.status)}`}>{tc.status}</span>
                <span className="text-xs text-muted-foreground">{tc.duration}</span>
                <button onClick={() => remove(tc.id)} className="text-destructive hover:opacity-80"><Trash2 size={14} /></button>
              </div>
            </div>
          </div>
        ))}
        {filtered.length === 0 && (
          <div className="text-center text-sm text-muted-foreground py-12">No test cases match your filters.</div>
        )}
      </div>
    </div>
  );
}
