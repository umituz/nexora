import { Link } from "react-router-dom";
import { DASHBOARD_LINKS } from "@/constants/app";
import { DASHBOARD_STATS, MOCK_TEST_RUNS, MOCK_PROJECTS, MOCK_BUG_REPORTS } from "@/data/mock";
import { calculatePassRate, formatRelativeTime, getStatusBg, creditUsagePercentage } from "@/utils/calculations";
import { Progress } from "@/components/ui/progress";
import { Activity, CheckCircle, XCircle, FolderKanban, Zap, Bug, Clock, BarChart3 } from "lucide-react";

export default function DashboardOverview() {
  const stats = [
    { label: "Total Tests", value: DASHBOARD_STATS.totalTests, icon: Activity, color: "text-primary" },
    { label: "Pass Rate", value: `${DASHBOARD_STATS.passRate}%`, icon: CheckCircle, color: "text-emerald-500" },
    { label: "Active Projects", value: DASHBOARD_STATS.activeProjects, icon: FolderKanban, color: "text-blue-500" },
    { label: "Bugs Found", value: DASHBOARD_STATS.bugsFound, icon: Bug, color: "text-red-500" },
    { label: "Tests Today", value: DASHBOARD_STATS.testsToday, icon: Zap, color: "text-amber-500" },
    { label: "Avg Duration", value: DASHBOARD_STATS.avgDuration, icon: Clock, color: "text-muted-foreground" },
  ];

  return (
    <div className="space-y-6">
      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {stats.map((s) => (
          <div key={s.label} className="glass-card p-4">
            <div className="flex items-center gap-2 mb-2">
              <s.icon size={16} className={s.color} />
              <span className="text-xs text-muted-foreground">{s.label}</span>
            </div>
            <div className="text-2xl font-heading font-bold">{s.value}</div>
          </div>
        ))}
      </div>

      {/* Credits */}
      <div className="glass-card p-5">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-heading font-medium">Credits Usage</span>
          <span className="text-sm text-muted-foreground">{DASHBOARD_STATS.creditsUsed} / {DASHBOARD_STATS.creditsTotal}</span>
        </div>
        <Progress value={creditUsagePercentage(DASHBOARD_STATS.creditsUsed, DASHBOARD_STATS.creditsTotal)} className="h-2" />
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Recent Runs */}
        <div className="glass-card p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-heading font-semibold text-sm">Recent Test Runs</h3>
            <Link to={DASHBOARD_LINKS.testRuns} className="text-xs text-primary hover:underline">View All</Link>
          </div>
          <div className="space-y-3">
            {MOCK_TEST_RUNS.slice(0, 4).map((run) => (
              <div key={run.id} className="flex items-center justify-between py-2 border-b border-border last:border-0">
                <div className="flex items-center gap-3">
                  {run.status === "passed" ? <CheckCircle size={16} className="text-emerald-500" /> : <XCircle size={16} className="text-red-500" />}
                  <div>
                    <div className="text-sm font-medium">{run.projectName}</div>
                    <div className="text-xs text-muted-foreground">{run.branch} · {run.commit}</div>
                  </div>
                </div>
                <div className="text-right">
                  <span className={`status-badge ${getStatusBg(run.status)}`}>{run.status}</span>
                  <div className="text-xs text-muted-foreground mt-1">{calculatePassRate(run.passed, run.total)}%</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Projects */}
        <div className="glass-card p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-heading font-semibold text-sm">Projects</h3>
            <Link to={DASHBOARD_LINKS.projects} className="text-xs text-primary hover:underline">View All</Link>
          </div>
          <div className="space-y-3">
            {MOCK_PROJECTS.slice(0, 4).map((proj) => (
              <div key={proj.id} className="flex items-center justify-between py-2 border-b border-border last:border-0">
                <div>
                  <div className="text-sm font-medium">{proj.name}</div>
                  <div className="text-xs text-muted-foreground">{proj.testCount} tests · {formatRelativeTime(proj.lastRun)}</div>
                </div>
                <div className="text-right">
                  <span className={`status-badge ${getStatusBg(proj.status)}`}>{proj.status}</span>
                  <div className="text-xs text-muted-foreground mt-1">{proj.passRate}%</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recent Bugs */}
      <div className="glass-card p-5">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-heading font-semibold text-sm">Recent Bug Reports</h3>
          <Link to={DASHBOARD_LINKS.bugReports} className="text-xs text-primary hover:underline">View All</Link>
        </div>
        <div className="space-y-3">
          {MOCK_BUG_REPORTS.slice(0, 3).map((bug) => (
            <div key={bug.id} className="flex items-center justify-between py-2 border-b border-border last:border-0">
              <div>
                <div className="text-sm font-medium">{bug.title}</div>
                <div className="text-xs text-muted-foreground">{bug.assignee} · {formatRelativeTime(bug.createdAt)}</div>
              </div>
              <div className="flex items-center gap-2">
                <span className={`status-badge ${getStatusBg(bug.severity)}`}>{bug.severity}</span>
                <span className={`status-badge ${getStatusBg(bug.status)}`}>{bug.status}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
