import { useData } from "@/contexts/DataContext";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, Mic, Play, Trash2 } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import { generateId, formatDate } from "@/lib/calculations";

export default function VoiceNotesPage() {
  const { voiceNotes, setVoiceNotes } = useData();
  const [showCreate, setShowCreate] = useState(false);
  const [name, setName] = useState("");

  const handleCreate = () => {
    if (!name) return;
    setVoiceNotes((prev) => [
      { id: generateId(), name, duration: Math.floor(Math.random() * 20) + 5, url: "#", usageCount: 0, createdAt: new Date().toISOString() },
      ...prev,
    ]);
    setName("");
    setShowCreate(false);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Voice Notes</h1>
          <p className="text-muted-foreground">Record and manage voice notes for campaigns</p>
        </div>
        <Dialog open={showCreate} onOpenChange={setShowCreate}>
          <DialogTrigger asChild><Button><Plus className="mr-2 h-4 w-4" /> Record Voice Note</Button></DialogTrigger>
          <DialogContent>
            <DialogHeader><DialogTitle>New Voice Note</DialogTitle></DialogHeader>
            <div className="space-y-4">
              <div><Label>Name</Label><Input value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g., Warm Introduction" /></div>
              <div className="flex flex-col items-center gap-4 py-6">
                <div className="rounded-full bg-primary/10 p-6"><Mic className="h-8 w-8 text-primary" /></div>
                <p className="text-sm text-muted-foreground">Click to simulate recording</p>
              </div>
              <Button onClick={handleCreate} className="w-full">Save Voice Note</Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {voiceNotes.map((vn) => (
          <Card key={vn.id}>
            <CardContent className="p-5">
              <div className="flex items-center gap-3">
                <button className="rounded-full bg-primary/10 p-2.5 hover:bg-primary/20 transition-colors">
                  <Play className="h-4 w-4 text-primary" />
                </button>
                <div className="flex-1 min-w-0">
                  <p className="font-medium truncate">{vn.name}</p>
                  <p className="text-xs text-muted-foreground">{vn.duration}s · {vn.usageCount} uses</p>
                </div>
                <button onClick={() => setVoiceNotes((prev) => prev.filter((v) => v.id !== vn.id))} className="rounded p-1 hover:bg-destructive/10 text-muted-foreground hover:text-destructive">
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
              <div className="mt-3 h-8 bg-secondary rounded-full overflow-hidden flex items-center px-2">
                <div className="flex gap-[2px] items-end h-5 flex-1">
                  {Array.from({ length: 40 }, (_, i) => (
                    <div key={i} className="flex-1 bg-primary/40 rounded-full" style={{ height: `${Math.random() * 100}%` }} />
                  ))}
                </div>
              </div>
              <p className="text-xs text-muted-foreground mt-2">{formatDate(vn.createdAt)}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
