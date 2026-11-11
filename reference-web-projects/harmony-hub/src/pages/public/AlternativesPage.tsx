import { Check, X } from "lucide-react";

const alternatives = [
  {
    name: "ManyChat",
    weakness: "Flow-based, can't handle real conversations. No AI selling.",
    dmchampWins: ["True AI conversations", "Handles objections", "Closes deals", "Multi-channel in one place"],
  },
  {
    name: "GoHighLevel",
    weakness: "Complex setup, limited AI capabilities, generic responses.",
    dmchampWins: ["15-minute setup", "Human-like AI", "Built for sales, not support", "One-click optimization"],
  },
  {
    name: "Intercom",
    weakness: "Support-focused chatbot. Answers questions but doesn't sell.",
    dmchampWins: ["Sales-focused AI", "Revenue generation", "Appointment booking", "Campaign management"],
  },
  {
    name: "Tidio",
    weakness: "Basic chatbot with limited AI. Not designed for sales.",
    dmchampWins: ["Advanced AI understanding", "Image/voice/video support", "Lead scoring", "White labeling"],
  },
  {
    name: "Zendesk",
    weakness: "Enterprise support tool. Expensive, complex, not sales-oriented.",
    dmchampWins: ["Affordable starting at €27/mo", "Sales-first approach", "Quick setup", "Agency-friendly"],
  },
  {
    name: "DIY / Zapier Solutions",
    weakness: "Fragile integrations, no real AI, constant maintenance needed.",
    dmchampWins: ["All-in-one platform", "No technical knowledge needed", "Reliable & maintained", "Professional white-label"],
  },
];

export default function AlternativesPage() {
  return (
    <div className="py-20">
      <div className="container mx-auto px-4">
        <p className="text-center text-sm font-medium uppercase tracking-wider text-primary">Alternatives</p>
        <h1 className="mt-2 text-center font-heading text-3xl font-bold md:text-5xl">
          Sales Agent vs. Regular Chatbot
        </h1>
        <p className="mx-auto mt-4 max-w-xl text-center text-muted-foreground">
          Your clients pay for results, not features. Here's why they stay with DM Champ.
        </p>
        <div className="mt-16 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {alternatives.map((alt) => (
            <div key={alt.name} className="rounded-xl border border-border bg-card p-6">
              <h3 className="font-heading text-lg font-semibold">{alt.name}</h3>
              <div className="mt-3 flex items-start gap-2 rounded-lg bg-destructive/10 p-3">
                <X className="mt-0.5 h-4 w-4 shrink-0 text-destructive" />
                <p className="text-sm text-destructive">{alt.weakness}</p>
              </div>
              <div className="mt-4 space-y-2">
                <p className="text-xs font-semibold uppercase tracking-wider text-primary">DM Champ advantage</p>
                {alt.dmchampWins.map((win) => (
                  <div key={win} className="flex items-center gap-2 text-sm">
                    <Check className="h-4 w-4 text-primary" />
                    <span>{win}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
