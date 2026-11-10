import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { APP_TAGLINE, APP_DESCRIPTION, FEATURES, PRICING_PLANS, TESTIMONIALS, PARTNER_LOGOS } from "@/lib/constants";
import { ArrowRight, Check, Code, Shield, Zap, Database, Users, BarChart } from "lucide-react";

const featureIcons = [Zap, Shield, Database, Code, BarChart, Users];

export default function HomePage() {
  return (
    <div>
      {/* Hero Section */}
      <section className="hero-section stars-bg relative overflow-hidden">
        <div className="container relative z-10 py-24 text-center md:py-32 lg:py-40">
          <h1 className="mx-auto max-w-4xl text-4xl font-bold leading-tight tracking-tight md:text-5xl lg:text-6xl">
            <span className="text-white">The best QuickBooks Desktop/Enterprise API </span>
            <span className="text-mint">on the planet</span>
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg text-white/60">
            {APP_DESCRIPTION}
          </p>
          <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
            <Button size="lg" className="gradient-mint shadow-mint text-base font-semibold" asChild>
              <Link to="/sign-up">Get started <ArrowRight className="ml-2 h-4 w-4" /></Link>
            </Button>
            <Button size="lg" variant="outline" className="border-white/20 bg-transparent text-white hover:bg-white/10" asChild>
              <Link to="/docs">Explore the docs <ArrowRight className="ml-2 h-4 w-4" /></Link>
            </Button>
          </div>
        </div>

        {/* Code Preview */}
        <div className="container relative z-10 pb-20">
          <div className="mx-auto max-w-3xl rounded-xl border border-white/10 bg-black/40 p-6 backdrop-blur-sm">
            <div className="mb-4 flex items-center gap-2">
              <div className="h-3 w-3 rounded-full bg-red-500/60" />
              <div className="h-3 w-3 rounded-full bg-amber-500/60" />
              <div className="h-3 w-3 rounded-full bg-emerald-500/60" />
            </div>
            <pre className="overflow-x-auto font-mono text-sm leading-relaxed">
              <code>
                <span className="text-blue-400">import</span> <span className="text-white">Conductor</span> <span className="text-blue-400">from</span> <span className="text-emerald-400">"conductor-node"</span>;{"\n\n"}
                <span className="text-blue-400">const</span> <span className="text-white">conductor</span> = <span className="text-blue-400">new</span> <span className="text-amber-300">Conductor</span>({"{"} <span className="text-white">apiKey:</span> <span className="text-emerald-400">"sk_test_..."</span> {"}"});{"\n\n"}
                <span className="text-white/40">{"// Create, fetch, or update any QuickBooks Desktop object."}</span>{"\n"}
                <span className="text-blue-400">const</span> <span className="text-white">invoice</span> = <span className="text-blue-400">await</span> <span className="text-white">conductor.qbd.invoices.</span><span className="text-amber-300">create</span>({"{"}{"\n"}
                {"  "}<span className="text-white">conductorEndUserId:</span> <span className="text-emerald-400">"end_usr_..."</span>,{"\n"}
                {"  "}<span className="text-white">customerId:</span> <span className="text-emerald-400">"abc_123..."</span>,{"\n"}
                {"  "}<span className="text-white">dueDate:</span> <span className="text-emerald-400">"2024-06-30"</span>,{"\n"}
                {"}"});
              </code>
            </pre>
          </div>
        </div>
      </section>

      {/* Logo Carousel */}
      <section className="hero-section border-y border-white/5 py-12">
        <p className="text-center text-xs font-semibold uppercase tracking-widest text-white/30">
          Syncing 1,000+ Businesses
        </p>
        <div className="mt-8 overflow-hidden">
          <div className="flex animate-scroll items-center gap-12 whitespace-nowrap">
            {[...PARTNER_LOGOS, ...PARTNER_LOGOS].map((logo, i) => (
              <span key={i} className="text-lg font-bold text-white/20">{logo}</span>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="hero-section stars-bg py-24">
        <div className="container">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-white md:text-4xl">
              Every object type, read or write, <span className="text-mint">fully typed</span>
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-white/50">
              In just a few lines, get real-time access to every API and object type for QuickBooks Desktop, all fully typed.
            </p>
          </div>
          <div className="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {FEATURES.map((feature, i) => {
              const Icon = featureIcons[i];
              return (
                <div
                  key={feature.title}
                  className="group rounded-xl border border-white/5 bg-white/[0.02] p-6 transition-colors hover:border-white/10 hover:bg-white/[0.04]"
                >
                  <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-lg bg-mint/10">
                    <Icon className="h-5 w-5 text-mint" />
                  </div>
                  <h3 className="text-lg font-semibold text-white">{feature.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-white/50">{feature.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Dashboard Preview */}
      <section className="hero-section py-24">
        <div className="container text-center">
          <h2 className="text-3xl font-bold text-white md:text-4xl">
            Beautiful <span className="text-mint">dashboard</span>
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-white/50">
            Create, manage, monitor, and debug your end-user connections from our lightning-fast dashboard.
          </p>
          <div className="mt-12">
            <Button size="lg" className="gradient-mint shadow-mint" asChild>
              <Link to="/dashboard">Try the Dashboard <ArrowRight className="ml-2 h-4 w-4" /></Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Error Handling */}
      <section className="hero-section stars-bg py-24">
        <div className="container">
          <div className="grid items-center gap-12 lg:grid-cols-2">
            <div>
              <h2 className="text-3xl font-bold text-white md:text-4xl">
                Masterful <span className="text-mint">error handling</span>
              </h2>
              <p className="mt-4 text-white/50">
                Conductor unifies QuickBooks's errors into a single, consistent error format and augments each with user-friendly messages.
              </p>
              <ul className="mt-6 space-y-3">
                {["Unified error format", "User-friendly resolution instructions", "Integration-specific error codes", "Help guide links included"].map((item) => (
                  <li key={item} className="flex items-center gap-3 text-sm text-white/60">
                    <Check className="h-4 w-4 text-mint" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
            <div className="rounded-xl border border-white/10 bg-black/40 p-6">
              <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-white/30">Example Error Response</p>
              <pre className="overflow-x-auto font-mono text-xs leading-relaxed text-white/70">
{`{
  "error": {
    "message": "QBD Connection Error",
    "userFacingMessage": "We could not
      connect to your QuickBooks Desktop.",
    "type": "INTEGRATION_CONNECTION_ERROR",
    "code": "QBD_CONNECTION_ERROR",
    "httpStatusCode": 502
  }
}`}
              </pre>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section className="hero-section py-24" id="pricing">
        <div className="container">
          <h2 className="text-center text-3xl font-bold text-white md:text-4xl">Pricing</h2>
          <div className="mt-16 grid gap-8 md:grid-cols-3">
            {PRICING_PLANS.map((plan) => (
              <div
                key={plan.name}
                className={`rounded-xl border p-8 ${
                  plan.highlighted
                    ? "border-mint/30 bg-mint/5"
                    : "border-white/5 bg-white/[0.02]"
                }`}
              >
                <h3 className="text-lg font-semibold text-white">{plan.name}</h3>
                <div className="mt-4">
                  <span className="text-3xl font-bold text-white">{plan.price}</span>
                  {plan.period && <p className="mt-1 text-sm text-white/40">{plan.period}</p>}
                </div>
                <p className="mt-4 text-sm text-white/50">{plan.description}</p>
                <ul className="mt-6 space-y-3">
                  {plan.features.map((f) => (
                    <li key={f} className="flex items-start gap-2 text-sm text-white/60">
                      <Check className="mt-0.5 h-4 w-4 shrink-0 text-mint" />
                      {f}
                    </li>
                  ))}
                </ul>
                <Button
                  className={`mt-8 w-full ${plan.highlighted ? "gradient-mint shadow-mint" : "bg-white/10 text-white hover:bg-white/20"}`}
                  asChild
                >
                  <Link to="/sign-up">{plan.cta} <ArrowRight className="ml-2 h-4 w-4" /></Link>
                </Button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="hero-section stars-bg py-24">
        <div className="container">
          <h2 className="text-center text-3xl font-bold text-white md:text-4xl">
            Wall of <span className="text-mint">love</span>
          </h2>
          <div className="mt-16 columns-1 gap-6 sm:columns-2 lg:columns-3">
            {TESTIMONIALS.map((t, i) => (
              <div key={i} className="mb-6 break-inside-avoid rounded-xl border border-white/5 bg-white/[0.02] p-6">
                <p className="text-sm italic leading-relaxed text-white/70">"{t.quote}"</p>
                <div className="mt-4">
                  <p className="text-sm font-medium text-white">{t.author}</p>
                  <p className="text-xs text-white/40">{t.role}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="hero-section py-24">
        <div className="container text-center">
          <h2 className="text-3xl font-bold text-white md:text-4xl">
            Ready to get started?
          </h2>
          <p className="mx-auto mt-4 max-w-lg text-white/50">
            {APP_TAGLINE}
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-4">
            <Button size="lg" className="gradient-mint shadow-mint" asChild>
              <Link to="/sign-up">Start for free <ArrowRight className="ml-2 h-4 w-4" /></Link>
            </Button>
            <Button size="lg" variant="outline" className="border-white/20 bg-transparent text-white hover:bg-white/10" asChild>
              <Link to="/docs">Read the docs <ArrowRight className="ml-2 h-4 w-4" /></Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
