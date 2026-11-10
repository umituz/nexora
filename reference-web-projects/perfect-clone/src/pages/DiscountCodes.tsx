import { PageHeader } from "@/components/dashboard/PageHeader";
import { DataTable } from "@/components/dashboard/DataTable";
import { StatusBadge } from "@/components/dashboard/StatusBadge";
import { mockDiscountCodes } from "@/data/mockData";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import type { DiscountCode } from "@/types";

export default function DiscountCodes() {
  return (
    <div className="space-y-6 animate-fade-in">
      <PageHeader title="Discount Codes" description="Manage discount codes for incentivizing users" actions={<Button size="sm" className="gradient-bg"><Plus className="h-4 w-4 mr-1" />Create Code</Button>} />
      <div className="bg-card border border-border rounded-xl overflow-hidden">
        <DataTable<DiscountCode>
          data={mockDiscountCodes}
          columns={[
            { header: "Code", accessor: (d) => <code className="font-mono font-semibold">{d.code}</code> },
            { header: "Type", accessor: (d) => <span className="capitalize">{d.type}</span> },
            { header: "Value", accessor: (d) => d.type === "percentage" ? `${d.value}%` : `$${d.value}` },
            { header: "Usage", accessor: (d) => `${d.usageCount} / ${d.maxUsage}` },
            { header: "Status", accessor: (d) => <StatusBadge status={d.status} /> },
          ]}
        />
      </div>
    </div>
  );
}
