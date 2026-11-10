import { PageHeader } from "@/components/shared/PageHeader";
import { DataTable } from "@/components/shared/DataTable";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { mockMigrations } from "@/lib/mock-data";
import { formatDate } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Play } from "lucide-react";

export default function MigrationsPage() {
  return (
    <div className="animate-fade-in">
      <PageHeader title="Migrations" description="Database migrations" actions={<Button size="sm"><Play className="h-4 w-4 mr-1" /> Run Pending</Button>} />
      <DataTable headers={["Name", "Status", "Applied At", "Created"]}>
        {mockMigrations.map((m) => (
          <tr key={m.id} className="hover:bg-secondary/30 transition-colors">
            <td className="px-4 py-3 font-medium font-mono text-foreground">{m.name}</td>
            <td className="px-4 py-3"><StatusBadge status={m.status} /></td>
            <td className="px-4 py-3 text-muted-foreground">{m.appliedAt ? formatDate(m.appliedAt) : "—"}</td>
            <td className="px-4 py-3 text-muted-foreground">{formatDate(m.createdAt)}</td>
          </tr>
        ))}
      </DataTable>
    </div>
  );
}
