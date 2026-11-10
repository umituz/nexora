import { APP_NAME, FEATURES } from "@/constants/app";
import { Check } from "lucide-react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

export default function FeaturesPage() {
  return (
    <div className="py-20">
      <div className="container">
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">All-in-one APM</h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            {APP_NAME} provides everything you need to monitor your application's health, performance, and reliability.
          </p>
        </div>

        <div className="space-y-20">
          {FEATURES.map((feature, i) => (
            <motion.div
              key={feature.id}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className={`flex flex-col ${i % 2 === 0 ? "md:flex-row" : "md:flex-row-reverse"} gap-8 items-center`}
            >
              <div className="flex-1">
                <h2 className="text-2xl md:text-3xl font-bold mb-3">{feature.title}</h2>
                <p className="text-muted-foreground mb-6">{feature.description}</p>
                <ul className="space-y-3 mb-6">
                  {feature.bullets.map((b) => (
                    <li key={b} className="flex items-start gap-2 text-sm">
                      <Check className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                      <span className="text-muted-foreground">{b}</span>
                    </li>
                  ))}
                </ul>
                <Button variant="outline" asChild>
                  <Link to={`/dashboard/${feature.id === "checkins" ? "check-ins" : feature.id}`}>
                    Explore {feature.title} →
                  </Link>
                </Button>
              </div>
              <div className="flex-1 rounded-xl border border-border bg-card p-8 min-h-[200px] flex items-center justify-center">
                <p className="text-muted-foreground text-center text-sm">
                  Interactive {feature.title} preview
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
