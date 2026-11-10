import { MOCK_AUDIT_LOG } from "@/data/mock";
import { formatDateTime, getStatusBg } from "@/utils/calculations";

export default function AuditLogPage() {
  return (
    <div className="space-y-3">
      {MOCK_AUDIT_LOG.map((entry) => (
        <div key={entry.id} className="glass-card p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h3 className="text-sm font-medium">{entry.action}</h3>
            <p className="text-xs text-muted-foreground">{entry.details}</p>
            <p className="text-xs text-muted-foreground">{entry.user} · {formatDateTime(entry.timestamp)}</p>
          </div>
          <span className={`status-badge ${getStatusBg(entry.category === "auth" ? "info" : entry.category === "test" ? "active" : "pending")}`}>{entry.category}</span>
        </div>
      ))}
    </div>
  );
}
