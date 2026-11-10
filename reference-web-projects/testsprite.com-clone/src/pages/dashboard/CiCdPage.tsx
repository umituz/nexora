import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { GitBranch, Check, Plus } from "lucide-react";

const integrations = [
  { name: "GitHub Actions", status: "connected", lastSync: "2 min ago" },
  { name: "GitLab CI", status: "available", lastSync: "—" },
  { name: "Jenkins", status: "available", lastSync: "—" },
  { name: "CircleCI", status: "available", lastSync: "—" },
  { name: "Bitbucket Pipelines", status: "available", lastSync: "—" },
];

const recentPipelines = [
  { name: "main → deploy", status: "passed", time: "3m ago", tests: "142/142 passed" },
  { name: "feature/auth → staging", status: "failed", time: "1h ago", tests: "89/96 passed" },
  { name: "hotfix/cart → main", status: "passed", time: "3h ago", tests: "312/312 passed" },
];

export default function CiCdPage() {
  return (
    <div className="space-y-6">
      <div className="glass-card p-5">
        <h3 className="font-heading font-semibold text-sm mb-4">CI/CD Integrations</h3>
        <div className="space-y-3">
          {integrations.map((i) => (
            <div key={i.name} className="flex items-center justify-between py-2 border-b border-border last:border-0">
              <div className="flex items-center gap-3">
                <GitBranch size={18} className="text-primary" />
                <div>
                  <div className="text-sm font-medium">{i.name}</div>
                  <div className="text-xs text-muted-foreground">Last sync: {i.lastSync}</div>
                </div>
              </div>
              {i.status === "connected" ? (
                <span className="status-badge bg-emerald-500/10 text-emerald-600"><Check size={12} /> Connected</span>
              ) : (
                <Button size="sm" variant="outline" onClick={() => toast.success(i.name + " connected!")} className="gap-1"><Plus size={12} /> Connect</Button>
              )}
            </div>
          ))}
        </div>
      </div>

      <div className="glass-card p-5">
        <h3 className="font-heading font-semibold text-sm mb-4">Recent Pipelines</h3>
        <div className="space-y-3">
          {recentPipelines.map((p) => (
            <div key={p.name} className="flex items-center justify-between py-2 border-b border-border last:border-0">
              <div>
                <div className="text-sm font-medium font-heading">{p.name}</div>
                <div className="text-xs text-muted-foreground">{p.tests}</div>
              </div>
              <div className="text-right">
                <span className={`status-badge ${p.status === "passed" ? "bg-emerald-500/10 text-emerald-600" : "bg-red-500/10 text-red-600"}`}>{p.status}</span>
                <div className="text-xs text-muted-foreground mt-1">{p.time}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
