import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MOCK_TEMPLATES, MOCK_CONTACTS } from "@/lib/mock-data";
import { STORAGE_KEYS } from "@/lib/constants";
import { getStorageItem, setStorageItem } from "@/lib/storage";
import { generateId } from "@/lib/calculations";
import type { Campaign } from "@/lib/types";
import { toast } from "sonner";

export default function CampaignCreatePage() {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [type, setType] = useState<"bulk" | "drip">("bulk");
  const [templateId, setTemplateId] = useState("");
  const [message, setMessage] = useState("");

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name) { toast.error("Please enter a campaign name"); return; }
    const newCampaign: Campaign = {
      id: generateId(),
      name,
      status: "draft",
      type,
      templateId: templateId || undefined,
      contactIds: [],
      sentCount: 0,
      deliveredCount: 0,
      repliedCount: 0,
      optOutCount: 0,
      createdAt: new Date().toISOString(),
    };
    const existing = getStorageItem<Campaign[]>(STORAGE_KEYS.CAMPAIGNS, []);
    setStorageItem(STORAGE_KEYS.CAMPAIGNS, [...existing, newCampaign]);
    toast.success("Campaign created!");
    navigate("/dashboard/campaigns");
  };

  return (
    <div className="space-y-6 animate-fade-in max-w-2xl">
      <div className="flex items-center gap-3">
        <Button variant="ghost" size="icon" onClick={() => navigate(-1)}><ArrowLeft className="w-4 h-4" /></Button>
        <div><h1 className="text-2xl font-heading font-bold text-foreground">Create Campaign</h1><p className="text-sm text-muted-foreground">Set up a new SMS campaign</p></div>
      </div>
      <form onSubmit={handleCreate}>
        <Card>
          <CardHeader><CardTitle>Campaign Details</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <div><Label>Campaign Name</Label><Input placeholder="e.g. Holiday Special Offer" value={name} onChange={(e) => setName(e.target.value)} /></div>
            <div><Label>Campaign Type</Label>
              <Select value={type} onValueChange={(v: "bulk" | "drip") => setType(v)}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent><SelectItem value="bulk">Bulk SMS</SelectItem><SelectItem value="drip">Drip Campaign</SelectItem></SelectContent>
              </Select>
            </div>
            <div><Label>Template (Optional)</Label>
              <Select value={templateId} onValueChange={setTemplateId}>
                <SelectTrigger><SelectValue placeholder="Select a template" /></SelectTrigger>
                <SelectContent>{MOCK_TEMPLATES.map((t) => <SelectItem key={t.id} value={t.id}>{t.name}</SelectItem>)}</SelectContent>
              </Select>
            </div>
            <div><Label>Message</Label><Textarea placeholder="Type your message..." value={message} onChange={(e) => setMessage(e.target.value)} rows={4} /></div>
            <div className="bg-secondary rounded-lg p-4">
              <p className="text-sm font-medium text-foreground mb-1">Audience</p>
              <p className="text-sm text-muted-foreground">{MOCK_CONTACTS.filter(c => c.status === "active").length} active contacts available</p>
            </div>
            <div className="flex gap-3 pt-2">
              <Button type="submit" className="flex-1">Create Campaign</Button>
              <Button type="button" variant="outline" onClick={() => navigate(-1)}>Cancel</Button>
            </div>
          </CardContent>
        </Card>
      </form>
    </div>
  );
}
