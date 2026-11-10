import { useState } from "react";
import { Link } from "react-router-dom";
import { Plus, Search, Upload, MoreHorizontal, Eye } from "lucide-react";
import { MOCK_CONTACTS } from "@/lib/mock-data";
import { formatDate, formatPhoneNumber } from "@/lib/calculations";
import { getStorageItem, setStorageItem } from "@/lib/storage";
import { STORAGE_KEYS } from "@/lib/constants";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import type { Contact } from "@/lib/types";
import { generateId } from "@/lib/calculations";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

export default function ContactsPage() {
  const [contacts, setContacts] = useState<Contact[]>(() => getStorageItem(STORAGE_KEYS.CONTACTS, MOCK_CONTACTS));
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");
  const [addOpen, setAddOpen] = useState(false);
  const [newContact, setNewContact] = useState({ firstName: "", lastName: "", phone: "", email: "" });

  const filtered = contacts.filter((c) => {
    const matchSearch = `${c.firstName} ${c.lastName} ${c.phone}`.toLowerCase().includes(search.toLowerCase());
    const matchFilter = filter === "all" || c.status === filter;
    return matchSearch && matchFilter;
  });

  const handleAdd = () => {
    if (!newContact.firstName || !newContact.phone) { toast.error("Name and phone required"); return; }
    const contact: Contact = {
      id: generateId(),
      firstName: newContact.firstName,
      lastName: newContact.lastName,
      phone: newContact.phone,
      email: newContact.email || undefined,
      tags: [],
      status: "active",
      createdAt: new Date().toISOString(),
    };
    const updated = [contact, ...contacts];
    setContacts(updated);
    setStorageItem(STORAGE_KEYS.CONTACTS, updated);
    setNewContact({ firstName: "", lastName: "", phone: "", email: "" });
    setAddOpen(false);
    toast.success("Contact added!");
  };

  const handleDelete = (id: string) => {
    const updated = contacts.filter((c) => c.id !== id);
    setContacts(updated);
    setStorageItem(STORAGE_KEYS.CONTACTS, updated);
    toast.success("Contact deleted");
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div><h1 className="text-2xl font-heading font-bold text-foreground">Contacts</h1><p className="text-sm text-muted-foreground">{contacts.length} total contacts</p></div>
        <div className="flex gap-2">
          <Button variant="outline" asChild><Link to="/dashboard/contacts/import" className="gap-2"><Upload className="w-4 h-4" />Import</Link></Button>
          <Dialog open={addOpen} onOpenChange={setAddOpen}>
            <DialogTrigger asChild><Button className="gap-2"><Plus className="w-4 h-4" />Add Contact</Button></DialogTrigger>
            <DialogContent>
              <DialogHeader><DialogTitle>Add New Contact</DialogTitle></DialogHeader>
              <div className="space-y-4 pt-2">
                <div className="grid grid-cols-2 gap-3">
                  <div><Label>First Name</Label><Input value={newContact.firstName} onChange={(e) => setNewContact(p => ({ ...p, firstName: e.target.value }))} /></div>
                  <div><Label>Last Name</Label><Input value={newContact.lastName} onChange={(e) => setNewContact(p => ({ ...p, lastName: e.target.value }))} /></div>
                </div>
                <div><Label>Phone</Label><Input value={newContact.phone} onChange={(e) => setNewContact(p => ({ ...p, phone: e.target.value }))} placeholder="+1 (555) 123-4567" /></div>
                <div><Label>Email (Optional)</Label><Input type="email" value={newContact.email} onChange={(e) => setNewContact(p => ({ ...p, email: e.target.value }))} /></div>
                <Button onClick={handleAdd} className="w-full">Add Contact</Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1"><Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" /><Input placeholder="Search contacts..." className="pl-9" value={search} onChange={(e) => setSearch(e.target.value)} /></div>
        <div className="flex gap-2">
          {["all", "active", "opted-out", "bounced"].map((f) => (
            <Button key={f} variant={filter === f ? "default" : "outline"} size="sm" onClick={() => setFilter(f)} className="capitalize">{f}</Button>
          ))}
        </div>
      </div>

      <div className="space-y-2">
        {filtered.map((c) => (
          <Card key={c.id}>
            <CardContent className="p-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                  <span className="text-sm font-semibold text-primary">{c.firstName[0]}{c.lastName?.[0]}</span>
                </div>
                <div>
                  <p className="font-medium text-foreground">{c.firstName} {c.lastName}</p>
                  <p className="text-xs text-muted-foreground">{formatPhoneNumber(c.phone)}{c.email ? ` · ${c.email}` : ""}</p>
                  <div className="flex gap-1 mt-1 flex-wrap">
                    {c.tags.map((tag) => <span key={tag} className="px-1.5 py-0.5 rounded text-[10px] bg-primary/10 text-primary">{tag}</span>)}
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span className={`px-2 py-0.5 rounded-full text-xs ${c.status === "active" ? "bg-success/10 text-success" : c.status === "opted-out" ? "bg-warning/10 text-warning" : "bg-destructive/10 text-destructive"}`}>{c.status}</span>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild><Button variant="ghost" size="icon"><MoreHorizontal className="w-4 h-4" /></Button></DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem asChild><Link to={`/dashboard/contacts/${c.id}`}><Eye className="w-4 h-4 mr-2" />View</Link></DropdownMenuItem>
                    <DropdownMenuItem onClick={() => handleDelete(c.id)} className="text-destructive">Delete</DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </CardContent>
          </Card>
        ))}
        {filtered.length === 0 && <div className="text-center py-12 text-muted-foreground">No contacts found</div>}
      </div>
    </div>
  );
}
