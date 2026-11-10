import { APP_NAME } from "@/constants/app";

export default function TermsPage() {
  return (
    <div className="py-20">
      <div className="container max-w-3xl">
        <h1 className="text-4xl md:text-5xl font-bold mb-4">Terms of Service</h1>
        <p className="text-sm text-muted-foreground mb-8">Last updated: March 1, 2026</p>
        {[
          { title: "1. Acceptance of Terms", content: `By using ${APP_NAME}, you agree to these terms. If you do not agree, do not use our services.` },
          { title: "2. Service Description", content: `${APP_NAME} provides application performance monitoring, error tracking, log management, and related services.` },
          { title: "3. User Accounts", content: "You are responsible for maintaining the security of your account credentials and for all activities under your account." },
          { title: "4. Acceptable Use", content: "You may not use our services for any unlawful purpose, to transmit malicious code, or to interfere with the service's operation." },
          { title: "5. Payment Terms", content: "Paid plans are billed monthly or annually. All fees are non-refundable except as required by law." },
          { title: "6. Data Ownership", content: "You retain ownership of your monitoring data. We only process it to provide our services as described." },
          { title: "7. Service Level Agreement", content: "We strive for 99.999% uptime. Enterprise customers may negotiate custom SLAs." },
          { title: "8. Limitation of Liability", content: `${APP_NAME}'s liability is limited to the amount paid for the service in the 12 months preceding the claim.` },
          { title: "9. Termination", content: "Either party may terminate at any time. Upon termination, your data will be retained for 30 days before deletion." },
        ].map((section) => (
          <div key={section.title} className="mb-6">
            <h2 className="text-lg font-semibold mb-2">{section.title}</h2>
            <p className="text-sm text-muted-foreground leading-relaxed">{section.content}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
