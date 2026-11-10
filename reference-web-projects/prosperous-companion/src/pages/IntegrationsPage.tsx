import { useData } from "@/contexts/DataContext";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Plug, RefreshCw } from "lucide-react";
import { formatDate } from "@/lib/calculations";

const iconColors: Record<string, string> = {
  hubspot: "bg-warning/10 text-warning",
  salesforce: "bg-info/10 text-info",
  zapier: "bg-warning/10 text-warning",
  sheets: "bg-success/10 text-success",
  gmail: "bg-destructive/10 text-destructive",
  csv: "bg-primary/10 text-primary",
};

export default function IntegrationsPage() {
  const { integrations, setIntegrations } = useData();

  const toggleConnection = (id: string) => {
    setIntegrations((prev) =>
      prev.map((i) =>
        i.id === id
          ? { ...i, status: i.status === "connected" ? "disconnected" : "connected", lastSyncAt: i.status === "disconnected" ? new Date().toISOString() : i.lastSyncAt }
          : i
      )
    );
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold">Integrations</h1>
        <p className="text-muted-foreground">Connect your favorite tools</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {integrations.map((i) => (
          <Card key={i.id}>
            <CardContent className="p-5">
              <div className="flex items-start gap-3 mb-3">
                <div className={`rounded-lg p-2.5 ${iconColors[i.icon] || "bg-secondary text-muted-foreground"}`}>
                  <Plug className="h-5 w-5" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <h3 className="font-semibold">{i.name}</h3>
                    <Badge className={`border-0 text-xs ${i.status === "connected" ? "bg-success/10 text-success" : "bg-secondary text-muted-foreground"}`}>
                      {i.status}
                    </Badge>
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">{i.description}</p>
                </div>
              </div>
              {i.lastSyncAt && <p className="text-xs text-muted-foreground mb-3">Last synced: {formatDate(i.lastSyncAt)}</p>}
              <Button variant={i.status === "connected" ? "outline" : "default"} size="sm" className="w-full" onClick={() => toggleConnection(i.id)}>
                {i.status === "connected" ? <><RefreshCw className="mr-2 h-3 w-3" /> Disconnect</> : "Connect"}
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}