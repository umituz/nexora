import { useAuth } from "@/hooks/use-auth";
import { PRICING_PLANS } from "@/constants/app";
import { Check } from "lucide-react";
import { cn } from "@/lib/utils";

export default function SettingsBillingPage() {
  const { user } = useAuth();
  const currentPlan = PRICING_PLANS.find((p) => p.id === user?.plan) ?? PRICING_PLANS[3];
  return (
    <div className="space-y-6">
      <h1 className="font-heading text-2xl font-bold">Billing</h1>
      <div className="max-w-xl rounded-xl border border-border bg-card p-6">
        <h3 className="font-heading font-semibold">Current Plan: {currentPlan.name}</h3>
        <p className="mt-1 text-2xl font-bold font-heading">{currentPlan.currency}{currentPlan.price}<span className="text-sm font-normal text-muted-foreground">/{currentPlan.period}</span></p>
        <div className="mt-4"><p className="text-sm text-muted-foreground">Credits: {user?.creditsUsed}/{user?.creditsTotal}</p>
        <div className="mt-1 h-2 rounded-full bg-secondary"><div className="h-full rounded-full bg-gradient-primary" style={{ width: `${((user?.creditsUsed ?? 0) / (user?.creditsTotal ?? 1)) * 100}%` }} /></div></div>
      </div>
    </div>
  );
}
