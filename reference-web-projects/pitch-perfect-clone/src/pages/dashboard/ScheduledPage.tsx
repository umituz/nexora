import { MOCK_SCHEDULED_MESSAGES } from "@/lib/mock-data";
import { formatDateTime } from "@/lib/calculations";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

export default function ScheduledPage() {
  return (
    <div className="space-y-6 animate-fade-in">
      <div><h1 className="text-2xl font-heading font-bold text-foreground">Scheduled Messages</h1><p className="text-sm text-muted-foreground">Upcoming scheduled messages</p></div>
      <div className="space-y-2">
        {MOCK_SCHEDULED_MESSAGES.map((m) => (
          <Card key={m.id}><CardContent className="p-4 flex items-center justify-between">
            <div>
              <p className="font-medium text-foreground">{m.contactName}</p>
              <p className="text-sm text-muted-foreground truncate max-w-[400px]">{m.body}</p>
              <p className="text-xs text-muted-foreground mt-1">Scheduled: {formatDateTime(m.scheduledAt)}</p>
            </div>
            <div className="flex items-center gap-2">
              <span className={`px-2 py-0.5 rounded-full text-xs ${m.status==="pending"?"bg-warning/10 text-warning":"bg-success/10 text-success"}`}>{m.status}</span>
              {m.status === "pending" && <Button variant="outline" size="sm" onClick={() => toast.success("Message cancelled")}>Cancel</Button>}
            </div>
          </CardContent></Card>
        ))}
      </div>
    </div>
  );
}
