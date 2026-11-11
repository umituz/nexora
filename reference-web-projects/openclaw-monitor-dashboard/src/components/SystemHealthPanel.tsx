import { useMoltworkerHealth } from "@/lib/hooks/useMoltworker";
import { Cpu, MemoryStick, HardDrive, Activity } from "lucide-react";
import { Area, AreaChart, ResponsiveContainer } from "recharts";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle, Loader2 } from "lucide-react";

interface HealthCardProps {
  label: string;
  value: number;
  unit: string;
  subtitle?: string;
  icon: React.ElementType;
  color: string;
  history: number[];
  fillColor: string;
}

const HealthCard = ({ label, value, unit, subtitle, icon: Icon, color, history, fillColor }: HealthCardProps) => {
  const chartData = history.map((v, i) => ({ i, v }));
  const getStatusColor = () => {
    if (value > 80) return "text-destructive";
    if (value > 60) return "text-warning";
    return "text-success";
  };

  return (
    <div className="glass-card p-4 relative overflow-hidden">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <Icon className={`w-4 h-4 ${color}`} />
          <span className="text-xs font-medium text-muted-foreground">{label}</span>
        </div>
        <span className={`text-xs font-mono font-bold ${getStatusColor()}`}>
          {value}{unit}
        </span>
      </div>
      {subtitle && <p className="text-[10px] text-muted-foreground mb-2 font-mono">{subtitle}</p>}
      <div className="h-16 -mx-1">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={chartData}>
            <defs>
              <linearGradient id={`grad-${label}`} x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={fillColor} stopOpacity={0.3} />
                <stop offset="100%" stopColor={fillColor} stopOpacity={0} />
              </linearGradient>
            </defs>
            <Area
              type="monotone"
              dataKey="v"
              stroke={fillColor}
              strokeWidth={1.5}
              fill={`url(#grad-${label})`}
              dot={false}
              isAnimationActive={true}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

const SystemHealthPanel = () => {
  const { data: health, isLoading, error, isError } = useMoltworkerHealth();

  // Generate mock history data (in production, this would come from the API)
  const generateHistory = (currentValue: number) => {
    const history = [];
    for (let i = 0; i < 20; i++) {
      const variation = (Math.random() - 0.5) * 10;
      history.push(Math.max(0, Math.min(100, currentValue + variation)));
    }
    return history;
  };

  if (isLoading) {
    return (
      <div className="space-y-6 animate-fade-in">
        <h2 className="text-lg font-semibold">Sistem Sağlığı</h2>
        <div className="flex items-center justify-center py-12">
          <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
        </div>
      </div>
    );
  }

  if (isError || !health) {
    return (
      <div className="space-y-6 animate-fade-in">
        <h2 className="text-lg font-semibold">Sistem Sağlığı</h2>
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            {error?.message || 'Moltworker bağlantı hatası. Lütfen ayarları kontrol edin.'}
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  const cpuPercent = Math.round(health.cpu);
  const ramPercent = Math.round(health.memory.percent);
  const diskPercent = Math.round(health.disk.percent);
  const ramGB = (health.memory.used / 1024).toFixed(1);
  const ramTotalGB = (health.memory.total / 1024).toFixed(1);
  const diskGB = (health.disk.used / 1024).toFixed(0);
  const diskTotalGB = (health.disk.total / 1024).toFixed(0);

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold">Sistem Sağlığı</h2>
        <div className="flex items-center gap-2 text-xs text-muted-foreground font-mono">
          <Activity className="w-3 h-3" />
          Uptime: {Math.floor(health.uptime / 3600)}h
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <HealthCard
          label="CPU"
          value={cpuPercent}
          unit="%"
          icon={Cpu}
          color="text-primary"
          history={generateHistory(cpuPercent)}
          fillColor="hsl(175, 80%, 50%)"
        />
        <HealthCard
          label="RAM"
          value={ramPercent}
          unit="%"
          subtitle={`${ramGB}GB / ${ramTotalGB}GB`}
          icon={MemoryStick}
          color="text-info"
          history={generateHistory(ramPercent)}
          fillColor="hsl(210, 80%, 55%)"
        />
        <HealthCard
          label="Disk"
          value={diskPercent}
          unit="%"
          subtitle={`${diskGB}GB / ${diskTotalGB}GB`}
          icon={HardDrive}
          color="text-warning"
          history={generateHistory(diskPercent)}
          fillColor="hsl(38, 92%, 55%)"
        />
        <HealthCard
          label="Uptime"
          value={Math.floor(health.uptime / 60)}
          unit="min"
          subtitle={`${Math.floor(health.uptime / 3600)}s ${Math.floor((health.uptime % 3600) / 60)}d`}
          icon={Activity}
          color="text-success"
          history={generateHistory(Math.min(100, health.uptime / 60))}
          fillColor="hsl(142, 76%, 36%)"
        />
      </div>
    </div>
  );
};

export default SystemHealthPanel;
