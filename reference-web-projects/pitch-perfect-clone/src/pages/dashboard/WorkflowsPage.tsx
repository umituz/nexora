import { MOCK_WORKFLOWS } from "@/lib/mock-data";
import { formatNumber, formatDate } from "@/lib/calculations";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { Link } from "react-router-dom";

export default function WorkflowsPage() {
  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div><h1 className="text-2xl font-heading font-bold text-foreground">Workflows</h1><p className="text-sm text-muted-foreground">Automate your SMS sequences</p></div>
        <Button asChild><Link to="/dashboard/workflows/builder" className="gap-2"><Plus className="w-4 h-4" />New Workflow</Link></Button>
      </div>
      <div className="space-y-3">
        {MOCK_WORKFLOWS.map((w) => (
          <Card key={w.id}><CardContent className="p-5">
            <div className="flex items-center justify-between">
              <div>
                <div className="flex items-center gap-3 mb-1">
                  <h3 className="font-semibold text-foreground">{w.name}</h3>
                  <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${w.status==="active"?"bg-success/10 text-success":w.status==="inactive"?"bg-warning/10 text-warning":"bg-muted text-muted-foreground"}`}>{w.status}</span>
                </div>
                <div className="flex gap-4 text-sm text-muted-foreground">
                  <span>Trigger: <strong className="text-foreground capitalize">{w.triggerType.replace("_"," ")}</strong></span>
                  <span>{w.steps.length} steps</span>
                  <span>Enrolled: {formatNumber(w.enrolledCount)}</span>
                  <span>Completed: {formatNumber(w.completedCount)}</span>
                </div>
              </div>
              <Button variant="outline" size="sm" asChild><Link to="/dashboard/workflows/builder">Edit</Link></Button>
            </div>
          </CardContent></Card>
        ))}
      </div>
    </div>
  );
}
