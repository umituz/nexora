import { PageHeader } from "@/components/dashboard/PageHeader";
import { StatCard } from "@/components/dashboard/StatCard";
import { DataTable } from "@/components/dashboard/DataTable";
import { StatusBadge } from "@/components/dashboard/StatusBadge";
import { mockTrials } from "@/data/mockData";
import { formatCurrency, formatPercent, calculateConversionRate, countByStatus } from "@/utils/calculations";
import { TrendingUp, CheckCircle, XCircle, Clock } from "lucide-react";

export default function Conversions() {
  const converted = countByStatus(mockTrials, "converted");
  const expired = countByStatus(mockTrials, "expired");
  const rate = calculateConversionRate(converted, mockTrials.length);

  return (
    <div className="space-y-6 animate-fade-in">
      <PageHeader title="Conversions" description="Track trial-to-paid conversion metrics" />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="Conversion Rate" value={formatPercent(rate)} change={8.3} icon={<TrendingUp className="h-5 w-5" />} />
        <StatCard title="Converted" value={converted} icon={<CheckCircle className="h-5 w-5" />} />
        <StatCard title="Expired" value={expired} icon={<XCircle className="h-5 w-5" />} />
        <StatCard title="Active Trials" value={countByStatus(mockTrials, "active")} icon={<Clock className="h-5 w-5" />} />
      </div>

      <div className="bg-card border border-border rounded-xl overflow-hidden">
        <div className="px-5 py-4 border-b border-border">
          <h3 className="font-semibold">Conversion History</h3>
        </div>
        <DataTable
          data={mockTrials.filter((t) => t.status === "converted")}
          columns={[
            { header: "Customer", accessor: (t) => <span className="font-medium">{t.customerName}</span> },
            { header: "Plan", accessor: "plan" },
            { header: "Status", accessor: (t) => <StatusBadge status={t.status} /> },
            { header: "Smart Charge", accessor: (t) => formatCurrency(t.smartChargeAmount) },
            { header: "Engagement", accessor: (t) => `${t.engagementScore}%` },
          ]}
        />
      </div>
    </div>
  );
}
