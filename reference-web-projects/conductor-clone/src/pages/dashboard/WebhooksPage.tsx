import { DataTableShell } from "@/components/shared/DataTableShell";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { Button } from "@/components/ui/button";
import { mockWebhooks } from "@/lib/mock-data";
import { formatDate, formatRelativeTime, formatPercentage } from "@/lib/utils";
import { Plus } from "lucide-react";

export default function WebhooksPage() {
  return (
    <DataTableShell title="Webhooks" description="Configure webhook endpoints." actions={<Button className="gradient-mint shadow-mint"><Plus className="mr-2 h-4 w-4" />Add Webhook</Button>}>
      <div className="rounded-lg border bg-card">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead><tr className="border-b text-xs text-muted-foreground">
              <th className="px-4 py-3 text-left font-medium">URL</th>
              <th className="px-4 py-3 text-left font-medium">Events</th>
              <th className="px-4 py-3 text-left font-medium">Status</th>
              <th className="px-4 py-3 text-left font-medium">Success Rate</th>
              <th className="px-4 py-3 text-left font-medium">Last Triggered</th>
            </tr></thead>
            <tbody>
              {mockWebhooks.map((w) => (
                <tr key={w.id} className="border-b last:border-0 hover:bg-muted/50">
                  <td className="px-4 py-3 font-mono text-xs">{w.url}</td>
                  <td className="px-4 py-3 text-xs text-muted-foreground">{w.events.join(", ")}</td>
                  <td className="px-4 py-3"><StatusBadge status={w.status} /></td>
                  <td className="px-4 py-3 text-sm">{formatPercentage(w.successRate)}</td>
                  <td className="px-4 py-3 text-sm text-muted-foreground">{formatRelativeTime(w.lastTriggeredAt)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </DataTableShell>
  );
}
