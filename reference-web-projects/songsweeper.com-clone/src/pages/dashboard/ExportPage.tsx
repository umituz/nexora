import { PageHeader } from "@/components/common/PageHeader";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Download } from "lucide-react";

export default function ExportPage() {
  const { toast } = useToast();
  const handleExport = (format: string) => {
    toast({ title: "Export Started", description: `Exporting library as ${format}...` });
  };

  return (
    <div>
      <PageHeader title="Export" description="Export your library data" />
      <div className="max-w-2xl grid gap-3">
        {["CSV", "JSON", "XML", "Playlist File (.m3u)"].map((format) => (
          <div key={format} className="glass-card p-4 flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-foreground">Export as {format}</p>
              <p className="text-xs text-muted-foreground">Download your complete library data</p>
            </div>
            <Button size="sm" variant="outline" onClick={() => handleExport(format)}>
              <Download size={14} className="mr-1" /> Export
            </Button>
          </div>
        ))}
      </div>
    </div>
  );
}
