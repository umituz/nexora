import { mockHeatmapData } from "@/data/mockData";

const days = ["Pzt", "Sal", "Çar", "Per", "Cum", "Cmt", "Paz"];
const intensityColors = [
  "bg-secondary",
  "bg-primary/20",
  "bg-primary/40",
  "bg-primary/60",
  "bg-primary/80",
  "bg-primary",
];

const ActivityHeatmap = () => {
  return (
    <div className="glass-card p-5">
      <h3 className="text-sm font-semibold mb-4">Aktivite Haritası</h3>
      <div className="space-y-1">
        {days.map((day, dayIndex) => (
          <div key={day} className="flex items-center gap-1">
            <span className="text-[10px] font-mono text-muted-foreground w-8">{day}</span>
            <div className="flex gap-[2px] flex-1">
              {Array.from({ length: 24 }).map((_, hour) => {
                const cell = mockHeatmapData.find((d) => d.day === dayIndex && d.hour === hour);
                const value = cell?.value ?? 0;
                return (
                  <div
                    key={hour}
                    className={`heatmap-cell flex-1 h-4 ${intensityColors[value]}`}
                    title={`${day} ${hour}:00 — seviye ${value}`}
                  />
                );
              })}
            </div>
          </div>
        ))}
      </div>
      <div className="flex items-center gap-2 mt-3 justify-end">
        <span className="text-[10px] text-muted-foreground">Az</span>
        {intensityColors.map((c, i) => (
          <div key={i} className={`w-3 h-3 rounded-sm ${c}`} />
        ))}
        <span className="text-[10px] text-muted-foreground">Çok</span>
      </div>
    </div>
  );
};

export default ActivityHeatmap;
