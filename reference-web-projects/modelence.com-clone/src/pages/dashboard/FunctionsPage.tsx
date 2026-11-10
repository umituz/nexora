import { PageHeader } from "@/components/shared/PageHeader";
import { DataTable } from "@/components/shared/DataTable";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { mockFunctions } from "@/lib/mock-data";
import { formatNumber, timeAgo } from "@/lib/utils";

export default function FunctionsPage() {
  return (
    <div className="animate-fade-in">
      <PageHeader title="Functions" description="Edge functions" />
      <DataTable headers={["Name", "Endpoint", "Method", "Invocations", "Avg Duration", "Status", "Last Invoked"]}>
        {mockFunctions.map((f) => (
          <tr key={f.id} className="hover:bg-secondary/30 transition-colors">
            <td className="px-4 py-3 font-medium text-foreground">{f.name}</td>
            <td className="px-4 py-3 text-muted-foreground font-mono text-xs">{f.endpoint}</td>
            <td className="px-4 py-3"><span className="px-1.5 py-0.5 bg-secondary text-xs rounded font-mono">{f.method}</span></td>
            <td className="px-4 py-3 text-muted-foreground">{formatNumber(f.invocations)}</td>
            <td className="px-4 py-3 text-muted-foreground">{f.avgDuration}ms</td>
            <td className="px-4 py-3"><StatusBadge status={f.status} /></td>
            <td className="px-4 py-3 text-muted-foreground">{f.lastInvoked ? timeAgo(f.lastInvoked) : "—"}</td>
          </tr>
        ))}
      </DataTable>
    </div>
  );
}
