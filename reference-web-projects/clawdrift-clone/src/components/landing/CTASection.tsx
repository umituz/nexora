import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

export function CTASection() {
  return (
    <section className="border-t bg-muted/30 py-20 text-center">
      <h2 className="text-3xl font-bold md:text-4xl">Start Deploying Now</h2>
      <p className="mx-auto mt-4 max-w-lg text-muted-foreground">
        Pick a model, choose a channel, and have your AI assistant running in under a minute.
      </p>
      <Button size="lg" className="mt-8 px-8" asChild>
        <Link to="/register">
          Get Started <ArrowRight className="ml-2 h-4 w-4" />
        </Link>
      </Button>
    </section>
  );
}
