import { MOCK_OPT_OUTS } from "@/lib/mock-data";
import { formatPhoneNumber, formatDate } from "@/lib/calculations";
import { Card, CardContent } from "@/components/ui/card";

export default function OptOutsPage() {
  return (
    <div className="space-y-6 animate-fade-in">
      <div><h1 className="text-2xl font-heading font-bold text-foreground">Opt-Outs</h1><p className="text-sm text-muted-foreground">{MOCK_OPT_OUTS.length} opted-out contacts</p></div>
      <div className="space-y-2">
        {MOCK_OPT_OUTS.map((o) => (
          <Card key={o.id}><CardContent className="p-4 flex items-center justify-between">
            <div><p className="font-medium text-foreground">{o.contactName}</p><p className="text-xs text-muted-foreground">{formatPhoneNumber(o.contactPhone)}</p></div>
            <div className="text-right"><p className="text-sm text-muted-foreground">{o.reason}</p><p className="text-xs text-muted-foreground">{formatDate(o.optedOutAt)}</p></div>
          </CardContent></Card>
        ))}
      </div>
    </div>
  );
}
