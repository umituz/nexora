import { Link } from "react-router-dom";
import { APP_NAME, APP_DESCRIPTION, APP_TAGLINE } from "@/constants/app";
import { Heart, Sparkles, Users, Mail, Shield, Mic, ArrowRight, Star, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";

const features = [
  { icon: Shield, tag: "FREE PROXIES", title: "Connect multiple accounts safely", desc: "We offer a Residential Proxy for every account that you connect to never put your account at risk." },
  { icon: Users, tag: "FIND LEADS", title: "Quickly find and enrich the perfect leads", desc: "Find or import leads from anywhere with our lead finder, Chrome extension and other integrations." },
  { icon: Sparkles, tag: "AI PERSONALIZATION", title: "Send automated personalized messages", desc: "Unlock the power of AI to craft and send personalized messages based on your prospect data and social activity." },
  { icon: Mic, tag: "VOICE NOTES", title: "Get more replies with voice notes", desc: "Add a warm human touch to your conversations by automating sending voice notes in your campaigns." },
  { icon: Mail, tag: "UNLIMITED SENDERS", title: "Unified inbox and account rotation", desc: "Effortlessly manage multiple accounts with a unified inbox and account rotation, enhancing efficiency." },
];

const testimonials = [
  { name: "James Donaldson", role: "GTM Expert", quote: "Nothing comes close to Prosp when it comes to AI and the range of actions. The level of personalization is unmatched.", stars: 5 },
  { name: "Ingrid Elbaz", role: "Lead Gen Agency", quote: "Managing multiple accounts on LinkedIn used to be a nightmare, but having a tool that brings everything together is absolutely incredible. 🙌", stars: 5 },
  { name: "Thierry Mercier", role: "Marketing Agency", quote: "We've tried them all—Heyreach, Waalaxy, Dripify—but nothing beats Prosp. The AI personalization delivered way more positive replies.", stars: 5 },
];

const pricing = [
  { label: "Monthly", price: 79, period: "/month" },
  { label: "Annual", price: 49, period: "/month", badge: "35% off" },
];

const pricingFeatures = [
  "Unlimited AI personalization",
  "Unlimited campaigns and contacts",
  "Unlimited access to all features",
  "Use your own proxies",
  "Free proxy for every account",
];

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-sidebar text-sidebar-foreground">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-sidebar-border bg-sidebar/95 backdrop-blur supports-[backdrop-filter]:bg-sidebar/80">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-6">
          <Link to="/" className="flex items-center gap-2">
            <Heart className="h-7 w-7 text-primary" />
            <span className="text-xl font-bold text-white">{APP_NAME}</span>
          </Link>
          <nav className="hidden items-center gap-8 md:flex">
            <a href="#demo" className="text-sm text-sidebar-foreground/70 hover:text-white transition-colors">Demo</a>
            <a href="#features" className="text-sm text-sidebar-foreground/70 hover:text-white transition-colors">Features</a>
            <a href="#testimonials" className="text-sm text-sidebar-foreground/70 hover:text-white transition-colors">Testimonials</a>
            <a href="#pricing" className="text-sm text-sidebar-foreground/70 hover:text-white transition-colors">Pricing</a>
          </nav>
          <div className="flex items-center gap-3">
            <Button variant="ghost" className="text-sidebar-foreground hover:text-white hover:bg-sidebar-accent" asChild>
              <Link to="/dashboard">Try for free</Link>
            </Button>
            <Button className="bg-primary hover:bg-primary/90" asChild>
              <Link to="/dashboard">Book a demo</Link>
            </Button>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="relative overflow-hidden py-24 md:py-36">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,hsl(var(--primary)/0.12),transparent_70%)]" />
        <div className="relative mx-auto max-w-4xl px-6 text-center">
          <h1 className="text-4xl font-bold tracking-tight text-white sm:text-5xl md:text-6xl lg:text-7xl">
            LinkedIn Outbound
            <br />
            <span className="text-primary">With AI Personalization</span>
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg text-sidebar-foreground/70">
            {APP_TAGLINE} Built for agencies and sales teams.
          </p>
          <div className="mt-10 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
            <Button size="lg" className="h-12 px-8 text-base bg-primary hover:bg-primary/90" asChild>
              <Link to="/dashboard">
                Try for free <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
            <Button size="lg" variant="outline" className="h-12 px-8 text-base border-sidebar-border text-white hover:bg-sidebar-accent" asChild>
              <Link to="/dashboard">Book a demo</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Demo Tabs */}
      <section id="demo" className="py-20">
        <div className="mx-auto max-w-6xl px-6">
          <div className="flex justify-center gap-2 mb-12">
            {[
              { icon: Sparkles, label: "Sequences" },
              { icon: Users, label: "Find leads" },
              { icon: Mail, label: "Unified Inbox" },
            ].map((tab) => (
              <Link
                key={tab.label}
                to="/dashboard"
                className="flex items-center gap-2 rounded-full border border-sidebar-border px-5 py-2.5 text-sm font-medium text-sidebar-foreground/80 hover:bg-sidebar-accent hover:text-white transition-all"
              >
                <tab.icon className="h-4 w-4" />
                {tab.label}
              </Link>
            ))}
          </div>
          <div className="rounded-2xl border border-sidebar-border bg-sidebar-accent/30 p-2 md:p-4">
            <div className="rounded-xl bg-card/5 border border-sidebar-border p-8 md:p-12 text-center">
              <p className="text-sidebar-foreground/50 text-sm">Interactive demo preview</p>
              <p className="text-white font-semibold mt-2 text-lg">Build multi-step AI sequences, find leads, manage conversations</p>
              <Button className="mt-6 bg-primary hover:bg-primary/90" asChild>
                <Link to="/campaigns">
                  Open Sequence Builder <ChevronRight className="ml-1 h-4 w-4" />
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="py-20">
        <div className="mx-auto max-w-6xl px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-white md:text-4xl">
              10x your replies,
              <br />
              <span className="text-primary">Automated and easy.</span>
            </h2>
            <p className="mt-4 text-sidebar-foreground/70 max-w-xl mx-auto">
              Leverage AI to build highly personalized outbound campaigns at scale in seconds, not days.
            </p>
          </div>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {features.map((f) => (
              <div
                key={f.tag}
                className="group rounded-2xl border border-sidebar-border bg-sidebar-accent/30 p-6 hover:border-primary/30 hover:bg-sidebar-accent/50 transition-all"
              >
                <div className="flex items-center gap-2 mb-3">
                  <f.icon className="h-5 w-5 text-primary" />
                  <span className="text-[10px] font-bold uppercase tracking-wider text-primary">{f.tag}</span>
                </div>
                <h3 className="text-lg font-semibold text-white mb-2">{f.title}</h3>
                <p className="text-sm text-sidebar-foreground/60 leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section id="testimonials" className="py-20">
        <div className="mx-auto max-w-6xl px-6">
          <div className="grid gap-6 md:grid-cols-3">
            {testimonials.map((t) => (
              <div key={t.name} className="rounded-2xl border border-sidebar-border bg-sidebar-accent/30 p-6">
                <div className="flex gap-0.5 mb-4">
                  {Array.from({ length: t.stars }).map((_, i) => (
                    <Star key={i} className="h-4 w-4 fill-warning text-warning" />
                  ))}
                </div>
                <p className="text-sm text-sidebar-foreground/80 leading-relaxed mb-6">"{t.quote}"</p>
                <div>
                  <p className="text-sm font-semibold text-white">{t.name}</p>
                  <p className="text-xs text-sidebar-foreground/50">{t.role}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="py-20">
        <div className="mx-auto max-w-2xl px-6 text-center">
          <h2 className="text-3xl font-bold text-white md:text-4xl mb-4">Get more, pay less</h2>
          <p className="text-sidebar-foreground/70 mb-12">
            Leverage AI to build highly personalized outbound campaigns at scale in seconds, not days.
          </p>
          <div className="grid gap-6 sm:grid-cols-2">
            {pricing.map((p) => (
              <div
                key={p.label}
                className="rounded-2xl border border-sidebar-border bg-sidebar-accent/30 p-6 text-left relative"
              >
                {p.badge && (
                  <span className="absolute -top-3 right-4 rounded-full bg-primary px-3 py-0.5 text-xs font-bold text-primary-foreground">
                    {p.badge}
                  </span>
                )}
                <p className="text-sm font-medium text-sidebar-foreground/60 mb-1">{p.label} Plan</p>
                <p className="text-3xl font-bold text-white">${p.price}<span className="text-base font-normal text-sidebar-foreground/50">{p.period}</span></p>
                <p className="text-xs text-sidebar-foreground/50 mt-1">per LinkedIn account</p>
                <ul className="mt-6 space-y-2.5">
                  {pricingFeatures.map((f) => (
                    <li key={f} className="flex items-center gap-2 text-sm text-sidebar-foreground/70">
                      <div className="h-1.5 w-1.5 rounded-full bg-primary shrink-0" />
                      {f}
                    </li>
                  ))}
                </ul>
                <Button className="w-full mt-6 bg-primary hover:bg-primary/90" asChild>
                  <Link to="/dashboard">Get started for free</Link>
                </Button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-sidebar-border py-12">
        <div className="mx-auto max-w-6xl px-6">
          <div className="flex flex-col items-center gap-4 md:flex-row md:justify-between">
            <div className="flex items-center gap-2">
              <Heart className="h-5 w-5 text-primary" />
              <span className="font-bold text-white">{APP_NAME}</span>
            </div>
            <nav className="flex gap-6">
              <a href="#demo" className="text-sm text-sidebar-foreground/50 hover:text-white transition-colors">Demo</a>
              <a href="#features" className="text-sm text-sidebar-foreground/50 hover:text-white transition-colors">Features</a>
              <a href="#testimonials" className="text-sm text-sidebar-foreground/50 hover:text-white transition-colors">Testimonials</a>
              <a href="#pricing" className="text-sm text-sidebar-foreground/50 hover:text-white transition-colors">Pricing</a>
            </nav>
          </div>
        </div>
      </footer>
    </div>
  );
}