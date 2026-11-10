import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { HelpCircle, MessageCircle, BookOpen, Mail } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

export default function SupportPage() {
  const [form, setForm] = useState({ subject: "", message: "" });

  const handleSubmit = () => {
    if (!form.subject || !form.message) return;
    toast.success("Support ticket submitted!");
    setForm({ subject: "", message: "" });
  };

  return (
    <div className="space-y-6 animate-fade-in max-w-2xl">
      <div><h1 className="text-2xl font-bold">Help & Support</h1><p className="text-muted-foreground">Get help with your account</p></div>
      <div className="grid gap-4 md:grid-cols-3">
        {[
          { icon: BookOpen, title: "Documentation", desc: "Browse our guides" },
          { icon: MessageCircle, title: "Live Chat", desc: "Chat with support" },
          { icon: Mail, title: "Email Support", desc: "Send us a message" },
        ].map((item) => (
          <Card key={item.title} className="cursor-pointer hover:shadow-md transition-shadow">
            <CardContent className="p-5 text-center">
              <item.icon className="h-8 w-8 mx-auto text-primary mb-2" />
              <p className="font-semibold">{item.title}</p>
              <p className="text-xs text-muted-foreground">{item.desc}</p>
            </CardContent>
          </Card>
        ))}
      </div>
      <Card><CardContent className="p-6 space-y-4">
        <h2 className="font-semibold">Submit a Ticket</h2>
        <div><Label>Subject</Label><Input value={form.subject} onChange={(e) => setForm((p) => ({ ...p, subject: e.target.value }))} /></div>
        <div><Label>Message</Label><Textarea value={form.message} onChange={(e) => setForm((p) => ({ ...p, message: e.target.value }))} rows={5} /></div>
        <Button onClick={handleSubmit}>Submit Ticket</Button>
      </CardContent></Card>
    </div>
  );
}
