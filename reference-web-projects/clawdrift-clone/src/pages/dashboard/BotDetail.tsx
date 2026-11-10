import { useParams, Link } from "react-router-dom";
import { mockBots } from "@/lib/mock-data";
import { AI_MODELS, PLATFORMS } from "@/constants/app";
import { formatNumber, formatDateTime, timeAgo } from "@/lib/calculations";
import { getFromStorage } from "@/lib/storage";
import { STORAGE_KEYS } from "@/constants/app";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft } from "lucide-react";
import type { Bot } from "@/lib/mock-data";

export default function BotDetailPage() {
  const { id } = useParams<{ id: string }>();
  const bots = getFromStorage<Bot[]>(STORAGE_KEYS.BOTS, mockBots);
  const bot = bots.find((b) => b.id === id);

  if (!bot) {
    return (
      <div className="text-center py-12">
        <h2 className="text-xl font-bold mb-4">Bot not found</h2>
        <Button asChild><Link to="/dashboard/bots">Back to Bots</Link></Button>
      </div>
    );
  }

  const model = AI_MODELS.find((m) => m.id === bot.modelId);
  const platform = PLATFORMS.find((p) => p.id === bot.platformId);

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="sm" asChild>
          <Link to="/dashboard/bots"><ArrowLeft className="mr-2 h-4 w-4" /> Back</Link>
        </Button>
      </div>

      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">{bot.name}</h2>
          <p className="text-muted-foreground">{bot.description}</p>
        </div>
        <Badge variant={bot.status === "active" ? "default" : "secondary"} className="text-sm">
          {bot.status}
        </Badge>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="pb-2"><CardTitle className="text-sm text-muted-foreground">Total Messages</CardTitle></CardHeader>
          <CardContent><p className="text-2xl font-bold">{formatNumber(bot.messagesTotal)}</p></CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2"><CardTitle className="text-sm text-muted-foreground">This Month</CardTitle></CardHeader>
          <CardContent><p className="text-2xl font-bold">{formatNumber(bot.messagesThisMonth)}</p></CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2"><CardTitle className="text-sm text-muted-foreground">Model</CardTitle></CardHeader>
          <CardContent><p className="text-lg font-medium">{model?.icon} {model?.name ?? bot.modelId}</p></CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2"><CardTitle className="text-sm text-muted-foreground">Platform</CardTitle></CardHeader>
          <CardContent><p className="text-lg font-medium capitalize">{platform?.name ?? bot.platformId}</p></CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader><CardTitle className="text-base">Persona</CardTitle></CardHeader>
        <CardContent>
          <p className="text-muted-foreground">{bot.persona || "No persona defined."}</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader><CardTitle className="text-base">Details</CardTitle></CardHeader>
        <CardContent className="grid gap-3 sm:grid-cols-2">
          <div>
            <p className="text-sm text-muted-foreground">Created</p>
            <p className="text-sm font-medium">{formatDateTime(bot.createdAt)}</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Last Active</p>
            <p className="text-sm font-medium">{timeAgo(bot.lastActive)}</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Bot ID</p>
            <p className="text-sm font-mono">{bot.id}</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
