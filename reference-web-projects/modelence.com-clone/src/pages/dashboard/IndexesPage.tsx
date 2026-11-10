import { PageHeader } from "@/components/shared/PageHeader";
import { DataTable } from "@/components/shared/DataTable";
import { mockIndexes } from "@/lib/mock-data";
import { formatDate } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

export default function IndexesPage() {
  return (
    <div className="animate-fade-in">
      <PageHeader title="Indexes" description="Database indexes" actions={<Button size="sm"><Plus className="h-4 w-4 mr-1" /> Create Index</Button>} />
      <DataTable headers={["Name", "Collection", "Fields", "Unique", "Created"]}>
        {mockIndexes.map((idx) => (
          <tr key={idx.id} className="hover:bg-secondary/30 transition-colors">
            <td className="px-4 py-3 font-medium font-mono text-foreground">{idx.name}</td>
            <td className="px-4 py-3 text-muted-foreground font-mono">{idx.collectionName}</td>
            <td className="px-4 py-3 text-muted-foreground font-mono text-xs">{idx.fields.join(", ")}</td>
            <td className="px-4 py-3 text-muted-foreground">{idx.unique ? "Yes" : "No"}</td>
            <td className="px-4 py-3 text-muted-foreground">{formatDate(idx.createdAt)}</td>
          </tr>
        ))}
      </DataTable>
    </div>
  );
}
