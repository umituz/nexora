import { AI_MODELS } from "@/constants/app";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export default function ModelsPage() {
  return (
    <div className="space-y-6">
      <p className="text-muted-foreground">Available AI models for your bots</p>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {AI_MODELS.map((model) => (
          <Card key={model.id}>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-base">
                  {model.icon} {model.name}
                </CardTitle>
                <Badge variant="outline">{model.provider}</Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 text-sm text-muted-foreground">
                <p>Model ID: <span className="font-mono">{model.id}</span></p>
                <p>Provider: {model.provider}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
