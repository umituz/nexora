import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { APP_DESCRIPTION } from "@/constants/app";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";

export function HeroSection() {
  return (
    <section className="container py-20 text-center">
      <motion.h1
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mx-auto max-w-3xl text-5xl font-bold tracking-tight md:text-6xl"
      >
        Deploy OpenClaw{" "}
        <span className="text-muted-foreground">In Under 1 Minute</span>
      </motion.h1>
      <motion.p
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="mx-auto mt-6 max-w-2xl text-lg text-muted-foreground"
      >
        {APP_DESCRIPTION}
      </motion.p>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15 }}
        className="mt-6 flex flex-wrap items-center justify-center gap-4 text-sm text-muted-foreground"
      >
        <span className="font-medium uppercase tracking-wider">Powered by</span>
        <span>🟠 Claude</span>
        <span>🟢 ChatGPT</span>
        <span>🔵 Gemini</span>
        <span className="text-border">|</span>
        <span className="font-medium uppercase tracking-wider">Available on</span>
        <span>📱 Telegram</span>
        <span>🎮 Discord</span>
        <span>💬 WhatsApp</span>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="mt-8"
      >
        <Button size="lg" className="px-8 text-base" asChild>
          <Link to="/register">
            Get Started <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
        </Button>
        <p className="mt-3 text-sm text-muted-foreground">
          Set up in under a minute. Cancel anytime.{" "}
          <Link to="/terms" className="underline">Moneyback guarantee</Link>.
        </p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="mt-4 text-sm text-muted-foreground"
      >
        <span className="inline-block h-2 w-2 rounded-full bg-success mr-2" />
        New Telegram bot live from Amman · 12 min ago
      </motion.div>
    </section>
  );
}
