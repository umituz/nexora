import { useState, useEffect } from "react";
import { Settings, Shield, RefreshCw, Trash2, Server, Key, Check, X } from "lucide-react";
import { getMoltworkerConfig, saveMoltworkerConfig, isMoltworkerConfigured } from "@/lib/config";
import { useMoltworkerVersion } from "@/lib/hooks/useMoltworker";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

const SettingsPanel = () => {
  const [url, setUrl] = useState("");
  const [token, setToken] = useState("");
  const [cdpSecret, setCdpSecret] = useState("");
  const [testResult, setTestResult] = useState<"success" | "error" | null>(null);

  // Load config on mount
  useEffect(() => {
    const config = getMoltworkerConfig();
    setUrl(config.url);
    setToken(config.token);
    setCdpSecret(config.cdpSecret || "");
  }, []);

  // Query for version info to test connection
  const { data: version, isLoading: isTesting, refetch } = useMoltworkerVersion();

  const handleSave = () => {
    saveMoltworkerConfig({
      url: url.trim(),
      token: token.trim(),
      cdpSecret: cdpSecret.trim() || undefined,
    });
    toast.success("Moltworker ayarları kaydedildi");
    setTestResult(null);
  };

  const handleTestConnection = async () => {
    setTestResult(null);
    // Temporarily save to test
    saveMoltworkerConfig({
      url: url.trim(),
      token: token.trim(),
      cdpSecret: cdpSecret.trim() || undefined,
    });

    const result = await refetch();
    if (result.isSuccess) {
      setTestResult("success");
      toast.success("Bağlantı başarılı!");
    } else {
      setTestResult("error");
      toast.error("Bağlantı başarısız. Ayarları kontrol edin.");
    }
  };

  const isConfigured = isMoltworkerConfigured();

  return (
  <div className="space-y-6 animate-fade-in">
    <div className="flex items-center gap-2">
      <Settings className="w-5 h-5 text-primary" />
      <h2 className="text-lg font-semibold">Ayarlar</h2>
    </div>

    {/* Quick Actions */}
    <div className="glass-card p-5">
      <h3 className="text-sm font-semibold mb-4">Hızlı İşlemler</h3>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        {[
          { label: "OpenClaw Yeniden Başlat", icon: RefreshCw, desc: "Ajanı yeniden başlatır" },
          { label: "Dashboard Yeniden Başlat", icon: RefreshCw, desc: "Panel servisini yeniler" },
          { label: "Log Temizle", icon: Trash2, desc: "Eski logları temizler" },
        ].map((action) => (
          <button
            key={action.label}
            className="flex items-center gap-3 p-4 rounded-lg bg-secondary/50 border border-border hover:border-primary/50 hover:bg-secondary transition-all text-left"
          >
            <action.icon className="w-4 h-4 text-primary flex-shrink-0" />
            <div>
              <p className="text-sm font-medium">{action.label}</p>
              <p className="text-[10px] text-muted-foreground">{action.desc}</p>
            </div>
          </button>
        ))}
      </div>
    </div>

    {/* Moltworker Configuration */}
    <div className="glass-card p-5">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Server className="w-4 h-4 text-primary" />
          <h3 className="text-sm font-semibold">Moltworker Bağlantısı</h3>
        </div>
        {isConfigured && (
          <div className="flex items-center gap-1 text-xs text-success">
            <Check className="w-3 h-3" />
            Yapılandırıldı
          </div>
        )}
      </div>

      <div className="space-y-4">
        <div>
          <Label htmlFor="moltworker-url" className="text-xs">Worker URL</Label>
          <Input
            id="moltworker-url"
            type="url"
            placeholder="https://your-worker.workers.dev"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            className="font-mono text-xs mt-1.5"
          />
          <p className="text-[10px] text-muted-foreground mt-1">
            Cloudflare Workers URL'si (örn: https://moltbot-subdomain.workers.dev)
          </p>
        </div>

        <div>
          <Label htmlFor="moltworker-token" className="text-xs">Gateway Token</Label>
          <div className="relative mt-1.5">
            <Key className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              id="moltworker-token"
              type="password"
              placeholder="MOLTBOT_GATEWAY_TOKEN"
              value={token}
              onChange={(e) => setToken(e.target.value)}
              className="font-mono text-xs pl-9"
            />
          </div>
          <p className="text-[10px] text-muted-foreground mt-1">
            Gateway token (OpenSSL ile oluşturulan rastgele token)
          </p>
        </div>

        <div>
          <Label htmlFor="moltworker-cdp" className="text-xs">CDP Secret (Opsiyonel)</Label>
          <div className="relative mt-1.5">
            <Shield className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              id="moltworker-cdp"
              type="password"
              placeholder="CDP_SECRET için debug endpoint'lere erişim"
              value={cdpSecret}
              onChange={(e) => setCdpSecret(e.target.value)}
              className="font-mono text-xs pl-9"
            />
          </div>
          <p className="text-[10px] text-muted-foreground mt-1">
            Debug endpoint'lere erişim için gerekli (opsiyonel)
          </p>
        </div>

        <div className="flex gap-2 pt-2">
          <Button onClick={handleSave} size="sm" className="flex-1">
            Kaydet
          </Button>
          <Button
            onClick={handleTestConnection}
            variant="outline"
            size="sm"
            disabled={!url || !token || isTesting}
            className="flex-1"
          >
            {isTesting ? "Test Ediliyor..." : "Bağlantıyı Test Et"}
          </Button>
        </div>

        {testResult === "success" && version && (
          <div className="flex items-center gap-2 p-3 rounded-lg bg-success/10 border border-success/20">
            <Check className="w-4 h-4 text-success" />
            <div className="flex-1">
              <p className="text-xs font-medium text-success">Bağlantı Başarılı</p>
              <p className="text-[10px] text-muted-foreground">
                OpenClaw {version.openclaw} • Moltbot {version.moltbot}
              </p>
            </div>
          </div>
        )}

        {testResult === "error" && (
          <div className="flex items-center gap-2 p-3 rounded-lg bg-destructive/10 border border-destructive/20">
            <X className="w-4 h-4 text-destructive" />
            <p className="text-xs text-destructive">Bağlantı başarısız. URL ve token'ı kontrol edin.</p>
          </div>
        )}
      </div>
    </div>

    {/* Environment */}
    <div className="glass-card p-5">
      <div className="flex items-center gap-2 mb-4">
        <Shield className="w-4 h-4 text-primary" />
        <h3 className="text-sm font-semibold">Ortam Bilgileri</h3>
      </div>
      <div className="space-y-2 font-mono text-xs">
        {[
          { key: "DASHBOARD_PORT", value: "7000" },
          { key: "WORKSPACE_DIR", value: "/home/user/.openclaw/workspace" },
          { key: "OPENCLAW_AGENT", value: "main" },
          { key: "Node.js", value: "v20.11.0" },
          { key: "Uptime", value: "3 gün, 14 saat" },
        ].map((env) => (
          <div key={env.key} className="flex justify-between py-1.5 border-b border-border/30">
            <span className="text-muted-foreground">{env.key}</span>
            <span className="text-foreground">{env.value}</span>
          </div>
        ))}
      </div>
    </div>
  </div>
  );
};

export default SettingsPanel;
