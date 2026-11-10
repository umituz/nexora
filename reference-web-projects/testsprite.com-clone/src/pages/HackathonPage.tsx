import { APP_NAME } from "@/constants/app";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Calendar, Trophy, Users, Zap } from "lucide-react";

export default function HackathonPage() {
  return (
    <div>
      <section className="section-padding grid-bg">
        <div className="container-wide text-center">
          <span className="text-primary font-heading text-sm font-medium">Community Event</span>
          <h1 className="text-4xl md:text-5xl font-heading font-bold mt-2 mb-4">
            {APP_NAME} Hackathon
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-8">
            Build, test, and ship with AI. Compete with developers worldwide and win amazing prizes.
          </p>
          <Button size="lg" className="gradient-primary text-primary-foreground">Register Now</Button>
        </div>
      </section>

      <section className="section-padding">
        <div className="container-wide grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            { icon: Calendar, title: "March 15-17, 2026", desc: "48-hour virtual hackathon" },
            { icon: Trophy, title: "$50,000 in Prizes", desc: "Cash, credits, and swag" },
            { icon: Users, title: "500+ Participants", desc: "Developers from 40+ countries" },
            { icon: Zap, title: "AI-Powered", desc: "Build with TestSprite's AI testing" },
          ].map((item) => (
            <div key={item.title} className="glass-card p-6 text-center">
              <item.icon size={32} className="text-primary mx-auto mb-3" />
              <h3 className="font-heading font-semibold text-sm">{item.title}</h3>
              <p className="text-xs text-muted-foreground mt-1">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="section-padding bg-accent/30">
        <div className="container-narrow text-center">
          <h2 className="text-2xl font-heading font-bold mb-4">How It Works</h2>
          <div className="grid md:grid-cols-3 gap-8 mt-8">
            <div><div className="text-gradient text-3xl font-heading font-bold mb-2">01</div><h3 className="font-heading font-semibold text-sm mb-1">Register</h3><p className="text-xs text-muted-foreground">Sign up and form your team</p></div>
            <div><div className="text-gradient text-3xl font-heading font-bold mb-2">02</div><h3 className="font-heading font-semibold text-sm mb-1">Build</h3><p className="text-xs text-muted-foreground">48 hours to build your project</p></div>
            <div><div className="text-gradient text-3xl font-heading font-bold mb-2">03</div><h3 className="font-heading font-semibold text-sm mb-1">Submit</h3><p className="text-xs text-muted-foreground">Demo and win prizes</p></div>
          </div>
        </div>
      </section>
    </div>
  );
}
