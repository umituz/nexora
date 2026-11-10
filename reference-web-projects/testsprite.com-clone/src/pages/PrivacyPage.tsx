import { APP_NAME } from "@/constants/app";

export default function PrivacyPage() {
  return (
    <div className="section-padding">
      <div className="container-narrow">
        <h1 className="text-4xl font-heading font-bold mb-8">Privacy Policy</h1>
        <div className="space-y-6 text-sm text-muted-foreground leading-relaxed">
          <p>Last updated: March 1, 2026</p>
          <h2 className="text-lg font-heading font-semibold text-foreground">1. Information We Collect</h2>
          <p>We collect information you provide directly, such as your name, email address, and payment information when you create an account with {APP_NAME}.</p>
          <h2 className="text-lg font-heading font-semibold text-foreground">2. How We Use Information</h2>
          <p>We use the information we collect to provide, maintain, and improve our services, process transactions, and send communications about your account.</p>
          <h2 className="text-lg font-heading font-semibold text-foreground">3. Data Security</h2>
          <p>We implement industry-standard security measures to protect your data, including encryption at rest and in transit, and SOC 2 compliance.</p>
          <h2 className="text-lg font-heading font-semibold text-foreground">4. Data Retention</h2>
          <p>We retain your data for as long as your account is active. Upon account deletion, we remove your data within 30 days.</p>
          <h2 className="text-lg font-heading font-semibold text-foreground">5. Contact</h2>
          <p>For privacy-related inquiries, please contact us at privacy@testsprite.com.</p>
        </div>
      </div>
    </div>
  );
}
