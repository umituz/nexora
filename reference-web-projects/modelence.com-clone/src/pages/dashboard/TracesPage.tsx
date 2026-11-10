import { PageHeader } from "@/components/shared/PageHeader";
import { DataTable } from "@/components/shared/DataTable";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { mockTraces } from "@/lib/mock-data";
import { timeAgo } from "@/lib/utils";

export default function TracesPage() {
  return (
    <div className="animate-fade-in">
      <PageHeader title="Traces" description="Distributed tracing" />
      <DataTable headers={["Name", "Service", "Duration", "Spans", "Status", "Time"]}>
        {mockTraces.map((t) => (
          <tr key={t.id} className="hover:bg-secondary/30 transition-colors">
            <td className="px-4 py-3 font-medium font-mono text-xs text-foreground">{t.name}</td>
            <td className="px-4 py-3 text-muted-foreground">{t.service}</td>
            <td className="px-4 py-3 text-muted-foreground">{t.duration}ms</td>
            <td className="px-4 py-3 text-muted-foreground">{t.spans}</td>
            <td className="px-4 py-3"><StatusBadge status={t.status} /></td>
            <td className="px-4 py-3 text-muted-foreground">{timeAgo(t.timestamp)}</td>
          </tr>
        ))}
      </DataTable>
    </div>
  );
}
