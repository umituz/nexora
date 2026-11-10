import { PageHeader } from "@/components/shared/PageHeader";
import { Button } from "@/components/ui/button";
import { PRICING_PLANS, APP_NAME } from "@/constants/app";
import { Check } from "lucide-react";
import { cn } from "@/lib/utils";

export default function BillingPage() {
  return (
    <div>
      <PageHeader title="Billing" description="Manage your subscription and billing" />
      <div className="rounded-lg border border-border bg-card p-6 mb-6">
        <h3 className="font-semibold mb-2">Current Plan: <span className="text-primary">Team</span></h3>
        <p className="text-sm text-muted-foreground mb-4">$29/month · Next billing: April 1, 2026</p>
        <div className="grid grid-cols-3 gap-4 text-sm mb-4">
          <div><span className="text-muted-foreground block">Requests used</span><span className="font-semibold">456,789 / 1,000,000</span></div>
          <div><span className="text-muted-foreground block">Apps</span><span className="font-semibold">3 / 5</span></div>
          <div><span className="text-muted-foreground block">Team members</span><span className="font-semibold">5 / 10</span></div>
        </div>
        <div className="h-2 rounded-full bg-muted overflow-hidden"><div className="h-full rounded-full bg-primary" style={{ width: "45%" }} /></div>
      </div>
      <h3 className="font-semibold mb-4">Available Plans</h3>
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
        {PRICING_PLANS.map((plan) => (
          <div key={plan.name} className={cn("rounded-lg border p-4", plan.name === "Team" ? "border-primary" : "border-border bg-card")}>
            <h4 className="font-semibold">{plan.name}</h4>
            <p className="text-lg font-bold mt-1">{plan.price === -1 ? "Custom" : plan.price === 0 ? "Free" : `$${plan.price}/mo`}</p>
            <ul className="space-y-1 mt-3 mb-4">{plan.features.slice(0, 4).map((f) => <li key={f} className="text-xs text-muted-foreground flex gap-1"><Check className="h-3 w-3 text-primary shrink-0 mt-0.5" />{f}</li>)}</ul>
            <Button size="sm" variant={plan.name === "Team" ? "outline" : "default"} className="w-full" disabled={plan.name === "Team"}>{plan.name === "Team" ? "Current" : "Upgrade"}</Button>
          </div>
        ))}
      </div>
    </div>
  );
}
