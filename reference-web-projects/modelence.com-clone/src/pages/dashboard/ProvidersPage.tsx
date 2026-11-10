import { PageHeader } from "@/components/shared/PageHeader";
import { mockProviders } from "@/lib/mock-data";
import { Switch } from "@/components/ui/switch";

export default function ProvidersPage() {
  return (
    <div className="animate-fade-in">
      <PageHeader title="Auth Providers" description="Configure authentication providers" />
      <div className="space-y-3">
        {mockProviders.map((p) => (
          <div key={p.id} className="bg-card border border-border rounded-lg p-5 flex items-center justify-between">
            <div>
              <h3 className="font-medium text-foreground">{p.name}</h3>
              <p className="text-sm text-muted-foreground">{p.userCount} users connected</p>
            </div>
            <Switch checked={p.enabled} />
          </div>
        ))}
      </div>
    </div>
  );
}
