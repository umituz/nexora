import { MOCK_DRIP_CAMPAIGNS } from "@/lib/mock-data";
import { formatNumber } from "@/lib/calculations";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { toast } from "sonner";

export default function DripCampaignsPage() {
  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div><h1 className="text-2xl font-heading font-bold text-foreground">Drip Campaigns</h1><p className="text-sm text-muted-foreground">Automated message sequences</p></div>
        <Button className="gap-2" onClick={() => toast.info("Drip campaign builder coming soon")}><Plus className="w-4 h-4" />New Drip</Button>
      </div>
      <div className="space-y-3">
        {MOCK_DRIP_CAMPAIGNS.map((d) => (
          <Card key={d.id}><CardContent className="p-5">
            <div className="flex items-center justify-between">
              <div>
                <div className="flex items-center gap-3 mb-1">
                  <h3 className="font-semibold text-foreground">{d.name}</h3>
                  <span className={`px-2 py-0.5 rounded-full text-xs ${d.status==="active"?"bg-success/10 text-success":d.status==="paused"?"bg-warning/10 text-warning":"bg-muted text-muted-foreground"}`}>{d.status}</span>
                </div>
                <p className="text-sm text-muted-foreground">{d.steps.length} steps · {formatNumber(d.enrolledCount)} enrolled · {formatNumber(d.completedCount)} completed</p>
              </div>
            </div>
          </CardContent></Card>
        ))}
      </div>
    </div>
  );
}
