import { APP_NAME, COMPANY_NAME, APP_URL } from "@/constants/app";

export default function PrivacyPage() {
  return (
    <div className="py-20">
      <div className="container mx-auto max-w-3xl px-4">
        <h1 className="font-heading text-3xl font-bold">Privacy Policy</h1>
        <p className="mt-2 text-sm text-muted-foreground">Last updated: March 2025</p>
        <div className="mt-8 space-y-6 text-sm leading-relaxed text-muted-foreground">
          <section>
            <h2 className="mb-2 font-heading text-lg font-semibold text-foreground">1. Information We Collect</h2>
            <p>We collect information you provide when creating an account, such as name, email, and payment details. We also collect usage data to improve our services.</p>
          </section>
          <section>
            <h2 className="mb-2 font-heading text-lg font-semibold text-foreground">2. How We Use Your Information</h2>
            <p>We use your information to provide and improve our services, process payments, send updates, and ensure security of our platform.</p>
          </section>
          <section>
            <h2 className="mb-2 font-heading text-lg font-semibold text-foreground">3. Data Storage & Security</h2>
            <p>Your data is stored securely using industry-standard encryption. We never sell your personal information to third parties.</p>
          </section>
          <section>
            <h2 className="mb-2 font-heading text-lg font-semibold text-foreground">4. Contact</h2>
            <p>For privacy inquiries, contact us at privacy@dmchamp.com</p>
          </section>
        </div>
      </div>
    </div>
  );
}
