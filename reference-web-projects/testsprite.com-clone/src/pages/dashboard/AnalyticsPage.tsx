import { MOCK_TEST_RUNS, MOCK_PROJECTS } from "@/data/mock";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, BarChart, Bar } from "recharts";

export default function AnalyticsPage() {
  const trendData = [
    { day: "Mon", passed: 120, failed: 8 },
    { day: "Tue", passed: 135, failed: 12 },
    { day: "Wed", passed: 142, failed: 5 },
    { day: "Thu", passed: 128, failed: 15 },
    { day: "Fri", passed: 155, failed: 3 },
    { day: "Sat", passed: 89, failed: 7 },
    { day: "Sun", passed: 95, failed: 4 },
  ];

  const projectData = MOCK_PROJECTS.map((p) => ({ name: p.name.split(" ")[0], passRate: p.passRate }));

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: "Total Tests This Week", value: "866" },
          { label: "Avg Pass Rate", value: "92.4%" },
          { label: "Test Duration Avg", value: "5.2m" },
          { label: "Credits Used", value: "847" },
        ].map((s) => (
          <div key={s.label} className="glass-card p-4 text-center">
            <div className="text-2xl font-heading font-bold">{s.value}</div>
            <div className="text-xs text-muted-foreground">{s.label}</div>
          </div>
        ))}
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        <div className="glass-card p-5">
          <h3 className="font-heading font-semibold text-sm mb-4">Test Trend (7 Days)</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={trendData}>
                <XAxis dataKey="day" tick={{ fontSize: 11 }} />
                <YAxis tick={{ fontSize: 11 }} />
                <Tooltip />
                <Line type="monotone" dataKey="passed" stroke="hsl(142, 71%, 45%)" strokeWidth={2} />
                <Line type="monotone" dataKey="failed" stroke="hsl(0, 72%, 51%)" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="glass-card p-5">
          <h3 className="font-heading font-semibold text-sm mb-4">Pass Rate by Project</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={projectData}>
                <XAxis dataKey="name" tick={{ fontSize: 11 }} />
                <YAxis domain={[0, 100]} tick={{ fontSize: 11 }} />
                <Tooltip />
                <Bar dataKey="passRate" fill="hsl(134, 40%, 28%)" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}
