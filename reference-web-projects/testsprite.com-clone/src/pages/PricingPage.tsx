import { Link } from "react-router-dom";
import { Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PRICING_PLANS, NAV_LINKS } from "@/constants/app";

export default function PricingPage() {
  return (
    <div className="section-padding">
      <div className="container-wide">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-heading font-bold mb-4">Simple, Transparent Pricing</h1>
          <p className="text-muted-foreground max-w-xl mx-auto">Choose the plan that fits your needs. Start free, scale as you grow.</p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          {PRICING_PLANS.map((plan) => (
            <div
              key={plan.id}
              className={`rounded-xl border p-6 flex flex-col ${
                plan.highlighted
                  ? "border-primary shadow-lg shadow-primary/10 relative"
                  : "border-border"
              }`}
            >
              {plan.badge && (
                <span className="status-badge bg-primary/10 text-primary mb-3 self-start text-xs">
                  {plan.badge}
                </span>
              )}
              <h3 className="font-heading font-bold text-xl mb-1">{plan.name}</h3>
              <div className="flex items-baseline gap-1 mb-1">
                <span className="text-3xl font-heading font-bold">{plan.price}</span>
                {plan.period && <span className="text-sm text-muted-foreground">{plan.period}</span>}
              </div>
              <p className="text-sm text-muted-foreground mb-4">{plan.credits}</p>
              <ul className="space-y-2 flex-1 mb-6">
                {plan.features.map((f) => (
                  <li key={f} className="flex items-start gap-2 text-sm">
                    <Check size={16} className="text-primary mt-0.5 shrink-0" />
                    <span>{f}</span>
                  </li>
                ))}
              </ul>
              <Link to={plan.id === "enterprise" ? NAV_LINKS.contact : NAV_LINKS.signUp}>
                <Button
                  className={`w-full ${plan.highlighted ? "gradient-primary text-primary-foreground" : ""}`}
                  variant={plan.highlighted ? "default" : "outline"}
                >
                  {plan.cta}
                </Button>
              </Link>
            </div>
          ))}
        </div>

        {/* Comparison Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left py-3 font-heading font-semibold">Feature</th>
                {PRICING_PLANS.map((p) => (
                  <th key={p.id} className="text-center py-3 font-heading font-semibold">{p.name}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {[
                { label: "Monthly Quota", values: PRICING_PLANS.map((p) => p.credits) },
                { label: "Test Lists", values: PRICING_PLANS.map((p) => p.testLists) },
                { label: "Schedules", values: PRICING_PLANS.map((p) => p.schedules) },
                { label: "AI Model", values: PRICING_PLANS.map((p) => p.aiModel) },
              ].map((row) => (
                <tr key={row.label} className="border-b border-border">
                  <td className="py-3 text-muted-foreground">{row.label}</td>
                  {row.values.map((v, i) => (
                    <td key={i} className="py-3 text-center">{v}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
