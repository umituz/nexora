import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { PRICING_PLANS, APP_NAME } from "@/constants/app";
import { Check } from "lucide-react";
import { cn } from "@/lib/utils";

export default function PricingPage() {
  return (
    <div className="py-20">
      <div className="container">
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Simple, transparent pricing</h1>
          <p className="text-lg text-muted-foreground max-w-xl mx-auto">
            Start for free. Scale as you grow. No hidden fees.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
          {PRICING_PLANS.map((plan, i) => (
            <motion.div
              key={plan.name}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className={cn(
                "rounded-xl border p-6 flex flex-col",
                plan.popular ? "border-primary bg-primary/5 ring-2 ring-primary" : "border-border bg-card"
              )}
            >
              {plan.popular && (
                <span className="text-xs font-semibold text-primary uppercase tracking-wider mb-2">Most Popular</span>
              )}
              <h3 className="text-xl font-bold">{plan.name}</h3>
              <div className="mt-4 mb-6">
                {plan.price === -1 ? (
                  <span className="text-3xl font-bold">Custom</span>
                ) : plan.price === 0 ? (
                  <span className="text-3xl font-bold">Free</span>
                ) : (
                  <div>
                    <span className="text-3xl font-bold">${plan.price}</span>
                    <span className="text-muted-foreground">/{plan.period}</span>
                  </div>
                )}
              </div>
              <ul className="space-y-3 mb-8 flex-1">
                {plan.features.map((f) => (
                  <li key={f} className="flex items-start gap-2 text-sm">
                    <Check className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                    <span className="text-muted-foreground">{f}</span>
                  </li>
                ))}
              </ul>
              <Button variant={plan.popular ? "default" : "outline"} asChild className="w-full">
                <Link to="/signup">{plan.cta}</Link>
              </Button>
            </motion.div>
          ))}
        </div>

        <div className="mt-20 text-center">
          <h2 className="text-2xl font-bold mb-4">Frequently asked questions</h2>
          <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto text-left mt-8">
            {[
              { q: "Can I change plans later?", a: "Yes, you can upgrade or downgrade your plan at any time." },
              { q: "What happens after my trial ends?", a: "You'll be moved to the free plan. No charges unless you upgrade." },
              { q: "Do you offer discounts for startups?", a: `Yes! Contact us for special ${APP_NAME} startup pricing.` },
              { q: "Is there a data retention limit?", a: "Data retention varies by plan, from 7 days to unlimited." },
            ].map((faq) => (
              <div key={faq.q} className="rounded-lg border border-border bg-card p-5">
                <h3 className="font-semibold mb-2">{faq.q}</h3>
                <p className="text-sm text-muted-foreground">{faq.a}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
