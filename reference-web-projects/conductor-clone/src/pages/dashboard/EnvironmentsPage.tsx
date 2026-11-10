import { StatusBadge } from "@/components/shared/StatusBadge";
import { mockEnvironments } from "@/lib/mock-data";
import { formatDate } from "@/lib/utils";

export default function EnvironmentsPage() {
  return (
    <div className="space-y-6">
      <div><h1 className="text-2xl font-bold">Environments</h1><p className="mt-1 text-sm text-muted-foreground">Manage your environments.</p></div>
      <div className="grid gap-4 sm:grid-cols-3">
        {mockEnvironments.map((e) => (
          <div key={e.id} className="rounded-lg border bg-card p-6">
            <div className="flex items-center justify-between"><h3 className="font-semibold">{e.name}</h3><StatusBadge status={e.type === "production" ? "active" : "configured"} /></div>
            <p className="mt-2 text-sm text-muted-foreground">Prefix: <code className="font-mono">{e.apiKeyPrefix}</code></p>
            <p className="text-sm text-muted-foreground">{e.connectionsCount} connections</p>
            <p className="text-xs text-muted-foreground mt-1">Created {formatDate(e.createdAt)}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
