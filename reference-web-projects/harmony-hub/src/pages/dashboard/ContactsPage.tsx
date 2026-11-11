import { useState } from "react";
import { mockContacts, type Contact } from "@/data/mock-data";
import { useLocalStorage } from "@/hooks/use-local-storage";
import { Link } from "react-router-dom";
import { Search, Plus } from "lucide-react";
import { cn } from "@/lib/utils";
import { formatCurrency } from "@/lib/calculations";
import { toast } from "sonner";

export default function ContactsPage() {
  const [contacts, setContacts] = useLocalStorage<Contact[]>("dmchamp_contacts", mockContacts);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");
  const filtered = contacts.filter((c) => c.name.toLowerCase().includes(search.toLowerCase()) && (filter === "all" || c.status === filter));
  const statusColors: Record<string, string> = { lead: "bg-info/10 text-info", qualified: "bg-warning/10 text-warning", customer: "bg-success/10 text-success", churned: "bg-muted text-muted-foreground" };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between"><h1 className="font-heading text-2xl font-bold">Contacts</h1></div>
      <div className="flex flex-wrap gap-3">
        <div className="relative max-w-sm flex-1"><Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" /><input type="text" placeholder="Search..." value={search} onChange={(e) => setSearch(e.target.value)} className="w-full rounded-lg border border-input bg-background py-2 pl-10 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-ring" /></div>
        <div className="flex gap-1">{["all","lead","qualified","customer","churned"].map((s) => <button key={s} onClick={() => setFilter(s)} className={cn("rounded-lg px-3 py-1.5 text-xs font-medium capitalize", filter === s ? "bg-primary text-primary-foreground" : "bg-secondary text-muted-foreground")}>{s}</button>)}</div>
      </div>
      <div className="overflow-x-auto rounded-xl border border-border">
        <table className="w-full text-sm">
          <thead><tr className="border-b border-border bg-secondary/50"><th className="px-4 py-3 text-left font-medium">Name</th><th className="px-4 py-3 text-left font-medium">Status</th><th className="px-4 py-3 text-left font-medium">Score</th><th className="px-4 py-3 text-left font-medium">Channel</th><th className="px-4 py-3 text-left font-medium">Revenue</th><th className="px-4 py-3 text-left font-medium">Tags</th></tr></thead>
          <tbody>{filtered.map((c) => (
            <tr key={c.id} className="border-b border-border last:border-0 hover:bg-secondary/30">
              <td className="px-4 py-3"><Link to={`/dashboard/contacts/${c.id}`} className="font-medium hover:text-primary">{c.name}</Link><p className="text-xs text-muted-foreground">{c.email}</p></td>
              <td className="px-4 py-3"><span className={cn("rounded-full px-2 py-0.5 text-xs font-medium", statusColors[c.status])}>{c.status}</span></td>
              <td className="px-4 py-3 font-medium">{c.score}</td>
              <td className="px-4 py-3 text-muted-foreground">{c.channel}</td>
              <td className="px-4 py-3">{formatCurrency(c.totalRevenue)}</td>
              <td className="px-4 py-3"><div className="flex flex-wrap gap-1">{c.tags.slice(0,2).map((t) => <span key={t} className="rounded bg-accent px-1.5 py-0.5 text-[10px]">{t}</span>)}</div></td>
            </tr>
          ))}</tbody>
        </table>
      </div>
    </div>
  );
}
