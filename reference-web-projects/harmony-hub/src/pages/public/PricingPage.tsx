import { Link } from "react-router-dom";
import { PRICING_PLANS } from "@/constants/app";
import { Check } from "lucide-react";
import { cn } from "@/lib/utils";

export default function PricingPage() {
  return (
    <div className="py-20">
      <div className="container mx-auto px-4">
        <p className="text-center text-sm font-medium uppercase tracking-wider text-primary">Pricing</p>
        <h1 className="mt-2 text-center font-heading text-3xl font-bold md:text-5xl">
          Start Free. Keep 100% of What You Charge.
        </h1>
        <p className="mx-auto mt-4 max-w-xl text-center text-muted-foreground">
          Use it for your own business or resell it to clients. Most agencies see ROI with their first two clients.
        </p>
        <div className="mt-16 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {PRICING_PLANS.map((plan) => (
            <div
              key={plan.id}
              className={cn(
                "relative flex flex-col rounded-xl border p-6 transition-all hover:shadow-glow",
                "popular" in plan && plan.popular
                  ? "border-primary bg-accent"
                  : "border-border bg-card"
              )}
            >
              {"popular" in plan && plan.popular && (
                <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-gradient-primary px-3 py-1 text-xs font-medium text-primary-foreground">
                  Most Popular
                </span>
              )}
              <h3 className="font-heading text-lg font-semibold">{plan.name}</h3>
              <p className="mt-1 text-sm text-muted-foreground">{plan.subtitle}</p>
              <div className="mt-4">
                <span className="font-heading text-4xl font-bold">{plan.currency}{plan.price}</span>
                <span className="text-muted-foreground">/{plan.period}</span>
              </div>
              <p className="mt-1 text-xs text-muted-foreground italic">Enough for {plan.chats}</p>
              <ul className="mt-6 flex-1 space-y-2">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-start gap-2 text-sm">
                    <Check className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
              <Link
                to="/register"
                className={cn(
                  "mt-6 block rounded-lg py-2.5 text-center text-sm font-medium transition-opacity hover:opacity-90",
                  "popular" in plan && plan.popular
                    ? "bg-gradient-primary text-primary-foreground"
                    : "border border-border bg-secondary text-foreground hover:bg-secondary/80"
                )}
              >
                Start Free Trial
              </Link>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
