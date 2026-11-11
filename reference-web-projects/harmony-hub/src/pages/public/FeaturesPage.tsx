import { Bot, MessageSquare, Calendar, Brain, Zap, Share2, Globe, Palette, TrendingUp, Image, Mic, FileText, Video, Webhook } from "lucide-react";

const allFeatures = [
  { icon: TrendingUp, title: "High-Ticket Sales Capability", desc: "Close deals from $27 to $50K+. The AI handles objections, builds trust, and guides leads to purchase." },
  { icon: Calendar, title: "AI Appointment Booking", desc: "Detects buying signals and books appointments right in the chat. No external links needed." },
  { icon: Brain, title: "Human-Like Conversations", desc: "Truly human-like dialogue that adapts tone, remembers context, and builds relationships." },
  { icon: MessageSquare, title: "Comment-to-DM Conversion", desc: "Automatically turn Instagram and Facebook comments into private DM conversations." },
  { icon: Share2, title: "Omnichannel Support", desc: "WhatsApp, Instagram, Messenger, and Web Chat — all managed from one unified dashboard." },
  { icon: Zap, title: "One-Click Optimization", desc: "Analyze top-performing conversations and improve your AI agent with a single click." },
  { icon: Globe, title: "Real-Time Web Search", desc: "AI can search the web in real-time to answer questions with up-to-date information." },
  { icon: Palette, title: "Complete White Labeling", desc: "Full white-label solution. Your brand, your domain, your clients never see DM Champ." },
  { icon: Image, title: "Image Understanding", desc: "AI understands images sent by customers — product photos, screenshots, references." },
  { icon: Mic, title: "Voice Note Understanding", desc: "Process and understand voice messages from WhatsApp and other platforms." },
  { icon: Video, title: "Video Understanding", desc: "AI can analyze and respond to video content shared by leads." },
  { icon: FileText, title: "Document & PDF Analysis", desc: "Upload documents and PDFs to your knowledge base for AI-powered responses." },
  { icon: Webhook, title: "Webhooks & API Access", desc: "Connect to any platform with webhooks and API. ManyChat, GHL, Intercom, Zapier compatible." },
  { icon: Bot, title: "Automatic Follow-Ups", desc: "AI automatically follows up with leads who haven't responded, at the perfect timing." },
];

export default function FeaturesPage() {
  return (
    <div className="py-20">
      <div className="container mx-auto px-4">
        <p className="text-center text-sm font-medium uppercase tracking-wider text-primary">Features</p>
        <h1 className="mt-2 text-center font-heading text-3xl font-bold md:text-5xl">
          It's Not a Chatbot. It's a Sales Agent.
        </h1>
        <p className="mx-auto mt-4 max-w-xl text-center text-muted-foreground">
          Here's what it actually does for your clients.
        </p>
        <div className="mt-16 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {allFeatures.map((f) => (
            <div key={f.title} className="rounded-xl border border-border bg-card p-6 transition-all hover:border-primary/30 hover:shadow-glow">
              <f.icon className="h-8 w-8 text-primary" />
              <h3 className="mt-4 font-heading text-lg font-semibold">{f.title}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{f.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
