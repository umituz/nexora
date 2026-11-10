import { PageHeader } from "@/components/dashboard/PageHeader";
import { DataTable } from "@/components/dashboard/DataTable";
import { StatusBadge } from "@/components/dashboard/StatusBadge";
import { mockCheckoutPages } from "@/data/mockData";
import { formatPercent, formatNumber } from "@/utils/calculations";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import type { CheckoutPage } from "@/types";

export default function CheckoutPages() {
  return (
    <div className="space-y-6 animate-fade-in">
      <PageHeader
        title="Checkout Pages"
        description="Manage and optimize your checkout experiences"
        actions={<Button size="sm" className="gradient-bg"><Plus className="h-4 w-4 mr-1" />New Page</Button>}
      />
      <div className="bg-card border border-border rounded-xl overflow-hidden">
        <DataTable<CheckoutPage>
          data={mockCheckoutPages}
          columns={[
            { header: "Name", accessor: (p) => (
              <div>
                <p className="font-medium">{p.name}</p>
                <p className="text-xs text-muted-foreground">/{p.slug}</p>
              </div>
            )},
            { header: "Status", accessor: (p) => <StatusBadge status={p.status} /> },
            { header: "Conversion", accessor: (p) => <span className="font-semibold">{formatPercent(p.conversionRate)}</span> },
            { header: "Visitors", accessor: (p) => formatNumber(p.visitors) },
            { header: "Conversions", accessor: (p) => formatNumber(p.conversions) },
            { header: "Template", accessor: (p) => <span className="capitalize">{p.template}</span> },
          ]}
        />
      </div>
    </div>
  );
}
