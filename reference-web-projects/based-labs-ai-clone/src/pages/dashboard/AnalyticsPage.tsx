import { MOCK_USER } from "@/data/mock-data";
import { BarChart3, Image, Video, TrendingUp } from "lucide-react";

export default function AnalyticsPage() {
  const stats = [
    { label: "Total Generations", value: "847", icon: BarChart3, change: "+12%" },
    { label: "Images Created", value: "623", icon: Image, change: "+8%" },
    { label: "Videos Created", value: "224", icon: Video, change: "+18%" },
    { label: "Total Views", value: "12.4K", icon: TrendingUp, change: "+25%" },
  ];

  return (
    <div>
      <h1 className="font-display text-2xl font-bold">Analytics</h1>
      <p className="text-sm text-muted-foreground mt-1">Track your creation metrics</p>
      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <div key={stat.label} className="rounded-xl border border-border bg-card p-5">
            <div className="flex items-center justify-between">
              <stat.icon className="h-5 w-5 text-muted-foreground" />
              <span className="text-xs font-medium text-success">{stat.change}</span>
            </div>
            <p className="mt-3 font-display text-2xl font-bold text-foreground">{stat.value}</p>
            <p className="text-sm text-muted-foreground">{stat.label}</p>
          </div>
        ))}
      </div>
      <div className="mt-8 rounded-xl border border-border bg-card p-6 min-h-[300px] flex items-center justify-center">
        <p className="text-muted-foreground text-sm">Charts and detailed analytics will be available with backend integration</p>
      </div>
    </div>
  );
}
