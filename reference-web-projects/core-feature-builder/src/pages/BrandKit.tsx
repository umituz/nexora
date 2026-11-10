import { useState } from "react";
import { Globe, RefreshCw, Palette, MessageSquare, Target, Plus, Check, Upload, X } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { useAppStore } from "@/store/appStore";
import { toast } from "sonner";

const TONE_OPTIONS = ["Professional", "Casual", "Bold", "Friendly", "Witty", "Authoritative", "Inspirational"];

export default function BrandKit() {
  const brand = useAppStore((s) => s.brand);
  const updateBrand = useAppStore((s) => s.updateBrand);

  const [local, setLocal] = useState(brand);
  const [newPainPoint, setNewPainPoint] = useState("");
  const [newColor, setNewColor] = useState("#000000");

  const dirty = JSON.stringify(local) !== JSON.stringify(brand);

  const set = <K extends keyof typeof local>(key: K, val: (typeof local)[K]) =>
    setLocal((p) => ({ ...p, [key]: val }));

  const toggleTone = (t: string) =>
    set("tones", local.tones.includes(t) ? local.tones.filter((x) => x !== t) : [...local.tones, t]);

  const addPainPoint = () => {
    if (!newPainPoint.trim()) return;
    set("painPoints", [...local.painPoints, newPainPoint.trim()]);
    setNewPainPoint("");
  };

  const removePainPoint = (p: string) =>
    set("painPoints", local.painPoints.filter((x) => x !== p));

  const addColor = () => {
    set("colors", [...local.colors, { name: `Color ${local.colors.length + 1}`, value: newColor }]);
  };

  const removeColor = (idx: number) =>
    set("colors", local.colors.filter((_, i) => i !== idx));

  const handleSave = () => {
    updateBrand(local);
    toast.success("Brand kit saved");
  };

  const handleRescan = () => {
    toast.success("Re-scanning website", { description: "We'll update your brand kit shortly." });
  };

  return (
    <div className="p-6 lg:p-8 max-w-5xl mx-auto space-y-6 animate-fade-up pb-24">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Brand Kit</h1>
        <p className="text-muted-foreground text-sm mt-1">
          What we learned from your website. Edit anything to refine your AI-generated content.
        </p>
      </div>

      <Card className="border">
        <CardContent className="p-5 flex items-center gap-3 flex-wrap">
          <div className="w-10 h-10 rounded-lg bg-accent flex items-center justify-center shrink-0">
            <Globe className="w-5 h-5 text-primary" />
          </div>
          <div className="flex-1 min-w-[200px]">
            <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-1">Source website</p>
            <Input value={local.website} onChange={(e) => set("website", e.target.value)} className="h-9" />
          </div>
          <Button variant="outline" onClick={handleRescan}>
            <RefreshCw className="w-4 h-4 mr-1" /> Re-scan
          </Button>
        </CardContent>
      </Card>

      <Card className="border">
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Target className="w-5 h-5 text-primary" /> Brand Identity
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-1.5 block">Brand name</label>
            <Input value={local.brandName} onChange={(e) => set("brandName", e.target.value)} />
          </div>
          <div>
            <label className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-1.5 block">One-liner</label>
            <Input value={local.oneLiner} onChange={(e) => set("oneLiner", e.target.value)} />
          </div>
          <div>
            <label className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-1.5 block">Description</label>
            <Textarea rows={3} value={local.description} onChange={(e) => set("description", e.target.value)} />
          </div>
        </CardContent>
      </Card>

      <Card className="border">
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Target className="w-5 h-5 text-primary" /> Target Audience
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-1.5 block">Primary audience</label>
              <Input value={local.audience} onChange={(e) => set("audience", e.target.value)} />
            </div>
            <div>
              <label className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-1.5 block">Age range</label>
              <Input value={local.ageRange} onChange={(e) => set("ageRange", e.target.value)} />
            </div>
          </div>
          <div>
            <label className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-1.5 block">Pain points</label>
            <div className="flex flex-wrap gap-2">
              {local.painPoints.map((p) => (
                <Badge key={p} variant="secondary" className="gap-1 px-3 py-1">
                  {p}
                  <button onClick={() => removePainPoint(p)} className="opacity-50 hover:opacity-100">
                    <X className="w-3 h-3" />
                  </button>
                </Badge>
              ))}
              <div className="flex items-center gap-1">
                <Input
                  value={newPainPoint}
                  onChange={(e) => setNewPainPoint(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && addPainPoint()}
                  placeholder="Add..."
                  className="h-7 w-32 text-xs"
                />
                <Button variant="outline" size="sm" className="h-7" onClick={addPainPoint}>
                  <Plus className="w-3 h-3" />
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="border">
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <MessageSquare className="w-5 h-5 text-primary" /> Voice & Tone
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-muted-foreground">Pick the tones that match your brand voice. Used in every script.</p>
          <div className="flex flex-wrap gap-2">
            {TONE_OPTIONS.map((t) => {
              const active = local.tones.includes(t);
              return (
                <button
                  key={t}
                  onClick={() => toggleTone(t)}
                  className={cn(
                    "px-4 py-2 rounded-full text-sm font-medium border-2 transition-all",
                    active
                      ? "border-primary bg-primary text-primary-foreground"
                      : "border-border bg-background text-foreground hover:border-primary/40"
                  )}
                >
                  {active && <Check className="w-3 h-3 inline mr-1" />} {t}
                </button>
              );
            })}
          </div>
        </CardContent>
      </Card>

      <Card className="border">
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Palette className="w-5 h-5 text-primary" /> Visual Identity
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-5">
          <div>
            <label className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-2 block">Brand colors</label>
            <div className="flex flex-wrap gap-3">
              {local.colors.map((c, i) => (
                <div key={i} className="text-center group relative">
                  <div className="w-16 h-16 rounded-xl border shadow-sm mb-1.5" style={{ backgroundColor: c.value }} />
                  <p className="text-xs font-medium text-foreground">{c.name}</p>
                  <p className="text-[10px] text-muted-foreground tabular-nums">{c.value}</p>
                  <button
                    onClick={() => removeColor(i)}
                    className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-destructive text-destructive-foreground opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </div>
              ))}
              <div className="flex flex-col items-center gap-1">
                <input
                  type="color"
                  value={newColor}
                  onChange={(e) => setNewColor(e.target.value)}
                  className="w-16 h-16 rounded-xl border cursor-pointer"
                />
                <Button size="sm" variant="outline" className="h-6 text-xs" onClick={addColor}>
                  <Plus className="w-3 h-3 mr-0.5" /> Add
                </Button>
              </div>
            </div>
          </div>
          <div>
            <label className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-2 block">Logo</label>
            <div className="flex items-center gap-3">
              <div className="w-16 h-16 rounded-xl gradient-warm flex items-center justify-center text-primary-foreground font-bold text-xl">
                {local.brandName.charAt(0)}
              </div>
              <Button variant="outline" onClick={() => toast.success("Upload feature coming with API")}>
                <Upload className="w-4 h-4 mr-1" /> Upload logo
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {dirty && (
        <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-50 bg-card border rounded-full shadow-lg p-2 pl-5 flex items-center gap-3 animate-fade-up">
          <span className="text-sm text-muted-foreground">Unsaved changes</span>
          <Button variant="ghost" size="sm" onClick={() => setLocal(brand)}>Discard</Button>
          <Button size="sm" onClick={handleSave}>Save</Button>
        </div>
      )}
    </div>
  );
}
