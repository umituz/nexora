import { useState } from "react";
import { mockSupportTickets, type SupportTicket } from "@/lib/mock-data";
import { formatDate, getStatusBadgeVariant, generateId } from "@/lib/calculations";
import { getFromStorage, setToStorage } from "@/lib/storage";
import { STORAGE_KEYS } from "@/constants/app";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Plus } from "lucide-react";
import { toast } from "sonner";

export default function SupportPage() {
  const [tickets, setTickets] = useState<SupportTicket[]>(() =>
    getFromStorage<SupportTicket[]>(STORAGE_KEYS.SUPPORT_TICKETS, mockSupportTickets)
  );
  const [dialogOpen, setDialogOpen] = useState(false);
  const [newTicket, setNewTicket] = useState({ subject: "", description: "" });

  const save = (updated: SupportTicket[]) => { setTickets(updated); setToStorage(STORAGE_KEYS.SUPPORT_TICKETS, updated); };

  const handleCreate = () => {
    if (!newTicket.subject) { toast.error("Subject required"); return; }
    const ticket: SupportTicket = {
      id: generateId(), subject: newTicket.subject, description: newTicket.description,
      status: "open", priority: "medium", createdAt: new Date().toISOString(), updatedAt: new Date().toISOString(),
      messages: [{ sender: "You", content: newTicket.description, timestamp: new Date().toISOString() }],
    };
    save([ticket, ...tickets]);
    setNewTicket({ subject: "", description: "" });
    setDialogOpen(false);
    toast.success("Ticket created");
  };

  const priorityColors: Record<string, "default" | "secondary" | "destructive" | "outline"> = { low: "outline", medium: "secondary", high: "default", critical: "destructive" };

  return (
    <div className="space-y-6">
      <div className="flex justify-end">
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild><Button><Plus className="mr-2 h-4 w-4" /> New Ticket</Button></DialogTrigger>
          <DialogContent>
            <DialogHeader><DialogTitle>Create Support Ticket</DialogTitle></DialogHeader>
            <div className="space-y-4">
              <div className="space-y-2"><Label>Subject</Label><Input value={newTicket.subject} onChange={(e) => setNewTicket({ ...newTicket, subject: e.target.value })} /></div>
              <div className="space-y-2"><Label>Description</Label><Textarea value={newTicket.description} onChange={(e) => setNewTicket({ ...newTicket, description: e.target.value })} rows={4} /></div>
              <Button onClick={handleCreate} className="w-full">Submit Ticket</Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>
      <div className="space-y-3">
        {tickets.map((t) => (
          <Card key={t.id}>
            <CardContent className="flex items-center justify-between pt-4">
              <div>
                <p className="font-medium">{t.subject}</p>
                <div className="flex items-center gap-2 mt-1">
                  <Badge variant={getStatusBadgeVariant(t.status)}>{t.status}</Badge>
                  <Badge variant={priorityColors[t.priority]}>{t.priority}</Badge>
                  <span className="text-xs text-muted-foreground">{formatDate(t.createdAt)}</span>
                </div>
              </div>
              <span className="text-sm text-muted-foreground">{t.messages.length} msg(s)</span>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
