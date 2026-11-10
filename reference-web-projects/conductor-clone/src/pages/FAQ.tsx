import { APP_NAME } from "@/lib/constants";

const faqItems = [
  { q: "What is Conductor?", a: "Conductor is the best QuickBooks Desktop/Enterprise API on the planet. We provide real-time, fully-typed access to every QuickBooks object via Python, Node.js/TypeScript, and REST." },
  { q: "How does Conductor connect to QuickBooks Desktop?", a: "Conductor uses the QuickBooks Web Connector protocol but completely abstracts away the complexity of qbXML, SOAP, and the Web Connector itself. Your end-users simply go through our interactive auth flow." },
  { q: "What QuickBooks versions are supported?", a: "Conductor supports QuickBooks Desktop Pro, Premier, and Enterprise editions from 2015 onward. Both 32-bit and 64-bit versions are supported." },
  { q: "Is Conductor real-time?", a: "Yes. Conductor provides real-time bidirectional read/write access to QuickBooks Desktop data. Changes are synced immediately when QuickBooks is running." },
  { q: "How much does Conductor cost?", a: "Conductor offers a free trial with 1 connection for testing. Production plans start at $49/month per company file with unlimited API usage. Enterprise plans with volume discounts are also available." },
  { q: "What programming languages are supported?", a: "Conductor provides fully-typed native SDKs for Python and Node.js/TypeScript, plus a REST API for any other language." },
  { q: "How do I handle errors?", a: "Conductor unifies all QuickBooks errors into a single, consistent format with user-friendly messages that describe how to resolve each issue, along with links to relevant help guides." },
  { q: "Is my data secure?", a: "Absolutely. Conductor uses end-to-end encryption, SOC 2 Type II compliance, and never stores your QuickBooks data on our servers. Data flows directly between your application and QuickBooks Desktop." },
];

export default function FAQPage() {
  return (
    <div className="hero-section stars-bg min-h-screen py-24">
      <div className="container max-w-3xl">
        <h1 className="text-center text-4xl font-bold text-white">Frequently Asked Questions</h1>
        <p className="mt-4 text-center text-white/50">Everything you need to know about {APP_NAME}.</p>
        <div className="mt-16 space-y-6">
          {faqItems.map((item, i) => (
            <div key={i} className="rounded-xl border border-white/5 bg-white/[0.02] p-6">
              <h3 className="text-lg font-semibold text-white">{item.q}</h3>
              <p className="mt-3 text-sm leading-relaxed text-white/60">{item.a}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
