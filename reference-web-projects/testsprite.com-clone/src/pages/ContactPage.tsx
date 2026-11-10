import { Mail, Phone, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { APP_NAME } from "@/constants/app";
import { useState } from "react";
import { toast } from "sonner";

export default function ContactPage() {
  const [form, setForm] = useState({ name: "", email: "", message: "" });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success("Message sent! We'll get back to you soon.");
    setForm({ name: "", email: "", message: "" });
  };

  return (
    <div className="section-padding">
      <div className="container-narrow">
        <h1 className="text-4xl md:text-5xl font-heading font-bold mb-4 text-center">Contact Us</h1>
        <p className="text-muted-foreground text-center mb-12">
          Have questions about {APP_NAME}? We&apos;d love to hear from you.
        </p>

        <div className="grid md:grid-cols-2 gap-12">
          <div>
            <h3 className="font-heading font-semibold mb-6">Get in Touch</h3>
            <div className="space-y-4">
              <div className="flex items-center gap-3 text-sm">
                <Mail size={18} className="text-primary" />
                <span>contact@testsprite.com</span>
              </div>
              <div className="flex items-center gap-3 text-sm">
                <Phone size={18} className="text-primary" />
                <span>+1 (206) 555-0100</span>
              </div>
              <div className="flex items-center gap-3 text-sm">
                <MapPin size={18} className="text-primary" />
                <span>Seattle, WA, United States</span>
              </div>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              placeholder="Your name"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              required
            />
            <Input
              type="email"
              placeholder="Your email"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              required
            />
            <Textarea
              placeholder="Your message"
              value={form.message}
              onChange={(e) => setForm({ ...form, message: e.target.value })}
              rows={5}
              required
            />
            <Button type="submit" className="w-full gradient-primary text-primary-foreground">
              Send Message
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}
