import { PageHeader } from "@/components/shared/PageHeader";
import { DataTable } from "@/components/shared/DataTable";
import { mockQueries } from "@/lib/mock-data";
import { formatNumber, formatDate } from "@/lib/utils";

export default function QueriesPage() {
  return (
    <div className="animate-fade-in">
      <PageHeader title="Queries & Mutations" description="Data loading operations" />
      <DataTable headers={["Name", "Type", "Collection", "Executions", "Avg Duration", "Created"]}>
        {mockQueries.map((q) => (
          <tr key={q.id} className="hover:bg-secondary/30 transition-colors">
            <td className="px-4 py-3 font-medium font-mono text-foreground">{q.name}</td>
            <td className="px-4 py-3"><span className="px-1.5 py-0.5 bg-secondary text-xs rounded capitalize">{q.type}</span></td>
            <td className="px-4 py-3 text-muted-foreground font-mono">{q.collection}</td>
            <td className="px-4 py-3 text-muted-foreground">{formatNumber(q.executionCount)}</td>
            <td className="px-4 py-3 text-muted-foreground">{q.avgDuration}ms</td>
            <td className="px-4 py-3 text-muted-foreground">{formatDate(q.createdAt)}</td>
          </tr>
        ))}
      </DataTable>
    </div>
  );
}
