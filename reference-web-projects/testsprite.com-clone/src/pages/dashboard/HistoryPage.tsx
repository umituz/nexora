import { MOCK_TEST_RUNS } from "@/data/mock";
import { getStatusBg, calculatePassRate, formatDateTime } from "@/utils/calculations";

export default function HistoryPage() {
  return (
    <div className="space-y-3">
      {MOCK_TEST_RUNS.map((run) => (
        <div key={run.id} className="glass-card p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h3 className="text-sm font-medium">{run.projectName}</h3>
            <p className="text-xs text-muted-foreground">{run.branch} · {run.commit} · {run.triggeredBy}</p>
            <p className="text-xs text-muted-foreground">{formatDateTime(run.startedAt)}</p>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-xs">{run.passed}/{run.total} passed ({run.total > 0 ? calculatePassRate(run.passed, run.total) : 0}%)</span>
            <span className="text-xs text-muted-foreground">{run.duration}</span>
            <span className={`status-badge ${getStatusBg(run.status)}`}>{run.status}</span>
          </div>
        </div>
      ))}
    </div>
  );
}
