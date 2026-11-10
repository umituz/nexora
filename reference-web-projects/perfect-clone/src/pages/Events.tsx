import { PageHeader } from "@/components/dashboard/PageHeader";
import { Button } from "@/components/ui/button";
import { Plus, MousePointerClick } from "lucide-react";
import { useLocalStorage } from "@/hooks/useLocalStorage";
import { STORAGE_KEYS } from "@/constants/app";

interface CustomEvent {
  id: string;
  name: string;
  description: string;
  count: number;
  lastTriggered: string;
}

const defaultEvents: CustomEvent[] = [
  { id: "ev_1", name: "trial_started", description: "Fired when a user starts a free trial", count: 342, lastTriggered: new Date().toISOString() },
  { id: "ev_2", name: "trial_converted", description: "Fired when a trial converts to paid", count: 195, lastTriggered: new Date().toISOString() },
  { id: "ev_3", name: "smart_charge_captured", description: "Smart charge successfully captured", count: 287, lastTriggered: new Date().toISOString() },
  { id: "ev_4", name: "checkout_completed", description: "User completed checkout flow", count: 456, lastTriggered: new Date().toISOString() },
  { id: "ev_5", name: "backup_payment_added", description: "User added backup payment method", count: 128, lastTriggered: new Date().toISOString() },
];

export default function Events() {
  const [events] = useLocalStorage<CustomEvent[]>(STORAGE_KEYS.CUSTOM_EVENTS, defaultEvents);

  return (
    <div className="space-y-6 animate-fade-in">
      <PageHeader
        title="Events"
        description="Track custom conversion and attribution events"
        actions={<Button size="sm" className="gradient-bg"><Plus className="h-4 w-4 mr-1" />New Event</Button>}
      />

      <div className="space-y-3">
        {events.map((ev) => (
          <div key={ev.id} className="bg-card border border-border rounded-xl p-5 flex items-center gap-4 hover:border-primary/30 transition-colors">
            <div className="p-2 rounded-lg bg-primary/10 text-primary">
              <MousePointerClick className="h-5 w-5" />
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <code className="text-sm font-mono font-medium">{ev.name}</code>
              </div>
              <p className="text-sm text-muted-foreground">{ev.description}</p>
            </div>
            <div className="text-right">
              <p className="text-lg font-bold">{ev.count.toLocaleString()}</p>
              <p className="text-xs text-muted-foreground">total triggers</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
