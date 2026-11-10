import { Link } from "react-router-dom";
import { APP_NAME, PLAN_TIERS } from "@/constants/app";
import { formatCurrency } from "@/lib/calculations";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Check } from "lucide-react";

export default function PricingPage() {
  return (
    <div className="container py-20">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold">Simple, transparent pricing</h1>
        <p className="mt-4 text-lg text-muted-foreground">
          Choose the plan that fits your needs. Upgrade or downgrade anytime.
        </p>
      </div>
      <div className="mx-auto grid max-w-5xl gap-6 md:grid-cols-2 lg:grid-cols-4">
        {PLAN_TIERS.map((plan) => (
          <Card key={plan.id} className={plan.id === "pro" ? "border-primary shadow-lg" : ""}>
            <CardHeader>
              <CardTitle>{plan.name}</CardTitle>
              <div className="mt-2">
                {plan.price === -1 ? (
                  <span className="text-3xl font-bold">Custom</span>
                ) : plan.price === 0 ? (
                  <span className="text-3xl font-bold">Free</span>
                ) : (
                  <span>
                    <span className="text-3xl font-bold">{formatCurrency(plan.price)}</span>
                    <span className="text-muted-foreground">/mo</span>
                  </span>
                )}
              </div>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 mb-6">
                {plan.features.map((f) => (
                  <li key={f} className="flex items-center gap-2 text-sm">
                    <Check className="h-4 w-4 text-primary shrink-0" />
                    {f}
                  </li>
                ))}
              </ul>
              <Button className="w-full" variant={plan.id === "pro" ? "default" : "outline"} asChild>
                <Link to="/register">
                  {plan.price === -1 ? "Contact Sales" : "Get Started"}
                </Link>
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
