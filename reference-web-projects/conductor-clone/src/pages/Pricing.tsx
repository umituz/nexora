import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { PRICING_PLANS } from "@/lib/constants";
import { ArrowRight, Check } from "lucide-react";

export default function PricingPage() {
  return (
    <div className="hero-section stars-bg min-h-screen py-24">
      <div className="container max-w-5xl">
        <h1 className="text-center text-4xl font-bold text-white">Pricing</h1>
        <p className="mt-4 text-center text-white/50">Simple, transparent pricing. No hidden fees.</p>
        <div className="mt-16 grid gap-8 md:grid-cols-3">
          {PRICING_PLANS.map((plan) => (
            <div key={plan.name} className={`rounded-xl border p-8 ${plan.highlighted ? "border-mint/30 bg-mint/5" : "border-white/5 bg-white/[0.02]"}`}>
              <h3 className="text-lg font-semibold text-white">{plan.name}</h3>
              <div className="mt-4"><span className="text-3xl font-bold text-white">{plan.price}</span>
                {plan.period && <p className="mt-1 text-sm text-white/40">{plan.period}</p>}
              </div>
              <p className="mt-4 text-sm text-white/50">{plan.description}</p>
              <ul className="mt-6 space-y-3">
                {plan.features.map((f) => (<li key={f} className="flex items-start gap-2 text-sm text-white/60"><Check className="mt-0.5 h-4 w-4 shrink-0 text-mint" />{f}</li>))}
              </ul>
              <Button className={`mt-8 w-full ${plan.highlighted ? "gradient-mint shadow-mint" : "bg-white/10 text-white hover:bg-white/20"}`} asChild>
                <Link to="/sign-up">{plan.cta} <ArrowRight className="ml-2 h-4 w-4" /></Link>
              </Button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
