import { useData } from "@/contexts/DataContext";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { formatDateTime } from "@/lib/calculations";

const typeColors: Record<string, string> = { campaign: "bg-primary/10 text-primary", lead: "bg-info/10 text-info", account: "bg-success/10 text-success", team: "bg-warning/10 text-warning", settings: "bg-secondary text-muted-foreground", integration: "bg-primary/10 text-primary" };

export default function ActivityLogPage() {
  const { activityLog } = useData();
  return (
    <div className="space-y-6 animate-fade-in">
      <div><h1 className="text-2xl font-bold">Activity Log</h1><p className="text-muted-foreground">Track all actions</p></div>
      <div className="space-y-2">
        {activityLog.map((a) => (
          <Card key={a.id}><CardContent className="p-3 flex items-center gap-3">
            <Badge className={`${typeColors[a.targetType]} border-0 text-[10px] shrink-0`}>{a.targetType}</Badge>
            <div className="flex-1 min-w-0"><p className="text-sm"><span className="font-medium">{a.userName}</span> {a.action} <span className="font-medium">{a.target}</span></p><p className="text-xs text-muted-foreground">{a.details}</p></div>
            <span className="text-xs text-muted-foreground shrink-0">{formatDateTime(a.timestamp)}</span>
          </CardContent></Card>
        ))}
      </div>
    </div>
  );
}
