import { PageHeader } from "@/components/dashboard/PageHeader";
import { Lightbulb, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

const recommendations = [
  { id: 1, title: "Switch to 14-day trials", description: "Based on your experiment results, 14-day trials outperform 7-day trials by 38%.", priority: "critical", action: "Apply to all plans" },
  { id: 2, title: "Enable backup payment incentives", description: "Add a 10% discount for users who add a backup payment method during trial.", priority: "high", action: "Configure discount" },
  { id: 3, title: "Implement $1 smart charge", description: "Lower friction with $1 holds instead of full-price holds for higher signup rates.", priority: "high", action: "Update settings" },
  { id: 4, title: "Optimize mobile checkout", description: "Mobile users convert 23% less. Simplify the mobile checkout form.", priority: "medium", action: "Edit checkout" },
  { id: 5, title: "Add social proof to checkout", description: "Showing customer count and testimonials can increase conversion by 15%.", priority: "medium", action: "Customize page" },
  { id: 6, title: "Enable disputer blocking", description: "Block known serial disputers at signup to prevent chargebacks.", priority: "high", action: "Configure blocking" },
];

function getPriorityClasses(priority: string): string {
  if (priority === "critical") return "bg-destructive/10 text-destructive";
  if (priority === "high") return "bg-primary/10 text-primary";
  return "bg-muted text-muted-foreground";
}

export default function Recommendations() {
  return (
    <div className="space-y-6 animate-fade-in">
      <PageHeader title="Recommendations" description="Actionable suggestions to improve your conversion" />

      <div className="space-y-3">
        {recommendations.map((rec) => (
          <div key={rec.id} className="bg-card border border-border rounded-xl p-5 flex items-center gap-4 hover:border-primary/30 transition-colors">
            <div className={`p-2 rounded-lg ${getPriorityClasses(rec.priority)}`}>
              <Lightbulb className="h-5 w-5" />
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <h3 className="font-medium">{rec.title}</h3>
                <span className={`text-[10px] uppercase tracking-wider font-semibold px-1.5 py-0.5 rounded ${getPriorityClasses(rec.priority)}`}>
                  {rec.priority}
                </span>
              </div>
              <p className="text-sm text-muted-foreground">{rec.description}</p>
            </div>
            <Button variant="outline" size="sm">{rec.action} <ArrowRight className="h-3 w-3 ml-1" /></Button>
          </div>
        ))}
      </div>
    </div>
  );
}
