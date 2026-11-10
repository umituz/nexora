import { MOCK_INTEGRATIONS } from "@/lib/mock-data";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Cloud, Circle, Zap, Calendar, CreditCard, Hash, Globe, Sheet } from "lucide-react";
import { toast } from "sonner";

const ICONS: Record<string, React.ElementType> = { Cloud, Circle, Zap, Calendar, CreditCard, Hash, Globe, Sheet };

export default function IntegrationsPage() {
  return (
    <div className="space-y-6 animate-fade-in">
      <div><h1 className="text-2xl font-heading font-bold text-foreground">Integrations</h1><p className="text-sm text-muted-foreground">Connect with your favorite tools</p></div>
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {MOCK_INTEGRATIONS.map((int) => {
          const Icon = ICONS[int.icon] || Globe;
          return (
            <Card key={int.id}><CardContent className="p-5">
              <div className="flex items-start justify-between mb-3">
                <div className="w-10 h-10 rounded-lg bg-secondary flex items-center justify-center"><Icon className="w-5 h-5 text-foreground" /></div>
                {int.connected && <span className="px-2 py-0.5 rounded-full text-xs bg-success/10 text-success">Connected</span>}
              </div>
              <h3 className="font-semibold text-foreground mb-1">{int.name}</h3>
              <p className="text-xs text-muted-foreground mb-3">{int.description}</p>
              <Button variant={int.connected ? "outline" : "default"} size="sm" className="w-full" onClick={() => toast.success(int.connected ? "Disconnected" : "Connected!")}>
                {int.connected ? "Disconnect" : "Connect"}
              </Button>
            </CardContent></Card>
          );
        })}
      </div>
    </div>
  );
}
