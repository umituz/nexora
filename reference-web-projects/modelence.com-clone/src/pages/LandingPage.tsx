import { Link } from "react-router-dom";
import { APP_NAME, APP_TAGLINE, APP_DESCRIPTION, NAV_LINKS, FAQ_ITEMS, TECH_STACK } from "@/lib/constants";
import { Button } from "@/components/ui/button";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { ShieldCheck, Database, BarChart3, Cloud, Clock, ArrowRightLeft, Settings2, Code } from "lucide-react";
import { motion } from "framer-motion";

const features = [
  { icon: ShieldCheck, title: "Authentication", desc: "Built-in user management in your own database" },
  { icon: Database, title: "Database", desc: "Just define your schema and forget about database connection setup" },
  { icon: BarChart3, title: "Monitoring", desc: "Logs, metrics, and traces out of the box, no setup required" },
];

const platformFeatures = [
  { icon: ShieldCheck, title: "Authentication & User Management", desc: "Users, sessions, roles, and permission scopes out of the box. Let agents wire auth correctly without reinventing login flows.", tags: ["Email", "Password", "Login", "User Management"] },
  { icon: Database, title: "Database Primitives", desc: "Type-safe queries on your data, with a predictable place for indexes and migrations. Ship changes without spaghetti glue code.", tags: ["Schema", "Queries", "Migrations"] },
  { icon: BarChart3, title: "Monitoring & Observability", desc: "Logs, metrics, and traces are set up by default. Catch errors and performance issues as soon as they happen.", tags: ["Logs", "Metrics", "Traces"] },
  { icon: Cloud, title: "Managed Cloud", desc: "Deploy cloud environments with zero configuration. Manage configurations, secrets, users, database and metrics from a single dashboard.", tags: ["Configs", "Users", "Database", "Metrics", "Logs", "Cron Jobs"] },
];

const noLockInFeatures = [
  { icon: Clock, title: "Cron Jobs", desc: "Simply define a handler function and it will run with sub-second precision — supports multiple application instances." },
  { icon: ArrowRightLeft, title: "Data Loading", desc: "Use queries and mutations to send and retrieve data between the client and server." },
  { icon: Settings2, title: "App Configuration", desc: "Define dynamic configuration values and secrets, use them anywhere in your app." },
];

export default function LandingPage() {
  return (
    <div>
      {/* Hero */}
      <section className="relative py-20 md:py-32 overflow-hidden">
        <div className="container mx-auto px-4 text-center relative z-10">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-4xl md:text-6xl lg:text-7xl font-bold text-foreground tracking-tight"
          >
            {APP_TAGLINE}
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="mt-6 text-lg text-muted-foreground max-w-2xl mx-auto"
          >
            {APP_DESCRIPTION}
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="mt-10 max-w-2xl mx-auto"
          >
            <div className="bg-card border border-border rounded-xl p-4 shadow-sm">
              <textarea
                placeholder="What do you want to build?"
                className="w-full bg-transparent resize-none outline-none text-foreground placeholder:text-muted-foreground min-h-[80px] text-sm"
                readOnly
              />
              <div className="flex justify-end">
                <Button size="sm" asChild>
                  <Link to={NAV_LINKS.signup}>
                    <Code className="h-4 w-4 mr-1" /> Start Building
                  </Link>
                </Button>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="mt-6 inline-flex items-center gap-2 border border-border rounded-full px-4 py-2 text-sm text-muted-foreground"
          >
            Backed by
            <span className="inline-flex items-center gap-1 font-semibold text-orange-600">
              <span className="bg-orange-600 text-primary-foreground text-xs rounded px-1 py-0.5 font-bold">Y</span>
              Combinator
            </span>
          </motion.div>
        </div>
      </section>

      {/* Feature Cards */}
      <section className="py-16 bg-secondary/30">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-3 gap-6">
            {features.map((f, i) => (
              <motion.div
                key={f.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="bg-card border border-border rounded-xl p-8 text-center"
              >
                <div className="mx-auto w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4">
                  <f.icon className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-lg font-semibold text-foreground">{f.title}</h3>
                <p className="mt-2 text-sm text-muted-foreground">{f.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Build With */}
      <section className="py-16">
        <div className="container mx-auto px-4 text-center">
          <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-8">Build With</p>
          <div className="flex flex-wrap items-center justify-center gap-10">
            {TECH_STACK.map((t) => (
              <div key={t.name} className="flex flex-col items-center gap-2">
                <div className="w-12 h-12 rounded-xl bg-secondary flex items-center justify-center text-xl">
                  {t.icon}
                </div>
                <span className="text-xs text-muted-foreground">{t.name}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* One Platform */}
      <section className="py-20 bg-secondary/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-14">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground">One platform</h2>
            <p className="mt-3 text-lg text-muted-foreground">Everything you need for a production app</p>
          </div>
          <div className="grid md:grid-cols-2 gap-6">
            {platformFeatures.map((f, i) => (
              <motion.div
                key={f.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="bg-card border border-border rounded-xl p-8"
              >
                <h3 className="text-lg font-semibold text-foreground mb-2">{f.title}</h3>
                <p className="text-sm text-muted-foreground mb-4">{f.desc}</p>
                <div className="flex flex-wrap gap-2">
                  {f.tags.map((tag) => (
                    <span key={tag} className="px-2.5 py-1 bg-secondary text-xs rounded-md text-muted-foreground">
                      {tag}
                    </span>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* No Lock-in */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-14">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground">No lock-in</h2>
            <p className="mt-3 text-lg text-muted-foreground">You own your app and data</p>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {noLockInFeatures.map((f, i) => (
              <motion.div
                key={f.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="bg-card border border-border rounded-xl p-8"
              >
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                  <f.icon className="h-5 w-5 text-primary" />
                </div>
                <h3 className="text-lg font-semibold text-foreground">{f.title}</h3>
                <p className="mt-2 text-sm text-muted-foreground">{f.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-20 bg-secondary/30">
        <div className="container mx-auto px-4 max-w-3xl">
          <h2 className="text-3xl font-bold text-foreground text-center mb-10">Frequently asked questions</h2>
          <Accordion type="single" collapsible className="space-y-3">
            {FAQ_ITEMS.map((item, i) => (
              <AccordionItem key={i} value={`faq-${i}`} className="bg-card border border-border rounded-lg px-6">
                <AccordionTrigger className="text-left font-medium text-foreground">
                  {item.question}
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground">
                  {item.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground">Ready to build?</h2>
          <p className="mt-4 text-lg text-muted-foreground">Start building your production-ready app today.</p>
          <div className="mt-8 flex items-center justify-center gap-3">
            <Button size="lg" asChild>
              <Link to={NAV_LINKS.signup}>Get Started</Link>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <Link to={NAV_LINKS.docs}>Read Docs</Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
