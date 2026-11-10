import { APP_NAME, SOCIAL_LINKS } from "@/constants/app";
import { HelpCircle, MessageSquare, BookOpen, ExternalLink } from "lucide-react";

export default function HelpPage() {
  const resources = [
    { icon: BookOpen, title: "Documentation", desc: "Browse our comprehensive docs", link: "/docs" },
    { icon: MessageSquare, title: "Discord Community", desc: "Join 100k+ developers", link: SOCIAL_LINKS.discord },
    { icon: HelpCircle, title: "FAQ", desc: "Frequently asked questions", link: "/#faq" },
  ];

  return (
    <div className="space-y-6">
      <div className="glass-card p-5">
        <h3 className="font-heading font-semibold text-sm mb-2">Need Help?</h3>
        <p className="text-sm text-muted-foreground">Find resources and support for {APP_NAME}.</p>
      </div>

      <div className="grid md:grid-cols-3 gap-4">
        {resources.map((r) => (
          <a key={r.title} href={r.link} target={r.link.startsWith("http") ? "_blank" : undefined} rel="noopener noreferrer" className="glass-card p-5 hover:border-primary/50 transition-colors">
            <r.icon size={24} className="text-primary mb-3" />
            <h3 className="font-heading font-semibold text-sm mb-1">{r.title}</h3>
            <p className="text-xs text-muted-foreground">{r.desc}</p>
          </a>
        ))}
      </div>

      <div className="glass-card p-5">
        <h3 className="font-heading font-semibold text-sm mb-4">Contact Support</h3>
        <p className="text-sm text-muted-foreground">Email us at <a href="mailto:support@testsprite.com" className="text-primary hover:underline">support@testsprite.com</a></p>
      </div>
    </div>
  );
}
