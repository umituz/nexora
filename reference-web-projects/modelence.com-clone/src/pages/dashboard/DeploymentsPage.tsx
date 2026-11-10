import { PageHeader } from "@/components/shared/PageHeader";
import { DataTable } from "@/components/shared/DataTable";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { mockDeployments } from "@/lib/mock-data";
import { timeAgo, formatDuration } from "@/lib/utils";

export default function DeploymentsPage() {
  return (
    <div className="animate-fade-in">
      <PageHeader title="Deployments" description="Deployment history and status" />
      <DataTable headers={["Version", "Project", "Environment", "Status", "Deployed By", "Duration", "Time"]}>
        {mockDeployments.map((d) => (
          <tr key={d.id} className="hover:bg-secondary/30 transition-colors">
            <td className="px-4 py-3 font-medium text-foreground font-mono text-xs">{d.version}</td>
            <td className="px-4 py-3 text-muted-foreground">{d.projectName}</td>
            <td className="px-4 py-3 text-muted-foreground">{d.environment}</td>
            <td className="px-4 py-3"><StatusBadge status={d.status} /></td>
            <td className="px-4 py-3 text-muted-foreground">{d.deployedBy}</td>
            <td className="px-4 py-3 text-muted-foreground">{d.duration > 0 ? formatDuration(d.duration) : "—"}</td>
            <td className="px-4 py-3 text-muted-foreground">{timeAgo(d.createdAt)}</td>
          </tr>
        ))}
      </DataTable>
    </div>
  );
}
