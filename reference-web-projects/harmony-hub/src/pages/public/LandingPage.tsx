import { Link } from "react-router-dom";
import { APP_NAME, APP_DESCRIPTION, APP_TAGLINE, STATS } from "@/constants/app";
import { Bot, MessageSquare, Calendar, TrendingUp, Zap, Brain, Share2, DollarSign, Users, Star } from "lucide-react";
import { motion } from "framer-motion";

const features = [
  { icon: TrendingUp, title: "It Sells", desc: "Qualifies leads, handles objections, closes deals. From $27 to $50K+." },
  { icon: Calendar, title: "It Books Appointments", desc: "Spots buying signals, books directly in chat. No links, no friction." },
  { icon: Brain, title: "It Understands Everything", desc: "Images, voice notes, documents, PDFs, video. Not just text." },
  { icon: MessageSquare, title: "It Remembers", desc: "Past conversations, context, preferences. Builds relationships." },
  { icon: Zap, title: "It Gets Smarter", desc: "One click and it analyzes top conversations to improve automatically." },
  { icon: Share2, title: "It Runs Campaigns", desc: "Outbound messages, follow-ups, comment-to-DM automation." },
];

const steps = [
  { num: "01", title: "Paste Their Website", desc: "Drop in your client's URL. The AI reads products, pricing, and builds a custom agent." },
  { num: "02", title: "Pick Their Channels", desc: "WhatsApp, Instagram, Messenger, web chat. Toggle on what they need." },
  { num: "03", title: "Turn It On", desc: "AI starts handling conversations immediately. Qualifying, booking, closing. 24/7." },
  { num: "04", title: "Watch Money Come In", desc: "Your AI agent sells around the clock. One-click optimization improves conversions." },
];

export default function LandingPage() {
  return (
    <div>
      {/* Hero */}
      <section className="bg-gradient-hero py-20 md:py-32">
        <div className="container mx-auto px-4 text-center">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="font-heading text-4xl font-bold leading-tight md:text-6xl lg:text-7xl"
          >
            AI So Good It Feels{" "}
            <span className="text-gradient-primary">ILLEGAL</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="mx-auto mt-6 max-w-2xl text-lg text-muted-foreground"
          >
            {APP_TAGLINE}
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mt-8"
          >
            <Link
              to="/pricing"
              className="inline-flex rounded-lg bg-gradient-primary px-8 py-3 text-base font-semibold text-primary-foreground shadow-glow transition-opacity hover:opacity-90"
            >
              Launch Your AI Sales Agent for Free
            </Link>
          </motion.div>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="mt-8 flex flex-wrap items-center justify-center gap-6 text-sm text-muted-foreground"
          >
            <div className="flex items-center gap-2">
              <Users className="h-4 w-4 text-primary" />
              <span>{STATS.brands} Brands</span>
            </div>
            <div className="flex items-center gap-2">
              <MessageSquare className="h-4 w-4 text-primary" />
              <span>{STATS.aiMessages} AI Messages</span>
            </div>
            <div className="flex items-center gap-2">
              <DollarSign className="h-4 w-4 text-primary" />
              <span>{STATS.aiSales} AI Sales</span>
            </div>
          </motion.div>
          <div className="mt-6 flex justify-center gap-1">
            {[1, 2, 3, 4, 5].map((i) => (
              <Star key={i} className="h-5 w-5 fill-warning text-warning" />
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <h2 className="text-center font-heading text-3xl font-bold md:text-4xl">
            Set Up a Client's AI Agent in <span className="text-gradient-primary">15 Minutes</span>
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-center text-muted-foreground">
            Pick a business. Paste their website. The AI does the rest.
          </p>
          <div className="mt-16 grid gap-8 md:grid-cols-2 lg:grid-cols-4">
            {steps.map((step) => (
              <div key={step.num} className="group rounded-xl border border-border bg-card p-6 transition-all hover:border-primary/30 hover:shadow-glow">
                <span className="font-heading text-3xl font-bold text-primary/30">{step.num}</span>
                <h3 className="mt-3 font-heading text-lg font-semibold">{step.title}</h3>
                <p className="mt-2 text-sm text-muted-foreground">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="border-t border-border bg-secondary/30 py-20">
        <div className="container mx-auto px-4">
          <p className="text-center text-sm font-medium uppercase tracking-wider text-primary">Features</p>
          <h2 className="mt-2 text-center font-heading text-3xl font-bold md:text-4xl">
            It's Not a Chatbot. It's a Sales Agent.
          </h2>
          <div className="mt-16 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {features.map((f) => (
              <div key={f.title} className="rounded-xl border border-border bg-card p-6 transition-all hover:border-primary/30">
                <f.icon className="h-8 w-8 text-primary" />
                <h3 className="mt-4 font-heading text-lg font-semibold">{f.title}</h3>
                <p className="mt-2 text-sm text-muted-foreground">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* The Math */}
      <section className="py-20">
        <div className="container mx-auto px-4 text-center">
          <h2 className="font-heading text-3xl font-bold md:text-4xl">The Math</h2>
          <div className="mx-auto mt-8 max-w-md rounded-xl border border-primary/30 bg-accent p-8">
            <p className="text-sm text-muted-foreground">Your cost</p>
            <p className="font-heading text-3xl font-bold">€497<span className="text-base font-normal text-muted-foreground">/month</span></p>
            <div className="my-4 h-px bg-border" />
            <p className="text-sm text-muted-foreground">Charge 10 clients €300/month each</p>
            <p className="font-heading text-3xl font-bold text-primary">€2,503+</p>
            <p className="text-sm text-muted-foreground">in pure profit</p>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-gradient-hero py-20">
        <div className="container mx-auto px-4 text-center">
          <h2 className="font-heading text-3xl font-bold md:text-4xl">
            Now Imagine <span className="text-gradient-primary">Selling</span> It.
          </h2>
          <Link
            to="/pricing"
            className="mt-8 inline-flex rounded-lg bg-gradient-primary px-8 py-3 text-base font-semibold text-primary-foreground shadow-glow transition-opacity hover:opacity-90"
          >
            Launch Your AI Sales Agent for Free
          </Link>
        </div>
      </section>
    </div>
  );
}
