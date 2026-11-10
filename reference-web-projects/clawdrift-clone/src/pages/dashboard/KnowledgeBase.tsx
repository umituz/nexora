import { mockKnowledgeBase } from "@/lib/mock-data";
import { formatDate } from "@/lib/calculations";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { toast } from "sonner";

export default function KnowledgeBasePage() {
  return (
    <div className="space-y-6">
      <div className="flex justify-end">
        <Button onClick={() => toast.info("Add source wizard — mock")}><Plus className="mr-2 h-4 w-4" /> Add Source</Button>
      </div>
      <div className="space-y-3">
        {mockKnowledgeBase.map((kb) => (
          <Card key={kb.id}>
            <CardContent className="flex items-center justify-between pt-4">
              <div>
                <p className="font-medium">{kb.title}</p>
                <div className="flex items-center gap-2 mt-1">
                  <Badge variant="outline" className="capitalize text-xs">{kb.type}</Badge>
                  <span className="text-xs text-muted-foreground">{(kb.size / 1000).toFixed(0)} KB</span>
                  <span className="text-xs text-muted-foreground">· Updated {formatDate(kb.updatedAt)}</span>
                </div>
              </div>
              <div className="text-sm text-muted-foreground">{kb.botIds.length} bot(s)</div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
