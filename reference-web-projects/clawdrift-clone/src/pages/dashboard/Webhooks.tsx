import { useState } from "react";
import { mockWebhooks, type WebhookEntry } from "@/lib/mock-data";
import { timeAgo, getStatusBadgeVariant, generateId } from "@/lib/calculations";
import { getFromStorage, setToStorage } from "@/lib/storage";
import { STORAGE_KEYS } from "@/constants/app";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Plus, Trash2 } from "lucide-react";
import { toast } from "sonner";

export default function WebhooksPage() {
  const [webhooks, setWebhooks] = useState<WebhookEntry[]>(() =>
    getFromStorage<WebhookEntry[]>(STORAGE_KEYS.WEBHOOKS, mockWebhooks)
  );
  const [dialogOpen, setDialogOpen] = useState(false);
  const [newUrl, setNewUrl] = useState("");

  const save = (updated: WebhookEntry[]) => {
    setWebhooks(updated);
    setToStorage(STORAGE_KEYS.WEBHOOKS, updated);
  };

  const handleCreate = () => {
    if (!newUrl) { toast.error("Please enter a URL"); return; }
    const wh: WebhookEntry = {
      id: generateId(),
      url: newUrl,
      events: ["message.received"],
      status: "active",
      lastTriggered: new Date().toISOString(),
      successRate: 100,
    };
    save([wh, ...webhooks]);
    setNewUrl("");
    setDialogOpen(false);
    toast.success("Webhook created");
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-end">
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button><Plus className="mr-2 h-4 w-4" /> Add Webhook</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader><DialogTitle>Add Webhook</DialogTitle></DialogHeader>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>Endpoint URL</Label>
                <Input value={newUrl} onChange={(e) => setNewUrl(e.target.value)} placeholder="https://api.example.com/webhook" />
              </div>
              <Button onClick={handleCreate} className="w-full">Add Webhook</Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardContent className="pt-6">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>URL</TableHead>
                <TableHead>Events</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Success Rate</TableHead>
                <TableHead>Last Triggered</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {webhooks.map((wh) => (
                <TableRow key={wh.id}>
                  <TableCell className="font-mono text-xs max-w-[200px] truncate">{wh.url}</TableCell>
                  <TableCell>
                    <div className="flex flex-wrap gap-1">
                      {wh.events.map((e) => <Badge key={e} variant="outline" className="text-xs">{e}</Badge>)}
                    </div>
                  </TableCell>
                  <TableCell><Badge variant={getStatusBadgeVariant(wh.status)}>{wh.status}</Badge></TableCell>
                  <TableCell>{wh.successRate}%</TableCell>
                  <TableCell>{timeAgo(wh.lastTriggered)}</TableCell>
                  <TableCell>
                    <Button size="icon" variant="ghost" onClick={() => { save(webhooks.filter((x) => x.id !== wh.id)); toast.success("Deleted"); }}>
                      <Trash2 className="h-3 w-3 text-destructive" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
