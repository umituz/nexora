import { Link } from "react-router-dom";
import { APP_NAME, ROUTES } from "@/constants/app";
import { PageHeader } from "@/components/common/PageHeader";
import { HelpCircle, Mail, MessageCircle } from "lucide-react";

export default function SupportPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-16">
      <Link to={ROUTES.HOME} className="text-sm text-primary hover:underline mb-4 inline-block">← Back to Home</Link>
      <PageHeader title="Support" description="Need help? We're here for you." />
      <div className="grid sm:grid-cols-2 gap-4">
        {[
          { icon: Mail, title: "Email Support", desc: "support@songsweeper.app", action: "Send Email" },
          { icon: MessageCircle, title: "Community", desc: "Join our Discord community", action: "Join Discord" },
          { icon: HelpCircle, title: "FAQ", desc: "Browse frequently asked questions", action: "View FAQ" },
        ].map((item) => (
          <div key={item.title} className="glass-card p-6 text-center">
            <item.icon size={28} className="mx-auto mb-3 text-primary" />
            <h3 className="font-semibold text-foreground">{item.title}</h3>
            <p className="text-sm text-muted-foreground mt-1 mb-3">{item.desc}</p>
            <button className="text-sm text-primary hover:underline font-medium">{item.action}</button>
          </div>
        ))}
      </div>
    </div>
  );
}
