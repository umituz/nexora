import { PageHeader } from "@/components/shared/PageHeader";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { mockWorkflows } from "@/lib/mock-data";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

export default function WorkflowPage() {
  return (
    <div>
      <PageHeader title="Workflow" description="Automate responses to alerts and events">
        <Button size="sm" onClick={() => toast.success("Workflow rule created")}>New Rule</Button>
      </PageHeader>
      <div className="space-y-3">
        {mockWorkflows.map((wf) => (
          <div key={wf.id} className="rounded-lg border border-border bg-card p-5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
              <div className="flex items-center gap-3">
                <h3 className="font-semibold text-sm">{wf.name}</h3>
                <StatusBadge status={wf.enabled ? "active" : "disabled"} />
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs text-muted-foreground">Triggered {wf.triggerCount}×</span>
                <Button size="sm" variant="ghost" onClick={() => toast.success(wf.enabled ? "Rule disabled" : "Rule enabled")}>
                  {wf.enabled ? "Disable" : "Enable"}
                </Button>
              </div>
            </div>
            <div className="grid sm:grid-cols-3 gap-4 text-xs">
              <div>
                <span className="font-medium text-muted-foreground block mb-1">Trigger</span>
                <span>{wf.trigger}</span>
              </div>
              <div>
                <span className="font-medium text-muted-foreground block mb-1">Conditions</span>
                {wf.conditions.length > 0 ? (
                  <ul className="space-y-0.5">{wf.conditions.map((c) => <li key={c}>{c}</li>)}</ul>
                ) : (
                  <span className="text-muted-foreground">No conditions</span>
                )}
              </div>
              <div>
                <span className="font-medium text-muted-foreground block mb-1">Actions</span>
                <ul className="space-y-0.5">{wf.actions.map((a) => <li key={a}>{a}</li>)}</ul>
              </div>
            </div>
            {wf.lastTriggered && (
              <p className="text-xs text-muted-foreground mt-3">Last triggered: {wf.lastTriggered}</p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
