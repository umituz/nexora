import { APP_NAME } from "@/constants/app";
import { X } from "lucide-react";

const traditionalSteps = [
  { task: "Purchasing a VM", time: "15 min" },
  { task: "Creating SSH keys", time: "10 min" },
  { task: "Installing dependencies", time: "10 min" },
  { task: "Configuring environment", time: "10 min" },
  { task: "Setting up the bot", time: "10 min" },
  { task: "Debugging webhooks", time: "5 min" },
];

export function ComparisonSection() {
  return (
    <section className="container py-20">
      <div className="text-center mb-12">
        <span className="inline-block rounded-full border px-3 py-1 text-xs font-medium mb-4">Comparison</span>
        <h2 className="text-3xl font-bold md:text-4xl">Traditional Method vs {APP_NAME}</h2>
      </div>
      <div className="mx-auto grid max-w-4xl gap-8 md:grid-cols-2">
        <div className="rounded-lg border p-6">
          <h3 className="text-xl font-semibold mb-4">Traditional</h3>
          <div className="space-y-3">
            {traditionalSteps.map((step) => (
              <div key={step.task} className="flex items-center justify-between text-sm">
                <span className="flex items-center gap-2">
                  <X className="h-4 w-4 text-destructive" />
                  {step.task}
                </span>
                <span className="text-muted-foreground">{step.time}</span>
              </div>
            ))}
            <div className="border-t pt-3 flex items-center justify-between font-semibold">
              <span>Total</span>
              <span>60 min</span>
            </div>
            <p className="text-xs text-muted-foreground">
              If you're non-technical, multiply these times by 10.
            </p>
          </div>
        </div>
        <div className="rounded-lg border border-primary/20 bg-primary/5 p-6">
          <h3 className="text-xl font-semibold mb-4">{APP_NAME}</h3>
          <div className="flex flex-col items-center justify-center py-8">
            <span className="text-6xl font-bold text-primary">&lt;1</span>
            <span className="mt-2 text-lg text-muted-foreground">minute to deploy</span>
          </div>
          <p className="text-sm text-muted-foreground text-center">
            Choose your model, pick a channel, and deploy. We handle infrastructure, keys, and webhooks automatically.
          </p>
        </div>
      </div>
    </section>
  );
}
