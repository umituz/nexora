import type { TestRun, TestCase, BugReport, CoverageData } from "@/data/mock";

export function calculatePassRate(passed: number, total: number): number {
  if (total === 0) return 0;
  return Math.round((passed / total) * 1000) / 10;
}

export function calculateTestRunStats(runs: TestRun[]) {
  const totalRuns = runs.length;
  const passedRuns = runs.filter((r) => r.status === "passed").length;
  const failedRuns = runs.filter((r) => r.status === "failed").length;
  const runningRuns = runs.filter((r) => r.status === "running").length;
  return { totalRuns, passedRuns, failedRuns, runningRuns };
}

export function calculateTestCaseStats(cases: TestCase[]) {
  const total = cases.length;
  const passed = cases.filter((c) => c.status === "passed").length;
  const failed = cases.filter((c) => c.status === "failed").length;
  const skipped = cases.filter((c) => c.status === "skipped").length;
  const pending = cases.filter((c) => c.status === "pending").length;
  return { total, passed, failed, skipped, pending, passRate: calculatePassRate(passed, total) };
}

export function calculateBugStats(bugs: BugReport[]) {
  const total = bugs.length;
  const open = bugs.filter((b) => b.status === "open").length;
  const inProgress = bugs.filter((b) => b.status === "in-progress").length;
  const resolved = bugs.filter((b) => b.status === "resolved").length;
  const critical = bugs.filter((b) => b.severity === "critical").length;
  return { total, open, inProgress, resolved, critical };
}

export function calculateCoverageStats(coverage: CoverageData[]) {
  const totalLines = coverage.reduce((a, c) => a + c.lines, 0);
  const coveredLines = coverage.reduce((a, c) => a + c.covered, 0);
  const totalBranches = coverage.reduce((a, c) => a + c.branches, 0);
  const coveredBranches = coverage.reduce((a, c) => a + c.branchesCovered, 0);
  return {
    linePercentage: calculatePassRate(coveredLines, totalLines),
    branchPercentage: calculatePassRate(coveredBranches, totalBranches),
    totalLines,
    coveredLines,
    totalBranches,
    coveredBranches,
  };
}

export function formatDate(dateStr: string): string {
  const d = new Date(dateStr);
  return d.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}

export function formatDateTime(dateStr: string): string {
  const d = new Date(dateStr);
  return d.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function formatRelativeTime(dateStr: string): string {
  const now = new Date();
  const d = new Date(dateStr);
  const diffMs = now.getTime() - d.getTime();
  const diffMin = Math.floor(diffMs / 60000);
  if (diffMin < 1) return "Just now";
  if (diffMin < 60) return `${diffMin}m ago`;
  const diffHr = Math.floor(diffMin / 60);
  if (diffHr < 24) return `${diffHr}h ago`;
  const diffDay = Math.floor(diffHr / 24);
  if (diffDay < 7) return `${diffDay}d ago`;
  return formatDate(dateStr);
}

export function getStatusColor(status: string): string {
  switch (status) {
    case "passed":
    case "active":
    case "resolved":
    case "success":
      return "text-emerald-500";
    case "failed":
    case "critical":
    case "error":
      return "text-red-500";
    case "running":
    case "in-progress":
    case "warning":
      return "text-amber-500";
    case "queued":
    case "pending":
    case "paused":
    case "info":
      return "text-blue-500";
    case "skipped":
    case "inactive":
    case "archived":
      return "text-muted-foreground";
    default:
      return "text-foreground";
  }
}

export function getStatusBg(status: string): string {
  switch (status) {
    case "passed":
    case "active":
    case "resolved":
      return "bg-emerald-500/10 text-emerald-600";
    case "failed":
    case "critical":
      return "bg-red-500/10 text-red-600";
    case "running":
    case "in-progress":
      return "bg-amber-500/10 text-amber-600";
    case "queued":
    case "pending":
    case "paused":
      return "bg-blue-500/10 text-blue-600";
    case "skipped":
    case "inactive":
      return "bg-muted text-muted-foreground";
    default:
      return "bg-muted text-foreground";
  }
}

export function getSeverityBg(severity: string): string {
  switch (severity) {
    case "critical":
      return "bg-red-500/10 text-red-600";
    case "high":
      return "bg-orange-500/10 text-orange-600";
    case "medium":
      return "bg-amber-500/10 text-amber-600";
    case "low":
      return "bg-blue-500/10 text-blue-600";
    default:
      return "bg-muted text-muted-foreground";
  }
}

export function truncateString(str: string, maxLength: number): string {
  if (str.length <= maxLength) return str;
  return str.slice(0, maxLength) + "…";
}

export function generateId(): string {
  return Math.random().toString(36).slice(2, 11);
}

export function creditUsagePercentage(used: number, total: number): number {
  if (total === 0) return 0;
  return Math.round((used / total) * 100);
}
