import { PageHeader } from "@/components/common/PageHeader";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Upload } from "lucide-react";

export default function ImportPage() {
  const { toast } = useToast();
  const handleImport = () => {
    toast({ title: "Import Complete", description: "Library data imported successfully (mock)." });
  };

  return (
    <div>
      <PageHeader title="Import" description="Import library data from external sources" />
      <div className="max-w-2xl">
        <div className="glass-card p-8 text-center border-2 border-dashed border-border">
          <Upload size={40} className="mx-auto mb-4 text-muted-foreground" />
          <h3 className="text-lg font-semibold text-foreground mb-2">Drop your file here</h3>
          <p className="text-sm text-muted-foreground mb-4">Supports CSV, JSON, XML, and M3U files</p>
          <Button onClick={handleImport}>Select File</Button>
        </div>
        <div className="mt-6 glass-card p-4">
          <h3 className="text-sm font-semibold text-foreground mb-2">Import from Services</h3>
          {["Apple Music", "Spotify", "YouTube Music", "Last.fm"].map((service) => (
            <div key={service} className="flex items-center justify-between py-2 border-b border-border last:border-0">
              <span className="text-sm text-foreground">{service}</span>
              <Button size="sm" variant="outline" onClick={handleImport}>Connect</Button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
