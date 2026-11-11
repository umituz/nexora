import { useMoltworkerWebSocket, WebSocketMessage } from "@/lib/hooks/useMoltworker";
import { Terminal, AlertTriangle, Bot, Radio, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";

const typeConfig: Record<string, { icon: React.ElementType; borderColor: string; labelColor: string }> = {
  agent: { icon: Bot, borderColor: "border-l-primary", labelColor: "text-primary" },
  system: { icon: Radio, borderColor: "border-l-info", labelColor: "text-info" },
  warning: { icon: AlertTriangle, borderColor: "border-l-warning", labelColor: "text-warning" },
};

const LiveFeedPanel = () => {
  const { messages, isConnected, error, clearMessages } = useMoltworkerWebSocket();

  // Display messages in reverse order (newest first)
  const displayMessages = [...messages].reverse();

  if (error && !isConnected) {
    return (
      <div className="space-y-6 animate-fade-in">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Terminal className="w-5 h-5 text-primary" />
            <h2 className="text-lg font-semibold">Canlı Akış</h2>
          </div>
        </div>
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            WebSocket bağlantı hatası: {error}
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Terminal className="w-5 h-5 text-primary" />
          <h2 className="text-lg font-semibold">Canlı Akış</h2>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 text-xs text-muted-foreground font-mono">
            {isConnected ? (
              <>
                <span className="w-2 h-2 rounded-full bg-success animate-pulse-glow" />
                Bağlı
              </>
            ) : (
              <>
                <Loader2 className="w-3 h-3 animate-spin" />
                Bağlanıyor...
              </>
            )}
          </div>
          {messages.length > 0 && (
            <Button variant="ghost" size="sm" onClick={clearMessages} className="h-7 text-xs">
              Temizle
            </Button>
          )}
        </div>
      </div>

      {displayMessages.length === 0 ? (
        <div className="flex items-center justify-center py-12 text-muted-foreground">
          <div className="text-center">
            <Radio className="w-8 h-8 mx-auto mb-2 opacity-50" />
            <p className="text-sm">
              {isConnected ? 'Mesaj bekleniyor...' : 'Bağlantı kuruluyor...'}
            </p>
          </div>
        </div>
      ) : (
        <div className="space-y-2">
          {displayMessages.map((msg, i) => {
            const config = typeConfig[msg.type] || typeConfig.system;
            const Icon = config.icon;
            const time = new Date(msg.timestamp).toLocaleTimeString("tr-TR", {
              hour: "2-digit",
              minute: "2-digit",
              second: "2-digit",
            });

            return (
              <div
                key={`${msg.timestamp}-${i}`}
                className={`glass-card p-3 border-l-2 ${config.borderColor} animate-fade-in`}
              >
                <div className="flex items-start gap-3">
                  <Icon className={`w-4 h-4 mt-0.5 ${config.labelColor} flex-shrink-0`} />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm break-words">{msg.content}</p>
                    <div className="flex items-center gap-3 mt-1.5">
                      <span className="text-[10px] font-mono text-muted-foreground">{time}</span>
                      {msg.session && (
                        <span className="text-[10px] font-mono text-primary/70">{msg.session}</span>
                      )}
                      {msg.processId && (
                        <span className="text-[10px] font-mono text-muted-foreground/70">{msg.processId}</span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default LiveFeedPanel;
