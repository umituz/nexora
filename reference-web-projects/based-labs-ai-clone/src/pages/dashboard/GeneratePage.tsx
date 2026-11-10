import { useState } from "react";
import { useSearchParams } from "react-router-dom";
import { MOCK_MODELS } from "@/data/mock-data";
import { Button } from "@/components/ui/button";
import { Sparkles, Settings2, ImageIcon, VideoIcon, Music } from "lucide-react";

export default function GeneratePage() {
  const [searchParams] = useSearchParams();
  const [prompt, setPrompt] = useState(searchParams.get("prompt") || "");
  const [selectedModel, setSelectedModel] = useState(searchParams.get("model") || "flux");
  const [generating, setGenerating] = useState(false);
  const [width, setWidth] = useState(1024);
  const [height, setHeight] = useState(1024);
  const [steps, setSteps] = useState(30);
  const [numImages, setNumImages] = useState(1);

  const model = MOCK_MODELS.find((m) => m.id === selectedModel);
  const imageModels = MOCK_MODELS.filter((m) => m.category === "image");
  const videoModels = MOCK_MODELS.filter((m) => m.category === "video");

  const handleGenerate = () => {
    if (!prompt.trim()) return;
    setGenerating(true);
    setTimeout(() => setGenerating(false), 3000);
  };

  return (
    <div className="mx-auto max-w-6xl">
      <h1 className="font-display text-2xl font-bold">Generate</h1>
      <p className="text-sm text-muted-foreground mt-1">Create images, videos, and audio with AI</p>

      <div className="mt-6 grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-4">
          <div className="rounded-xl border border-border bg-card p-4">
            <label className="text-sm font-medium text-foreground">Prompt</label>
            <textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="Describe what you want to create..."
              rows={4}
              className="mt-2 w-full rounded-lg border border-input bg-muted/50 p-3 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none resize-none"
            />
            <div className="mt-3 flex items-center justify-between">
              <span className="text-xs text-muted-foreground">{model?.creditCost || 0} credits {model?.creditUnit}</span>
              <Button onClick={handleGenerate} disabled={generating || !prompt.trim()} className="bg-gradient-primary text-primary-foreground">
                {generating ? (
                  <span className="flex items-center gap-2"><span className="h-4 w-4 animate-spin rounded-full border-2 border-primary-foreground border-t-transparent" /> Generating...</span>
                ) : (
                  <span className="flex items-center gap-2"><Sparkles className="h-4 w-4" /> Generate</span>
                )}
              </Button>
            </div>
          </div>

          {/* Output area */}
          <div className="rounded-xl border border-border bg-card p-8 min-h-[300px] flex items-center justify-center">
            {generating ? (
              <div className="text-center">
                <div className="mx-auto h-12 w-12 animate-spin rounded-full border-4 border-muted border-t-primary" />
                <p className="mt-4 text-sm text-muted-foreground">Creating your masterpiece...</p>
              </div>
            ) : (
              <div className="text-center text-muted-foreground">
                <ImageIcon className="mx-auto h-16 w-16 opacity-20" />
                <p className="mt-4 text-sm">Your generations will appear here</p>
              </div>
            )}
          </div>
        </div>

        {/* Settings panel */}
        <div className="space-y-4">
          <div className="rounded-xl border border-border bg-card p-4">
            <div className="flex items-center gap-2 mb-3">
              <Settings2 className="h-4 w-4 text-muted-foreground" />
              <h3 className="text-sm font-semibold">Model</h3>
            </div>
            <select
              value={selectedModel}
              onChange={(e) => setSelectedModel(e.target.value)}
              className="w-full rounded-lg border border-input bg-muted/50 px-3 py-2 text-sm text-foreground focus:border-primary focus:outline-none"
            >
              <optgroup label="Image Models">
                {imageModels.map((m) => <option key={m.id} value={m.id}>{m.name} ({m.creditCost} credits)</option>)}
              </optgroup>
              <optgroup label="Video Models">
                {videoModels.map((m) => <option key={m.id} value={m.id}>{m.name} ({m.creditCost} cr/sec)</option>)}
              </optgroup>
            </select>
          </div>

          <div className="rounded-xl border border-border bg-card p-4 space-y-4">
            <h3 className="text-sm font-semibold">Settings</h3>
            <div>
              <label className="text-xs text-muted-foreground">Size</label>
              <div className="mt-1 grid grid-cols-2 gap-2">
                <input type="number" value={width} onChange={(e) => setWidth(Number(e.target.value))} className="rounded-lg border border-input bg-muted/50 px-3 py-1.5 text-sm text-foreground focus:border-primary focus:outline-none" />
                <input type="number" value={height} onChange={(e) => setHeight(Number(e.target.value))} className="rounded-lg border border-input bg-muted/50 px-3 py-1.5 text-sm text-foreground focus:border-primary focus:outline-none" />
              </div>
            </div>
            <div>
              <label className="text-xs text-muted-foreground">Steps: {steps}</label>
              <input type="range" min={10} max={50} value={steps} onChange={(e) => setSteps(Number(e.target.value))} className="mt-1 w-full accent-primary" />
            </div>
            <div>
              <label className="text-xs text-muted-foreground">Number of images</label>
              <div className="mt-1 flex gap-2">
                {[1, 2, 4].map((n) => (
                  <button key={n} onClick={() => setNumImages(n)} className={`rounded-lg px-3 py-1.5 text-sm ${numImages === n ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"}`}>{n}</button>
                ))}
              </div>
            </div>
          </div>

          <div className="rounded-xl border border-border bg-card p-4">
            <h3 className="text-sm font-semibold mb-2">Quick Presets</h3>
            <div className="grid grid-cols-2 gap-2">
              {["1024×1024", "1920×1080", "768×1024", "512×512"].map((size) => {
                const [w, h] = size.split("×").map(Number);
                return (
                  <button key={size} onClick={() => { setWidth(w); setHeight(h); }} className="rounded-lg bg-muted px-3 py-2 text-xs text-muted-foreground hover:text-foreground">{size}</button>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
