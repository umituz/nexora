import { MOCK_TEST_CASES } from "@/data/mock";
import { getStatusBg } from "@/utils/calculations";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { Play, Search } from "lucide-react";
import { toast } from "sonner";

export default function UiTestingPage() {
  const [url, setUrl] = useState("");
  const uiTests = MOCK_TEST_CASES.filter((tc) => tc.type === "frontend" || tc.type === "e2e");

  return (
    <div className="space-y-6">
      <div className="glass-card p-5">
        <h3 className="font-heading font-semibold text-sm mb-3">Quick UI Test</h3>
        <div className="flex gap-3">
          <Input placeholder="Enter page URL to test..." value={url} onChange={(e) => setUrl(e.target.value)} className="flex-1" />
          <Button onClick={() => toast.success("UI test started")} className="gradient-primary text-primary-foreground gap-1"><Play size={14} /> Run</Button>
        </div>
      </div>
      <div className="space-y-3">
        {uiTests.map((tc) => (
          <div key={tc.id} className="glass-card p-4 flex items-center justify-between">
            <div>
              <h3 className="text-sm font-medium">{tc.name}</h3>
              <p className="text-xs text-muted-foreground">{tc.description}</p>
              <div className="flex gap-1 mt-1">{tc.tags.map((t) => <span key={t} className="text-[10px] px-2 py-0.5 rounded bg-muted text-muted-foreground">{t}</span>)}</div>
            </div>
            <span className={`status-badge ${getStatusBg(tc.status)}`}>{tc.status}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
