import { Link } from "react-router-dom";
import { APP_NAME, APP_TAGLINE, APP_DESCRIPTION, FEATURES, ROUTES } from "@/constants/app";
import { Button } from "@/components/ui/button";
import { Copy, Disc3, TrendingDown, TrendingUp, Trash2, ArrowRight, Shield, Palette, Smartphone } from "lucide-react";
import { motion } from "framer-motion";

const FEATURE_ICONS: Record<string, React.ElementType> = {
  Copy, Disc3, TrendingDown, TrendingUp, Trash2,
};

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i: number) => ({ opacity: 1, y: 0, transition: { delay: i * 0.1, duration: 0.5 } }),
};

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <nav className="sticky top-0 z-50 bg-background/80 backdrop-blur-md border-b border-border">
        <div className="max-w-6xl mx-auto flex items-center justify-between h-16 px-4 lg:px-6">
          <Link to={ROUTES.HOME} className="text-xl font-serif font-bold text-gradient-hero">
            {APP_NAME}
          </Link>
          <div className="flex items-center gap-4">
            <Link to={ROUTES.PRIVACY} className="text-sm text-muted-foreground hover:text-foreground transition-colors hidden sm:block">
              Privacy Policy
            </Link>
            <Link to={ROUTES.SUPPORT} className="text-sm text-muted-foreground hover:text-foreground transition-colors hidden sm:block">
              Support
            </Link>
            <Button asChild>
              <Link to={ROUTES.DASHBOARD}>
                Open App <ArrowRight size={16} className="ml-1" />
              </Link>
            </Button>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="max-w-4xl mx-auto px-4 pt-20 pb-16 text-center">
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-4xl sm:text-5xl lg:text-6xl font-serif leading-tight text-foreground"
        >
          Your music library<br />
          <span className="text-gradient-hero">is messier than you think.</span>
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.15 }}
          className="mt-6 text-lg text-muted-foreground max-w-2xl mx-auto"
        >
          {APP_DESCRIPTION}
        </motion.p>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="mt-8 flex flex-col sm:flex-row gap-3 justify-center"
        >
          <Button size="lg" asChild>
            <Link to={ROUTES.DASHBOARD}>
              Get Started <ArrowRight size={18} className="ml-2" />
            </Link>
          </Button>
          <Button size="lg" variant="outline" asChild>
            <Link to={ROUTES.ABOUT}>Learn More</Link>
          </Button>
        </motion.div>
        <p className="mt-4 text-xs text-muted-foreground">Works with your music streaming library.</p>
      </section>

      {/* Features */}
      <section className="max-w-6xl mx-auto px-4 py-16">
        <motion.h2
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="text-3xl lg:text-4xl font-serif text-center mb-4 text-foreground"
        >
          Your library didn&apos;t get messy overnight.
        </motion.h2>
        <p className="text-center text-muted-foreground max-w-2xl mx-auto mb-12">
          You add a song from a single, another from a deluxe edition, and over time your library
          starts to feel fragmented. {APP_NAME} brings everything back into alignment.
        </p>

        <div className="space-y-20">
          {FEATURES.map((feature, i) => {
            const Icon = FEATURE_ICONS[feature.icon] || Copy;
            const isReversed = i % 2 === 1;
            return (
              <motion.div
                key={feature.key}
                custom={i}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={fadeUp}
                className={`flex flex-col ${isReversed ? "lg:flex-row-reverse" : "lg:flex-row"} items-center gap-8 lg:gap-16`}
              >
                <div className="flex-1 text-center lg:text-left">
                  <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-primary-foreground text-sm font-medium mb-4 feature-gradient-${feature.key}`}>
                    <Icon size={16} />
                    {feature.title}
                  </div>
                  <h3 className="text-2xl font-serif text-foreground mb-3">{feature.description}</h3>
                  <Link
                    to={feature.route}
                    className="inline-flex items-center text-sm text-primary hover:underline font-medium"
                  >
                    Try it now <ArrowRight size={14} className="ml-1" />
                  </Link>
                </div>
                <div className="flex-1 w-full max-w-md">
                  <div className={`aspect-[4/3] rounded-2xl feature-gradient-${feature.key} opacity-20`} />
                </div>
              </motion.div>
            );
          })}
        </div>
      </section>

      {/* Extra Features */}
      <section className="max-w-4xl mx-auto px-4 py-16">
        <div className="grid sm:grid-cols-3 gap-6">
          {[
            { icon: Shield, title: "Privacy-first", desc: "Your library stays on your device. No cloud uploads." },
            { icon: Palette, title: "Light & Dark Mode", desc: "Every screen adapts to your preferred appearance." },
            { icon: Smartphone, title: "Fully Responsive", desc: "Works beautifully on desktop, tablet, and mobile." },
          ].map((item) => (
            <motion.div
              key={item.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="glass-card p-6 text-center"
            >
              <item.icon size={28} className="mx-auto mb-3 text-primary" />
              <h3 className="font-semibold text-foreground mb-1">{item.title}</h3>
              <p className="text-sm text-muted-foreground">{item.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="max-w-4xl mx-auto px-4 py-16 text-center">
        <h2 className="text-3xl lg:text-4xl font-serif text-foreground mb-4">
          Take control of your music library.
        </h2>
        <p className="text-muted-foreground mb-8">{APP_NAME} is ready for you.</p>
        <Button size="lg" asChild>
          <Link to={ROUTES.DASHBOARD}>
            Open Dashboard <ArrowRight size={18} className="ml-2" />
          </Link>
        </Button>
      </section>

      {/* Footer */}
      <footer className="border-t border-border py-8 px-4">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-sm text-muted-foreground">
            &copy; {new Date().getFullYear()} {APP_NAME}. All rights reserved.
          </p>
          <div className="flex gap-6">
            <Link to={ROUTES.PRIVACY} className="text-sm text-muted-foreground hover:text-foreground">Privacy</Link>
            <Link to={ROUTES.SUPPORT} className="text-sm text-muted-foreground hover:text-foreground">Support</Link>
            <Link to={ROUTES.ABOUT} className="text-sm text-muted-foreground hover:text-foreground">About</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
