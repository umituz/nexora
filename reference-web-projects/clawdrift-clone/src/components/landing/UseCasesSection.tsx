import { Check } from "lucide-react";

const useCaseRows = [
  ["Translate in real time", "Organize your inbox", "Answer support tickets", "Summarize long documents", "Notify before a meeting", "Auto-reply to messages", "Draft follow-up emails"],
  ["Schedule across time zones", "Do your taxes", "Track expenses and receipts", "Compare insurance quotes", "Manage subscriptions", "Set smart reminders", "Automate data entry"],
  ["Find discount codes", "Price-drop alerts", "Compare product specs", "Negotiate deals", "Run payroll calculations", "Monitor competitor pricing", "Track order shipments"],
  ["Generate invoices", "Create presentations from bullet points", "Book travel and hotels", "Find recipes from ingredients", "Write meeting agendas", "Summarize research papers"],
  ["Screen cold outreach", "Draft job descriptions", "Run standup summaries", "Track OKRs and KPIs", "Monitor brand mentions", "Generate weekly reports", "Onboard new team members"],
];

export function UseCasesSection() {
  return (
    <section className="container py-20">
      <div className="text-center mb-12">
        <h2 className="text-3xl font-bold md:text-4xl">What can OpenClaw do for you?</h2>
        <p className="mt-2 text-muted-foreground">One assistant, thousands of use cases</p>
      </div>
      <div className="space-y-4 overflow-hidden">
        {useCaseRows.map((row, rowIndex) => (
          <div key={rowIndex} className="overflow-hidden">
            <div
              className="animate-marquee flex gap-4 whitespace-nowrap"
              style={{
                animationDirection: rowIndex % 2 === 0 ? "normal" : "reverse",
                animationDuration: `${30 + rowIndex * 5}s`,
              }}
            >
              {[...row, ...row].map((uc, i) => (
                <span key={i} className="inline-flex items-center gap-2 rounded-full border px-4 py-2 text-sm">
                  <Check className="h-3 w-3 text-primary" />
                  {uc}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>
      <p className="mt-6 text-center text-sm text-muted-foreground">
        PS. You can add as many use cases as you want via natural language
      </p>
    </section>
  );
}
