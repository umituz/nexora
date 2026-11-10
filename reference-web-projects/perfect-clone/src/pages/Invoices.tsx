import { PageHeader } from "@/components/dashboard/PageHeader";
import { DataTable } from "@/components/dashboard/DataTable";
import { StatusBadge } from "@/components/dashboard/StatusBadge";
import { mockInvoices } from "@/data/mockData";
import { formatCurrency } from "@/utils/calculations";
import type { Invoice } from "@/types";

export default function Invoices() {
  return (
    <div className="space-y-6 animate-fade-in">
      <PageHeader title="Invoices" description="Manage customer invoices" />
      <div className="bg-card border border-border rounded-xl overflow-hidden">
        <DataTable<Invoice>
          data={mockInvoices}
          columns={[
            { header: "Invoice", accessor: (inv) => <code className="text-xs font-mono">{inv.id}</code> },
            { header: "Customer", accessor: (inv) => <span className="font-medium">{inv.customerName}</span> },
            { header: "Amount", accessor: (inv) => <span className="font-semibold">{formatCurrency(inv.amount)}</span> },
            { header: "Status", accessor: (inv) => <StatusBadge status={inv.status} /> },
            { header: "Due Date", accessor: (inv) => new Date(inv.dueDate).toLocaleDateString() },
            { header: "Paid", accessor: (inv) => inv.paidDate ? new Date(inv.paidDate).toLocaleDateString() : "—" },
          ]}
        />
      </div>
    </div>
  );
}
