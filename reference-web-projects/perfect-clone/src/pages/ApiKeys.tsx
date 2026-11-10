import { PageHeader } from "@/components/dashboard/PageHeader";
import { mockApiKeys } from "@/data/mockData";
import { StatusBadge } from "@/components/dashboard/StatusBadge";
import { Button } from "@/components/ui/button";
import { Plus, Eye, EyeOff, Copy } from "lucide-react";
import { useState } from "react";

export default function ApiKeys() {
  const [revealed, setRevealed] = useState<Set<string>>(new Set());

  const toggle = (id: string) => {
    setRevealed((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id); else next.add(id);
      return next;
    });
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <PageHeader title="API Keys" description="Manage API keys for integration" actions={<Button size="sm" className="gradient-bg"><Plus className="h-4 w-4 mr-1" />Create Key</Button>} />
      <div className="space-y-3">
        {mockApiKeys.map((k) => (
          <div key={k.id} className="bg-card border border-border rounded-xl p-5">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <h3 className="font-semibold">{k.name}</h3>
                <StatusBadge status={k.type === "live" ? "active" : "draft"} />
              </div>
              <div className="flex gap-1">
                <Button variant="ghost" size="icon" onClick={() => toggle(k.id)}>
                  {revealed.has(k.id) ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </Button>
                <Button variant="ghost" size="icon" onClick={() => navigator.clipboard.writeText(k.key)}>
                  <Copy className="h-4 w-4" />
                </Button>
              </div>
            </div>
            <code className="text-sm font-mono text-muted-foreground">{revealed.has(k.id) ? k.key : k.key.replace(/./g, "•").slice(0, 30) + "..."}</code>
            <div className="flex gap-4 mt-2 text-xs text-muted-foreground">
              <span>Permissions: {k.permissions.join(", ")}</span>
              {k.lastUsed && <span>Last used: {new Date(k.lastUsed).toLocaleDateString()}</span>}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
