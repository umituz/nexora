import { mockBilling } from "@/lib/mock-data";
import { formatCurrency, formatDate } from "@/lib/calculations";
import { PLAN_TIERS } from "@/constants/app";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { toast } from "sonner";

export default function BillingPage() {
  return (
    <div className="space-y-6 max-w-3xl">
      <Card>
        <CardHeader><CardTitle className="text-base">Current Plan</CardTitle></CardHeader>
        <CardContent className="space-y-3">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xl font-bold">{mockBilling.plan} Plan</p>
              <p className="text-sm text-muted-foreground">{formatCurrency(mockBilling.amount)}/month · Next billing: {formatDate(mockBilling.nextBillingDate)}</p>
            </div>
            <Button variant="outline" onClick={() => toast.info("Plan management — mock")}>Change Plan</Button>
          </div>
          <p className="text-sm text-muted-foreground">Payment: {mockBilling.paymentMethod}</p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader><CardTitle className="text-base">Invoices</CardTitle></CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Date</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {mockBilling.invoices.map((inv) => (
                <TableRow key={inv.id}>
                  <TableCell>{formatDate(inv.date)}</TableCell>
                  <TableCell>{formatCurrency(inv.amount)}</TableCell>
                  <TableCell><Badge variant="outline" className="capitalize">{inv.status}</Badge></TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
