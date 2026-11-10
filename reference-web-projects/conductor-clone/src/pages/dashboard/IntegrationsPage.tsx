import { DataTableShell } from "@/components/shared/DataTableShell";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { mockIntegrations } from "@/lib/mock-data";

export default function IntegrationsPage() {
  return (
    <DataTableShell title="Integrations" description="Connect third-party services.">
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {mockIntegrations.map((i) => (
          <div key={i.id} className="rounded-lg border bg-card p-6">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold">{i.name}</h3>
              <StatusBadge status={i.status} />
            </div>
            <p className="mt-2 text-sm text-muted-foreground">{i.description}</p>
          </div>
        ))}
      </div>
    </DataTableShell>
  );
}
