import { PageHeader } from "@/components/dashboard/PageHeader";
import { DataTable } from "@/components/dashboard/DataTable";
import { StatusBadge } from "@/components/dashboard/StatusBadge";
import { mockTrials } from "@/data/mockData";
import { formatCurrency } from "@/utils/calculations";
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";
import type { Trial } from "@/types";

export default function Trials() {
  return (
    <div className="space-y-6 animate-fade-in">
      <PageHeader
        title="Trials"
        description="Manage and monitor active and past trials"
        actions={<Button variant="outline" size="sm"><Download className="h-4 w-4 mr-1" />Export</Button>}
      />

      <div className="bg-card border border-border rounded-xl overflow-hidden">
        <DataTable<Trial>
          data={mockTrials}
          columns={[
            { header: "Customer", accessor: (t) => (
              <div>
                <p className="font-medium">{t.customerName}</p>
                <p className="text-xs text-muted-foreground">{t.customerEmail}</p>
              </div>
            )},
            { header: "Plan", accessor: "plan" },
            { header: "Status", accessor: (t) => <StatusBadge status={t.status} /> },
            { header: "Smart Charge", accessor: (t) => (
              <div>
                <StatusBadge status={t.smartChargeStatus} />
                <span className="ml-2 text-xs">{formatCurrency(t.smartChargeAmount)}</span>
              </div>
            )},
            { header: "Days Left", accessor: (t) => <span className={t.daysRemaining <= 3 ? "text-destructive font-medium" : ""}>{t.daysRemaining}d</span> },
            { header: "Engagement", accessor: (t) => (
              <div className="flex items-center gap-2">
                <div className="w-16 h-1.5 bg-muted rounded-full overflow-hidden">
                  <div className="h-full rounded-full gradient-bg" style={{ width: `${t.engagementScore}%` }} />
                </div>
                <span className="text-xs">{t.engagementScore}%</span>
              </div>
            )},
            { header: "Source", accessor: "source" },
          ]}
        />
      </div>
    </div>
  );
}
