import { APP_NAME } from "@/lib/constants";

export default function DocsPage() {
  const sections = [
    { title: "Getting Started", items: ["Quickstart", "Installation", "Authentication", "First API Call"] },
    { title: "Core Concepts", items: ["End Users", "Connections", "Object Types", "Error Handling"] },
    { title: "SDKs", items: ["Node.js / TypeScript", "Python", "REST API"] },
    { title: "Guides", items: ["Invoices", "Customers", "Vendors", "Bills", "Payments", "Items"] },
  ];

  return (
    <div className="hero-section stars-bg min-h-screen py-24">
      <div className="container max-w-4xl">
        <h1 className="text-4xl font-bold text-white">{APP_NAME} Documentation</h1>
        <p className="mt-4 text-white/50">Everything you need to integrate with QuickBooks Desktop.</p>
        <div className="mt-16 grid gap-8 sm:grid-cols-2">
          {sections.map((section) => (
            <div key={section.title} className="rounded-xl border border-white/5 bg-white/[0.02] p-6">
              <h3 className="text-lg font-semibold text-mint">{section.title}</h3>
              <ul className="mt-4 space-y-2">
                {section.items.map((item) => (
                  <li key={item} className="text-sm text-white/60 hover:text-white cursor-pointer">→ {item}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
