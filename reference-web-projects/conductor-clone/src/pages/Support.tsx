import { APP_NAME } from "@/lib/constants";

export default function SupportPage() {
  return (
    <div className="hero-section stars-bg min-h-screen py-24">
      <div className="container max-w-3xl text-center">
        <h1 className="text-4xl font-bold text-white">Support</h1>
        <p className="mt-4 text-white/50">We're here to help you succeed with {APP_NAME}.</p>
        <div className="mt-12 grid gap-6 sm:grid-cols-2">
          {[
            { title: "Documentation", desc: "Comprehensive guides and API reference.", link: "/docs" },
            { title: "Help Center", desc: "Guides for common QuickBooks issues.", link: "/docs/help" },
            { title: "Community", desc: "Join our Slack community.", link: "/community" },
            { title: "Email Support", desc: "support@conductor.is", link: "/contact" },
          ].map((item) => (
            <div key={item.title} className="rounded-xl border border-white/5 bg-white/[0.02] p-6 text-left">
              <h3 className="text-lg font-semibold text-white">{item.title}</h3>
              <p className="mt-2 text-sm text-white/50">{item.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
