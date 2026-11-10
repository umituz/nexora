import { PageHeader } from "@/components/dashboard/PageHeader";
import { StatCard } from "@/components/dashboard/StatCard";
import { DataTable } from "@/components/dashboard/DataTable";
import { StatusBadge } from "@/components/dashboard/StatusBadge";
import { mockChargebacks } from "@/data/mockData";
import { formatCurrency, countByStatus } from "@/utils/calculations";
import { AlertTriangle, ShieldCheck, Clock, XCircle } from "lucide-react";
import type { Chargeback } from "@/types";

export default function Chargebacks() {
  return (
    <div className="space-y-6 animate-fade-in">
      <PageHeader title="Chargebacks" description="Monitor and manage payment disputes" />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="Open Disputes" value={countByStatus(mockChargebacks, "open")} icon={<AlertTriangle className="h-5 w-5" />} />
        <StatCard title="Under Review" value={countByStatus(mockChargebacks, "under_review")} icon={<Clock className="h-5 w-5" />} />
        <StatCard title="Won" value={countByStatus(mockChargebacks, "won")} icon={<ShieldCheck className="h-5 w-5" />} />
        <StatCard title="Lost" value={countByStatus(mockChargebacks, "lost")} icon={<XCircle className="h-5 w-5" />} />
      </div>

      <div className="bg-card border border-border rounded-xl overflow-hidden">
        <DataTable<Chargeback>
          data={mockChargebacks}
          columns={[
            { header: "Customer", accessor: (c) => <span className="font-medium">{c.customerName}</span> },
            { header: "Amount", accessor: (c) => <span className="font-semibold">{formatCurrency(c.amount)}</span> },
            { header: "Reason", accessor: "reason" },
            { header: "Status", accessor: (c) => <StatusBadge status={c.status} /> },
            { header: "Filed", accessor: (c) => new Date(c.filedDate).toLocaleDateString() },
            { header: "Due", accessor: (c) => new Date(c.dueDate).toLocaleDateString() },
          ]}
        />
      </div>
    </div>
  );
}
