import { useParams, Link } from "react-router-dom";
import { useData } from "@/contexts/DataContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ArrowLeft, ExternalLink, Mail, Phone, Globe, Building, MapPin } from "lucide-react";
import { formatDate } from "@/lib/calculations";
import type { Lead } from "@/lib/mock-data";

export default function LeadDetailPage() {
  const { id } = useParams<{ id: string }>();
  const { leads, setLeads } = useData();
  const lead = leads.find((l) => l.id === id);

  if (!lead) {
    return (
      <div className="text-center py-20">
        <p className="text-muted-foreground">Lead not found</p>
        <Link to="/leads" className="text-primary hover:underline mt-2 inline-block">Back to leads</Link>
      </div>
    );
  }

  const updateLead = (updates: Partial<Lead>) => {
    setLeads((prev) => prev.map((l) => (l.id === id ? { ...l, ...updates } : l)));
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center gap-4">
        <Link to="/leads" className="rounded-lg p-2 hover:bg-secondary"><ArrowLeft className="h-5 w-5" /></Link>
        <div className="flex items-center gap-4 flex-1">
          <img src={lead.avatar} alt="" className="h-12 w-12 rounded-full bg-secondary" />
          <div>
            <h1 className="text-xl font-bold">{lead.firstName} {lead.lastName}</h1>
            <p className="text-sm text-muted-foreground">{lead.title} at {lead.company}</p>
          </div>
        </div>
        <Button variant="outline" asChild>
          <a href={lead.linkedinUrl} target="_blank" rel="noopener noreferrer">
            <ExternalLink className="mr-2 h-4 w-4" /> LinkedIn
          </a>
        </Button>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader><CardTitle>Contact Information</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-center gap-2 text-sm"><Mail className="h-4 w-4 text-muted-foreground" />{lead.email}</div>
                <div className="flex items-center gap-2 text-sm"><Phone className="h-4 w-4 text-muted-foreground" />{lead.phone || "N/A"}</div>
                <div className="flex items-center gap-2 text-sm"><Building className="h-4 w-4 text-muted-foreground" />{lead.company}</div>
                <div className="flex items-center gap-2 text-sm"><MapPin className="h-4 w-4 text-muted-foreground" />{lead.location}</div>
                <div className="flex items-center gap-2 text-sm"><Globe className="h-4 w-4 text-muted-foreground" />{lead.website || "N/A"}</div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader><CardTitle>Notes</CardTitle></CardHeader>
            <CardContent>
              <Textarea
                value={lead.notes}
                onChange={(e) => updateLead({ notes: e.target.value })}
                placeholder="Add notes about this lead..."
                rows={4}
              />
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader><CardTitle>Status</CardTitle></CardHeader>
            <CardContent>
              <Select value={lead.status} onValueChange={(v) => updateLead({ status: v as Lead["status"] })}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="new">New</SelectItem>
                  <SelectItem value="contacted">Contacted</SelectItem>
                  <SelectItem value="replied">Replied</SelectItem>
                  <SelectItem value="interested">Interested</SelectItem>
                  <SelectItem value="not_interested">Not Interested</SelectItem>
                  <SelectItem value="converted">Converted</SelectItem>
                </SelectContent>
              </Select>
            </CardContent>
          </Card>

          <Card>
            <CardHeader><CardTitle>Details</CardTitle></CardHeader>
            <CardContent className="space-y-3 text-sm">
              <div className="flex justify-between"><span className="text-muted-foreground">Industry</span><span>{lead.industry}</span></div>
              <div className="flex justify-between"><span className="text-muted-foreground">Company Size</span><span>{lead.companySize || "N/A"}</span></div>
              <div className="flex justify-between"><span className="text-muted-foreground">Enriched</span><Badge variant={lead.enriched ? "default" : "secondary"} className="text-xs">{lead.enriched ? "Yes" : "No"}</Badge></div>
              <div className="flex justify-between"><span className="text-muted-foreground">Added</span><span>{formatDate(lead.createdAt)}</span></div>
              <div className="flex justify-between"><span className="text-muted-foreground">Last Contacted</span><span>{lead.lastContactedAt ? formatDate(lead.lastContactedAt) : "Never"}</span></div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
