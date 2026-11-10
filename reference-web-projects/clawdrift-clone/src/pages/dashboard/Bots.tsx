import { useState } from "react";
import { Link } from "react-router-dom";
import { mockBots, type Bot } from "@/lib/mock-data";
import { formatNumber, timeAgo, getStatusBadgeVariant } from "@/lib/calculations";
import { getFromStorage, setToStorage } from "@/lib/storage";
import { STORAGE_KEYS, AI_MODELS, PLATFORMS } from "@/constants/app";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Plus, Search, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { generateId } from "@/lib/calculations";

export default function BotsPage() {
  const [bots, setBots] = useState<Bot[]>(() =>
    getFromStorage<Bot[]>(STORAGE_KEYS.BOTS, mockBots)
  );
  const [search, setSearch] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [newBot, setNewBot] = useState({ name: "", description: "", modelId: "", platformId: "", persona: "" });

  const filtered = bots.filter((b) =>
    b.name.toLowerCase().includes(search.toLowerCase()) ||
    b.description.toLowerCase().includes(search.toLowerCase())
  );

  const saveBots = (updated: Bot[]) => {
    setBots(updated);
    setToStorage(STORAGE_KEYS.BOTS, updated);
  };

  const handleCreate = () => {
    if (!newBot.name || !newBot.modelId || !newBot.platformId) {
      toast.error("Please fill in all required fields");
      return;
    }
    const bot: Bot = {
      id: generateId(),
      name: newBot.name,
      description: newBot.description,
      modelId: newBot.modelId,
      platformId: newBot.platformId,
      persona: newBot.persona,
      status: "deploying",
      messagesTotal: 0,
      messagesThisMonth: 0,
      createdAt: new Date().toISOString(),
      lastActive: new Date().toISOString(),
    };
    saveBots([bot, ...bots]);
    setNewBot({ name: "", description: "", modelId: "", platformId: "", persona: "" });
    setDialogOpen(false);
    toast.success(`Bot "${bot.name}" created!`);
  };

  const handleDelete = (id: string) => {
    saveBots(bots.filter((b) => b.id !== id));
    toast.success("Bot deleted");
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-4">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input placeholder="Search bots..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-9" />
        </div>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button><Plus className="mr-2 h-4 w-4" /> Create Bot</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create New Bot</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>Name *</Label>
                <Input value={newBot.name} onChange={(e) => setNewBot({ ...newBot, name: e.target.value })} placeholder="My Assistant" />
              </div>
              <div className="space-y-2">
                <Label>Description</Label>
                <Input value={newBot.description} onChange={(e) => setNewBot({ ...newBot, description: e.target.value })} placeholder="What does this bot do?" />
              </div>
              <div className="space-y-2">
                <Label>Model *</Label>
                <Select value={newBot.modelId} onValueChange={(v) => setNewBot({ ...newBot, modelId: v })}>
                  <SelectTrigger><SelectValue placeholder="Select model" /></SelectTrigger>
                  <SelectContent>
                    {AI_MODELS.map((m) => (
                      <SelectItem key={m.id} value={m.id}>{m.icon} {m.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Platform *</Label>
                <Select value={newBot.platformId} onValueChange={(v) => setNewBot({ ...newBot, platformId: v })}>
                  <SelectTrigger><SelectValue placeholder="Select platform" /></SelectTrigger>
                  <SelectContent>
                    {PLATFORMS.map((p) => (
                      <SelectItem key={p.id} value={p.id}>{p.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Persona</Label>
                <Textarea value={newBot.persona} onChange={(e) => setNewBot({ ...newBot, persona: e.target.value })} placeholder="Describe how this bot should behave..." />
              </div>
              <Button onClick={handleCreate} className="w-full">Create Bot</Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {filtered.map((bot) => (
          <Card key={bot.id}>
            <CardHeader className="flex flex-row items-start justify-between pb-2">
              <div>
                <CardTitle className="text-base">
                  <Link to={`/dashboard/bots/${bot.id}`} className="hover:text-primary">{bot.name}</Link>
                </CardTitle>
                <p className="text-xs text-muted-foreground mt-1">{bot.description}</p>
              </div>
              <Badge variant={getStatusBadgeVariant(bot.status)}>{bot.status}</Badge>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div>
                  <p className="text-muted-foreground">Messages</p>
                  <p className="font-medium">{formatNumber(bot.messagesTotal)}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">This month</p>
                  <p className="font-medium">{formatNumber(bot.messagesThisMonth)}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Platform</p>
                  <p className="font-medium capitalize">{bot.platformId}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Last active</p>
                  <p className="font-medium">{timeAgo(bot.lastActive)}</p>
                </div>
              </div>
              <div className="mt-3 flex gap-2">
                <Button variant="outline" size="sm" asChild className="flex-1">
                  <Link to={`/dashboard/bots/${bot.id}`}>View</Link>
                </Button>
                <Button variant="ghost" size="sm" onClick={() => handleDelete(bot.id)}>
                  <Trash2 className="h-4 w-4 text-destructive" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
      {filtered.length === 0 && (
        <div className="text-center py-12 text-muted-foreground">
          {search ? "No bots match your search." : "No bots yet. Create your first one!"}
        </div>
      )}
    </div>
  );
}
