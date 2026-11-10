import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { APP_NAME, APP_TAGLINE, APP_SUBTITLE, FEATURES, LANGUAGES, TESTIMONIALS } from "@/constants/app";
import { Bug, Gauge, Server, AlertTriangle, Activity, BarChart3, FileText, CheckSquare, Check, Zap, Shield, HeadphonesIcon } from "lucide-react";

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  Bug, Gauge, Server, AlertTriangle, Activity, BarChart3, FileText, CheckSquare,
};

const featureTabs = FEATURES.map((f) => ({ ...f, Icon: iconMap[f.icon] }));

export default function HomePage() {
  return (
    <div>
      {/* Hero */}
      <section className="relative overflow-hidden py-20 lg:py-32">
        <div className="absolute inset-0 bg-gradient-to-b from-primary/5 via-transparent to-transparent" />
        <div className="container relative text-center">
          <motion.p
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
            className="text-sm font-semibold uppercase tracking-widest text-primary mb-4"
          >
            Application Performance Monitoring
          </motion.p>
          <motion.h1
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
            className="text-4xl md:text-6xl lg:text-7xl font-black leading-tight mb-6"
          >
            {APP_TAGLINE.split(".").map((part, i) => (
              <span key={i} className="block">{part.trim()}{i === 0 ? "." : ""}</span>
            ))}
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
            className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-8"
          >
            {APP_SUBTITLE}
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}
            className="flex flex-col sm:flex-row gap-4 justify-center"
          >
            <Button size="lg" asChild>
              <Link to="/signup">Start free trial</Link>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <Link to="/login">View demo dashboard</Link>
            </Button>
          </motion.div>
        </div>
      </section>

      {/* Feature Tabs */}
      <section className="py-20 bg-card">
        <div className="container">
          <div className="flex flex-wrap justify-center gap-4 lg:gap-8 mb-12">
            {featureTabs.map((f) => {
              const Icon = f.Icon;
              return (
                <Link
                  key={f.id}
                  to={`/dashboard/${f.id === "checkins" ? "check-ins" : f.id}`}
                  className="flex flex-col items-center gap-2 px-4 py-3 rounded-lg hover:bg-accent transition-colors group"
                >
                  {Icon && <Icon className="h-6 w-6 text-muted-foreground group-hover:text-primary transition-colors" />}
                  <span className="text-sm font-medium text-muted-foreground group-hover:text-foreground">{f.title.split(" ")[0]}</span>
                </Link>
              );
            })}
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {FEATURES.slice(0, 8).map((feature, i) => (
              <motion.div
                key={feature.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="rounded-xl border border-border bg-background p-6 hover:border-primary/30 transition-colors"
              >
                <h3 className="text-lg font-semibold mb-2">{feature.title}</h3>
                <p className="text-sm text-muted-foreground mb-4">{feature.description}</p>
                <ul className="space-y-2">
                  {feature.bullets.slice(0, 3).map((b) => (
                    <li key={b} className="flex items-start gap-2 text-sm text-muted-foreground">
                      <Check className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                      {b}
                    </li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Languages */}
      <section className="py-20">
        <div className="container">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-4">Works with your stack</h2>
          <p className="text-muted-foreground text-center mb-12 max-w-xl mx-auto">
            {APP_NAME} supports all major languages and frameworks. Get started in minutes.
          </p>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {LANGUAGES.map((lang) => (
              <div key={lang.name} className="rounded-xl border border-border bg-card p-5 text-center hover:border-primary/30 transition-colors">
                <h3 className="font-semibold mb-3">{lang.name}</h3>
                <div className="space-y-1">
                  {lang.frameworks.slice(0, 3).map((fw) => (
                    <p key={fw} className="text-xs text-muted-foreground">{fw}</p>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 bg-card">
        <div className="container">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-4">Trusted by 10,000+ developers</h2>
          <p className="text-muted-foreground text-center mb-12">Development teams rely on {APP_NAME} to ship code with confidence.</p>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {TESTIMONIALS.map((t, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="rounded-xl border border-border bg-background p-6"
              >
                <p className="text-sm text-muted-foreground mb-4 italic">"{t.quote}"</p>
                <div>
                  <p className="text-sm font-semibold">{t.author}</p>
                  <p className="text-xs text-muted-foreground">{t.role}, {t.company}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Bottom Features */}
      <section className="py-20">
        <div className="container">
          <div className="grid md:grid-cols-3 gap-8 text-center">
            {[
              { icon: Zap, title: "Lightweight Agent", desc: "Built with Rust. Lightweight, stable and already runs in thousands of applications." },
              { icon: HeadphonesIcon, title: "Dev-to-dev Support", desc: "If you need us, we're there for you. Committed to making monitoring great." },
              { icon: Shield, title: "99.999% Uptime", desc: "If there's one thing you need to trust, it's your APM. We're ready at every scale." },
            ].map((item, i) => (
              <div key={i} className="flex flex-col items-center">
                <item.icon className="h-10 w-10 text-primary mb-4" />
                <h3 className="text-lg font-semibold mb-2">{item.title}</h3>
                <p className="text-sm text-muted-foreground">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-gradient-to-r from-primary/10 via-primary/5 to-transparent">
        <div className="container text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Ready to monitor with ease?</h2>
          <p className="text-muted-foreground mb-8 max-w-lg mx-auto">
            Start your free trial today. No credit card required.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" asChild>
              <Link to="/signup">Start free trial</Link>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <Link to="/pricing">View pricing</Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
