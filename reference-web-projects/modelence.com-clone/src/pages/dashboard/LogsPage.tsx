import { useState } from "react";
import { PageHeader } from "@/components/shared/PageHeader";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { SearchInput } from "@/components/shared/SearchInput";
import { mockLogs } from "@/lib/mock-data";
import { formatDateTime } from "@/lib/utils";

export default function LogsPage() {
  const [query, setQuery] = useState("");
  const filtered = query ? mockLogs.filter((l) => l.message.toLowerCase().includes(query.toLowerCase()) || l.level.includes(query.toLowerCase())) : mockLogs;
  return (
    <div className="animate-fade-in">
      <PageHeader title="Logs" description="Application logs" />
      <div className="mb-4 max-w-sm"><SearchInput placeholder="Filter logs..." value={query} onChange={setQuery} /></div>
      <div className="bg-card border border-border rounded-lg overflow-hidden">
        <div className="overflow-x-auto max-h-[600px] overflow-y-auto">
          <table className="w-full text-xs font-mono">
            <thead className="sticky top-0 bg-secondary/80 backdrop-blur-sm">
              <tr><th className="text-left px-3 py-2 text-muted-foreground font-medium">Time</th><th className="text-left px-3 py-2 text-muted-foreground font-medium">Level</th><th className="text-left px-3 py-2 text-muted-foreground font-medium">Service</th><th className="text-left px-3 py-2 text-muted-foreground font-medium">Message</th></tr>
            </thead>
            <tbody className="divide-y divide-border">
              {filtered.map((l) => (
                <tr key={l.id} className="hover:bg-secondary/30 transition-colors">
                  <td className="px-3 py-2 text-muted-foreground whitespace-nowrap">{formatDateTime(l.timestamp)}</td>
                  <td className="px-3 py-2"><StatusBadge status={l.level} /></td>
                  <td className="px-3 py-2 text-muted-foreground">{l.service}</td>
                  <td className="px-3 py-2 text-foreground">{l.message}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
