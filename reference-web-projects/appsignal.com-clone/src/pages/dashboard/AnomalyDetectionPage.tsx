import { PageHeader } from "@/components/shared/PageHeader";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { mockAnomalyTriggers } from "@/lib/mock-data";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

export default function AnomalyDetectionPage() {
  return (
    <div>
      <PageHeader title="Anomaly Detection" description="Configure alerts for unusual metrics">
        <Button size="sm" onClick={() => toast.success("New trigger created")}>New Trigger</Button>
      </PageHeader>
      <div className="space-y-3">
        {mockAnomalyTriggers.map((t) => (
          <div key={t.id} className="rounded-lg border border-border bg-card p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h3 className="font-semibold text-sm">{t.name}</h3>
              <p className="text-xs text-muted-foreground">{t.metric} {t.condition} {t.threshold} · Delay: {t.warmupDelay}min</p>
              {t.lastTriggered && <p className="text-xs text-muted-foreground mt-1">Last triggered: {t.lastTriggered}</p>}
            </div>
            <div className="flex items-center gap-3">
              <div className="flex gap-1">{t.notifyChannels.map((c) => <span key={c} className="rounded bg-muted px-2 py-0.5 text-[10px] capitalize">{c}</span>)}</div>
              <StatusBadge status={t.status} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
