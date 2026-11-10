import { PageHeader } from "@/components/dashboard/PageHeader";
import { Brain, TrendingUp, AlertTriangle, Lightbulb } from "lucide-react";
import { StatCard } from "@/components/dashboard/StatCard";

const insights = [
  { id: 1, title: "Increase trial length to 14 days", description: "Data shows 14-day trials convert 38% better than 7-day trials. Consider adjusting your default trial period.", impact: "high", category: "Trial Optimization", metric: "+38% conversion" },
  { id: 2, title: "Add backup payment method incentive", description: "Customers with backup payment methods have 95% lower involuntary churn. Offer a 10% discount for adding one.", impact: "high", category: "Churn Prevention", metric: "-95% involuntary churn" },
  { id: 3, title: "Optimize checkout for mobile", description: "Mobile conversion rate is 23% lower than desktop. Simplifying the mobile checkout flow could recover significant revenue.", impact: "medium", category: "Checkout", metric: "+23% mobile conversion" },
  { id: 4, title: "Smart charge at $1 vs full price", description: "A/B test shows $1 holds have 18% higher signup rate with similar conversion. Consider switching to minimal holds.", impact: "medium", category: "Smart Charge", metric: "+18% signups" },
  { id: 5, title: "Re-engage churned users", description: "34% of churned users return when offered a personalized discount within 30 days. Set up an automated win-back campaign.", impact: "medium", category: "Re-engagement", metric: "34% win-back rate" },
  { id: 6, title: "Peak conversion time targeting", description: "Users who sign up between 10am-2pm have 28% higher conversion rates. Focus ad spend during these hours.", impact: "low", category: "Timing", metric: "+28% conversion" },
];

export default function AIInsights() {
  return (
    <div className="space-y-6 animate-fade-in">
      <PageHeader title="AI Insights" description="AI-powered recommendations to boost your conversion" />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="Active Insights" value={insights.length} icon={<Brain className="h-5 w-5" />} />
        <StatCard title="High Impact" value={insights.filter((i) => i.impact === "high").length} icon={<TrendingUp className="h-5 w-5" />} />
        <StatCard title="Potential Uplift" value="+47%" icon={<Lightbulb className="h-5 w-5" />} />
        <StatCard title="Risks Identified" value={2} icon={<AlertTriangle className="h-5 w-5" />} />
      </div>

      <div className="space-y-4">
        {insights.map((insight) => (
          <div key={insight.id} className="bg-card border border-border rounded-xl p-5 hover:border-primary/30 transition-colors">
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <span className={`inline-block w-2 h-2 rounded-full ${insight.impact === "high" ? "bg-primary" : insight.impact === "medium" ? "bg-accent" : "bg-muted-foreground"}`} />
                  <span className="text-xs text-muted-foreground uppercase tracking-wider">{insight.category}</span>
                </div>
                <h3 className="font-semibold mb-1">{insight.title}</h3>
                <p className="text-sm text-muted-foreground">{insight.description}</p>
              </div>
              <div className="text-right shrink-0">
                <p className="text-lg font-bold text-primary">{insight.metric}</p>
                <p className="text-xs text-muted-foreground capitalize">{insight.impact} impact</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
