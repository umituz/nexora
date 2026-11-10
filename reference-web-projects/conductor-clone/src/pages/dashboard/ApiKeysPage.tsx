import { DataTableShell } from "@/components/shared/DataTableShell";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { Button } from "@/components/ui/button";
import { mockApiKeys } from "@/lib/mock-data";
import { formatDate, formatRelativeTime } from "@/lib/utils";
import { Plus, Copy } from "lucide-react";

export default function ApiKeysPage() {
  return (
    <DataTableShell title="API Keys" description="Manage your API keys for authentication." actions={<Button className="gradient-mint shadow-mint"><Plus className="mr-2 h-4 w-4" />Create Key</Button>}>
      <div className="rounded-lg border bg-card">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead><tr className="border-b text-xs text-muted-foreground">
              <th className="px-4 py-3 text-left font-medium">Name</th>
              <th className="px-4 py-3 text-left font-medium">Key</th>
              <th className="px-4 py-3 text-left font-medium">Environment</th>
              <th className="px-4 py-3 text-left font-medium">Status</th>
              <th className="px-4 py-3 text-left font-medium">Created</th>
              <th className="px-4 py-3 text-left font-medium">Last Used</th>
              <th className="px-4 py-3 text-left font-medium">Actions</th>
            </tr></thead>
            <tbody>
              {mockApiKeys.map((k) => (
                <tr key={k.id} className="border-b last:border-0 hover:bg-muted/50">
                  <td className="px-4 py-3 text-sm font-medium">{k.name}</td>
                  <td className="px-4 py-3 font-mono text-xs text-muted-foreground">{k.prefix}...••••</td>
                  <td className="px-4 py-3"><StatusBadge status={k.environment} /></td>
                  <td className="px-4 py-3"><StatusBadge status={k.status} /></td>
                  <td className="px-4 py-3 text-sm text-muted-foreground">{formatDate(k.createdAt)}</td>
                  <td className="px-4 py-3 text-sm text-muted-foreground">{formatRelativeTime(k.lastUsedAt)}</td>
                  <td className="px-4 py-3"><Button variant="ghost" size="sm"><Copy className="h-3 w-3" /></Button></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </DataTableShell>
  );
}
