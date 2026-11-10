import { PageHeader } from "@/components/shared/PageHeader";
import { DataTable } from "@/components/shared/DataTable";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { mockSessions } from "@/lib/mock-data";
import { formatDateTime } from "@/lib/utils";

export default function SessionsPage() {
  return (
    <div className="animate-fade-in">
      <PageHeader title="Sessions" description="Active user sessions" />
      <DataTable headers={["User", "IP Address", "User Agent", "Status", "Created", "Expires"]}>
        {mockSessions.map((s) => (
          <tr key={s.id} className="hover:bg-secondary/30 transition-colors">
            <td className="px-4 py-3 text-foreground">{s.userEmail}</td>
            <td className="px-4 py-3 text-muted-foreground font-mono text-xs">{s.ipAddress}</td>
            <td className="px-4 py-3 text-muted-foreground">{s.userAgent}</td>
            <td className="px-4 py-3"><StatusBadge status={s.active ? "active" : "expired"} /></td>
            <td className="px-4 py-3 text-muted-foreground">{formatDateTime(s.createdAt)}</td>
            <td className="px-4 py-3 text-muted-foreground">{formatDateTime(s.expiresAt)}</td>
          </tr>
        ))}
      </DataTable>
    </div>
  );
}
