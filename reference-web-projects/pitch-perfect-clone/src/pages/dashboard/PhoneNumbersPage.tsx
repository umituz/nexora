import { MOCK_PHONE_NUMBERS } from "@/lib/mock-data";
import { formatPhoneNumber, formatNumber } from "@/lib/calculations";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { toast } from "sonner";

export default function PhoneNumbersPage() {
  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div><h1 className="text-2xl font-heading font-bold text-foreground">Phone Numbers</h1><p className="text-sm text-muted-foreground">Manage your SMS phone numbers</p></div>
        <Button className="gap-2" onClick={() => toast.info("Add number flow coming soon")}><Plus className="w-4 h-4" />Add Number</Button>
      </div>
      <div className="space-y-3">
        {MOCK_PHONE_NUMBERS.map((p) => (
          <Card key={p.id}><CardContent className="p-5 flex items-center justify-between">
            <div>
              <p className="font-semibold text-foreground">{formatPhoneNumber(p.number)}</p>
              <p className="text-sm text-muted-foreground">{p.label} · {p.type}</p>
              <p className="text-xs text-muted-foreground">{formatNumber(p.monthlyMessages)} messages this month</p>
            </div>
            <span className={`px-2 py-0.5 rounded-full text-xs ${p.status==="active"?"bg-success/10 text-success":"bg-warning/10 text-warning"}`}>{p.status}</span>
          </CardContent></Card>
        ))}
      </div>
    </div>
  );
}
