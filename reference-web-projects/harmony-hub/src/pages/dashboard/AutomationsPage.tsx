import { mockAutomations, type AutomationRule } from "@/data/mock-data";
import { useLocalStorage } from "@/hooks/use-local-storage";
import { Workflow } from "lucide-react";
import { toast } from "sonner";

export default function AutomationsPage() {
  const [rules, setRules] = useLocalStorage<AutomationRule[]>("dmchamp_automations", mockAutomations);
  const toggle = (id: string) => { setRules((p) => p.map((r) => r.id === id ? { ...r, isActive: !r.isActive } : r)); toast.success("Updated"); };
  return (
    <div className="space-y-6">
      <h1 className="font-heading text-2xl font-bold">Automation Rules</h1>
      <div className="space-y-3">
        {rules.map((r) => (
          <div key={r.id} className="rounded-xl border border-border bg-card p-5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3"><Workflow className="h-5 w-5 text-primary" /><div><h3 className="font-heading font-semibold">{r.name}</h3><p className="text-xs text-muted-foreground">Trigger: {r.trigger} · Ran {r.executionCount}x</p></div></div>
              <button onClick={() => toggle(r.id)} className={`rounded-full px-3 py-1 text-xs font-medium ${r.isActive ? "bg-success/10 text-success" : "bg-muted text-muted-foreground"}`}>{r.isActive ? "Active" : "Inactive"}</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
