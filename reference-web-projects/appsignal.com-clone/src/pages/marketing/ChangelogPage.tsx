import { APP_NAME } from "@/constants/app";
import { Link } from "react-router-dom";

const changes = [
  { version: "v2.4.1", date: "March 8, 2026", items: ["Fixed payment processing timeout", "Improved error detail page load time", "Added new API key management features"] },
  { version: "v2.4.0", date: "March 7, 2026", items: ["New custom dashboard builder", "Time Detective correlation engine", "Workflow automation rules", "Enhanced log search with filters"] },
  { version: "v2.3.9", date: "March 6, 2026", items: ["Database migration improvements", "Fixed memory leak in background worker", "Updated Slack integration"] },
  { version: "v2.3.8", date: "March 5, 2026", items: ["Performance optimization for search", "Added P99 percentile tracking", "New uptime monitoring regions"] },
  { version: "v2.3.7", date: "March 4, 2026", items: ["User authentication overhaul", "SAML SSO support", "Team member role management", "Improved deploy markers"] },
  { version: "v2.3.6", date: "March 1, 2026", items: ["Check-in heartbeat monitoring", "Anomaly detection smart delays", "Bug fixes and stability improvements"] },
];

export default function ChangelogPage() {
  return (
    <div className="py-20">
      <div className="container max-w-3xl">
        <h1 className="text-4xl md:text-5xl font-bold mb-4">Changelog</h1>
        <p className="text-lg text-muted-foreground mb-12">What's new in {APP_NAME}.</p>
        <div className="space-y-10">
          {changes.map((c) => (
            <div key={c.version} className="border-l-2 border-primary pl-6 relative">
              <div className="absolute -left-[5px] top-1 h-2 w-2 rounded-full bg-primary" />
              <div className="flex items-baseline gap-3 mb-2">
                <h2 className="text-lg font-bold">{c.version}</h2>
                <span className="text-sm text-muted-foreground">{c.date}</span>
              </div>
              <ul className="space-y-1">
                {c.items.map((item) => (
                  <li key={item} className="text-sm text-muted-foreground">• {item}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
