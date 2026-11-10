import { PageHeader } from "@/components/dashboard/PageHeader";
import { StatusBadge } from "@/components/dashboard/StatusBadge";
import { mockWebhooks } from "@/data/mockData";
import { Button } from "@/components/ui/button";
import { Plus, Webhook } from "lucide-react";

export default function Webhooks() {
  return (
    <div className="space-y-6 animate-fade-in">
      <PageHeader title="Webhooks" description="Manage webhook endpoints" actions={<Button size="sm" className="gradient-bg"><Plus className="h-4 w-4 mr-1" />Add Webhook</Button>} />
      <div className="space-y-3">
        {mockWebhooks.map((wh) => (
          <div key={wh.id} className="bg-card border border-border rounded-xl p-5">
            <div className="flex items-center gap-3 mb-3">
              <Webhook className="h-5 w-5 text-primary" />
              <code className="text-sm font-mono flex-1 truncate">{wh.url}</code>
              <StatusBadge status={wh.status} />
            </div>
            <div className="flex flex-wrap gap-1.5 mb-2">
              {wh.events.map((ev) => (
                <span key={ev} className="text-xs px-2 py-0.5 rounded bg-muted text-muted-foreground">{ev}</span>
              ))}
            </div>
            <p className="text-xs text-muted-foreground">
              {wh.lastTriggered ? `Last triggered: ${new Date(wh.lastTriggered).toLocaleDateString()}` : "Never triggered"}
              {wh.failureCount > 0 && ` · ${wh.failureCount} failures`}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
