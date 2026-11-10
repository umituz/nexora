import { PageHeader } from "@/components/shared/PageHeader";
import { DataTable } from "@/components/shared/DataTable";
import { mockStorageFiles } from "@/lib/mock-data";
import { formatBytes, formatDate } from "@/lib/utils";

export default function StorageFilesPage() {
  return (
    <div className="animate-fade-in">
      <PageHeader title="Files" description="Uploaded files" />
      <DataTable headers={["Name", "Path", "Size", "Type", "Uploaded"]}>
        {mockStorageFiles.map((f) => (
          <tr key={f.id} className="hover:bg-secondary/30 transition-colors">
            <td className="px-4 py-3 font-medium text-foreground">{f.name}</td>
            <td className="px-4 py-3 text-muted-foreground font-mono text-xs">{f.path}</td>
            <td className="px-4 py-3 text-muted-foreground">{formatBytes(f.sizeBytes)}</td>
            <td className="px-4 py-3 text-muted-foreground">{f.mimeType}</td>
            <td className="px-4 py-3 text-muted-foreground">{formatDate(f.uploadedAt)}</td>
          </tr>
        ))}
      </DataTable>
    </div>
  );
}
