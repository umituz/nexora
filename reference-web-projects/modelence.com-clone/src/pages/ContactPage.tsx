import { useState } from "react";
import { APP_NAME, APP_SUPPORT_EMAIL } from "@/lib/constants";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";

export default function ContactPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !message) {
      toast.error("Please fill in all fields");
      return;
    }
    toast.success("Message sent! We'll get back to you soon.");
    setName("");
    setEmail("");
    setMessage("");
  };

  return (
    <div className="py-20">
      <div className="container mx-auto px-4 max-w-lg">
        <h1 className="text-4xl font-bold text-foreground text-center mb-4">Contact Us</h1>
        <p className="text-center text-muted-foreground mb-10">
          Have a question? Reach out at{" "}
          <a href={`mailto:${APP_SUPPORT_EMAIL}`} className="text-primary hover:underline">{APP_SUPPORT_EMAIL}</a>{" "}
          or use the form below.
        </p>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div><Label htmlFor="c-name">Name</Label><Input id="c-name" value={name} onChange={(e) => setName(e.target.value)} placeholder="Your name" /></div>
          <div><Label htmlFor="c-email">Email</Label><Input id="c-email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" /></div>
          <div><Label htmlFor="c-msg">Message</Label><Textarea id="c-msg" value={message} onChange={(e) => setMessage(e.target.value)} placeholder="How can we help?" rows={5} /></div>
          <Button type="submit" className="w-full">Send Message</Button>
        </form>
      </div>
    </div>
  );
}
