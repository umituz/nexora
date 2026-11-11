import { useState } from "react";
import { useMoltworkerProcesses } from "@/lib/hooks/useMoltworker";
import { Search, Filter, Loader2, Activity } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";

const statusColors: Record<string, string> = {
  active: "bg-success/20 text-success",
  completed: "bg-primary/20 text-primary",
  error: "bg-destructive/20 text-destructive",
};

const statusLabels: Record<string, string> = {
  active: "Aktif",
  completed: "Tamamlandı",
  error: "Hata",
};

const processStatusColors: Record<string, string> = {
  running: "bg-success/20 text-success",
  stopped: "bg-muted/20 text-muted-foreground",
  error: "bg-destructive/20 text-destructive",
};

const processStatusLabels: Record<string, string> = {
  running: "Çalışıyor",
  stopped: "Durduruldu",
  error: "Hata",
};

const formatUptime = (seconds: number) => {
  if (seconds < 60) return `${seconds}s`;
  if (seconds < 3600) return `${Math.floor(seconds / 60)}m`;
  if (seconds < 86400) return `${Math.floor(seconds / 3600)}h`;
  return `${Math.floor(seconds / 86400)}d`;
};

const SessionsPanel = () => {
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<string>("all");
  const { data: processes, isLoading, error, isError } = useMoltworkerProcesses();

  const filtered = (processes || []).filter((p) => {
    const matchSearch = p.id.includes(search) || p.name.toLowerCase().includes(search.toLowerCase());
    const matchFilter = filter === "all" || p.status === filter;
    return matchSearch && matchFilter;
  });

  if (isLoading) {
    return (
      <div className="space-y-6 animate-fade-in">
        <h2 className="text-lg font-semibold">Süreçler</h2>
        <div className="flex items-center justify-center py-12">
          <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="space-y-6 animate-fade-in">
        <h2 className="text-lg font-semibold">Süreçler</h2>
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            {error?.message || 'Süreç bilgileri alınamadı.'}
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold">Süreçler</h2>
        <div className="flex items-center gap-2 text-xs text-muted-foreground font-mono">
          <Activity className="w-3 h-3" />
          {processes?.length || 0} süreç
        </div>
      </div>

      {/* Search & Filter */}
      <div className="flex gap-3">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Süreç ara..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-2 bg-secondary border border-border rounded-lg text-sm font-mono focus:outline-none focus:ring-1 focus:ring-primary placeholder:text-muted-foreground"
          />
        </div>
        <div className="flex items-center gap-1 bg-secondary rounded-lg border border-border p-1">
          <Filter className="w-4 h-4 text-muted-foreground mx-2" />
          {["all", "running", "stopped", "error"].map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-3 py-1 text-xs font-medium rounded-md transition-colors ${
                filter === f ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {f === "all" ? "Tümü" : processStatusLabels[f]}
            </button>
          ))}
        </div>
      </div>

      {/* Processes Table */}
      {filtered.length === 0 ? (
        <div className="glass-card p-12 text-center text-muted-foreground">
          <Activity className="w-8 h-8 mx-auto mb-2 opacity-50" />
          <p>Süreç bulunamadı</p>
        </div>
      ) : (
        <div className="glass-card overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border text-muted-foreground text-xs">
                <th className="text-left px-4 py-3 font-medium">Süreç ID</th>
                <th className="text-left px-4 py-3 font-medium">İsim</th>
                <th className="text-left px-4 py-3 font-medium">Durum</th>
                <th className="text-right px-4 py-3 font-medium">CPU</th>
                <th className="text-right px-4 py-3 font-medium">Bellek</th>
                <th className="text-right px-4 py-3 font-medium">Uptime</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((p) => (
                <tr key={p.id} className="border-b border-border/50 hover:bg-secondary/50 transition-colors">
                  <td className="px-4 py-3 font-mono text-xs text-primary">{p.id}</td>
                  <td className="px-4 py-3 text-xs">{p.name}</td>
                  <td className="px-4 py-3">
                    <span className={`inline-flex px-2 py-0.5 rounded-full text-[10px] font-semibold ${processStatusColors[p.status]}`}>
                      {processStatusLabels[p.status]}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right font-mono text-xs">{p.cpu ? `${p.cpu.toFixed(1)}%` : '-'}</td>
                  <td className="px-4 py-3 text-right font-mono text-xs">{p.memory ? `${(p.memory / 1024).toFixed(1)}MB` : '-'}</td>
                  <td className="px-4 py-3 text-right font-mono text-xs">{p.uptime ? formatUptime(p.uptime) : '-'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default SessionsPanel;
