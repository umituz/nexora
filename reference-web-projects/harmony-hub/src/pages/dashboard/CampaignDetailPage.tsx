import { useParams, useNavigate, Link } from "react-router-dom";
import { mockCampaigns, type Campaign } from "@/data/mock-data";
import { useLocalStorage } from "@/hooks/use-local-storage";
import { ArrowLeft } from "lucide-react";
import { calculateConversionRate } from "@/lib/calculations";
import { cn } from "@/lib/utils";

export default function CampaignDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [campaigns] = useLocalStorage<Campaign[]>("dmchamp_campaigns", mockCampaigns);
  const campaign = campaigns.find((c) => c.id === id);
  if (!campaign) return <div className="py-20 text-center text-muted-foreground">Not found. <Link to="/dashboard/campaigns" className="text-primary">Back</Link></div>;

  const openRate = calculateConversionRate(campaign.openedCount, campaign.sentCount);
  const replyRate = calculateConversionRate(campaign.repliedCount, campaign.sentCount);
  const convRate = calculateConversionRate(campaign.convertedCount, campaign.sentCount);

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground"><ArrowLeft className="h-4 w-4" /> Back</button>
      <h1 className="font-heading text-2xl font-bold">{campaign.name}</h1>
      <p className="text-sm text-muted-foreground">{campaign.type} · {campaign.channel} · {campaign.agentName}</p>
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        {[{ l: "Sent", v: campaign.sentCount }, { l: "Open Rate", v: `${openRate}%` }, { l: "Reply Rate", v: `${replyRate}%` }, { l: "Conv. Rate", v: `${convRate}%` }].map((s) => (
          <div key={s.l} className="rounded-xl border border-border bg-card p-4"><p className="text-xs text-muted-foreground">{s.l}</p><p className="mt-1 font-heading text-lg font-bold">{s.v}</p></div>
        ))}
      </div>
      <div className="rounded-xl border border-border bg-card p-6">
        <p className="text-xs font-medium text-muted-foreground">Message</p>
        <p className="mt-2 text-sm">{campaign.message}</p>
      </div>
    </div>
  );
}
