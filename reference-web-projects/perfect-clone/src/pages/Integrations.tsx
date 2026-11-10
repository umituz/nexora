import { PageHeader } from "@/components/dashboard/PageHeader";
import { Puzzle, Check, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";

const integrations = [
  { id: "stripe", name: "Stripe", description: "Payment processing and subscription management", connected: true, logo: "💳" },
  { id: "slack", name: "Slack", description: "Team notifications and alerts", connected: true, logo: "💬" },
  { id: "zapier", name: "Zapier", description: "Connect with 5,000+ apps", connected: false, logo: "⚡" },
  { id: "hubspot", name: "HubSpot", description: "CRM and marketing automation", connected: false, logo: "🔶" },
  { id: "segment", name: "Segment", description: "Customer data platform", connected: false, logo: "📊" },
  { id: "intercom", name: "Intercom", description: "Customer messaging platform", connected: false, logo: "💬" },
  { id: "mixpanel", name: "Mixpanel", description: "Product analytics", connected: false, logo: "📈" },
  { id: "salesforce", name: "Salesforce", description: "Enterprise CRM", connected: false, logo: "☁️" },
];

export default function Integrations() {
  return (
    <div className="space-y-6 animate-fade-in">
      <PageHeader title="Integrations" description="Connect your favorite tools" />
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {integrations.map((int) => (
          <div key={int.id} className="bg-card border border-border rounded-xl p-5 hover:border-primary/30 transition-colors">
            <div className="flex items-start justify-between mb-3">
              <span className="text-3xl">{int.logo}</span>
              {int.connected && <span className="flex items-center gap-1 text-xs text-primary"><Check className="h-3 w-3" />Connected</span>}
            </div>
            <h3 className="font-semibold">{int.name}</h3>
            <p className="text-sm text-muted-foreground mb-4">{int.description}</p>
            <Button variant={int.connected ? "outline" : "default"} size="sm" className={!int.connected ? "gradient-bg" : ""}>
              {int.connected ? "Configure" : "Connect"}
            </Button>
          </div>
        ))}
      </div>
    </div>
  );
}
