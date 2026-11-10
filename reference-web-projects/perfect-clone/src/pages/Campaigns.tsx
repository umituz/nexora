import { PageHeader } from "@/components/dashboard/PageHeader";
import { DataTable } from "@/components/dashboard/DataTable";
import { StatusBadge } from "@/components/dashboard/StatusBadge";
import { mockCampaigns } from "@/data/mockData";
import { formatCurrency, formatPercent } from "@/utils/calculations";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import type { Campaign } from "@/types";

export default function Campaigns() {
  return (
    <div className="space-y-6 animate-fade-in">
      <PageHeader
        title="Campaigns"
        description="Track marketing campaign performance"
        actions={<Button size="sm" className="gradient-bg"><Plus className="h-4 w-4 mr-1" />New Campaign</Button>}
      />
      <div className="bg-card border border-border rounded-xl overflow-hidden">
        <DataTable<Campaign>
          data={mockCampaigns}
          columns={[
            { header: "Campaign", accessor: (c) => <span className="font-medium">{c.name}</span> },
            { header: "Channel", accessor: "channel" },
            { header: "Status", accessor: (c) => <StatusBadge status={c.status} /> },
            { header: "Budget", accessor: (c) => formatCurrency(c.budget) },
            { header: "Spent", accessor: (c) => formatCurrency(c.spent) },
            { header: "Conversions", accessor: (c) => c.conversions.toString() },
            { header: "ROI", accessor: (c) => <span className="text-primary font-semibold">{c.roi}%</span> },
          ]}
        />
      </div>
    </div>
  );
}
