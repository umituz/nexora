import { useData } from "@/contexts/DataContext";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Plus, Trash2, Ban } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useState } from "react";
import { generateId, formatDate } from "@/lib/calculations";
import type { BlacklistEntry } from "@/lib/mock-data";

export default function BlacklistPage() {
  const { blacklist, setBlacklist } = useData();
  const [showAdd, setShowAdd] = useState(false);
  const [form, setForm] = useState({ type: "domain" as BlacklistEntry["type"], value: "", reason: "" });

  const handleAdd = () => {
    if (!form.value) return;
    setBlacklist((prev) => [...prev, { id: generateId(), ...form, createdAt: new Date().toISOString() }]);
    setForm({ type: "domain", value: "", reason: "" }); setShowAdd(false);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div><h1 className="text-2xl font-bold">Blacklist</h1><p className="text-muted-foreground">{blacklist.length} entries</p></div>
        <Dialog open={showAdd} onOpenChange={setShowAdd}>
          <DialogTrigger asChild><Button><Plus className="mr-2 h-4 w-4" /> Add Entry</Button></DialogTrigger>
          <DialogContent>
            <DialogHeader><DialogTitle>Add to Blacklist</DialogTitle></DialogHeader>
            <div className="space-y-3">
              <div><Label>Type</Label><Select value={form.type} onValueChange={(v) => setForm((p) => ({ ...p, type: v as BlacklistEntry["type"] }))}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent><SelectItem value="domain">Domain</SelectItem><SelectItem value="email">Email</SelectItem><SelectItem value="company">Company</SelectItem><SelectItem value="linkedin_url">LinkedIn URL</SelectItem></SelectContent></Select></div>
              <div><Label>Value</Label><Input value={form.value} onChange={(e) => setForm((p) => ({ ...p, value: e.target.value }))} /></div>
              <div><Label>Reason</Label><Input value={form.reason} onChange={(e) => setForm((p) => ({ ...p, reason: e.target.value }))} /></div>
              <Button onClick={handleAdd} className="w-full">Add to Blacklist</Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>
      <Card><CardContent className="p-0">
        <Table>
          <TableHeader><TableRow><TableHead>Type</TableHead><TableHead>Value</TableHead><TableHead>Reason</TableHead><TableHead>Added</TableHead><TableHead className="w-10"></TableHead></TableRow></TableHeader>
          <TableBody>
            {blacklist.map((b) => (
              <TableRow key={b.id}>
                <TableCell><Badge variant="secondary" className="text-xs">{b.type}</Badge></TableCell>
                <TableCell className="font-medium">{b.value}</TableCell>
                <TableCell className="text-muted-foreground text-sm">{b.reason}</TableCell>
                <TableCell className="text-muted-foreground text-sm">{formatDate(b.createdAt)}</TableCell>
                <TableCell><button onClick={() => setBlacklist((prev) => prev.filter((x) => x.id !== b.id))} className="rounded p-1 hover:bg-destructive/10 text-muted-foreground hover:text-destructive"><Trash2 className="h-4 w-4" /></button></TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent></Card>
    </div>
  );
}
