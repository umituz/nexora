import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, MessageSquare } from "lucide-react";
import { MOCK_CONTACTS, MOCK_CONVERSATIONS } from "@/lib/mock-data";
import { formatPhoneNumber, formatDate } from "@/lib/calculations";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function ContactDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const contact = MOCK_CONTACTS.find((c) => c.id === id);
  const conversation = MOCK_CONVERSATIONS.find((c) => c.contactId === id);

  if (!contact) return <div className="text-center py-12 text-muted-foreground">Contact not found</div>;

  return (
    <div className="space-y-6 animate-fade-in max-w-2xl">
      <div className="flex items-center gap-3">
        <Button variant="ghost" size="icon" onClick={() => navigate(-1)}><ArrowLeft className="w-4 h-4" /></Button>
        <div>
          <h1 className="text-2xl font-heading font-bold text-foreground">{contact.firstName} {contact.lastName}</h1>
          <p className="text-sm text-muted-foreground">{formatPhoneNumber(contact.phone)}</p>
        </div>
      </div>
      <div className="grid gap-6">
        <Card>
          <CardHeader><CardTitle className="text-base">Contact Info</CardTitle></CardHeader>
          <CardContent className="space-y-3">
            <div className="flex justify-between py-2 border-b"><span className="text-sm text-muted-foreground">Phone</span><span className="text-sm text-foreground">{formatPhoneNumber(contact.phone)}</span></div>
            {contact.email && <div className="flex justify-between py-2 border-b"><span className="text-sm text-muted-foreground">Email</span><span className="text-sm text-foreground">{contact.email}</span></div>}
            <div className="flex justify-between py-2 border-b"><span className="text-sm text-muted-foreground">Status</span><span className={`text-sm px-2 py-0.5 rounded-full ${contact.status === "active" ? "bg-success/10 text-success" : "bg-warning/10 text-warning"}`}>{contact.status}</span></div>
            {contact.segment && <div className="flex justify-between py-2 border-b"><span className="text-sm text-muted-foreground">Segment</span><span className="text-sm text-foreground">{contact.segment}</span></div>}
            <div className="flex justify-between py-2 border-b"><span className="text-sm text-muted-foreground">Added</span><span className="text-sm text-foreground">{formatDate(contact.createdAt)}</span></div>
            {contact.lastContactedAt && <div className="flex justify-between py-2"><span className="text-sm text-muted-foreground">Last Contacted</span><span className="text-sm text-foreground">{formatDate(contact.lastContactedAt)}</span></div>}
          </CardContent>
        </Card>
        <Card>
          <CardHeader><CardTitle className="text-base">Tags</CardTitle></CardHeader>
          <CardContent>
            <div className="flex gap-2 flex-wrap">
              {contact.tags.length > 0 ? contact.tags.map((t) => <span key={t} className="px-3 py-1 rounded-full text-sm bg-primary/10 text-primary">{t}</span>) : <span className="text-sm text-muted-foreground">No tags</span>}
            </div>
          </CardContent>
        </Card>
        {conversation && (
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-base">Recent Messages</CardTitle>
              <Button variant="ghost" size="sm" onClick={() => navigate(`/dashboard/conversations/${conversation.id}`)} className="gap-1"><MessageSquare className="w-4 h-4" />View Conversation</Button>
            </CardHeader>
            <CardContent className="space-y-3">
              {conversation.messages.slice(-3).map((m) => (
                <div key={m.id} className={`p-3 rounded-lg text-sm ${m.direction === "outbound" ? "bg-primary/10 ml-8" : "bg-secondary mr-8"}`}>
                  <p className="text-foreground">{m.body}</p>
                  <p className="text-xs text-muted-foreground mt-1">{formatDate(m.timestamp)}</p>
                </div>
              ))}
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
