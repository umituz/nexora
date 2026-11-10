import { mockObjectStats } from "@/lib/mock-data";
import { formatRelativeTime, formatNumber } from "@/lib/utils";

export default function ObjectsPage() {
  return (
    <div className="space-y-6">
      <div><h1 className="text-2xl font-bold">Objects</h1><p className="mt-1 text-sm text-muted-foreground">QuickBooks Desktop object types and sync stats.</p></div>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {mockObjectStats.map((o) => (
          <div key={o.type} className="rounded-lg border bg-card p-4">
            <h3 className="font-semibold">{o.type}</h3>
            <p className="mt-1 text-2xl font-bold">{formatNumber(o.count)}</p>
            <p className="text-xs text-muted-foreground">Last sync: {formatRelativeTime(o.lastSync)}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
