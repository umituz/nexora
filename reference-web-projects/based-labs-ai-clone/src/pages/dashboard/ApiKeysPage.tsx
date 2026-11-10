import { MOCK_API_KEYS } from "@/data/mock-data";
import { formatDate } from "@/utils/formatters";
import { maskApiKey } from "@/utils/formatters";
import { Plus, Copy, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export default function ApiKeysPage() {
  return (
    <div>
      <div className="flex items-center justify-between">
        <h1 className="font-display text-2xl font-bold">API Keys</h1>
        <Button className="bg-gradient-primary text-primary-foreground"><Plus className="mr-2 h-4 w-4" /> Create Key</Button>
      </div>
      <p className="text-sm text-muted-foreground mt-1">Manage your API keys for programmatic access</p>
      <div className="mt-6 space-y-3">
        {MOCK_API_KEYS.map((key) => (
          <div key={key.id} className="flex items-center gap-4 rounded-lg border border-border bg-card p-4">
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-medium text-foreground">{key.name}</h3>
                <Badge variant={key.isActive ? "default" : "secondary"} className={key.isActive ? "bg-success text-success-foreground" : ""}>{key.isActive ? "Active" : "Inactive"}</Badge>
              </div>
              <p className="mt-1 font-mono text-xs text-muted-foreground">{maskApiKey(key.key)}</p>
              <p className="mt-1 text-xs text-muted-foreground">Created {formatDate(key.createdAt)} · Last used {key.lastUsed ? formatDate(key.lastUsed) : "Never"}</p>
            </div>
            <div className="flex gap-2">
              <Button variant="ghost" size="icon"><Copy className="h-4 w-4" /></Button>
              <Button variant="ghost" size="icon" className="text-destructive"><Trash2 className="h-4 w-4" /></Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
