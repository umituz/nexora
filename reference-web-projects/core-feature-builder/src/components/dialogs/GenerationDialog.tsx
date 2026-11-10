import { useEffect, useState } from "react";
import { Sparkles, Check } from "lucide-react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";

interface Props {
  open: boolean;
  onComplete: () => void;
}

const STEPS = [
  "Analyzing your brand kit",
  "Generating script with AI",
  "Selecting trending music",
  "Rendering video",
  "Adding captions",
  "Finalizing export",
];

export function GenerationDialog({ open, onComplete }: Props) {
  const [progress, setProgress] = useState(0);
  const [stepIdx, setStepIdx] = useState(0);

  useEffect(() => {
    if (!open) {
      setProgress(0);
      setStepIdx(0);
      return;
    }
    const interval = setInterval(() => {
      setProgress((p) => {
        const next = p + 100 / (STEPS.length * 6);
        if (next >= 100) {
          clearInterval(interval);
          setTimeout(onComplete, 400);
          return 100;
        }
        setStepIdx(Math.min(STEPS.length - 1, Math.floor((next / 100) * STEPS.length)));
        return next;
      });
    }, 180);
    return () => clearInterval(interval);
  }, [open, onComplete]);

  return (
    <Dialog open={open}>
      <DialogContent className="max-w-md text-center [&>button]:hidden">
        <div className="py-4">
          <div className="w-16 h-16 mx-auto rounded-full gradient-warm flex items-center justify-center mb-4 animate-pulse-glow">
            <Sparkles className="w-7 h-7 text-primary-foreground" />
          </div>
          <h2 className="text-xl font-bold text-foreground mb-1">Creating your content</h2>
          <p className="text-sm text-muted-foreground mb-6">This usually takes 30 seconds...</p>

          <Progress value={progress} className="mb-6" />

          <div className="space-y-2 text-left">
            {STEPS.map((step, i) => {
              const done = i < stepIdx;
              const active = i === stepIdx;
              return (
                <div
                  key={step}
                  className={cn(
                    "flex items-center gap-3 text-sm transition-opacity",
                    !done && !active && "opacity-40"
                  )}
                >
                  <div
                    className={cn(
                      "w-5 h-5 rounded-full flex items-center justify-center shrink-0 transition-colors",
                      done ? "bg-success" : active ? "bg-primary" : "bg-muted"
                    )}
                  >
                    {done ? (
                      <Check className="w-3 h-3 text-success-foreground" />
                    ) : active ? (
                      <div className="w-1.5 h-1.5 rounded-full bg-primary-foreground animate-pulse" />
                    ) : null}
                  </div>
                  <span className={cn("text-foreground", done && "text-muted-foreground line-through")}>
                    {step}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
