import { DataTableShell } from "@/components/shared/DataTableShell";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { mockBillingInvoices } from "@/lib/mock-data";
import { formatCurrency, formatDate } from "@/lib/utils";
import { StatCard } from "@/components/shared/StatCard";

export default function BillingPage() {
  return (
    <div className="space-y-6">
      <div><h1 className="text-2xl font-bold">Billing</h1><p className="mt-1 text-sm text-muted-foreground">Manage billing and invoices.</p></div>
      <div className="grid gap-4 sm:grid-cols-3">
        <StatCard title="Current Plan" value="Production" description="$49/connection/month" />
        <StatCard title="Active Connections" value="6" description={formatCurrency(294) + "/month"} />
        <StatCard title="Next Invoice" value={formatCurrency(294)} description="Due April 1, 2026" />
      </div>
      <div className="rounded-lg border bg-card">
        <div className="border-b p-4"><h3 className="text-sm font-semibold">Invoice History</h3></div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead><tr className="border-b text-xs text-muted-foreground">
              <th className="px-4 py-3 text-left font-medium">Period</th>
              <th className="px-4 py-3 text-left font-medium">Amount</th>
              <th className="px-4 py-3 text-left font-medium">Connections</th>
              <th className="px-4 py-3 text-left font-medium">Status</th>
              <th className="px-4 py-3 text-left font-medium">Date</th>
            </tr></thead>
            <tbody>
              {mockBillingInvoices.map((inv) => (
                <tr key={inv.id} className="border-b last:border-0 hover:bg-muted/50">
                  <td className="px-4 py-3 text-sm font-medium">{inv.period}</td>
                  <td className="px-4 py-3 text-sm">{formatCurrency(inv.amount)}</td>
                  <td className="px-4 py-3 text-sm">{inv.connections}</td>
                  <td className="px-4 py-3"><StatusBadge status={inv.status} /></td>
                  <td className="px-4 py-3 text-sm text-muted-foreground">{formatDate(inv.date)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
