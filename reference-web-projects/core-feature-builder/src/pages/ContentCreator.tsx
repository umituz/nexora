import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Type, Layers, MonitorPlay, Video as VideoIcon, Wand2, ArrowRight, Check } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import { AVATARS, FORMAT_LABELS, type ContentFormat } from "@/lib/data";
import { useAppStore } from "@/store/appStore";
import { GenerationDialog } from "@/components/dialogs/GenerationDialog";
import { toast } from "sonner";

const contentTypes: { id: ContentFormat; label: string; icon: any; desc: string }[] = [
  { id: "wall-of-text", label: "Wall of Text", icon: Type, desc: "Bold text overlay on trending video" },
  { id: "hook-demo", label: "Hook & Demo", icon: MonitorPlay, desc: "Hook intro + product demo" },
  { id: "slideshow", label: "Slideshow", icon: Layers, desc: "Multi-slide carousel format" },
  { id: "green-screen", label: "Green Screen", icon: VideoIcon, desc: "AI avatar + your content behind" },
];

const SAMPLE_HOOKS = [
  "POV: You just realized this changes everything",
  "I wish someone told me this 6 months ago",
  "Stop doing this immediately",
  "The uncomfortable truth nobody talks about",
  "Most founders get this wrong",
];

export default function ContentCreator() {
  const navigate = useNavigate();
  const addPost = useAppStore((s) => s.addPost);
  const brand = useAppStore((s) => s.brand);

  const [step, setStep] = useState(1);
  const [selectedType, setSelectedType] = useState<ContentFormat | null>(null);
  const [selectedAvatar, setSelectedAvatar] = useState<number | null>(null);
  const [topic, setTopic] = useState("");
  const [script, setScript] = useState("");
  const [generating, setGenerating] = useState(false);

  const canProceed = () => {
    if (step === 1) return !!selectedType;
    if (step === 2) return topic.length > 0;
    if (step === 3) return selectedType !== "wall-of-text" ? !!selectedAvatar : true;
    return true;
  };

  const handleAIScript = () => {
    if (!topic) {
      toast.error("Add a topic first");
      return;
    }
    const hook = SAMPLE_HOOKS[Math.floor(Math.random() * SAMPLE_HOOKS.length)];
    const generated = `${hook}.\n\nIf you're a ${brand.audience.toLowerCase()}, you've probably struggled with ${topic.toLowerCase()}.\n\nHere's the framework that actually works:\n\n1. Identify the real pain point\n2. Build a 30-second hook\n3. Show the result, not the process\n\nTry it this week and watch your engagement explode.`;
    setScript(generated);
    toast.success("Script generated");
  };

  const handleGenerate = () => {
    setGenerating(true);
  };

  const handleGenerationComplete = () => {
    const id = addPost({
      title: topic.slice(0, 60) || "Untitled",
      format: selectedType!,
      topic,
      script,
      avatarId: selectedAvatar,
      caption: topic.slice(0, 60),
      captionStyleId: 1,
      musicId: 1,
      platforms: ["TikTok"],
      status: "draft",
      scheduledAt: null,
      publishedAt: null,
      thumbnail: "✨",
    });
    setGenerating(false);
    toast.success("Content created!", { description: "Opening editor..." });
    navigate(`/editor?id=${id}`);
  };

  return (
    <div className="p-6 lg:p-8 max-w-4xl mx-auto animate-fade-up">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-foreground">Create Content</h1>
        <p className="text-muted-foreground text-sm mt-1">Generate viral content for your brand in minutes</p>
      </div>

      <div className="flex items-center gap-2 mb-8">
        {[1, 2, 3, 4].map((s) => (
          <div key={s} className="flex items-center gap-2">
            <div
              className={cn(
                "w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium transition-all",
                step > s
                  ? "bg-primary text-primary-foreground"
                  : step === s
                  ? "gradient-warm text-primary-foreground shadow-glow"
                  : "bg-secondary text-muted-foreground"
              )}
            >
              {step > s ? <Check className="w-4 h-4" /> : s}
            </div>
            {s < 4 && <div className={cn("w-12 h-0.5 rounded", step > s ? "bg-primary" : "bg-border")} />}
          </div>
        ))}
      </div>

      {step === 1 && (
        <div className="space-y-4">
          <h2 className="text-lg font-semibold text-foreground">Choose content format</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {contentTypes.map((type) => (
              <Card
                key={type.id}
                className={cn(
                  "cursor-pointer transition-all hover:shadow-md border-2",
                  selectedType === type.id
                    ? "border-primary bg-accent shadow-glow"
                    : "border-transparent hover:border-border"
                )}
                onClick={() => setSelectedType(type.id)}
              >
                <CardContent className="p-5 flex items-start gap-4">
                  <div className="w-12 h-12 rounded-xl bg-secondary flex items-center justify-center shrink-0">
                    <type.icon
                      className={cn(
                        "w-6 h-6",
                        selectedType === type.id ? "text-primary" : "text-muted-foreground"
                      )}
                    />
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground">{type.label}</h3>
                    <p className="text-sm text-muted-foreground mt-0.5">{type.desc}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {step === 2 && (
        <div className="space-y-6">
          <h2 className="text-lg font-semibold text-foreground">What's your content about?</h2>
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium text-foreground mb-1.5 block">
                Topic or product URL
              </label>
              <Input
                placeholder="e.g. My AI scheduling app or https://myapp.com"
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
              />
            </div>
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-sm font-medium text-foreground">Script (optional)</label>
                <Button variant="ghost" size="sm" className="text-xs text-primary" onClick={handleAIScript}>
                  <Wand2 className="w-3 h-3 mr-1" /> Generate with AI
                </Button>
              </div>
              <Textarea
                placeholder="Write your script or let AI generate one..."
                value={script}
                onChange={(e) => setScript(e.target.value)}
                rows={8}
              />
            </div>
          </div>
        </div>
      )}

      {step === 3 && (
        <div className="space-y-6">
          <h2 className="text-lg font-semibold text-foreground">Choose your AI avatar</h2>
          <p className="text-sm text-muted-foreground">
            {selectedType === "wall-of-text"
              ? "Wall of Text doesn't need an avatar. You can skip this step."
              : "Select a hyper-realistic AI presenter for your video"}
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
            {AVATARS.slice(0, 6).map((avatar) => (
              <button
                key={avatar.id}
                onClick={() => setSelectedAvatar(avatar.id)}
                className={cn(
                  "rounded-xl border-2 p-4 text-center transition-all hover:shadow-md",
                  selectedAvatar === avatar.id
                    ? "border-primary bg-accent"
                    : "border-transparent bg-card hover:border-border"
                )}
              >
                <div className="text-5xl mb-3">{avatar.emoji}</div>
                <p className="font-medium text-foreground text-sm">{avatar.name}</p>
                <p className="text-xs text-muted-foreground">{avatar.style}</p>
              </button>
            ))}
          </div>
        </div>
      )}

      {step === 4 && (
        <div className="space-y-6">
          <h2 className="text-lg font-semibold text-foreground">Review & Generate</h2>
          <Card className="border">
            <CardContent className="p-6 space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Format</span>
                <span className="text-sm font-medium text-foreground">
                  {selectedType && FORMAT_LABELS[selectedType]}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Topic</span>
                <span className="text-sm font-medium text-foreground">{topic}</span>
              </div>
              {selectedAvatar && (
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Avatar</span>
                  <span className="text-sm font-medium text-foreground">
                    {AVATARS.find((a) => a.id === selectedAvatar)?.name}
                  </span>
                </div>
              )}
              {script && (
                <div>
                  <span className="text-sm text-muted-foreground block mb-1">Script</span>
                  <p className="text-sm text-foreground bg-secondary rounded-lg p-3 whitespace-pre-line">
                    {script}
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
          <Button className="w-full" size="lg" onClick={handleGenerate}>
            <Wand2 className="w-5 h-5 mr-2" /> Generate Content
          </Button>
        </div>
      )}

      <div className="flex items-center justify-between mt-8 pt-6 border-t border-border">
        <Button variant="ghost" onClick={() => setStep(Math.max(1, step - 1))} disabled={step === 1}>
          Back
        </Button>
        {step < 4 ? (
          <Button onClick={() => setStep(step + 1)} disabled={!canProceed()}>
            Next <ArrowRight className="w-4 h-4 ml-1" />
          </Button>
        ) : null}
      </div>

      <GenerationDialog open={generating} onComplete={handleGenerationComplete} />
    </div>
  );
}
