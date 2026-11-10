import { useState } from "react";
import { PageHeader } from "@/components/shared/PageHeader";
import { mockIntegrations, type Integration } from "@/lib/mock-data";
import { Switch } from "@/components/ui/switch";
import { storage } from "@/lib/storage";
import { toast } from "sonner";
import { SearchInput, useSearch } from "@/components/shared/SearchInput";

export default function IntegrationsPage() {
  const [integrations, setIntegrations] = useState<Integration[]>(() => storage.get("integrations", mockIntegrations));
  const { query, setQuery, filtered } = useSearch(integrations, (i, q) => i.name.toLowerCase().includes(q) || i.category.toLowerCase().includes(q));

  const toggle = (id: string) => {
    const updated = integrations.map((i) =>
      i.id === id ? { ...i, enabled: !i.enabled, configuredAt: !i.enabled ? new Date().toISOString() : null } : i
    );
    setIntegrations(updated);
    storage.set("integrations", updated);
    const item = updated.find((i) => i.id === id);
    toast.success(`${item?.name} ${item?.enabled ? "enabled" : "disabled"}`);
  };

  const categories = [...new Set(filtered.map((i) => i.category))];

  return (
    <div className="animate-fade-in">
      <PageHeader title="Integrations" description="Third-party integrations" />
      <div className="mb-6 max-w-sm"><SearchInput placeholder="Search integrations..." value={query} onChange={setQuery} /></div>
      {categories.map((cat) => (
        <div key={cat} className="mb-6">
          <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-3">{cat}</h3>
          <div className="grid sm:grid-cols-2 gap-3">
            {filtered.filter((i) => i.category === cat).map((i) => (
              <div key={i.id} className="bg-card border border-border rounded-lg p-5 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="text-2xl">{i.icon}</span>
                  <div><h4 className="font-medium text-foreground">{i.name}</h4><p className="text-xs text-muted-foreground">{i.description}</p></div>
                </div>
                <Switch checked={i.enabled} onCheckedChange={() => toggle(i.id)} />
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
