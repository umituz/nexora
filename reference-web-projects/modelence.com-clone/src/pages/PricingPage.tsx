import { Link } from "react-router-dom";
import { APP_NAME, PRICING_PLANS, CLOUD_PRICING, NAV_LINKS } from "@/lib/constants";
import { Button } from "@/components/ui/button";
import { Check } from "lucide-react";
import { cn } from "@/lib/utils";

export default function PricingPage() {
  return (
    <div>
      <section className="py-20">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-foreground">Free to start</h1>
          <p className="mt-4 text-lg text-muted-foreground">Pay when you deploy to production, based on usage</p>
        </div>
      </section>

      <section className="pb-20">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {PRICING_PLANS.map((plan) => (
              <div key={plan.name} className={cn("bg-card border rounded-xl p-8 flex flex-col", plan.highlighted ? "border-primary shadow-lg" : "border-border")}>
                <h3 className="text-xl font-bold text-foreground">{plan.name}</h3>
                <p className="text-sm text-muted-foreground mt-1">{plan.description}</p>
                <div className="mt-6 mb-6">
                  {"pricePrefix" in plan && <span className="text-sm text-muted-foreground mr-1">{plan.pricePrefix}</span>}
                  <span className="text-4xl font-bold text-foreground">{plan.price}</span>
                  {plan.period && <span className="text-muted-foreground">{plan.period}</span>}
                </div>
                <ul className="space-y-3 mb-8 flex-1">
                  {plan.features.map((f) => (
                    <li key={f} className="flex items-start gap-2 text-sm text-muted-foreground">
                      <Check className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                      {f}
                    </li>
                  ))}
                </ul>
                <Button variant={plan.highlighted ? "default" : "outline"} asChild className="w-full">
                  <Link to={plan.cta === "Contact Us" ? "/contact" : NAV_LINKS.signup}>{plan.cta}</Link>
                </Button>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 bg-secondary/30">
        <div className="container mx-auto px-4 max-w-4xl">
          <h2 className="text-3xl font-bold text-foreground text-center mb-10">Cloud Environment Pricing</h2>
          <p className="text-center text-muted-foreground mb-8">Pay only for what you use, based on the number and tier of your app containers</p>
          <div className="border border-border rounded-lg overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-secondary/50">
                    <th className="text-left px-4 py-3 font-medium text-muted-foreground">Size</th>
                    <th className="text-left px-4 py-3 font-medium text-muted-foreground">vCPU</th>
                    <th className="text-left px-4 py-3 font-medium text-muted-foreground">Memory</th>
                    <th className="text-left px-4 py-3 font-medium text-muted-foreground">Price</th>
                    <th className="text-left px-4 py-3 font-medium text-muted-foreground">Monthly estimate</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {CLOUD_PRICING.map((row) => (
                    <tr key={row.size} className="hover:bg-secondary/30 transition-colors">
                      <td className="px-4 py-3 font-medium text-foreground">{row.size}</td>
                      <td className="px-4 py-3 text-muted-foreground">{row.vcpu}</td>
                      <td className="px-4 py-3 text-muted-foreground">{row.memory}</td>
                      <td className="px-4 py-3 text-muted-foreground">{row.price}</td>
                      <td className="px-4 py-3 text-muted-foreground">{row.monthly}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
