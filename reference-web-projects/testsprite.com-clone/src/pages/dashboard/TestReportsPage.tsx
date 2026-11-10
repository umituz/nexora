import { MOCK_TEST_RUNS, MOCK_TEST_CASES, MOCK_PROJECTS } from "@/data/mock";
import { calculateTestRunStats, calculateTestCaseStats } from "@/utils/calculations";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";

const CHART_COLORS = ["hsl(142, 71%, 45%)", "hsl(0, 72%, 51%)", "hsl(38, 92%, 50%)", "hsl(217, 91%, 60%)"];

export default function TestReportsPage() {
  const runStats = calculateTestRunStats(MOCK_TEST_RUNS);
  const caseStats = calculateTestCaseStats(MOCK_TEST_CASES);

  const pieData = [
    { name: "Passed", value: caseStats.passed },
    { name: "Failed", value: caseStats.failed },
    { name: "Skipped", value: caseStats.skipped },
    { name: "Pending", value: caseStats.pending },
  ];

  const projectData = MOCK_PROJECTS.map((p) => ({ name: p.name.split(" ")[0], tests: p.testCount, passRate: p.passRate }));

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="glass-card p-4 text-center">
          <div className="text-2xl font-heading font-bold">{runStats.totalRuns}</div>
          <div className="text-xs text-muted-foreground">Total Runs</div>
        </div>
        <div className="glass-card p-4 text-center">
          <div className="text-2xl font-heading font-bold text-emerald-500">{runStats.passedRuns}</div>
          <div className="text-xs text-muted-foreground">Passed</div>
        </div>
        <div className="glass-card p-4 text-center">
          <div className="text-2xl font-heading font-bold text-red-500">{runStats.failedRuns}</div>
          <div className="text-xs text-muted-foreground">Failed</div>
        </div>
        <div className="glass-card p-4 text-center">
          <div className="text-2xl font-heading font-bold">{caseStats.passRate}%</div>
          <div className="text-xs text-muted-foreground">Pass Rate</div>
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        <div className="glass-card p-5">
          <h3 className="font-heading font-semibold text-sm mb-4">Test Results Distribution</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={pieData} cx="50%" cy="50%" innerRadius={60} outerRadius={90} dataKey="value" label={({ name, value }) => `${name}: ${value}`}>
                  {pieData.map((_, i) => (<Cell key={i} fill={CHART_COLORS[i % CHART_COLORS.length]} />))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="glass-card p-5">
          <h3 className="font-heading font-semibold text-sm mb-4">Tests by Project</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={projectData}>
                <XAxis dataKey="name" tick={{ fontSize: 11 }} />
                <YAxis tick={{ fontSize: 11 }} />
                <Tooltip />
                <Bar dataKey="tests" fill="hsl(134, 40%, 28%)" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}
