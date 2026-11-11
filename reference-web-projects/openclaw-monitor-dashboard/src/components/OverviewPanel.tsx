import { mockOverviewStats } from "@/data/mockData";
import { Zap, MessageSquare, Coins, Flame, TrendingUp } from "lucide-react";

const stats = [
  { label: "Bugünkü Oturumlar", value: mockOverviewStats.todaySessions, icon: MessageSquare, color: "text-primary" },
  { label: "Bugünkü Tokenler", value: `${(mockOverviewStats.todayTokens / 1000).toFixed(1)}K`, icon: Zap, color: "text-accent" },
  { label: "Bugünkü Maliyet", value: `$${mockOverviewStats.todayCost.toFixed(2)}`, icon: Coins, color: "text-warning" },
  { label: "Aktif Seri", value: `${mockOverviewStats.activeStreak} gün`, icon: Flame, color: "text-destructive" },
];

const lifetime = [
  { label: "Toplam Oturum", value: mockOverviewStats.totalSessions.toLocaleString() },
  { label: "Toplam Token", value: `${(mockOverviewStats.totalTokens / 1_000_000).toFixed(1)}M` },
  { label: "Toplam Maliyet", value: `$${mockOverviewStats.totalCost.toFixed(2)}` },
];

const OverviewPanel = () => (
  <div className="space-y-6 animate-fade-in">
    <div className="flex items-center justify-between">
      <h2 className="text-lg font-semibold">Genel Bakış</h2>
      <div className="flex items-center gap-2 text-xs font-mono text-muted-foreground">
        <span className="w-2 h-2 rounded-full bg-success animate-pulse-glow" />
        Canlı
      </div>
    </div>

    {/* Today stats */}
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {stats.map((s) => (
        <div key={s.label} className="glass-card p-4 glow-primary">
          <div className="flex items-center gap-2 mb-3">
            <s.icon className={`w-4 h-4 ${s.color}`} />
            <span className="text-xs text-muted-foreground">{s.label}</span>
          </div>
          <p className="stat-value">{s.value}</p>
        </div>
      ))}
    </div>

    {/* Lifetime stats */}
    <div className="glass-card p-5">
      <div className="flex items-center gap-2 mb-4">
        <TrendingUp className="w-4 h-4 text-primary" />
        <h3 className="text-sm font-semibold">Ömür Boyu İstatistikler</h3>
      </div>
      <div className="grid grid-cols-3 gap-6">
        {lifetime.map((l) => (
          <div key={l.label}>
            <p className="text-xs text-muted-foreground mb-1">{l.label}</p>
            <p className="stat-value text-xl">{l.value}</p>
          </div>
        ))}
      </div>
    </div>
  </div>
);

export default OverviewPanel;
