import { PageHeader } from "@/components/shared/PageHeader";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { mockCheckIns } from "@/lib/mock-data";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

export default function CheckInsPage() {
  return (
    <div>
      <PageHeader title="Check-ins" description="Monitor scheduled jobs and processes">
        <Button size="sm" onClick={() => toast.success("Check-in created")}>New Check-in</Button>
      </PageHeader>
      <div className="space-y-3">
        {mockCheckIns.map((ci) => (
          <div key={ci.id} className="rounded-lg border border-border bg-card p-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <h3 className="font-semibold text-sm">{ci.name}</h3>
                <p className="text-xs text-muted-foreground font-mono">{ci.schedule}</p>
              </div>
              <div className="flex items-center gap-3">
                <span className="rounded bg-muted px-2 py-0.5 text-[10px] capitalize">{ci.type}</span>
                <StatusBadge status={ci.status} />
              </div>
            </div>
            <div className="grid grid-cols-3 gap-4 mt-3 text-xs text-muted-foreground">
              <div><span className="block font-medium text-foreground">Last Check-in</span>{ci.lastCheckIn}</div>
              <div><span className="block font-medium text-foreground">Next Expected</span>{ci.nextExpected}</div>
              {ci.avgDuration > 0 && <div><span className="block font-medium text-foreground">Avg Duration</span>{ci.avgDuration}s</div>}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
