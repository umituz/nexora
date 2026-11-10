import { Shield } from "lucide-react";
import { MOCK_TEST_CASES } from "@/data/mock";
import { getStatusBg } from "@/utils/calculations";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

export default function RegressionPage() {
  const regressionTests = MOCK_TEST_CASES.filter((tc) => tc.priority === "critical" || tc.priority === "high");

  return (
    <div className="space-y-6">
      <div className="glass-card p-5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Shield size={20} className="text-primary" />
            <div>
              <h3 className="font-heading font-semibold text-sm">Regression Suite</h3>
              <p className="text-xs text-muted-foreground">{regressionTests.length} critical/high priority tests</p>
            </div>
          </div>
          <Button size="sm" className="gradient-primary text-primary-foreground" onClick={() => toast.success("Regression suite triggered")}>Run All</Button>
        </div>
      </div>

      <div className="space-y-3">
        {regressionTests.map((tc) => (
          <div key={tc.id} className="glass-card p-4 flex items-center justify-between">
            <div>
              <h3 className="text-sm font-medium">{tc.name}</h3>
              <p className="text-xs text-muted-foreground">{tc.description}</p>
            </div>
            <div className="flex items-center gap-2">
              <span className={`status-badge ${getStatusBg(tc.priority)}`}>{tc.priority}</span>
              <span className={`status-badge ${getStatusBg(tc.status)}`}>{tc.status}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
