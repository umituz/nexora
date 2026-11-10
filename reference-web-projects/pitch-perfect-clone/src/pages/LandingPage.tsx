import { Link } from "react-router-dom";
import { useState } from "react";
import { Menu, X, ArrowRight, CheckCircle, Zap, Shield, DollarSign, MessageSquare, Users, GitBranch, Tag, Bot, Star, ChevronDown, ChevronUp } from "lucide-react";
import { motion } from "framer-motion";
import { APP_NAME, APP_TAGLINE, APP_DESCRIPTION, APP_EMAIL, APP_ADDRESS, APP_COPYRIGHT, APP_MONTHLY_PRICE, APP_FREE_TRIAL_DAYS, APP_FREE_SMS_CREDITS, NAV_LINKS } from "@/lib/constants";
import { MOCK_TESTIMONIALS } from "@/lib/mock-data";
import { calculateSavings, formatCurrency, formatNumber } from "@/lib/calculations";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
};

const stagger = {
  visible: { transition: { staggerChildren: 0.15 } },
};

export default function LandingPage() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [smsVolume, setSmsVolume] = useState([100000]);
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  const savings = calculateSavings(smsVolume[0]);

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-background/95 backdrop-blur border-b">
        <div className="container mx-auto flex items-center justify-between h-16 px-4">
          <Link to="/" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg gradient-primary flex items-center justify-center">
              <span className="text-primary-foreground font-bold text-sm">P</span>
            </div>
            <span className="font-heading font-bold text-xl text-foreground">{APP_NAME}</span>
          </Link>
          <nav className="hidden md:flex items-center gap-8">
            {NAV_LINKS.map((link) => (
              <a key={link.href} href={link.href} className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
                {link.label}
              </a>
            ))}
          </nav>
          <div className="hidden md:flex items-center gap-3">
            <Button variant="ghost" asChild><Link to="/login">Login</Link></Button>
            <Button asChild><Link to="/register">Start Free Trial</Link></Button>
          </div>
          <Button variant="ghost" size="icon" className="md:hidden" onClick={() => setMenuOpen(!menuOpen)}>
            {menuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </Button>
        </div>
        {menuOpen && (
          <div className="md:hidden border-t bg-background p-4 space-y-3">
            {NAV_LINKS.map((link) => (
              <a key={link.href} href={link.href} onClick={() => setMenuOpen(false)} className="block text-sm font-medium text-muted-foreground py-2">{link.label}</a>
            ))}
            <div className="flex flex-col gap-2 pt-2">
              <Button variant="outline" asChild><Link to="/login">Login</Link></Button>
              <Button asChild><Link to="/register">Start Free Trial</Link></Button>
            </div>
          </div>
        )}
      </header>

      {/* Hero */}
      <section className="py-20 lg:py-32">
        <motion.div className="container mx-auto px-4 text-center max-w-4xl" initial="hidden" animate="visible" variants={stagger}>
          <motion.h1 variants={fadeUp} className="text-4xl md:text-6xl lg:text-7xl font-heading font-bold text-foreground leading-tight tracking-tight">
            {APP_TAGLINE}
          </motion.h1>
          <motion.p variants={fadeUp} className="mt-6 text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
            {APP_DESCRIPTION}
          </motion.p>
          <motion.div variants={fadeUp} className="mt-10 flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" variant="outline" className="text-base px-8">Book a Demo</Button>
            <Button size="lg" className="text-base px-8 gap-2" asChild>
              <Link to="/register">Start Free Trial <ArrowRight className="w-4 h-4" /></Link>
            </Button>
          </motion.div>
        </motion.div>
      </section>

      {/* Key Benefits */}
      <section id="features" className="py-20 bg-secondary/50">
        <div className="container mx-auto px-4">
          <motion.div className="text-center mb-16" initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp}>
            <p className="text-sm font-semibold text-primary uppercase tracking-wide">Key benefits</p>
            <h2 className="mt-3 text-3xl md:text-4xl font-heading font-bold text-foreground">Fast, Compliant, and Affordable SMS Campaigns</h2>
          </motion.div>
          <motion.div className="grid md:grid-cols-3 gap-8" initial="hidden" whileInView="visible" viewport={{ once: true }} variants={stagger}>
            {[
              { icon: Zap, title: "Fast 10DLC Approvals", desc: "Get verified and live in days instead of waiting months." },
              { icon: Shield, title: "Built-In Compliance", desc: "Stay TCPA-friendly with real-time checks while you draft and send bulk SMS." },
              { icon: DollarSign, title: "Affordable & Scalable", desc: "$0.007 per text, 14-day free trial, and no setup fees." },
            ].map((item) => (
              <motion.div key={item.title} variants={fadeUp} className="bg-card rounded-xl p-8 shadow-card hover:shadow-card-hover transition-shadow">
                <div className="w-12 h-12 rounded-xl gradient-primary flex items-center justify-center mb-5">
                  <item.icon className="w-6 h-6 text-primary-foreground" />
                </div>
                <h3 className="text-xl font-heading font-bold text-foreground mb-2">{item.title}</h3>
                <p className="text-muted-foreground">{item.desc}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <motion.div className="text-center mb-16" initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp}>
            <h2 className="text-3xl md:text-4xl font-heading font-bold text-foreground">Everything You Need for Powerful SMS Marketing</h2>
          </motion.div>
          <motion.div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6" initial="hidden" whileInView="visible" viewport={{ once: true }} variants={stagger}>
            {[
              { icon: MessageSquare, title: "Message Templates", desc: "Save and reuse your best replies instantly." },
              { icon: DollarSign, title: "Flexible Credits", desc: "Pay-as-you-go or add credit packs for lower rates." },
              { icon: Zap, title: "Bulk + Drip Sending", desc: "Reach thousands while protecting deliverability." },
              { icon: GitBranch, title: "Automated Workflows", desc: "Set triggers once; campaigns run on autopilot." },
              { icon: Tag, title: "Smart Filtering + Tagging", desc: "Keep your inbox organized at scale." },
              { icon: Users, title: "Contact Management", desc: "Segment, tag, and organize in one place." },
            ].map((item) => (
              <motion.div key={item.title} variants={fadeUp} className="bg-card rounded-xl p-6 border hover:shadow-card-hover transition-all">
                <item.icon className="w-8 h-8 text-primary mb-4" />
                <h3 className="text-lg font-heading font-semibold text-foreground mb-1">{item.title}</h3>
                <p className="text-sm text-muted-foreground">{item.desc}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* AI Copilot */}
      <section id="jayni" className="py-20 bg-secondary/50">
        <div className="container mx-auto px-4">
          <motion.div className="text-center mb-16" initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp}>
            <span className="inline-block px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-semibold mb-4">Coming Soon</span>
            <h2 className="text-3xl md:text-4xl font-heading font-bold text-foreground">AI Co-Pilot — Jayni</h2>
            <p className="mt-3 text-muted-foreground max-w-2xl mx-auto">Your intelligent SMS co-pilot that automates workflows, ensures compliance, and books meetings for you.</p>
          </motion.div>
          <motion.div className="grid md:grid-cols-3 gap-8" initial="hidden" whileInView="visible" viewport={{ once: true }} variants={stagger}>
            {[
              { icon: Bot, title: "Prompt-to-Automation", desc: "Write a simple prompt and Jayni instantly builds SMS campaigns and workflows." },
              { icon: Shield, title: "10DLC Compliance Agent", desc: "Scans your marketing assets, flags what's missing for 10DLC compliance." },
              { icon: Star, title: "AI Appointment Setter", desc: "Books meetings for you over text so you never miss a lead." },
            ].map((item) => (
              <motion.div key={item.title} variants={fadeUp} className="bg-card rounded-xl p-8 border">
                <item.icon className="w-8 h-8 text-primary mb-4" />
                <h3 className="text-lg font-heading font-semibold text-foreground mb-2">{item.title}</h3>
                <p className="text-sm text-muted-foreground">{item.desc}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="py-20">
        <div className="container mx-auto px-4">
          <motion.div className="text-center mb-16" initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp}>
            <p className="text-sm font-semibold text-primary uppercase tracking-wide">Pricing</p>
            <h2 className="mt-3 text-3xl md:text-4xl font-heading font-bold text-foreground">Scale More, Pay Less</h2>
            <p className="mt-3 text-muted-foreground">No hidden fees, no gimmicks — just the lowest cost per text in the industry.</p>
          </motion.div>
          <motion.div className="max-w-2xl mx-auto" initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp}>
            <div className="bg-card rounded-2xl p-8 border shadow-card">
              <h3 className="text-lg font-heading font-semibold text-foreground mb-2">Instantly Calculate Your Savings</h3>
              <p className="text-sm text-muted-foreground mb-6">See how your savings grow as you scale.</p>
              <div className="mb-8">
                <div className="flex justify-between mb-2">
                  <span className="text-sm text-muted-foreground">Monthly SMS</span>
                  <span className="text-2xl font-heading font-bold text-foreground">{formatNumber(smsVolume[0])}</span>
                </div>
                <Slider value={smsVolume} onValueChange={setSmsVolume} min={1000} max={500000} step={1000} className="mb-1" />
                <p className="text-xs text-muted-foreground">Drag the slider to adjust volume</p>
              </div>
              <div className="grid grid-cols-3 gap-4 mb-6">
                <div className="bg-secondary rounded-lg p-4">
                  <p className="text-xs text-muted-foreground mb-1">{APP_NAME}</p>
                  <p className="text-lg font-bold text-foreground">{formatCurrency(savings.ourCost)}</p>
                  <p className="text-xs text-muted-foreground">$0.007/SMS</p>
                </div>
                <div className="bg-secondary rounded-lg p-4">
                  <p className="text-xs text-muted-foreground mb-1">Competitor</p>
                  <p className="text-lg font-bold text-foreground">{formatCurrency(savings.competitorCost)}</p>
                  <p className="text-xs text-muted-foreground">$0.030/SMS</p>
                </div>
                <div className="bg-primary/10 rounded-lg p-4">
                  <p className="text-xs text-primary font-semibold mb-1">You save</p>
                  <p className="text-lg font-bold text-primary">{formatCurrency(savings.savings)}</p>
                  <p className="text-xs text-muted-foreground">${savings.savingsPerSms.toFixed(3)}/SMS</p>
                </div>
              </div>
              <div className="text-center mb-6">
                <span className="text-3xl font-heading font-bold text-foreground">${APP_MONTHLY_PRICE}</span>
                <span className="text-muted-foreground">/month</span>
              </div>
              <div className="space-y-2 mb-6">
                {[
                  `${APP_FREE_TRIAL_DAYS}-day free trial`,
                  "$0 setup fees for 10DLC",
                  `${formatNumber(APP_FREE_SMS_CREDITS)} free SMS credits included`,
                  "Ongoing rates as low as $0.007 per message",
                ].map((item) => (
                  <div key={item} className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-primary shrink-0" />
                    <span className="text-sm text-foreground">{item}</span>
                  </div>
                ))}
              </div>
              <div className="flex flex-col sm:flex-row gap-3">
                <Button className="flex-1" asChild><Link to="/register">Start Free Trial</Link></Button>
                <Button variant="outline" className="flex-1">Enterprise — Book a Demo</Button>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 bg-secondary/50">
        <div className="container mx-auto px-4">
          <motion.div className="text-center mb-12" initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp}>
            <h2 className="text-3xl md:text-4xl font-heading font-bold text-foreground">What Our Customers Say</h2>
          </motion.div>
          <motion.div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6" initial="hidden" whileInView="visible" viewport={{ once: true }} variants={stagger}>
            {MOCK_TESTIMONIALS.map((t) => (
              <motion.div key={t.id} variants={fadeUp} className="bg-card rounded-xl p-6 border">
                <div className="flex gap-1 mb-4">
                  {[1, 2, 3, 4, 5].map((s) => (
                    <Star key={s} className="w-4 h-4 fill-warning text-warning" />
                  ))}
                </div>
                <p className="text-sm text-foreground mb-4 italic">"{t.text}"</p>
                <div>
                  <p className="font-semibold text-foreground text-sm">{t.name}</p>
                  <p className="text-xs text-muted-foreground">{t.role}</p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="py-20">
        <div className="container mx-auto px-4 max-w-3xl">
          <motion.div className="text-center mb-12" initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp}>
            <h2 className="text-3xl md:text-4xl font-heading font-bold text-foreground">Everything You Need to Know</h2>
          </motion.div>
          <div className="space-y-3">
            {[
              { q: "What is 10DLC and why do I need it?", a: "10DLC (10-Digit Long Code) is a mandatory registration system required by U.S. carriers for business text messaging. It verifies your business identity and messaging use case. Without it, your messages may be blocked or filtered as spam." },
              { q: "What happens if contacts opt out?", a: "When a contact replies STOP, they are automatically removed from all future campaigns and marked as opted-out in the system. This process is fully automated and TCPA compliant." },
              { q: "What are my daily message volume limits?", a: "Your daily limits depend on your 10DLC registration score. Most businesses can send between 2,000-10,000 messages per day. Enterprise plans can go higher." },
              { q: "How do I purchase credits and what do they cost?", a: "Credits can be purchased directly from the dashboard. Pay-as-you-go rate is $0.007/SMS or buy credit packs for discounted rates as low as $0.0055/SMS." },
            ].map((item, i) => (
              <div key={i} className="bg-card rounded-xl border overflow-hidden">
                <button
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  className="w-full flex items-center justify-between p-5 text-left"
                >
                  <span className="font-heading font-semibold text-foreground pr-4">{item.q}</span>
                  {openFaq === i ? <ChevronUp className="w-5 h-5 text-muted-foreground shrink-0" /> : <ChevronDown className="w-5 h-5 text-muted-foreground shrink-0" />}
                </button>
                {openFaq === i && (
                  <div className="px-5 pb-5">
                    <p className="text-sm text-muted-foreground">{item.a}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t py-12 bg-card">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-start gap-8">
            <div>
              <Link to="/" className="flex items-center gap-2 mb-3">
                <div className="w-8 h-8 rounded-lg gradient-primary flex items-center justify-center">
                  <span className="text-primary-foreground font-bold text-sm">P</span>
                </div>
                <span className="font-heading font-bold text-lg text-foreground">{APP_NAME}</span>
              </Link>
              <p className="text-sm text-muted-foreground max-w-xs">Automated SMS marketing at unbeatable prices</p>
              <p className="text-xs text-muted-foreground mt-2">{APP_ADDRESS}</p>
              <a href={`mailto:${APP_EMAIL}`} className="text-xs text-primary hover:underline">{APP_EMAIL}</a>
            </div>
            <div className="flex gap-8 text-sm">
              <Link to="/terms" className="text-muted-foreground hover:text-foreground transition-colors">Terms & Conditions</Link>
              <Link to="/privacy" className="text-muted-foreground hover:text-foreground transition-colors">Privacy Policy</Link>
            </div>
          </div>
          <div className="mt-8 pt-8 border-t text-center">
            <p className="text-xs text-muted-foreground">{APP_COPYRIGHT}</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
