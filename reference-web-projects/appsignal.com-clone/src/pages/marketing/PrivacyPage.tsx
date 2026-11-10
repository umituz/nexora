import { APP_NAME } from "@/constants/app";

export default function PrivacyPage() {
  return (
    <div className="py-20">
      <div className="container max-w-3xl">
        <h1 className="text-4xl md:text-5xl font-bold mb-4">Privacy Policy</h1>
        <p className="text-sm text-muted-foreground mb-8">Last updated: March 1, 2026</p>
        {[
          { title: "1. Information We Collect", content: `${APP_NAME} collects information you provide directly, such as account details (name, email), billing information, and application monitoring data sent through our SDK.` },
          { title: "2. How We Use Your Information", content: "We use collected information to provide and improve our monitoring services, send alerts and notifications, process payments, and provide customer support." },
          { title: "3. Data Retention", content: "Monitoring data is retained according to your plan's retention period (7-365 days). Account information is retained for the duration of your account." },
          { title: "4. Data Security", content: "We implement industry-standard security measures including encryption at rest (AES-256) and in transit (TLS 1.3), regular security audits, and access controls." },
          { title: "5. Third-Party Services", content: "We may share data with third-party services necessary to provide our product (e.g., payment processors, hosting providers). We do not sell your data." },
          { title: "6. Your Rights", content: "You have the right to access, correct, delete your data, and opt out of certain processing. Contact privacy@signaltrack.com for requests." },
          { title: "7. Cookies", content: "We use essential cookies for authentication and preferences, and optional analytics cookies to improve our service." },
          { title: "8. Contact", content: `For privacy inquiries, contact us at privacy@${APP_NAME.toLowerCase()}.com.` },
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
