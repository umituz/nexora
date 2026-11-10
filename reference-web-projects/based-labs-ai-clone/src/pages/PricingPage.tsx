import { Link } from "react-router-dom";
import { Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PRICING_PLANS, CREDIT_COSTS, APP_NAME } from "@/constants/app";
import { MOCK_FAQ } from "@/data/mock-data";
import { useState } from "react";

export default function PricingPage() {
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6">
      <div className="text-center">
        <p className="text-sm text-primary font-medium">Pay your way</p>
        <h1 className="mt-2 font-display text-4xl font-bold">Simple Pricing</h1>
        <p className="mt-3 text-muted-foreground">Buy credits with card or crypto. Use them whenever you want.</p>
        <p className="text-sm text-muted-foreground">No subscriptions. No recurring charges.</p>
      </div>

      <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {PRICING_PLANS.map((plan) => (
          <div key={plan.id} className={`relative rounded-xl border bg-card p-6 ${plan.badge ? "border-primary" : "border-border"}`}>
            {plan.badge && (
              <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                <span className="rounded-full bg-gradient-primary px-3 py-1 text-xs font-semibold text-primary-foreground">{plan.badge}</span>
              </div>
            )}
            <h3 className="font-display text-lg font-semibold">{plan.name}</h3>
            <p className="mt-1 text-sm text-muted-foreground">{plan.description}</p>
            <div className="mt-4">
              <span className="font-display text-3xl font-bold">${plan.price}</span>
            </div>
            <ul className="mt-4 space-y-2 text-sm text-muted-foreground">
              <li>{plan.credits.toLocaleString()} credits</li>
              <li>{plan.images} images</li>
              <li>{plan.videos} videos</li>
              {plan.bonus && <li className="text-primary font-medium">{plan.bonus}</li>}
            </ul>
            <Button className={`mt-6 w-full ${plan.badge ? "bg-gradient-primary text-primary-foreground" : "bg-muted text-foreground hover:bg-muted/80"}`}>
              Buy Credits
            </Button>
          </div>
        ))}
      </div>

      <div className="mt-12 flex flex-wrap items-center justify-center gap-4 text-sm text-muted-foreground">
        <span>✓ All AI models included</span>
        <span>✓ Instant delivery</span>
        <span>✓ Commercial use included</span>
        <span>✓ No subscriptions</span>
      </div>

      {/* Credit Costs */}
      <section className="mt-20">
        <h2 className="font-display text-2xl font-bold text-center">What Do Credits Buy?</h2>
        <p className="mt-2 text-center text-muted-foreground">Different AI models have different credit costs based on their complexity.</p>
        <div className="mt-10 grid gap-8 md:grid-cols-3">
          <div>
            <h3 className="font-display font-semibold mb-4">Image Generation</h3>
            <div className="space-y-3">
              {Object.entries(CREDIT_COSTS.image).map(([key, cost]) => (
                <div key={key} className="flex items-center justify-between rounded-lg border border-border bg-card p-3">
                  <span className="text-sm text-foreground">{key.replace(/_/g, " ").replace(/\b\w/g, c => c.toUpperCase())}</span>
                  <span className="font-mono text-sm font-bold text-primary">{cost}</span>
                </div>
              ))}
            </div>
          </div>
          <div>
            <h3 className="font-display font-semibold mb-4">Video Generation</h3>
            <div className="space-y-3">
              {Object.entries(CREDIT_COSTS.video).map(([key, cost]) => (
                <div key={key} className="flex items-center justify-between rounded-lg border border-border bg-card p-3">
                  <span className="text-sm text-foreground">{key.replace(/_/g, " ").replace(/\b\w/g, c => c.toUpperCase())}</span>
                  <span className="font-mono text-sm font-bold text-primary">{cost}/sec</span>
                </div>
              ))}
            </div>
          </div>
          <div>
            <h3 className="font-display font-semibold mb-4">Tools & Audio</h3>
            <div className="space-y-3">
              {Object.entries(CREDIT_COSTS.tools).map(([key, cost]) => (
                <div key={key} className="flex items-center justify-between rounded-lg border border-border bg-card p-3">
                  <span className="text-sm text-foreground">{key.replace(/_/g, " ").replace(/\b\w/g, c => c.toUpperCase())}</span>
                  <span className="font-mono text-sm font-bold text-primary">{cost}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="mt-20 mx-auto max-w-2xl">
        <h2 className="font-display text-2xl font-bold text-center mb-8">FAQs</h2>
        <div className="space-y-2">
          {MOCK_FAQ.map((faq, i) => (
            <div key={i} className="rounded-lg border border-border bg-card">
              <button onClick={() => setOpenFaq(openFaq === i ? null : i)} className="flex w-full items-center justify-between p-4 text-left text-sm font-medium text-foreground">
                {faq.question}
                <span className="text-muted-foreground">{openFaq === i ? "−" : "+"}</span>
              </button>
              {openFaq === i && (
                <div className="border-t border-border px-4 py-3 text-sm text-muted-foreground">{faq.answer}</div>
              )}
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
