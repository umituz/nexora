import { Brain, FileText } from "lucide-react";

const memoryFiles = [
  { name: "MEMORY.md", size: "4.2 KB", modified: "10 dk önce", preview: "## Aktif Bağlam\n- Kullanıcı dashboard projesinde çalışıyor\n- Rate limiter tamamlandı\n- Auth modülü refaktör ediliyor..." },
  { name: "HEARTBEAT.md", size: "1.1 KB", modified: "5 dk önce", preview: "## Son Durum\n- Aktif oturum: sess_a1b2c3\n- Son görev: Unit test yazımı\n- Durum: Çalışıyor..." },
  { name: "2026-03-27.md", size: "8.7 KB", modified: "2 saat önce", preview: "## Günlük Notlar\n- 10:15 — Rate limiter middleware eklendi\n- 09:00 — Auth refaktör başlatıldı\n- 08:30 — Gemini oturumu tamamlandı..." },
];

const MemoryPanel = () => (
  <div className="space-y-6 animate-fade-in">
    <div className="flex items-center gap-2">
      <Brain className="w-5 h-5 text-primary" />
      <h2 className="text-lg font-semibold">Bellek Görüntüleyici</h2>
    </div>

    <div className="space-y-3">
      {memoryFiles.map((file) => (
        <div key={file.name} className="glass-card p-4">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <FileText className="w-4 h-4 text-primary" />
              <span className="text-sm font-mono font-medium">{file.name}</span>
            </div>
            <div className="flex items-center gap-3 text-[10px] text-muted-foreground">
              <span>{file.size}</span>
              <span>{file.modified}</span>
            </div>
          </div>
          <pre className="text-xs text-muted-foreground font-mono bg-secondary/50 rounded-lg p-3 overflow-x-auto whitespace-pre-wrap">
            {file.preview}
          </pre>
        </div>
      ))}
    </div>
  </div>
);

export default MemoryPanel;
