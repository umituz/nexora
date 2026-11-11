import { mockActivityLog } from "@/data/mock-data";
import { ScrollText } from "lucide-react";

export default function ActivityLogPage() {
  return (
    <div className="space-y-6">
      <h1 className="font-heading text-2xl font-bold">Activity Log</h1>
      <div className="space-y-2">
        {mockActivityLog.map((e) => (
          <div key={e.id} className="flex items-start gap-3 rounded-xl border border-border bg-card p-4">
            <ScrollText className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
            <div className="flex-1"><p className="text-sm">{e.description}</p><p className="text-xs text-muted-foreground">{e.userName} · {new Date(e.timestamp).toLocaleString()}</p></div>
            <span className="rounded bg-secondary px-2 py-0.5 text-xs text-muted-foreground">{e.type}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
