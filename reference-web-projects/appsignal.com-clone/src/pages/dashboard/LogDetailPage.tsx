import { useParams, Link } from "react-router-dom";
import { mockLogs } from "@/lib/mock-data";
import { PageHeader } from "@/components/shared/PageHeader";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { ArrowLeft } from "lucide-react";

export default function LogDetailPage() {
  const { id } = useParams<{ id: string }>();
  const log = mockLogs.find((l) => l.id === id) ?? mockLogs[0];
  return (
    <div>
      <Link to="/dashboard/logs" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary mb-4"><ArrowLeft className="h-4 w-4" />Back</Link>
      <PageHeader title="Log Entry" description={new Date(log.timestamp).toLocaleString()}><StatusBadge status={log.level === "fatal" ? "critical" : log.level} /></PageHeader>
      <div className="rounded-lg border border-border bg-card p-4 mb-4">
        <pre className="text-sm font-mono whitespace-pre-wrap break-all">{log.message}</pre>
      </div>
      <div className="grid md:grid-cols-2 gap-4">
        <div className="rounded-lg border border-border bg-card p-4">
          <h3 className="text-sm font-semibold mb-3">Details</h3>
          <dl className="space-y-2 text-sm">
            <div className="flex justify-between"><dt className="text-muted-foreground">Source</dt><dd className="font-mono text-xs">{log.source}</dd></div>
            <div className="flex justify-between"><dt className="text-muted-foreground">Hostname</dt><dd className="font-mono text-xs">{log.hostname}</dd></div>
            <div className="flex justify-between"><dt className="text-muted-foreground">Level</dt><dd className="capitalize">{log.level}</dd></div>
          </dl>
        </div>
        <div className="rounded-lg border border-border bg-card p-4">
          <h3 className="text-sm font-semibold mb-3">Attributes</h3>
          <dl className="space-y-2 text-sm">
            {Object.entries(log.attributes).map(([k, v]) => (
              <div key={k} className="flex justify-between"><dt className="text-muted-foreground">{k}</dt><dd className="font-mono text-xs">{v}</dd></div>
            ))}
          </dl>
        </div>
      </div>
    </div>
  );
}
