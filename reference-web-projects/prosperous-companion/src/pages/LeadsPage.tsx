import { useData } from "@/contexts/DataContext";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Checkbox } from "@/components/ui/checkbox";
import { Plus, Search, Upload, Download, Trash2, Eye } from "lucide-react";
import { useState } from "react";
import { Link } from "react-router-dom";
import { formatDate, generateId } from "@/lib/calculations";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";

const statusColors: Record<string, string> = {
  new: "bg-info/10 text-info",
  contacted: "bg-primary/10 text-primary",
  replied: "bg-success/10 text-success",
  interested: "bg-warning/10 text-warning",
  not_interested: "bg-destructive/10 text-destructive",
  converted: "bg-success/10 text-success",
};

export default function LeadsPage() {
  const { leads, setLeads } = useData();
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [newLead, setNewLead] = useState({ firstName: "", lastName: "", email: "", company: "", title: "" });

  const filtered = leads.filter((l) => {
    const name = `${l.firstName} ${l.lastName} ${l.company} ${l.email}`.toLowerCase();
    const matchesSearch = name.includes(search.toLowerCase());
    const matchesStatus = statusFilter === "all" || l.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const toggleAll = () => {
    if (selected.size === filtered.length) setSelected(new Set());
    else setSelected(new Set(filtered.map((l) => l.id)));
  };

  const toggleOne = (id: string) => {
    const next = new Set(selected);
    if (next.has(id)) next.delete(id);
    else next.add(id);
    setSelected(next);
  };

  const handleDelete = () => {
    setLeads((prev) => prev.filter((l) => !selected.has(l.id)));
    setSelected(new Set());
  };

  const handleAddLead = () => {
    if (!newLead.firstName || !newLead.lastName) return;
    const lead = {
      id: generateId(),
      ...newLead,
      linkedinUrl: `https://linkedin.com/in/${newLead.firstName.toLowerCase()}-${newLead.lastName.toLowerCase()}`,
      location: "Unknown",
      industry: "SaaS",
      status: "new" as const,
      tags: [],
      notes: "",
      avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${newLead.firstName}${newLead.lastName}`,
      createdAt: new Date().toISOString(),
      enriched: false,
    };
    setLeads((prev) => [lead, ...prev]);
    setNewLead({ firstName: "", lastName: "", email: "", company: "", title: "" });
    setShowAddDialog(false);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Leads</h1>
          <p className="text-muted-foreground">{leads.length} total leads</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline"><Upload className="mr-2 h-4 w-4" /> Import</Button>
          <Button variant="outline"><Download className="mr-2 h-4 w-4" /> Export</Button>
          <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
            <DialogTrigger asChild>
              <Button><Plus className="mr-2 h-4 w-4" /> Add Lead</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader><DialogTitle>Add New Lead</DialogTitle></DialogHeader>
              <div className="space-y-3">
                <div className="grid grid-cols-2 gap-3">
                  <div><Label>First Name</Label><Input value={newLead.firstName} onChange={(e) => setNewLead((p) => ({ ...p, firstName: e.target.value }))} /></div>
                  <div><Label>Last Name</Label><Input value={newLead.lastName} onChange={(e) => setNewLead((p) => ({ ...p, lastName: e.target.value }))} /></div>
                </div>
                <div><Label>Email</Label><Input value={newLead.email} onChange={(e) => setNewLead((p) => ({ ...p, email: e.target.value }))} /></div>
                <div><Label>Company</Label><Input value={newLead.company} onChange={(e) => setNewLead((p) => ({ ...p, company: e.target.value }))} /></div>
                <div><Label>Title</Label><Input value={newLead.title} onChange={(e) => setNewLead((p) => ({ ...p, title: e.target.value }))} /></div>
                <Button onClick={handleAddLead} className="w-full">Add Lead</Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <div className="flex gap-3">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input placeholder="Search leads..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-9" />
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-40"><SelectValue placeholder="Status" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="new">New</SelectItem>
            <SelectItem value="contacted">Contacted</SelectItem>
            <SelectItem value="replied">Replied</SelectItem>
            <SelectItem value="interested">Interested</SelectItem>
            <SelectItem value="not_interested">Not Interested</SelectItem>
            <SelectItem value="converted">Converted</SelectItem>
          </SelectContent>
        </Select>
        {selected.size > 0 && (
          <Button variant="destructive" size="sm" onClick={handleDelete}>
            <Trash2 className="mr-2 h-4 w-4" /> Delete ({selected.size})
          </Button>
        )}
      </div>

      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-10"><Checkbox checked={selected.size === filtered.length && filtered.length > 0} onCheckedChange={toggleAll} /></TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Company</TableHead>
                <TableHead>Title</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Location</TableHead>
                <TableHead>Added</TableHead>
                <TableHead className="w-10"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.slice(0, 50).map((l) => (
                <TableRow key={l.id}>
                  <TableCell><Checkbox checked={selected.has(l.id)} onCheckedChange={() => toggleOne(l.id)} /></TableCell>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <img src={l.avatar} alt="" className="h-8 w-8 rounded-full bg-secondary" />
                      <div>
                        <Link to={`/leads/${l.id}`} className="font-medium hover:text-primary">{l.firstName} {l.lastName}</Link>
                        <p className="text-xs text-muted-foreground">{l.email}</p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="text-sm">{l.company}</TableCell>
                  <TableCell className="text-sm">{l.title}</TableCell>
                  <TableCell><Badge className={`${statusColors[l.status]} border-0 text-xs`}>{l.status.replace("_", " ")}</Badge></TableCell>
                  <TableCell className="text-sm text-muted-foreground">{l.location}</TableCell>
                  <TableCell className="text-sm text-muted-foreground">{formatDate(l.createdAt)}</TableCell>
                  <TableCell>
                    <Link to={`/leads/${l.id}`} className="rounded p-1 hover:bg-secondary inline-block"><Eye className="h-4 w-4 text-muted-foreground" /></Link>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          {filtered.length === 0 && <div className="text-center py-12 text-muted-foreground">No leads found</div>}
        </CardContent>
      </Card>
    </div>
  );
}
