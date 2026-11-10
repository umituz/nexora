import { PageHeader } from "@/components/shared/PageHeader";
import { mockIntegrations } from "@/lib/mock-data";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

export default function IntegrationsPage() {
  return (
    <div>
      <PageHeader title="Integrations" description="Connect with your favorite tools" />
      {["notification", "issue_tracker", "deployment", "communication"].map((cat) => (
        <div key={cat} className="mb-8">
          <h2 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground mb-3">{cat.replace(/_/g, " ")}</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {mockIntegrations.filter((i) => i.category === cat).map((int) => (
              <div key={int.id} className="rounded-lg border border-border bg-card p-4 flex flex-col">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-semibold text-sm">{int.name}</h3>
                  <StatusBadge status={int.connected ? "active" : "inactive"} />
                </div>
                <p className="text-xs text-muted-foreground flex-1 mb-3">{int.description}</p>
                <Button size="sm" variant={int.connected ? "outline" : "default"} onClick={() => toast.success(int.connected ? `${int.name} disconnected` : `${int.name} connected`)}>
                  {int.connected ? "Disconnect" : "Connect"}
                </Button>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
