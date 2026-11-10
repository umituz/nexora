import { PageHeader } from "@/components/dashboard/PageHeader";
import { mockTrials } from "@/data/mockData";
import { calculateConversionRate, formatPercent } from "@/utils/calculations";

export default function Funnel() {
  const total = mockTrials.length;
  const active = mockTrials.filter((t) => t.status === "active" || t.status === "converted").length;
  const smartCharged = mockTrials.filter((t) => t.smartChargeStatus === "captured").length;
  const converted = mockTrials.filter((t) => t.status === "converted").length;

  const stages = [
    { label: "Trial Started", count: total, rate: 100 },
    { label: "Active / Engaged", count: active, rate: calculateConversionRate(active, total) },
    { label: "Smart Charge Captured", count: smartCharged, rate: calculateConversionRate(smartCharged, total) },
    { label: "Converted to Paid", count: converted, rate: calculateConversionRate(converted, total) },
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      <PageHeader title="Conversion Funnel" description="Visualize the customer journey from trial to paid" />

      <div className="bg-card border border-border rounded-xl p-6">
        <div className="max-w-2xl mx-auto space-y-4">
          {stages.map((stage, i) => (
            <div key={stage.label} className="relative">
              <div
                className="rounded-xl p-5 transition-all"
                style={{
                  width: `${Math.max(stage.rate, 30)}%`,
                  background: `linear-gradient(135deg, hsl(162, 72%, ${45 - i * 5}%), hsl(190, 80%, ${50 - i * 5}%))`,
                  marginLeft: `${(100 - Math.max(stage.rate, 30)) / 2}%`,
                }}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-semibold text-primary-foreground">{stage.label}</p>
                    <p className="text-sm text-primary-foreground/80">{stage.count} users</p>
                  </div>
                  <p className="text-2xl font-bold text-primary-foreground">{formatPercent(stage.rate)}</p>
                </div>
              </div>
              {i < stages.length - 1 && (
                <div className="flex justify-center my-1">
                  <div className="w-0.5 h-4 bg-border" />
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
