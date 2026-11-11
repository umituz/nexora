import { useState } from "react";
import { toast } from "sonner";

const notifSettings = [
  { id: "new_conversation", label: "New Conversation", desc: "When a new lead starts a conversation" },
  { id: "appointment_booked", label: "Appointment Booked", desc: "When AI books an appointment" },
  { id: "conversion", label: "Conversion", desc: "When a lead converts to customer" },
  { id: "agent_error", label: "Agent Error", desc: "When an AI agent encounters an error" },
  { id: "credits_low", label: "Credits Low", desc: "When credits drop below 10%" },
  { id: "campaign_complete", label: "Campaign Complete", desc: "When a campaign finishes" },
];

export default function SettingsNotificationsPage() {
  const [enabled, setEnabled] = useState<string[]>(["new_conversation", "conversion", "credits_low"]);
  const toggle = (id: string) => { setEnabled((p) => p.includes(id) ? p.filter((i) => i !== id) : [...p, id]); toast.success("Updated"); };
  return (
    <div className="space-y-6">
      <h1 className="font-heading text-2xl font-bold">Notifications</h1>
      <div className="max-w-xl space-y-3">
        {notifSettings.map((n) => (
          <div key={n.id} className="flex items-center justify-between rounded-xl border border-border bg-card p-4">
            <div><p className="font-medium text-sm">{n.label}</p><p className="text-xs text-muted-foreground">{n.desc}</p></div>
            <button onClick={() => toggle(n.id)} className={`relative h-6 w-11 rounded-full transition-colors ${enabled.includes(n.id) ? "bg-primary" : "bg-muted"}`}>
              <span className={`absolute top-0.5 h-5 w-5 rounded-full bg-card shadow transition-transform ${enabled.includes(n.id) ? "left-[22px]" : "left-0.5"}`} />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
