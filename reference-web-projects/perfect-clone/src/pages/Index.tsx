import { ArrowRight, Zap, TrendingUp, ShieldCheck, BarChart3, CheckCircle } from "lucide-react";
import { Link } from "react-router-dom";
import { APP_NAME, APP_TAGLINE, APP_DESCRIPTION, PLAN_TIERS } from "@/constants/app";
import { Button } from "@/components/ui/button";
import { formatCurrency } from "@/utils/calculations";

const features = [
  { icon: Zap, title: "Smart Charge", desc: "Apply a pending charge at trial signup to ensure only qualified users access your free trial." },
  { icon: TrendingUp, title: "2-3x Conversions", desc: "Data-driven trial sign-up page AI optimization & 100% payment success rate." },
  { icon: ShieldCheck, title: "Block Disputers", desc: "Proactively block known serial disputers before checkout, saving revenue and frustration." },
  { icon: BarChart3, title: "100% Attribution", desc: "Custom events and offline conversion tracking for full visibility into your funnel." },
];

const stats = [
  { value: "57%", label: "Conversion Rate" },
  { value: "3.7x", label: "Revenue Growth" },
  { value: "5 min", label: "Setup Time" },
  { value: "$1/mo", label: "Starting Price" },
];

export default function Index() {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border/50 bg-card/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto flex items-center justify-between h-16 px-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg gradient-bg flex items-center justify-center">
              <span className="text-sm font-bold text-primary-foreground">1C</span>
            </div>
            <span className="font-bold text-lg">{APP_NAME}</span>
          </div>
          <nav className="hidden md:flex items-center gap-6 text-sm text-muted-foreground">
            <a href="#features" className="hover:text-foreground transition-colors">Features</a>
            <a href="#pricing" className="hover:text-foreground transition-colors">Pricing</a>
            <a href="#how-it-works" className="hover:text-foreground transition-colors">How It Works</a>
          </nav>
          <div className="flex items-center gap-3">
            <Link to="/dashboard">
              <Button variant="ghost" size="sm">Log in</Button>
            </Link>
            <Link to="/dashboard">
              <Button size="sm" className="gradient-bg">Get Started Free <ArrowRight className="h-3.5 w-3.5 ml-1" /></Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="py-20 md:py-32">
        <div className="container mx-auto px-4 text-center max-w-4xl">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-primary/30 bg-primary/5 text-xs font-medium text-primary mb-6">
            {APP_NAME} – A Stripe Partner Solution
          </div>
          <h1 className="text-4xl md:text-6xl font-bold tracking-tight leading-tight mb-6">
            {APP_TAGLINE}{" "}
            <span className="gradient-text">Without Making Product Changes.</span>
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-8">
            {APP_DESCRIPTION}
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link to="/dashboard">
              <Button size="lg" className="gradient-bg text-base px-8">
                Get Started Free <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            </Link>
            <Button variant="outline" size="lg" className="text-base px-8">
              Schedule Demo 📅
            </Button>
          </div>
        </div>
      </section>

      {/* Stats Bar */}
      <section className="border-y border-border/50 bg-card/30">
        <div className="container mx-auto px-4 py-8 grid grid-cols-2 md:grid-cols-4 gap-6">
          {stats.map((s) => (
            <div key={s.label} className="text-center">
              <p className="text-3xl md:text-4xl font-bold gradient-text">{s.value}</p>
              <p className="text-sm text-muted-foreground mt-1">{s.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="py-20">
        <div className="container mx-auto px-4 max-w-4xl">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">How It Works</h2>
          <div className="space-y-8">
            {[
              { step: "1", title: "0% failed first payments after trial", desc: "Applies a pending 'smart charge' to customer's card before free trial access." },
              { step: "2", title: "2-3x trial-to-paid conversions", desc: "Data-driven trial sign-up page AI optimization & 100% payment success rate." },
              { step: "3", title: "100% conversion attribution", desc: "Custom events and offline conversion tracking." },
              { step: "4", title: "Significant chargeback reduction", desc: "Known disputers alerts and blocking, before checkout." },
            ].map((item) => (
              <div key={item.step} className="flex items-start gap-5">
                <div className="w-10 h-10 rounded-full gradient-bg flex items-center justify-center shrink-0">
                  <span className="text-sm font-bold text-primary-foreground">{item.step}</span>
                </div>
                <div>
                  <h3 className="text-lg font-semibold">{item.title}</h3>
                  <p className="text-muted-foreground mt-1">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="py-20 bg-card/30 border-y border-border/50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-4">Everything You Need</h2>
          <p className="text-center text-muted-foreground mb-12 max-w-xl mx-auto">
            Smart payment capture and AI optimization to boost your trial conversion rate.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-5xl mx-auto">
            {features.map((f) => (
              <div key={f.title} className="bg-card border border-border rounded-xl p-6 hover:border-primary/30 transition-colors">
                <div className="p-2.5 rounded-lg bg-primary/10 text-primary inline-flex mb-4">
                  <f.icon className="h-5 w-5" />
                </div>
                <h3 className="font-semibold mb-2">{f.title}</h3>
                <p className="text-sm text-muted-foreground">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Smart Charge Explanation */}
      <section className="py-20">
        <div className="container mx-auto px-4 max-w-3xl text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Never lose a customer to a <span className="gradient-text">failed payment</span> again.
          </h2>
          <p className="text-muted-foreground mb-8 leading-relaxed">
            {APP_NAME} ensures only users that have sufficient funds can access your free trial by making a 'smart charge' at sign-up,
            to temporarily withhold their first subscription payment without chargeback risks.
          </p>
          <Link to="/dashboard">
            <Button size="lg" className="gradient-bg">
              Start Capturing More Trials <ArrowRight className="h-4 w-4 ml-2" />
            </Button>
          </Link>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="py-20 bg-card/30 border-y border-border/50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-4">Simple, Transparent Pricing</h2>
          <p className="text-center text-muted-foreground mb-12">Start free, upgrade as you grow.</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-5xl mx-auto">
            {PLAN_TIERS.map((plan) => (
              <div key={plan.id} className={`bg-card border rounded-xl p-6 ${plan.id === "growth" ? "border-primary ring-1 ring-primary/20" : "border-border"}`}>
                {plan.id === "growth" && (
                  <span className="text-xs font-semibold text-primary uppercase tracking-wider">Most Popular</span>
                )}
                <h3 className="font-semibold text-lg mt-1">{plan.name}</h3>
                <p className="text-3xl font-bold mt-2">{plan.price === 0 ? "Custom" : `${formatCurrency(plan.price)}/mo`}</p>
                <p className="text-xs text-muted-foreground mt-1">{plan.trialDays}-day free trial</p>
                <ul className="mt-5 space-y-2.5">
                  {plan.features.map((f) => (
                    <li key={f} className="flex items-start gap-2 text-sm">
                      <CheckCircle className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                      {f}
                    </li>
                  ))}
                </ul>
                <Link to="/dashboard">
                  <Button
                    variant={plan.id === "growth" ? "default" : "outline"}
                    className={`w-full mt-6 ${plan.id === "growth" ? "gradient-bg" : ""}`}
                    size="sm"
                  >
                    {plan.price === 0 ? "Contact Sales" : "Get Started"}
                  </Button>
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stripe Integration */}
      <section className="py-20">
        <div className="container mx-auto px-4 text-center max-w-2xl">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Integrate directly with <span className="gradient-text">Stripe</span>
          </h2>
          <p className="text-muted-foreground mb-8">
            Seamless setup in minutes. No complex integrations, no data migration. Works with your existing Stripe account and products.
          </p>
          <div className="flex items-center justify-center gap-6 text-sm text-muted-foreground">
            <span className="flex items-center gap-1.5"><ShieldCheck className="h-4 w-4 text-primary" /> Bank-level security</span>
            <span className="flex items-center gap-1.5"><Zap className="h-4 w-4 text-primary" /> 5-minute setup</span>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 border-t border-border/50">
        <div className="container mx-auto px-4 text-center max-w-2xl">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Fix This in 5 Minutes</h2>
          <p className="text-muted-foreground mb-8">Stop losing customers to failed payments. Start converting more trials today.</p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link to="/dashboard">
              <Button size="lg" className="gradient-bg text-base px-8">
                Get Started Free <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            </Link>
          </div>
          <div className="flex items-center justify-center gap-6 mt-6 text-sm text-muted-foreground">
            <span>5-minute setup</span>
            <span>From $1/mo</span>
            <span>3.7x revenue increase</span>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border/50 py-8">
        <div className="container mx-auto px-4 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded gradient-bg flex items-center justify-center">
              <span className="text-[10px] font-bold text-primary-foreground">1C</span>
            </div>
            <span className="text-sm text-muted-foreground">© {new Date().getFullYear()} {APP_NAME}. All rights reserved.</span>
          </div>
          <div className="flex items-center gap-6 text-sm text-muted-foreground">
            <a href="#" className="hover:text-foreground transition-colors">Privacy</a>
            <a href="#" className="hover:text-foreground transition-colors">Terms</a>
            <a href="#" className="hover:text-foreground transition-colors">Contact</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
