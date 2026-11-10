import { PageHeader } from "@/components/shared/PageHeader";
import { mockApiKeys } from "@/lib/mock-data";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Copy, Trash2 } from "lucide-react";

export default function ApiKeysPage() {
  return (
    <div>
      <PageHeader title="API Keys" description="Manage your API keys">
        <Button size="sm" onClick={() => toast.success("New API key created")}>Create Key</Button>
      </PageHeader>
      <div className="space-y-3">
        {mockApiKeys.map((key) => (
          <div key={key.id} className="rounded-lg border border-border bg-card p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h3 className="font-semibold text-sm">{key.name}</h3>
              <p className="text-xs font-mono text-muted-foreground mt-1">{key.key}</p>
              <p className="text-xs text-muted-foreground mt-1">Created by {key.createdBy} · Last used: {key.lastUsed}</p>
            </div>
            <div className="flex items-center gap-2">
              <span className="rounded bg-muted px-2 py-0.5 text-[10px] uppercase">{key.type}</span>
              <Button size="icon" variant="ghost" className="h-8 w-8" onClick={() => toast.success("Key copied")}><Copy className="h-3.5 w-3.5" /></Button>
              <Button size="icon" variant="ghost" className="h-8 w-8" onClick={() => toast.success("Key revoked")}><Trash2 className="h-3.5 w-3.5" /></Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
