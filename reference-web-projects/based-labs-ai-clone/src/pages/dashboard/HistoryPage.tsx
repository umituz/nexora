import { MOCK_HISTORY } from "@/data/mock-data";
import { formatRelativeTime } from "@/utils/formatters";
import { CheckCircle, XCircle, Loader2 } from "lucide-react";

export default function HistoryPage() {
  return (
    <div>
      <h1 className="font-display text-2xl font-bold">History</h1>
      <p className="text-sm text-muted-foreground mt-1">Your generation history</p>
      <div className="mt-6 space-y-2">
        {MOCK_HISTORY.map((entry) => (
          <div key={entry.id} className="flex items-center gap-4 rounded-lg border border-border bg-card p-4">
            {entry.resultUrl && <img src={entry.resultUrl} alt="" className="h-12 w-12 rounded-lg object-cover flex-shrink-0" />}
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-foreground truncate">{entry.prompt}</p>
              <p className="text-xs text-muted-foreground">{entry.model} · {entry.action} · {entry.creditCost} credits</p>
            </div>
            <div className="flex items-center gap-2 flex-shrink-0">
              {entry.status === "completed" && <CheckCircle className="h-4 w-4 text-success" />}
              {entry.status === "failed" && <XCircle className="h-4 w-4 text-destructive" />}
              {entry.status === "processing" && <Loader2 className="h-4 w-4 text-primary animate-spin" />}
              <span className="text-xs text-muted-foreground">{formatRelativeTime(entry.createdAt)}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
