import { useState } from "react";
import { MOCK_TEST_RUNS, MOCK_PROJECTS, type TestRun } from "@/data/mock";
import { useLocalStorage } from "@/hooks/useLocalStorage";
import { getStatusBg, calculatePassRate, formatRelativeTime, generateId } from "@/utils/calculations";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, Play, RotateCw, Trash2 } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";

export default function TestRunsPage() {
  const [runs, setRuns] = useLocalStorage<TestRun[]>("ts_test_runs", MOCK_TEST_RUNS);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  const filtered = runs.filter((r) => {
    const ms = r.projectName.toLowerCase().includes(search.toLowerCase());
    const mst = statusFilter === "all" || r.status === statusFilter;
    return ms && mst;
  });

  const triggerRun = (projectId: string) => {
    const project = MOCK_PROJECTS.find((p) => p.id === projectId) ?? MOCK_PROJECTS[0];
    const total = project.testCount || 50;
    const run: TestRun = {
      id: `run-${generateId()}`,
      projectId: project.id,
      projectName: project.name,
      status: "queued",
      total,
      passed: 0,
      failed: 0,
      skipped: 0,
      duration: "—",
      startedAt: new Date().toISOString(),
      triggeredBy: "Manual",
      branch: "main",
      commit: generateId().slice(0, 7),
    };
    setRuns([run, ...runs]);
    toast.success(`Test run queued for ${project.name}`);
  };

  const rerun = (id: string) => {
    const original = runs.find((r) => r.id === id);
    if (!original) return;
    triggerRun(original.projectId);
  };

  const remove = (id: string) => {
    setRuns(runs.filter((r) => r.id !== id));
    toast.success("Run removed");
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row gap-3 sm:items-center">
        <div className="relative w-full sm:w-64">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <Input placeholder="Search runs..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-9" />
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-full sm:w-40"><SelectValue placeholder="Status" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="passed">Passed</SelectItem>
            <SelectItem value="failed">Failed</SelectItem>
            <SelectItem value="running">Running</SelectItem>
            <SelectItem value="queued">Queued</SelectItem>
          </SelectContent>
        </Select>
        <Select onValueChange={triggerRun}>
          <SelectTrigger className="w-full sm:w-auto sm:ml-auto gradient-primary text-primary-foreground border-0">
            <Play size={14} className="mr-1" />
            <SelectValue placeholder="Trigger run" />
          </SelectTrigger>
          <SelectContent>
            {MOCK_PROJECTS.map((p) => <SelectItem key={p.id} value={p.id}>{p.name}</SelectItem>)}
          </SelectContent>
        </Select>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border text-left">
              <th className="py-3 font-heading font-semibold">Project</th>
              <th className="py-3 font-heading font-semibold">Status</th>
              <th className="py-3 font-heading font-semibold">Pass Rate</th>
              <th className="py-3 font-heading font-semibold hidden md:table-cell">Branch</th>
              <th className="py-3 font-heading font-semibold hidden md:table-cell">Duration</th>
              <th className="py-3 font-heading font-semibold hidden lg:table-cell">Triggered By</th>
              <th className="py-3 font-heading font-semibold">Time</th>
              <th className="py-3 font-heading font-semibold text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((run) => (
              <tr key={run.id} className="border-b border-border hover:bg-accent/30 transition-colors">
                <td className="py-3">
                  <div className="font-medium">{run.projectName}</div>
                  <div className="text-xs text-muted-foreground">{run.commit}</div>
                </td>
                <td className="py-3"><span className={`status-badge ${getStatusBg(run.status)}`}>{run.status}</span></td>
                <td className="py-3">{run.total > 0 ? `${calculatePassRate(run.passed, run.total)}%` : "—"}</td>
                <td className="py-3 hidden md:table-cell text-muted-foreground">{run.branch}</td>
                <td className="py-3 hidden md:table-cell text-muted-foreground">{run.duration}</td>
                <td className="py-3 hidden lg:table-cell text-muted-foreground">{run.triggeredBy}</td>
                <td className="py-3 text-muted-foreground text-xs">{formatRelativeTime(run.startedAt)}</td>
                <td className="py-3 text-right">
                  <div className="inline-flex gap-2">
                    <Button size="icon" variant="ghost" onClick={() => rerun(run.id)} title="Re-run"><RotateCw size={14} /></Button>
                    <Button size="icon" variant="ghost" onClick={() => remove(run.id)} title="Delete" className="text-destructive"><Trash2 size={14} /></Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
