import { PageHeader } from "@/components/dashboard/PageHeader";
import { PLAN_TIERS, APP_NAME } from "@/constants/app";
import { formatCurrency } from "@/utils/calculations";
import { Check } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function Billing() {
  return (
    <div className="space-y-6 animate-fade-in">
      <PageHeader title="Billing" description="Manage your subscription and billing" />
      <div className="bg-card border border-primary/30 rounded-xl p-6 max-w-md">
        <p className="text-xs text-primary font-medium uppercase tracking-wider mb-1">Current Plan</p>
        <h3 className="text-2xl font-bold">Growth</h3>
        <p className="text-muted-foreground">{formatCurrency(49)}/month</p>
        <Button variant="outline" size="sm" className="mt-3">Manage Subscription</Button>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {PLAN_TIERS.map((plan) => (
          <div key={plan.id} className={`bg-card border rounded-xl p-5 ${plan.id === "growth" ? "border-primary" : "border-border"}`}>
            <h3 className="font-semibold text-lg">{plan.name}</h3>
            <p className="text-2xl font-bold mt-1">{plan.price === 0 ? "Custom" : `${formatCurrency(plan.price)}/mo`}</p>
            <ul className="mt-4 space-y-2">
              {plan.features.map((f) => (
                <li key={f} className="flex items-center gap-2 text-sm">
                  <Check className="h-3.5 w-3.5 text-primary shrink-0" />
                  {f}
                </li>
              ))}
            </ul>
            <Button variant={plan.id === "growth" ? "default" : "outline"} size="sm" className={`mt-4 w-full ${plan.id === "growth" ? "gradient-bg" : ""}`}>
              {plan.id === "growth" ? "Current Plan" : "Upgrade"}
            </Button>
          </div>
        ))}
      </div>
    </div>
  );
}
