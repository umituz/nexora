import { PageHeader } from "@/components/shared/PageHeader";
import { mockPerformanceActions } from "@/lib/mock-data";
import { formatDuration } from "@/lib/calculations";
import { Link } from "react-router-dom";

export default function PerformanceListPage() {
  return (
    <div>
      <PageHeader title="Performance" description="Monitor action response times and throughput" />
      <div className="rounded-lg border border-border bg-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead><tr className="border-b border-border bg-muted/50">
              <th className="text-left px-4 py-3 font-medium">Action</th>
              <th className="text-left px-4 py-3 font-medium">Method</th>
              <th className="text-left px-4 py-3 font-medium hidden sm:table-cell">Mean</th>
              <th className="text-left px-4 py-3 font-medium hidden md:table-cell">P90</th>
              <th className="text-left px-4 py-3 font-medium hidden lg:table-cell">P95</th>
              <th className="text-left px-4 py-3 font-medium">Throughput</th>
              <th className="text-left px-4 py-3 font-medium hidden sm:table-cell">Error Rate</th>
            </tr></thead>
            <tbody>
              {mockPerformanceActions.map((a) => (
                <tr key={a.id} className="border-b border-border hover:bg-accent/50">
                  <td className="px-4 py-3"><Link to={`/dashboard/performance/${a.id}`} className="font-mono text-xs text-primary hover:underline">{a.action}</Link></td>
                  <td className="px-4 py-3"><span className="rounded bg-muted px-2 py-0.5 text-xs font-medium">{a.method}</span></td>
                  <td className="px-4 py-3 font-mono hidden sm:table-cell">{formatDuration(a.meanDuration)}</td>
                  <td className="px-4 py-3 font-mono hidden md:table-cell">{formatDuration(a.p90Duration)}</td>
                  <td className="px-4 py-3 font-mono hidden lg:table-cell">{formatDuration(a.p95Duration)}</td>
                  <td className="px-4 py-3 font-mono">{a.throughput} rpm</td>
                  <td className="px-4 py-3 hidden sm:table-cell"><span className={a.errorRate > 1 ? "text-red-400" : "text-muted-foreground"}>{a.errorRate}%</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
