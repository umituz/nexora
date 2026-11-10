import { useParams, Link } from "react-router-dom";
import { useData } from "@/contexts/DataContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Play, Pause, Plus, Trash2, GripVertical } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { useState } from "react";
import { generateId } from "@/lib/calculations";
import type { SequenceStep } from "@/lib/mock-data";

const stepTypeLabels: Record<string, string> = {
  send_connection: "Send Connection Request",
  send_message: "Send Message",
  send_email: "Send Email",
  send_voice_note: "Send Voice Note",
  view_profile: "View Profile",
  like_post: "Like Post",
  endorse_skill: "Endorse Skill",
  wait: "Wait",
};

const stepTypeColors: Record<string, string> = {
  send_connection: "bg-info/10 text-info",
  send_message: "bg-primary/10 text-primary",
  send_email: "bg-warning/10 text-warning",
  send_voice_note: "bg-success/10 text-success",
  view_profile: "bg-secondary text-muted-foreground",
  like_post: "bg-secondary text-muted-foreground",
  endorse_skill: "bg-secondary text-muted-foreground",
  wait: "bg-muted text-muted-foreground",
};

export default function CampaignDetailPage() {
  const { id } = useParams<{ id: string }>();
  const { campaigns, setCampaigns } = useData();
  const campaign = campaigns.find((c) => c.id === id);

  if (!campaign) {
    return (
      <div className="text-center py-20">
        <p className="text-muted-foreground">Campaign not found</p>
        <Link to="/campaigns" className="text-primary hover:underline mt-2 inline-block">Back to campaigns</Link>
      </div>
    );
  }

  const updateCampaign = (updates: Partial<typeof campaign>) => {
    setCampaigns((prev) => prev.map((c) => (c.id === id ? { ...c, ...updates, updatedAt: new Date().toISOString() } : c)));
  };

  const addStep = (type: SequenceStep["type"]) => {
    const newStep: SequenceStep = {
      id: generateId(),
      type,
      content: type === "wait" ? undefined : "",
      delayDays: type === "wait" ? 3 : 0,
      order: campaign.sequenceSteps.length,
      aiEnabled: type === "send_message" || type === "send_connection",
    };
    updateCampaign({ sequenceSteps: [...campaign.sequenceSteps, newStep] });
  };

  const updateStep = (stepId: string, updates: Partial<SequenceStep>) => {
    updateCampaign({
      sequenceSteps: campaign.sequenceSteps.map((s) => (s.id === stepId ? { ...s, ...updates } : s)),
    });
  };

  const removeStep = (stepId: string) => {
    updateCampaign({
      sequenceSteps: campaign.sequenceSteps.filter((s) => s.id !== stepId).map((s, i) => ({ ...s, order: i })),
    });
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center gap-4">
        <Link to="/campaigns" className="rounded-lg p-2 hover:bg-secondary transition-colors">
          <ArrowLeft className="h-5 w-5" />
        </Link>
        <div className="flex-1">
          <Input
            value={campaign.name}
            onChange={(e) => updateCampaign({ name: e.target.value })}
            className="text-xl font-bold border-0 p-0 h-auto focus-visible:ring-0 bg-transparent"
          />
        </div>
        <Badge className={campaign.status === "active" ? "bg-success/10 text-success border-0" : "bg-secondary text-muted-foreground border-0"}>
          {campaign.status}
        </Badge>
        <Button
          variant={campaign.status === "active" ? "outline" : "default"}
          onClick={() => updateCampaign({ status: campaign.status === "active" ? "paused" : "active" })}
        >
          {campaign.status === "active" ? <><Pause className="mr-2 h-4 w-4" /> Pause</> : <><Play className="mr-2 h-4 w-4" /> Activate</>}
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        {[
          { label: "Leads", value: campaign.leadsCount },
          { label: "Sent", value: campaign.sentCount },
          { label: "Replied", value: campaign.repliedCount },
          { label: "Accepted", value: campaign.acceptedCount },
        ].map((s) => (
          <Card key={s.label}>
            <CardContent className="p-4 text-center">
              <p className="text-2xl font-bold">{s.value}</p>
              <p className="text-xs text-muted-foreground">{s.label}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader className="flex-row items-center justify-between">
          <CardTitle>Sequence Steps</CardTitle>
          <Select onValueChange={(v) => addStep(v as SequenceStep["type"])}>
            <SelectTrigger className="w-48">
              <Plus className="mr-2 h-4 w-4" />
              <SelectValue placeholder="Add step" />
            </SelectTrigger>
            <SelectContent>
              {Object.entries(stepTypeLabels).map(([key, label]) => (
                <SelectItem key={key} value={key}>{label}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {campaign.sequenceSteps.map((step, i) => (
              <div key={step.id} className="flex items-start gap-3 rounded-lg border border-border p-4">
                <GripVertical className="h-5 w-5 text-muted-foreground mt-0.5 cursor-grab" />
                <div className="flex-1 space-y-2">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-medium text-muted-foreground">Step {i + 1}</span>
                    <Badge className={`${stepTypeColors[step.type]} border-0 text-xs`}>{stepTypeLabels[step.type]}</Badge>
                    {step.type !== "wait" && (
                      <div className="ml-auto flex items-center gap-2">
                        <span className="text-xs text-muted-foreground">AI</span>
                        <Switch checked={step.aiEnabled} onCheckedChange={(v) => updateStep(step.id, { aiEnabled: v })} />
                      </div>
                    )}
                  </div>
                  {step.type === "wait" ? (
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-muted-foreground">Wait for</span>
                      <Input
                        type="number"
                        value={step.delayDays}
                        onChange={(e) => updateStep(step.id, { delayDays: parseInt(e.target.value) || 0 })}
                        className="w-20"
                        min={1}
                      />
                      <span className="text-sm text-muted-foreground">days</span>
                    </div>
                  ) : (
                    <Textarea
                      value={step.content || ""}
                      onChange={(e) => updateStep(step.id, { content: e.target.value })}
                      placeholder="Enter message content... Use {{firstName}}, {{company}}, etc."
                      rows={2}
                    />
                  )}
                </div>
                <button onClick={() => removeStep(step.id)} className="rounded p-1 text-muted-foreground hover:text-destructive hover:bg-destructive/10">
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            ))}
            {campaign.sequenceSteps.length === 0 && (
              <div className="text-center py-8 text-muted-foreground">
                No steps yet. Add steps to build your sequence.
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader><CardTitle>Settings</CardTitle></CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium">Daily Limit</p>
              <p className="text-xs text-muted-foreground">Max actions per day</p>
            </div>
            <Input
              type="number"
              value={campaign.dailyLimit}
              onChange={(e) => updateCampaign({ dailyLimit: parseInt(e.target.value) || 25 })}
              className="w-24"
              min={1}
              max={200}
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
