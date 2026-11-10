import { APP_NAME } from "@/constants/app";

export default function ChangelogPage() {
  const entries = [
    { version: "2.1.0", date: "Mar 5, 2026", changes: ["Added AI model selection in test configuration", "Improved MCP server stability", "New webhook event types", "Performance improvements for large test suites"] },
    { version: "2.0.0", date: "Jul 15, 2025", changes: ["Autonomous self-repair capabilities", "Unified batch generation", "New dashboard UI", "Enhanced analytics", "MCP server integration"] },
    { version: "1.5.0", date: "Apr 10, 2025", changes: ["Scheduled test support", "Environment variables management", "Webhook notifications", "Bug report tracking"] },
    { version: "1.0.0", date: "Jan 28, 2025", changes: ["Initial release", "AI-powered test generation", "Frontend & backend testing", "CI/CD integration", "Community edition launched"] },
  ];

  return (
    <div className="section-padding">
      <div className="container-narrow">
        <h1 className="text-4xl md:text-5xl font-heading font-bold mb-2">Changelog</h1>
        <p className="text-muted-foreground mb-12">What&apos;s new in {APP_NAME}.</p>

        <div className="space-y-8">
          {entries.map((entry) => (
            <div key={entry.version} className="glass-card p-6">
              <div className="flex items-center gap-3 mb-3">
                <span className="status-badge bg-primary/10 text-primary font-heading">v{entry.version}</span>
                <span className="text-sm text-muted-foreground">{entry.date}</span>
              </div>
              <ul className="space-y-2">
                {entry.changes.map((c) => (
                  <li key={c} className="text-sm text-muted-foreground flex items-start gap-2">
                    <span className="text-primary mt-1">•</span> {c}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
