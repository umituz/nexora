import { Link } from "react-router-dom";
import { ArrowRight, Play, CheckCircle, Zap, Shield, Clock, BarChart3 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { APP_NAME, NAV_LINKS, STATS, FAQ_ITEMS } from "@/constants/app";
import { MOCK_TESTIMONIALS } from "@/data/mock";
import { motion } from "framer-motion";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const trustedLogos = [
  "Cursor", "Trae", "VS Code", "Claude Code", "Windsurf",
  "Genrex", "Astronuts", "Parcel AI", "Luckin Coffee",
];

const features = [
  { icon: Zap, title: "No-Code Test Refinement", desc: "Streamline test maintenance with intuitive management tools. Quickly edit interactions through a visual interface." },
  { icon: Shield, title: "Zero-Overhead Automation", desc: "Automate your testing culture with zero friction. Get instant, actionable feedback delivered directly to your PR." },
  { icon: BarChart3, title: "Unified Batch Generation", desc: "One-click generation for total stack coverage. Simultaneously create frontend and backend tests." },
  { icon: Clock, title: "Continuous Regression Guardrails", desc: "Automatically re-verify your system on a schedule to detect regressions early and maintain 24/7 reliability." },
  { icon: CheckCircle, title: "Open Community Access", desc: "Join 100k+ developers building the future of AI-native software with our accessible Community Edition." },
  { icon: Play, title: "Autonomous Self-Repair", desc: "TestSprite doesn't just find bugs — it fixes them. Autonomous self-repair capabilities keep your tests healthy." },
];

const steps = [
  { num: "01", title: "Understand Intent", desc: "AI analyzes your codebase and understands the intent behind each feature." },
  { num: "02", title: "Verify Functionality & Usability", desc: "Generates and executes comprehensive tests across your stack." },
  { num: "03", title: "Autonomous Self-Repair", desc: "Automatically fixes broken tests and adapts to code changes." },
];

export default function HomePage() {
  return (
    <div>
      {/* Hero */}
      <section className="grid-bg section-padding">
        <div className="container-wide">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="max-w-4xl"
          >
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-heading font-bold leading-tight mb-6">
              <span className="text-gradient">10x</span> your AI-native dev speed with our{" "}
              <span className="text-gradient">autonomous AI testing agent</span> handling verification.
            </h1>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <p className="text-lg text-muted-foreground max-w-2xl mb-4 font-heading text-sm">
              The missing layer of the agentic workflow.
            </p>
            <p className="text-base text-muted-foreground max-w-2xl mb-8">
              Eliminate manual bottlenecks and let our autonomous AI testing agent transform your CI/CD into a high-velocity engine.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="flex flex-wrap gap-4"
          >
            <Link to={NAV_LINKS.signUp}>
              <Button size="lg" className="gradient-primary text-primary-foreground gap-2">
                Get Started Free <ArrowRight size={16} />
              </Button>
            </Link>
            <Button size="lg" variant="outline" className="gap-2">
              <Play size={16} /> Watch Video
            </Button>
          </motion.div>
        </div>
      </section>

      {/* Trusted By */}
      <section className="py-12 border-b border-border overflow-hidden">
        <p className="text-center text-sm font-heading text-muted-foreground mb-6">
          // Trusted by high-velocity engineering teams worldwide.
        </p>
        <div className="flex animate-marquee whitespace-nowrap">
          {[...trustedLogos, ...trustedLogos].map((name, i) => (
            <div key={i} className="mx-8 flex items-center gap-2 text-muted-foreground/40 font-heading font-bold text-lg shrink-0">
              {name}
            </div>
          ))}
        </div>
      </section>

      {/* Built for your stack */}
      <section className="section-padding bg-accent/30">
        <div className="container-wide text-center">
          <h2 className="text-3xl md:text-4xl font-heading font-bold mb-4">
            Built for your <span className="text-gradient">AI-native development stack.</span>
          </h2>
          <p className="text-muted-foreground mb-8 font-heading text-sm">Simple to connect.</p>
          <div className="flex flex-wrap justify-center gap-4">
            {["Cursor", "VS Code", "Claude Code", "Trae", "Windsurf", "And More"].map((ide) => (
              <div
                key={ide}
                className="px-6 py-3 rounded-lg border border-border bg-card hover:border-primary/50 transition-colors font-heading text-sm font-medium"
              >
                {ide}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Feedback Loop Steps */}
      <section className="section-padding">
        <div className="container-wide">
          <h2 className="text-3xl md:text-4xl font-heading font-bold mb-2 text-center">
            The Autonomous <span className="text-gradient">Feedback Loop</span>
          </h2>
          <p className="text-center text-muted-foreground mb-12 max-w-2xl mx-auto">
            {APP_NAME} turns AI-generated code into production-ready software through continuous, agentic verification.
          </p>
          <div className="grid md:grid-cols-3 gap-8">
            {steps.map((step) => (
              <motion.div
                key={step.num}
                whileHover={{ y: -4 }}
                className="glass-card p-6"
              >
                <span className="text-gradient font-heading font-bold text-2xl">{step.num}</span>
                <h3 className="font-heading font-semibold text-lg mt-3 mb-2">{step.title}</h3>
                <p className="text-sm text-muted-foreground">{step.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Accuracy stats */}
      <section className="section-padding gradient-primary text-primary-foreground">
        <div className="container-wide text-center">
          <h2 className="text-3xl md:text-4xl font-heading font-bold mb-4">
            Boost Accuracy <span className="text-5xl">{STATS.accuracyBoost}</span>
          </h2>
          <p className="text-lg opacity-90 mb-8 max-w-2xl mx-auto">
            Scale Quality with Agentic Precision. Close the gap between code generation and production.
          </p>
          <div className="flex justify-center gap-12 flex-wrap">
            <div>
              <div className="text-4xl font-heading font-bold">{STATS.featuresWithAgent}</div>
              <div className="text-sm opacity-70 mt-1">With Coding Agent Only</div>
            </div>
            <div className="text-4xl font-heading">→</div>
            <div>
              <div className="text-4xl font-heading font-bold">{STATS.featuresWithTestSprite}</div>
              <div className="text-sm opacity-70 mt-1">With {APP_NAME}</div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="section-padding">
        <div className="container-wide">
          <h2 className="text-3xl md:text-4xl font-heading font-bold mb-12 text-center">
            Ensure Engineering Certainty for Production
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((f) => (
              <motion.div
                key={f.title}
                whileHover={{ y: -4 }}
                className="glass-card p-6"
              >
                <f.icon size={24} className="text-primary mb-4" />
                <h3 className="font-heading font-semibold mb-2">{f.title}</h3>
                <p className="text-sm text-muted-foreground">{f.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="section-padding bg-accent/30">
        <div className="container-wide text-center">
          <h2 className="text-3xl md:text-4xl font-heading font-bold mb-12">
            Take Flight with {APP_NAME}.
          </h2>
          <div className="grid grid-cols-2 gap-8 max-w-md mx-auto">
            <div>
              <div className="text-3xl md:text-4xl font-heading font-bold text-gradient">{STATS.communityMembers}</div>
              <div className="text-sm text-muted-foreground mt-1">community members</div>
            </div>
            <div>
              <div className="text-3xl md:text-4xl font-heading font-bold text-gradient">{STATS.developersOnboarded}</div>
              <div className="text-sm text-muted-foreground mt-1">developers & teams</div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="section-padding">
        <div className="container-wide">
          <h2 className="text-3xl md:text-4xl font-heading font-bold mb-12 text-center">
            The New Way to Validate Software.
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {MOCK_TESTIMONIALS.map((t) => (
              <div key={t.id} className="glass-card p-6">
                <p className="text-sm text-muted-foreground mb-4 italic">&ldquo;{t.quote}&rdquo;</p>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full gradient-primary flex items-center justify-center text-primary-foreground font-heading font-bold text-sm">
                    {t.name.charAt(0)}
                  </div>
                  <div>
                    <div className="text-sm font-medium">{t.name}</div>
                    <div className="text-xs text-muted-foreground">{t.role} — {t.company}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="section-padding bg-accent/30">
        <div className="container-narrow">
          <h2 className="text-3xl md:text-4xl font-heading font-bold mb-8 text-center">
            Frequently Asked Questions
          </h2>
          <Accordion type="single" collapsible className="w-full">
            {FAQ_ITEMS.map((item, i) => (
              <AccordionItem key={i} value={`faq-${i}`}>
                <AccordionTrigger className="font-heading text-sm font-medium text-left">
                  {item.q}
                </AccordionTrigger>
                <AccordionContent className="text-sm text-muted-foreground">
                  {item.a}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </section>

      {/* Final CTA */}
      <section className="section-padding text-center grid-bg">
        <div className="container-narrow">
          <h2 className="text-3xl md:text-4xl font-heading font-bold mb-4">
            Ship With Confidence. Automate Your Testing With AI.
          </h2>
          <div className="flex flex-wrap justify-center gap-4 mt-8">
            <Link to={NAV_LINKS.signUp}>
              <Button size="lg" className="gradient-primary text-primary-foreground gap-2">
                Get Started Free <ArrowRight size={16} />
              </Button>
            </Link>
            <Link to={NAV_LINKS.contact}>
              <Button size="lg" variant="outline">Schedule a Call</Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
