import { useData } from "@/contexts/DataContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { formatCurrency, formatDate } from "@/lib/calculations";
import { CreditCard, Download } from "lucide-react";

export default function BillingPage() {
  const { billing } = useData();
  return (
    <div className="space-y-6 animate-fade-in max-w-2xl">
      <div><h1 className="text-2xl font-bold">Billing</h1><p className="text-muted-foreground">Manage your subscription</p></div>
      <Card><CardHeader><CardTitle>Current Plan</CardTitle></CardHeader><CardContent className="space-y-4">
        <div className="flex items-center justify-between">
          <div><p className="text-lg font-bold capitalize">{billing.plan} Plan</p><p className="text-sm text-muted-foreground">{formatCurrency(billing.pricePerAccount)}/account/month · {billing.totalAccounts} accounts</p></div>
          <Badge className="bg-primary/10 text-primary border-0">Active</Badge>
        </div>
        <div className="flex justify-between text-sm"><span className="text-muted-foreground">Next billing date</span><span>{formatDate(billing.nextBillingDate)}</span></div>
        <div className="flex justify-between text-sm"><span className="text-muted-foreground">Monthly total</span><span className="font-bold">{formatCurrency(billing.pricePerAccount * billing.totalAccounts)}</span></div>
        <div className="flex justify-between text-sm"><span className="text-muted-foreground">Payment method</span><span className="flex items-center gap-1"><CreditCard className="h-4 w-4" />{billing.paymentMethod}</span></div>
        <div className="flex gap-2"><Button>Upgrade Plan</Button><Button variant="outline">Update Payment</Button></div>
      </CardContent></Card>
      <Card><CardHeader><CardTitle>Invoices</CardTitle></CardHeader><CardContent>
        <div className="space-y-2">
          {billing.invoices.map((inv) => (
            <div key={inv.id} className="flex items-center justify-between py-2 border-b border-border last:border-0">
              <div><p className="text-sm font-medium">{formatDate(inv.date)}</p><p className="text-xs text-muted-foreground">{formatCurrency(inv.amount)}</p></div>
              <div className="flex items-center gap-2">
                <Badge className={`border-0 text-xs ${inv.status === "paid" ? "bg-success/10 text-success" : "bg-warning/10 text-warning"}`}>{inv.status}</Badge>
                <Button size="sm" variant="ghost"><Download className="h-3 w-3" /></Button>
              </div>
            </div>
          ))}
        </div>
      </CardContent></Card>
    </div>
  );
}
