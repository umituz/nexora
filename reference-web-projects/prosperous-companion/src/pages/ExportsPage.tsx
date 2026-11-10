import { useData } from "@/contexts/DataContext";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";
import { formatDate } from "@/lib/calculations";

export default function ExportsPage() {
  const { exports: exportJobs } = useData();
  const statusColors: Record<string, string> = { completed: "bg-success/10 text-success", processing: "bg-warning/10 text-warning", pending: "bg-secondary text-muted-foreground", failed: "bg-destructive/10 text-destructive" };
  return (
    <div className="space-y-6 animate-fade-in">
      <div><h1 className="text-2xl font-bold">Export Center</h1><p className="text-muted-foreground">Download your data</p></div>
      <div className="space-y-3">
        {exportJobs.map((e) => (
          <Card key={e.id}><CardContent className="p-4 flex items-center gap-4">
            <Download className="h-5 w-5 text-muted-foreground" />
            <div className="flex-1"><p className="font-medium">{e.name}</p><p className="text-xs text-muted-foreground">{e.format.toUpperCase()} · {e.recordCount} records · {formatDate(e.createdAt)}</p></div>
            <Badge className={`${statusColors[e.status]} border-0 text-xs`}>{e.status}</Badge>
            {e.status === "completed" && <Button size="sm" variant="outline"><Download className="mr-1 h-3 w-3" /> Download</Button>}
          </CardContent></Card>
        ))}
      </div>
    </div>
  );
}
