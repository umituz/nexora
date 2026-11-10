import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { MOCK_CAMPAIGNS } from "@/lib/mock-data";
import { formatNumber, formatDate, calculateDeliveryRate, calculateReplyRate, calculateOptOutRate } from "@/lib/calculations";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

export default function CampaignDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const campaign = MOCK_CAMPAIGNS.find((c) => c.id === id);

  if (!campaign) return <div className="text-center py-12 text-muted-foreground">Campaign not found</div>;

  const deliveryRate = calculateDeliveryRate(campaign);
  const replyRate = calculateReplyRate(campaign);
  const optOutRate = calculateOptOutRate(campaign);

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center gap-3">
        <Button variant="ghost" size="icon" onClick={() => navigate(-1)}><ArrowLeft className="w-4 h-4" /></Button>
        <div>
          <h1 className="text-2xl font-heading font-bold text-foreground">{campaign.name}</h1>
          <p className="text-sm text-muted-foreground">Created {formatDate(campaign.createdAt)}</p>
        </div>
        <span className={`ml-3 px-2 py-1 rounded-full text-xs font-medium ${
          campaign.status === "active" ? "bg-success/10 text-success" :
          campaign.status === "completed" ? "bg-info/10 text-info" :
          campaign.status === "paused" ? "bg-warning/10 text-warning" :
          "bg-muted text-muted-foreground"
        }`}>{campaign.status}</span>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "Messages Sent", value: formatNumber(campaign.sentCount) },
          { label: "Delivery Rate", value: `${deliveryRate}%` },
          { label: "Reply Rate", value: `${replyRate}%` },
          { label: "Opt-Out Rate", value: `${optOutRate}%` },
        ].map((s) => (
          <Card key={s.label}><CardContent className="p-5"><p className="text-2xl font-heading font-bold text-foreground">{s.value}</p><p className="text-xs text-muted-foreground mt-1">{s.label}</p></CardContent></Card>
        ))}
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader><CardTitle className="text-base">Delivery Funnel</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <div><div className="flex justify-between text-sm mb-1"><span className="text-muted-foreground">Sent</span><span className="text-foreground font-medium">{formatNumber(campaign.sentCount)}</span></div><Progress value={100} /></div>
            <div><div className="flex justify-between text-sm mb-1"><span className="text-muted-foreground">Delivered</span><span className="text-foreground font-medium">{formatNumber(campaign.deliveredCount)}</span></div><Progress value={deliveryRate} /></div>
            <div><div className="flex justify-between text-sm mb-1"><span className="text-muted-foreground">Replied</span><span className="text-foreground font-medium">{formatNumber(campaign.repliedCount)}</span></div><Progress value={replyRate} className="[&>div]:bg-info" /></div>
            <div><div className="flex justify-between text-sm mb-1"><span className="text-muted-foreground">Opt-Outs</span><span className="text-foreground font-medium">{formatNumber(campaign.optOutCount)}</span></div><Progress value={optOutRate} className="[&>div]:bg-destructive" /></div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader><CardTitle className="text-base">Campaign Info</CardTitle></CardHeader>
          <CardContent className="space-y-3">
            <div className="flex justify-between py-2 border-b"><span className="text-sm text-muted-foreground">Type</span><span className="text-sm font-medium text-foreground capitalize">{campaign.type}</span></div>
            <div className="flex justify-between py-2 border-b"><span className="text-sm text-muted-foreground">Contacts</span><span className="text-sm font-medium text-foreground">{campaign.contactIds.length}</span></div>
            <div className="flex justify-between py-2 border-b"><span className="text-sm text-muted-foreground">Created</span><span className="text-sm font-medium text-foreground">{formatDate(campaign.createdAt)}</span></div>
            {campaign.completedAt && <div className="flex justify-between py-2"><span className="text-sm text-muted-foreground">Completed</span><span className="text-sm font-medium text-foreground">{formatDate(campaign.completedAt)}</span></div>}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
