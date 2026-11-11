import { mockLeadScoreRules, type LeadScoreRule } from "@/data/mock-data";
import { useLocalStorage } from "@/hooks/use-local-storage";
import { Target } from "lucide-react";
import { toast } from "sonner";

export default function LeadScoringPage() {
  const [rules, setRules] = useLocalStorage<LeadScoreRule[]>("dmchamp_lead_scoring", mockLeadScoreRules);
  const toggle = (id: string) => { setRules((p) => p.map((r) => r.id === id ? { ...r, isActive: !r.isActive } : r)); toast.success("Updated"); };
  return (
    <div className="space-y-6">
      <h1 className="font-heading text-2xl font-bold">Lead Scoring</h1>
      <div className="space-y-3">
        {rules.map((r) => (
          <div key={r.id} className="flex items-center gap-4 rounded-xl border border-border bg-card p-4">
            <Target className="h-5 w-5 text-primary" />
            <div className="flex-1"><p className="font-medium">{r.name}</p><p className="text-xs text-muted-foreground">{r.condition}</p></div>
            <span className={`font-heading font-bold ${r.points >= 0 ? "text-success" : "text-destructive"}`}>{r.points > 0 ? "+" : ""}{r.points}</span>
            <button onClick={() => toggle(r.id)} className={`rounded-full px-3 py-1 text-xs font-medium ${r.isActive ? "bg-success/10 text-success" : "bg-muted text-muted-foreground"}`}>{r.isActive ? "On" : "Off"}</button>
          </div>
        ))}
      </div>
    </div>
  );
}
