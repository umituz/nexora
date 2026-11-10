import { mockTemplates } from "@/lib/mock-data";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Star } from "lucide-react";
import { toast } from "sonner";

export default function TemplatesPage() {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {mockTemplates.map((t) => (
        <Card key={t.id}>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-base">{t.name}</CardTitle>
              <Badge variant="outline">{t.category}</Badge>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-3">{t.description}</p>
            <div className="flex items-center justify-between text-sm">
              <div className="flex items-center gap-1"><Star className="h-3 w-3 text-warning fill-warning" /> {t.rating}</div>
              <span className="text-muted-foreground">{t.usageCount} uses</span>
            </div>
            <Button className="w-full mt-3" size="sm" onClick={() => toast.success(`Template "${t.name}" applied — mock`)}>Use Template</Button>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
