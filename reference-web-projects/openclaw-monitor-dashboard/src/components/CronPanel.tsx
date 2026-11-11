import { mockCronJobs } from "@/data/mockData";
import { Clock, Play, ToggleLeft, ToggleRight } from "lucide-react";

const CronPanel = () => {
  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center gap-2">
        <Clock className="w-5 h-5 text-primary" />
        <h2 className="text-lg font-semibold">Cron Görevleri</h2>
      </div>

      <div className="space-y-3">
        {mockCronJobs.map((job) => {
          const lastRun = new Date(job.lastRun).toLocaleTimeString("tr-TR", { hour: "2-digit", minute: "2-digit" });
          const nextRun = new Date(job.nextRun).toLocaleTimeString("tr-TR", { hour: "2-digit", minute: "2-digit" });

          return (
            <div key={job.id} className="glass-card p-4 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <button className="text-muted-foreground hover:text-primary transition-colors">
                  {job.enabled ? (
                    <ToggleRight className="w-6 h-6 text-success" />
                  ) : (
                    <ToggleLeft className="w-6 h-6" />
                  )}
                </button>
                <div>
                  <p className="text-sm font-medium">{job.name}</p>
                  <p className="text-[10px] font-mono text-muted-foreground">{job.schedule}</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="text-right">
                  <p className="text-[10px] text-muted-foreground">Son: {lastRun}</p>
                  <p className="text-[10px] text-muted-foreground">Sonraki: {nextRun}</p>
                </div>
                <button className="p-2 rounded-lg hover:bg-secondary transition-colors text-muted-foreground hover:text-primary">
                  <Play className="w-4 h-4" />
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default CronPanel;
