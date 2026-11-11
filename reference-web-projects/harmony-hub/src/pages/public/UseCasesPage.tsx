import { Link } from "react-router-dom";
import { Scissors, ShoppingBag, Home, Monitor, GraduationCap, Megaphone, Users } from "lucide-react";

const useCases = [
  { icon: Scissors, title: "High-Ticket Service Providers", desc: "Hair clinics, dental practices, cosmetic surgery — close $10K-$50K+ deals on autopilot.", example: "FueGenix went from $5M to $10M in one year with our AI agent.", link: "/use-cases/high-ticket" },
  { icon: ShoppingBag, title: "E-commerce Brands", desc: "Answer product questions, handle objections, upsell, and close sales in DMs 24/7.", example: "Convert browsing visitors into paying customers with personalized conversations.", link: "/use-cases/ecommerce" },
  { icon: Home, title: "Real Estate Professionals", desc: "Qualify leads, schedule viewings, and follow up automatically with interested buyers.", example: "Never miss a lead again. Your AI qualifies and books viewings while you sleep.", link: "/use-cases/real-estate" },
  { icon: Monitor, title: "SaaS Companies", desc: "Handle demo requests, answer feature questions, and convert trials to paid users.", example: "Reduce churn and increase conversions with proactive AI engagement.", link: "/use-cases/saas" },
  { icon: GraduationCap, title: "Educational Institutions", desc: "Guide prospects through course selection, handle enrollment questions, and close registrations.", example: "Web Academie uses DM Champ for sales and student support.", link: "/use-cases/education" },
  { icon: Megaphone, title: "Agencies & Marketing Firms", desc: "White-label AI agents for all your clients. Charge monthly, keep 100% of the profit.", example: "Most agencies see ROI with their first two clients.", link: "/use-cases/agencies" },
  { icon: Users, title: "Social Media Brands & Influencers", desc: "Monetize your audience with AI-powered DM sales. Comment-to-DM automation included.", example: "Turn followers into customers without hiring a sales team.", link: "/use-cases/influencers" },
];

export default function UseCasesPage() {
  return (
    <div className="py-20">
      <div className="container mx-auto px-4">
        <p className="text-center text-sm font-medium uppercase tracking-wider text-primary">Use Cases</p>
        <h1 className="mt-2 text-center font-heading text-3xl font-bold md:text-5xl">
          Built for Every Business
        </h1>
        <div className="mt-16 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {useCases.map((uc) => (
            <div key={uc.title} className="flex flex-col rounded-xl border border-border bg-card p-6 transition-all hover:border-primary/30">
              <uc.icon className="h-8 w-8 text-primary" />
              <h3 className="mt-4 font-heading text-lg font-semibold">{uc.title}</h3>
              <p className="mt-2 flex-1 text-sm text-muted-foreground">{uc.desc}</p>
              <p className="mt-3 text-xs italic text-primary">{uc.example}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
