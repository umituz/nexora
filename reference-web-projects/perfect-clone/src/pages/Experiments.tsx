import { PageHeader } from "@/components/dashboard/PageHeader";
import { StatusBadge } from "@/components/dashboard/StatusBadge";
import { mockExperiments } from "@/data/mockData";
import { formatPercent } from "@/utils/calculations";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

export default function Experiments() {
  return (
    <div className="space-y-6 animate-fade-in">
      <PageHeader
        title="Experiments"
        description="A/B tests and optimization experiments"
        actions={<Button size="sm" className="gradient-bg"><Plus className="h-4 w-4 mr-1" />New Experiment</Button>}
      />

      <div className="space-y-4">
        {mockExperiments.map((exp) => (
          <div key={exp.id} className="bg-card border border-border rounded-xl p-5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-semibold">{exp.name}</h3>
                  <StatusBadge status={exp.status} />
                </div>
                <p className="text-sm text-muted-foreground mt-0.5">{exp.description}</p>
              </div>
              <div className="text-right">
                <p className="text-sm text-muted-foreground">Confidence: <span className="font-semibold text-foreground">{exp.confidence}%</span></p>
                {exp.winner && <p className="text-xs text-primary">Winner declared</p>}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {exp.variants.map((v) => (
                <div
                  key={v.id}
                  className={`p-4 rounded-lg border ${exp.winner === v.id ? "border-primary bg-primary/5" : "border-border"}`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <p className="text-sm font-medium">{v.name}</p>
                    {exp.winner === v.id && <span className="text-xs text-primary font-medium">Winner</span>}
                  </div>
                  <p className="text-2xl font-bold">{formatPercent(v.conversionRate)}</p>
                  <p className="text-xs text-muted-foreground">{v.conversions} / {v.visitors} visitors</p>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
