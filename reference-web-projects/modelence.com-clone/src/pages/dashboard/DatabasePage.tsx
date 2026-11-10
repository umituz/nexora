import { PageHeader } from "@/components/shared/PageHeader";
import { DataTable } from "@/components/shared/DataTable";
import { mockCollections } from "@/lib/mock-data";
import { formatBytes, formatNumber, formatDate } from "@/lib/utils";

export default function DatabasePage() {
  return (
    <div className="animate-fade-in">
      <PageHeader title="Database Schema" description="Overview of your database collections" />
      <DataTable headers={["Collection", "Documents", "Size", "Indexes", "Created"]}>
        {mockCollections.map((c) => (
          <tr key={c.id} className="hover:bg-secondary/30 transition-colors">
            <td className="px-4 py-3 font-medium font-mono text-foreground">{c.name}</td>
            <td className="px-4 py-3 text-muted-foreground">{formatNumber(c.documentCount)}</td>
            <td className="px-4 py-3 text-muted-foreground">{formatBytes(c.sizeBytes)}</td>
            <td className="px-4 py-3 text-muted-foreground">{c.indexCount}</td>
            <td className="px-4 py-3 text-muted-foreground">{formatDate(c.createdAt)}</td>
          </tr>
        ))}
      </DataTable>
    </div>
  );
}
