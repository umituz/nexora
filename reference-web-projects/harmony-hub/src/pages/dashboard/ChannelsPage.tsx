import { CHANNELS } from "@/constants/app";
import { useState } from "react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

export default function ChannelsPage() {
  const [connected, setConnected] = useState<string[]>(["whatsapp", "instagram"]);
  const toggle = (id: string) => { setConnected((p) => p.includes(id) ? p.filter((c) => c !== id) : [...p, id]); toast.success("Channel updated"); };
  return (
    <div className="space-y-6">
      <h1 className="font-heading text-2xl font-bold">Channels</h1>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {CHANNELS.map((ch) => (
          <div key={ch.id} className="rounded-xl border border-border bg-card p-6 text-center">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full" style={{backgroundColor: ch.color + "20"}}><span className="text-lg font-bold" style={{color: ch.color}}>{ch.name[0]}</span></div>
            <h3 className="mt-3 font-heading font-semibold">{ch.name}</h3>
            <button onClick={() => toggle(ch.id)} className={cn("mt-3 w-full rounded-lg py-2 text-sm font-medium", connected.includes(ch.id) ? "bg-success/10 text-success" : "bg-secondary text-muted-foreground hover:bg-secondary/80")}>{connected.includes(ch.id) ? "Connected" : "Connect"}</button>
          </div>
        ))}
      </div>
    </div>
  );
}
