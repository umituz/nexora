import { MOCK_TEST_CASES } from "@/data/mock";
import { getStatusBg } from "@/utils/calculations";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, Play } from "lucide-react";
import { toast } from "sonner";

export default function ApiTestingPage() {
  const [endpoint, setEndpoint] = useState("");
  const apiTests = MOCK_TEST_CASES.filter((tc) => tc.type === "backend");

  const handleRun = () => {
    toast.success("API test triggered for " + (endpoint || "all endpoints"));
  };

  return (
    <div className="space-y-6">
      <div className="glass-card p-5">
        <h3 className="font-heading font-semibold text-sm mb-3">Quick API Test</h3>
        <div className="flex gap-3">
          <Input placeholder="Enter API endpoint URL..." value={endpoint} onChange={(e) => setEndpoint(e.target.value)} className="flex-1" />
          <Button onClick={handleRun} className="gradient-primary text-primary-foreground gap-1"><Play size={14} /> Run</Button>
        </div>
      </div>
      <div className="space-y-3">
        {apiTests.map((tc) => (
          <div key={tc.id} className="glass-card p-4 flex items-center justify-between">
            <div>
              <h3 className="text-sm font-medium">{tc.name}</h3>
              <p className="text-xs text-muted-foreground">{tc.description}</p>
            </div>
            <span className={`status-badge ${getStatusBg(tc.status)}`}>{tc.status}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
