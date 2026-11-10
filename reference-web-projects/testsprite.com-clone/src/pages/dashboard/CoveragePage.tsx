import { MOCK_COVERAGE } from "@/data/mock";
import { calculateCoverageStats } from "@/utils/calculations";
import { Progress } from "@/components/ui/progress";

export default function CoveragePage() {
  const stats = calculateCoverageStats(MOCK_COVERAGE);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="glass-card p-4 text-center">
          <div className="text-2xl font-heading font-bold">{stats.linePercentage}%</div>
          <div className="text-xs text-muted-foreground">Line Coverage</div>
        </div>
        <div className="glass-card p-4 text-center">
          <div className="text-2xl font-heading font-bold">{stats.branchPercentage}%</div>
          <div className="text-xs text-muted-foreground">Branch Coverage</div>
        </div>
        <div className="glass-card p-4 text-center">
          <div className="text-2xl font-heading font-bold">{stats.coveredLines}/{stats.totalLines}</div>
          <div className="text-xs text-muted-foreground">Lines Covered</div>
        </div>
        <div className="glass-card p-4 text-center">
          <div className="text-2xl font-heading font-bold">{stats.coveredBranches}/{stats.totalBranches}</div>
          <div className="text-xs text-muted-foreground">Branches Covered</div>
        </div>
      </div>

      <div className="space-y-3">
        {MOCK_COVERAGE.map((c) => (
          <div key={c.file} className="glass-card p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-heading">{c.file}</span>
              <span className={`text-sm font-bold ${c.percentage >= 80 ? "text-emerald-500" : c.percentage >= 60 ? "text-amber-500" : "text-red-500"}`}>
                {c.percentage}%
              </span>
            </div>
            <Progress value={c.percentage} className="h-2" />
            <div className="flex justify-between text-xs text-muted-foreground mt-1">
              <span>{c.covered}/{c.lines} lines</span>
              <span>{c.branchesCovered}/{c.branches} branches</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
