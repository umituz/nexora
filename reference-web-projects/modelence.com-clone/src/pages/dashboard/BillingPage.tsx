import { PageHeader } from "@/components/shared/PageHeader";
import { mockBillingInfo } from "@/lib/mock-data";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { Progress } from "@/components/ui/progress";
import { formatDate } from "@/lib/utils";

export default function BillingPage() {
  const b = mockBillingInfo;
  return (
    <div className="animate-fade-in max-w-3xl">
      <PageHeader title="Billing" description="Plan and usage" />
      <div className="bg-card border border-border rounded-lg p-6 mb-6">
        <div className="flex items-center justify-between mb-4">
          <div><h3 className="font-semibold text-foreground">{b.plan}</h3><p className="text-sm text-muted-foreground">Current period ends {formatDate(b.currentPeriodEnd)}</p></div>
          <StatusBadge status={b.status} />
        </div>
      </div>
      <h3 className="font-semibold text-foreground mb-4">Usage</h3>
      <div className="grid sm:grid-cols-2 gap-4 mb-8">
        {b.usage.map((u) => (
          <div key={u.category} className="bg-card border border-border rounded-lg p-4">
            <div className="flex justify-between text-sm mb-2"><span className="text-foreground">{u.category}</span><span className="text-muted-foreground">{u.used} / {u.limit} {u.unit}</span></div>
            <Progress value={(u.used / u.limit) * 100} className="h-2" />
          </div>
        ))}
      </div>
      <h3 className="font-semibold text-foreground mb-4">Invoices</h3>
      <div className="space-y-2">
        {b.invoices.map((inv) => (
          <div key={inv.id} className="bg-card border border-border rounded-lg px-4 py-3 flex items-center justify-between">
            <div className="flex items-center gap-4"><span className="text-sm text-foreground">{formatDate(inv.date)}</span><span className="text-sm text-muted-foreground">${inv.amount}</span></div>
            <StatusBadge status={inv.status} />
          </div>
        ))}
      </div>
    </div>
  );
}
