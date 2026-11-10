import { mockIntegrations } from "@/lib/mock-data";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

export default function IntegrationsPage() {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {mockIntegrations.map((int) => (
        <Card key={int.id}>
          <CardHeader>
            <div className="flex items-center gap-2">
              <span className="text-2xl">{int.icon}</span>
              <div>
                <CardTitle className="text-base">{int.name}</CardTitle>
                <Badge variant="outline" className="text-xs">{int.category}</Badge>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-3">{int.description}</p>
            <Button
              variant={int.status === "connected" ? "outline" : "default"}
              size="sm"
              className="w-full"
              onClick={() => toast.success(`${int.status === "connected" ? "Disconnected" : "Connected"} ${int.name} — mock`)}
            >
              {int.status === "connected" ? "Disconnect" : "Connect"}
            </Button>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
