import { APP_NAME, APP_SUPPORT_EMAIL } from "@/lib/constants";

export default function PrivacyPage() {
  return (
    <div className="py-20">
      <div className="container mx-auto px-4 max-w-3xl">
        <h1 className="text-4xl font-bold text-foreground mb-2">Privacy Policy</h1>
        <p className="text-sm text-muted-foreground mb-8">Last updated: March 1, 2026</p>
        <div className="space-y-6 text-muted-foreground leading-relaxed text-sm">
          <section>
            <h2 className="text-lg font-semibold text-foreground mb-2">1. Information We Collect</h2>
            <p>We collect information you provide directly, including your name, email address, and payment information. We also collect usage data automatically through cookies and similar technologies.</p>
          </section>
          <section>
            <h2 className="text-lg font-semibold text-foreground mb-2">2. How We Use Your Information</h2>
            <p>We use your information to provide, maintain, and improve our services, process transactions, send communications, and ensure security.</p>
          </section>
          <section>
            <h2 className="text-lg font-semibold text-foreground mb-2">3. Data Storage and Security</h2>
            <p>Your data is stored securely using industry-standard encryption. We implement appropriate technical and organizational measures to protect your personal data.</p>
          </section>
          <section>
            <h2 className="text-lg font-semibold text-foreground mb-2">4. Data Sharing</h2>
            <p>We do not sell your personal data. We may share data with service providers who assist in operating our platform, subject to confidentiality agreements.</p>
          </section>
          <section>
            <h2 className="text-lg font-semibold text-foreground mb-2">5. Your Rights</h2>
            <p>You have the right to access, correct, delete, or export your personal data. Contact us at {APP_SUPPORT_EMAIL} to exercise these rights.</p>
          </section>
          <section>
            <h2 className="text-lg font-semibold text-foreground mb-2">6. Cookies</h2>
            <p>{APP_NAME} uses essential cookies for functionality and optional cookies for analytics. You can manage cookie preferences through your browser settings.</p>
          </section>
          <section>
            <h2 className="text-lg font-semibold text-foreground mb-2">7. Contact</h2>
            <p>For privacy-related inquiries, contact us at {APP_SUPPORT_EMAIL}.</p>
          </section>
        </div>
      </div>
    </div>
  );
}
