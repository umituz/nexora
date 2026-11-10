import { useState } from "react";
import { Bot, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function AiCopilotPage() {
  const [prompt, setPrompt] = useState("");
  const [messages, setMessages] = useState<Array<{ role: "user" | "assistant"; text: string }>>([
    { role: "assistant", text: "Hi! I'm Jayni, your AI SMS co-pilot. I can help you create workflows, check compliance, and schedule appointments. What would you like to do?" }
  ]);

  const handleSend = () => {
    if (!prompt.trim()) return;
    setMessages(prev => [...prev, { role: "user" as const, text: prompt }, { role: "assistant" as const, text: "I'll help you with that! This feature will be fully functional when connected to an AI backend. For now, I can simulate creating workflows and checking compliance." }]);
    setPrompt("");
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div><h1 className="text-2xl font-heading font-bold text-foreground">AI Copilot — Jayni</h1><p className="text-sm text-muted-foreground">Your intelligent SMS assistant</p></div>
      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <Card className="h-[600px] flex flex-col">
            <CardContent className="flex-1 overflow-y-auto p-4 space-y-3">
              {messages.map((m, i) => (
                <div key={i} className={`max-w-[80%] ${m.role === "user" ? "ml-auto" : ""}`}>
                  <div className={`p-3 rounded-xl text-sm ${m.role === "user" ? "bg-primary text-primary-foreground rounded-br-sm" : "bg-secondary text-foreground rounded-bl-sm"}`}>{m.text}</div>
                </div>
              ))}
            </CardContent>
            <div className="p-4 border-t flex gap-2">
              <Input placeholder="Ask Jayni anything..." value={prompt} onChange={(e) => setPrompt(e.target.value)} onKeyDown={(e) => e.key === "Enter" && handleSend()} />
              <Button onClick={handleSend} size="icon"><Send className="w-4 h-4" /></Button>
            </div>
          </Card>
        </div>
        <div className="space-y-4">
          {[
            { title: "Create Workflow", desc: "Build an automated SMS sequence from a prompt" },
            { title: "Check Compliance", desc: "Scan your content for 10DLC compliance" },
            { title: "Book Appointment", desc: "Schedule meetings via SMS conversation" },
          ].map((f) => (
            <Card key={f.title} className="cursor-pointer hover:shadow-card-hover transition-shadow" onClick={() => { setPrompt(f.desc); }}>
              <CardContent className="p-4"><Bot className="w-5 h-5 text-primary mb-2" /><p className="font-semibold text-foreground text-sm">{f.title}</p><p className="text-xs text-muted-foreground">{f.desc}</p></CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
