import { APP_NAME } from "@/constants/app";
import { formatDate } from "@/lib/calculations";
import { Badge } from "@/components/ui/badge";

const entries = [
  { version: "2.1.0", date: "2026-03-08", type: "Feature", changes: ["Added scheduled tasks with cron support", "Knowledge base URL scraping", "Improved conversation memory across sessions", "Dark mode support"] },
  { version: "2.0.0", date: "2026-03-01", type: "Major", changes: ["Multi-model support (Claude, GPT-4o, Gemini)", "Redesigned dashboard UI", "Team collaboration features", "Webhook management", "Audit logging"] },
  { version: "1.5.0", date: "2026-02-20", type: "Feature", changes: ["WhatsApp integration", "Custom personas", "Analytics dashboard", "API key management"] },
  { version: "1.0.0", date: "2026-02-15", type: "Launch", changes: ["Initial public beta release", "Telegram and Discord support", "Claude model support", "Basic bot deployment"] },
];

export default function ChangelogPage() {
  return (
    <div className="container max-w-3xl py-20">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold">Changelog</h1>
        <p className="mt-2 text-muted-foreground">What's new in {APP_NAME}</p>
      </div>
      <div className="space-y-8">
        {entries.map((entry) => (
          <div key={entry.version} className="border-l-2 border-primary pl-6 relative">
            <div className="absolute -left-[5px] top-0 h-2.5 w-2.5 rounded-full bg-primary" />
            <div className="flex items-center gap-3 mb-2">
              <h2 className="text-lg font-semibold">v{entry.version}</h2>
              <Badge variant="secondary">{entry.type}</Badge>
              <span className="text-sm text-muted-foreground">{formatDate(entry.date)}</span>
            </div>
            <ul className="space-y-1">
              {entry.changes.map((change) => (
                <li key={change} className="text-sm text-muted-foreground">• {change}</li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
}
