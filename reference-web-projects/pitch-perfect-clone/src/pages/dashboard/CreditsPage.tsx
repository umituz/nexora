import { MOCK_CREDIT_PACKS } from "@/lib/mock-data";
import { formatCurrency, formatNumber } from "@/lib/calculations";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { toast } from "sonner";

export default function CreditsPage() {
  const creditsUsed = 5750;
  const creditsTotal = 10000;

  return (
    <div className="space-y-6 animate-fade-in">
      <div><h1 className="text-2xl font-heading font-bold text-foreground">Credits</h1><p className="text-sm text-muted-foreground">Manage your SMS credits</p></div>
      <Card><CardContent className="p-6">
        <div className="flex justify-between mb-2"><span className="text-sm text-muted-foreground">Credits Used</span><span className="text-sm font-medium text-foreground">{formatNumber(creditsUsed)} / {formatNumber(creditsTotal)}</span></div>
        <Progress value={(creditsUsed/creditsTotal)*100} className="mb-2" />
        <p className="text-xs text-muted-foreground">{formatNumber(creditsTotal - creditsUsed)} credits remaining</p>
      </CardContent></Card>
      <h2 className="text-lg font-heading font-semibold text-foreground">Buy Credit Packs</h2>
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {MOCK_CREDIT_PACKS.map((p) => (
          <Card key={p.id}><CardContent className="p-5 text-center">
            <p className="font-heading font-bold text-foreground text-lg">{p.name}</p>
            <p className="text-3xl font-bold text-primary my-3">{formatCurrency(p.price)}</p>
            <p className="text-sm text-muted-foreground mb-1">{formatNumber(p.credits)} credits</p>
            <p className="text-xs text-muted-foreground mb-4">${p.pricePerCredit}/credit</p>
            <Button className="w-full" onClick={() => toast.success(`${p.name} purchased!`)}>Buy Now</Button>
          </CardContent></Card>
        ))}
      </div>
    </div>
  );
}
