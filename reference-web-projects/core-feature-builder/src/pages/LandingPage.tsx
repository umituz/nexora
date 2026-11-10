import { Link } from "react-router-dom";
import { Zap, ArrowRight, Sparkles, TrendingUp, Video, Calendar, BarChart3, Users, Play, Star, ChevronRight, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import heroMockup from "@/assets/hero-mockup.jpg";
import blitzPreview from "@/assets/blitz-preview.jpg";
import calendarPreview from "@/assets/calendar-preview.jpg";

const features = [
  {
    icon: Sparkles,
    title: "Generate Trending Content",
    desc: "Create slideshows, wall of text, hook & demo, and green screen videos automatically.",
  },
  {
    icon: TrendingUp,
    title: "500+ Trending Videos",
    desc: "Remix proven viral videos directly with your business context.",
  },
  {
    icon: Users,
    title: "Hyper-Realistic AI UGC",
    desc: "500+ lifelike AI avatars that deliver your message like a real creator.",
  },
  {
    icon: Video,
    title: "Multi-Platform Posting",
    desc: "Publish directly to TikTok, Instagram Reels and YouTube Shorts.",
  },
  {
    icon: Calendar,
    title: "Content Calendar",
    desc: "Schedule and manage your entire content pipeline from one place.",
  },
  {
    icon: BarChart3,
    title: "Track Performance",
    desc: "Monitor views, engagement and growth across every channel.",
  },
];

const steps = [
  {
    num: "01",
    title: "Enter your website",
    desc: "We instantly learn your product, audience, and tone.",
    image: heroMockup,
  },
  {
    num: "02",
    title: "Blitz Mode",
    desc: "Swipe through content Fastlane has created for your brand.",
    image: blitzPreview,
  },
  {
    num: "03",
    title: "Fill up your calendar",
    desc: "Schedule content across TikTok, Reels, and Shorts in one click.",
    image: calendarPreview,
  },
];

const testimonials = [
  {
    name: "Dom",
    handle: "@dngi",
    role: "Founder, Brandalyze",
    text: "After I started using the platform I got my best month analytics-wise with a 3,800% increase in page viewership.",
    avatar: "D",
  },
  {
    name: "Nimisha",
    handle: "@NimishaChanda",
    role: "CMO, Smallest AI",
    text: "I just found this website and it's so crazy! I tried gatekeeping it but cannot. If you're working in AI UGC, check this out.",
    avatar: "N",
  },
  {
    name: "Jon",
    handle: "@joncphillips",
    role: "Founder, 8x SaaS",
    text: "The distribution machine we've been asking for. Been using Fastlane for a few weeks now and it's awesome!",
    avatar: "J",
  },
  {
    name: "Tim",
    handle: "@timjayas",
    role: "Founder, Redleads",
    text: "Guys have no idea how to code but make $300 instantly after launching SaaS. Here's the tools they use: Fastlane AI to organic market.",
    avatar: "T",
  },
];

const stats = [
  { value: "50,000+", label: "organic views in a month" },
  { value: "1,000+", label: "businesses in the fast lane" },
  { value: "500+", label: "AI UGC avatars" },
];

const pricingPlans = [
  {
    name: "Starter",
    price: "$0",
    period: "/mo",
    desc: "Get started for free",
    features: ["5 videos per month", "3 AI avatars", "TikTok publishing", "Basic analytics"],
    cta: "Start Free",
    popular: false,
  },
  {
    name: "Pro",
    price: "$29",
    period: "/mo",
    desc: "For serious builders",
    features: ["Unlimited videos", "All 500+ avatars", "All platforms", "Advanced analytics", "Priority support", "Content calendar"],
    cta: "Start Free Trial",
    popular: true,
  },
  {
    name: "Agency",
    price: "$99",
    period: "/mo",
    desc: "For teams & agencies",
    features: ["Everything in Pro", "5 team members", "White-label exports", "API access", "Dedicated support", "Custom avatars"],
    cta: "Contact Sales",
    popular: false,
  },
];

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Navbar */}
      <nav className="sticky top-0 z-50 bg-background/80 backdrop-blur-xl border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg gradient-warm flex items-center justify-center">
              <Zap className="w-4 h-4 text-primary-foreground" />
            </div>
            <span className="font-bold text-xl text-foreground tracking-tight">Fastlane</span>
          </div>
          <div className="hidden md:flex items-center gap-8">
            <a href="#features" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Features</a>
            <a href="#how-it-works" className="text-sm text-muted-foreground hover:text-foreground transition-colors">How it Works</a>
            <a href="#pricing" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Pricing</a>
            <a href="#testimonials" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Testimonials</a>
          </div>
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="sm" asChild>
              <Link to="/dashboard">Log in</Link>
            </Button>
            <Button size="sm" asChild>
              <Link to="/dashboard">Start Free <ArrowRight className="w-3 h-3 ml-1" /></Link>
            </Button>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative overflow-hidden">
        {/* Background gradient */}
        <div className="absolute inset-0 gradient-hero" />
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[800px] rounded-full bg-primary/5 blur-3xl" />
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-16 lg:pt-28 lg:pb-24">
          {/* Badge */}
          <div className="flex justify-center mb-6">
            <div className="inline-flex items-center gap-2 bg-accent border border-primary/10 text-accent-foreground px-4 py-1.5 rounded-full text-sm font-medium">
              <span className="bg-primary text-primary-foreground text-xs px-2 py-0.5 rounded-full font-bold">New</span>
              We raised a VC-backed funding round to empower every builder
            </div>
          </div>

          {/* Heading */}
          <div className="text-center max-w-4xl mx-auto">
            <h1 className="text-4xl sm:text-5xl lg:text-7xl font-extrabold text-foreground tracking-tight leading-[1.1]">
              Experience Marketing
              <br />
              in the <span className="italic bg-gradient-to-r from-primary to-warning bg-clip-text text-transparent">Fastlane</span>
            </h1>
            <p className="mt-6 text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
              The fastest way to turn trending videos into content for your business,
              then publish it across TikTok, Instagram Reels, and YouTube Shorts.
            </p>
            <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
              <Button size="lg" className="text-base px-8 h-12 shadow-glow" asChild>
                <Link to="/dashboard">
                  Start Free <ArrowRight className="w-4 h-4 ml-2" />
                </Link>
              </Button>
              <Button size="lg" variant="outline" className="text-base px-8 h-12" asChild>
                <a href="#how-it-works">
                  <Play className="w-4 h-4 mr-2" /> See How it Works
                </a>
              </Button>
            </div>
          </div>

          {/* Hero Image */}
          <div className="mt-16 max-w-5xl mx-auto">
            <div className="relative rounded-2xl overflow-hidden shadow-2xl border border-border/50">
              <img
                src={heroMockup}
                alt="Fastlane AI Marketing Dashboard"
                width={1200}
                height={800}
                className="w-full"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-background/20 to-transparent" />
            </div>
          </div>
        </div>
      </section>

      {/* Stats Bar */}
      <section className="border-y border-border bg-card">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 text-center">
            {stats.map((stat) => (
              <div key={stat.label}>
                <p className="text-3xl sm:text-4xl font-extrabold text-foreground">{stat.value}</p>
                <p className="text-sm text-muted-foreground mt-1">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="py-20 lg:py-28">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <span className="text-sm font-semibold text-primary uppercase tracking-wide">Features</span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-foreground mt-2">
              10x Your Growth, Fast
            </h2>
            <p className="text-muted-foreground mt-3 max-w-xl mx-auto">
              Everything you need to create, schedule, and track viral content.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((f) => (
              <div
                key={f.title}
                className="group p-6 rounded-2xl border border-border bg-card hover:shadow-lg hover:border-primary/20 transition-all duration-300"
              >
                <div className="w-12 h-12 rounded-xl bg-accent flex items-center justify-center mb-4 group-hover:gradient-warm group-hover:shadow-glow transition-all duration-300">
                  <f.icon className="w-6 h-6 text-primary group-hover:text-primary-foreground transition-colors" />
                </div>
                <h3 className="text-lg font-semibold text-foreground mb-2">{f.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it Works */}
      <section id="how-it-works" className="py-20 lg:py-28 bg-secondary/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <span className="text-sm font-semibold text-primary uppercase tracking-wide">How it Works</span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-foreground mt-2">
              Three steps to viral content
            </h2>
          </div>

          <div className="space-y-20">
            {steps.map((step, i) => (
              <div
                key={step.num}
                className={`flex flex-col ${i % 2 === 1 ? "lg:flex-row-reverse" : "lg:flex-row"} items-center gap-10 lg:gap-16`}
              >
                <div className="flex-1 max-w-lg">
                  <div className="flex items-center gap-3 mb-4">
                    <span className="text-5xl font-extrabold text-primary/15">{step.num}</span>
                    <span className="text-xs font-semibold text-primary uppercase tracking-widest">Step {step.num}</span>
                  </div>
                  <h3 className="text-2xl sm:text-3xl font-bold text-foreground mb-3">{step.title}</h3>
                  <p className="text-muted-foreground leading-relaxed">{step.desc}</p>
                  <Button variant="link" className="mt-4 p-0 text-primary" asChild>
                    <Link to="/dashboard">
                      Get started for free <ChevronRight className="w-4 h-4 ml-1" />
                    </Link>
                  </Button>
                </div>
                <div className="flex-1 max-w-lg">
                  <div className="rounded-2xl overflow-hidden shadow-xl border border-border/50">
                    <img
                      src={step.image}
                      alt={step.title}
                      loading="lazy"
                      width={600}
                      height={800}
                      className="w-full object-cover"
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="py-20 lg:py-28">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <span className="text-sm font-semibold text-primary uppercase tracking-wide">Pricing</span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-foreground mt-2">
              Simple, transparent pricing
            </h2>
            <p className="text-muted-foreground mt-3 max-w-xl mx-auto">
              Start free and scale as you grow. No hidden fees.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {pricingPlans.map((plan) => (
              <div
                key={plan.name}
                className={`relative rounded-2xl border p-6 flex flex-col ${
                  plan.popular
                    ? "border-primary shadow-glow bg-card scale-[1.02]"
                    : "border-border bg-card hover:border-primary/20"
                } transition-all duration-300`}
              >
                {plan.popular && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                    <span className="gradient-warm text-primary-foreground text-xs font-bold px-3 py-1 rounded-full">
                      Most Popular
                    </span>
                  </div>
                )}
                <h3 className="text-lg font-bold text-foreground">{plan.name}</h3>
                <p className="text-sm text-muted-foreground mt-1">{plan.desc}</p>
                <div className="mt-4 mb-6">
                  <span className="text-4xl font-extrabold text-foreground">{plan.price}</span>
                  <span className="text-muted-foreground">{plan.period}</span>
                </div>
                <ul className="space-y-3 mb-8 flex-1">
                  {plan.features.map((f) => (
                    <li key={f} className="flex items-center gap-2 text-sm text-foreground">
                      <Check className="w-4 h-4 text-primary shrink-0" />
                      {f}
                    </li>
                  ))}
                </ul>
                <Button
                  className="w-full"
                  variant={plan.popular ? "default" : "outline"}
                  asChild
                >
                  <Link to="/dashboard">{plan.cta}</Link>
                </Button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section id="testimonials" className="py-20 lg:py-28 bg-secondary/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <span className="text-sm font-semibold text-primary uppercase tracking-wide">Testimonials</span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-foreground mt-2">
              Loved by builders, worldwide
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 max-w-4xl mx-auto">
            {testimonials.map((t) => (
              <div
                key={t.handle}
                className="rounded-2xl border border-border bg-card p-6 hover:shadow-lg transition-all duration-300"
              >
                <div className="flex items-center gap-1 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-warning text-warning" />
                  ))}
                </div>
                <p className="text-foreground text-sm leading-relaxed mb-5">"{t.text}"</p>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full gradient-warm flex items-center justify-center text-primary-foreground font-bold text-sm">
                    {t.avatar}
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-foreground">{t.name} <span className="text-muted-foreground font-normal">({t.handle})</span></p>
                    <p className="text-xs text-muted-foreground">{t.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-20 lg:py-28">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="rounded-3xl gradient-warm p-12 sm:p-16 relative overflow-hidden">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_50%,rgba(255,255,255,0.15),transparent)]" />
            <div className="relative">
              <h2 className="text-3xl sm:text-4xl font-extrabold text-primary-foreground leading-tight">
                Ready to 10x your<br />organic marketing?
              </h2>
              <p className="text-primary-foreground/80 mt-4 text-lg max-w-md mx-auto">
                Join 1,000+ businesses already in the Fastlane.
              </p>
              <Button
                size="lg"
                variant="secondary"
                className="mt-8 text-base px-10 h-12"
                asChild
              >
                <Link to="/dashboard">
                  Get Started Free <ArrowRight className="w-4 h-4 ml-2" />
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border bg-card">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg gradient-warm flex items-center justify-center">
                <Zap className="w-3.5 h-3.5 text-primary-foreground" />
              </div>
              <span className="font-bold text-foreground">Fastlane</span>
            </div>
            <div className="flex items-center gap-6 text-sm text-muted-foreground">
              <a href="#features" className="hover:text-foreground transition-colors">Features</a>
              <a href="#pricing" className="hover:text-foreground transition-colors">Pricing</a>
              <a href="#testimonials" className="hover:text-foreground transition-colors">Testimonials</a>
              <Link to="/dashboard" className="hover:text-foreground transition-colors">Dashboard</Link>
            </div>
            <p className="text-xs text-muted-foreground">
              © 2026 Fastlane. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
