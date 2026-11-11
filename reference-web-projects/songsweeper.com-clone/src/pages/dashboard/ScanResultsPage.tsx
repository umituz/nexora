import { mockData } from "@/data/mockData";
import { PageHeader } from "@/components/common/PageHeader";
import { formatRelativeDate } from "@/lib/calculations";

export default function ScanResultsPage() {
  return (
    <div>
      <PageHeader title="Scan Results" description="Results from your latest library scan" />
      <div className="glass-card divide-y divide-border">
        {mockData.scanResults.map((r) => (
          <div key={r.id} className="flex items-center justify-between px-4 py-3">
            <div>
              <p className="text-sm font-medium capitalize text-foreground">{r.type.replace("-", " ")}</p>
              <p className="text-xs text-muted-foreground">{formatRelativeDate(r.timestamp)}</p>
            </div>
            <div className="text-right">
              <p className="text-sm font-medium text-foreground">{r.itemsFound} items</p>
              <p className="text-xs capitalize text-muted-foreground">{r.status}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
