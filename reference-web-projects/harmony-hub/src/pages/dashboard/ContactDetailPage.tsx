import { useParams, useNavigate, Link } from "react-router-dom";
import { mockContacts, type Contact } from "@/data/mock-data";
import { useLocalStorage } from "@/hooks/use-local-storage";
import { ArrowLeft, Mail, Phone } from "lucide-react";
import { formatCurrency } from "@/lib/calculations";

export default function ContactDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [contacts] = useLocalStorage<Contact[]>("dmchamp_contacts", mockContacts);
  const contact = contacts.find((c) => c.id === id);
  if (!contact) return <div className="py-20 text-center text-muted-foreground">Not found. <Link to="/dashboard/contacts" className="text-primary">Back</Link></div>;

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground"><ArrowLeft className="h-4 w-4" /> Back</button>
      <div className="rounded-xl border border-border bg-card p-6">
        <div className="flex items-center gap-4">
          <div className="flex h-14 w-14 items-center justify-center rounded-full bg-primary/10 text-lg font-bold text-primary">{contact.name.split(" ").map((n) => n[0]).join("")}</div>
          <div>
            <h1 className="font-heading text-xl font-bold">{contact.name}</h1>
            <div className="flex items-center gap-3 text-sm text-muted-foreground">
              <span className="flex items-center gap-1"><Mail className="h-3 w-3" />{contact.email}</span>
              <span className="flex items-center gap-1"><Phone className="h-3 w-3" />{contact.phone}</span>
            </div>
          </div>
        </div>
        <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-4">
          <div><p className="text-xs text-muted-foreground">Score</p><p className="font-heading text-lg font-bold">{contact.score}</p></div>
          <div><p className="text-xs text-muted-foreground">Status</p><p className="font-heading text-lg font-bold capitalize">{contact.status}</p></div>
          <div><p className="text-xs text-muted-foreground">Revenue</p><p className="font-heading text-lg font-bold">{formatCurrency(contact.totalRevenue)}</p></div>
          <div><p className="text-xs text-muted-foreground">Conversations</p><p className="font-heading text-lg font-bold">{contact.totalConversations}</p></div>
        </div>
        <div className="mt-4 flex flex-wrap gap-1">{contact.tags.map((t) => <span key={t} className="rounded-full bg-accent px-2 py-0.5 text-xs">{t}</span>)}</div>
        {contact.notes && <div className="mt-4 rounded-lg bg-secondary p-3 text-sm text-muted-foreground">{contact.notes}</div>}
      </div>
    </div>
  );
}
