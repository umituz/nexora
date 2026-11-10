import { PageHeader } from "@/components/shared/PageHeader";
import { mockActivityLog } from "@/lib/mock-data";
import { timeAgo } from "@/lib/utils";

export default function ActivityLogPage() {
  return (
    <div className="animate-fade-in">
      <PageHeader title="Activity Log" description="Recent platform activity" />
      <div className="space-y-2">
        {mockActivityLog.map((a) => (
          <div key={a.id} className="bg-card border border-border rounded-lg px-4 py-3 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="px-2 py-0.5 bg-secondary text-xs rounded text-muted-foreground capitalize">{a.action}</span>
              <p className="text-sm text-foreground">{a.details}</p>
            </div>
            <div className="flex items-center gap-3 shrink-0">
              <span className="text-xs text-muted-foreground">{a.user}</span>
              <span className="text-xs text-muted-foreground">{timeAgo(a.timestamp)}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
