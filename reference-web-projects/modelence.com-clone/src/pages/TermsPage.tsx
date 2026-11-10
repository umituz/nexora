import { APP_NAME, APP_SUPPORT_EMAIL } from "@/lib/constants";

export default function TermsPage() {
  return (
    <div className="py-20">
      <div className="container mx-auto px-4 max-w-3xl">
        <h1 className="text-4xl font-bold text-foreground mb-2">Terms of Service</h1>
        <p className="text-sm text-muted-foreground mb-8">Last updated: March 1, 2026</p>
        <div className="space-y-6 text-muted-foreground leading-relaxed text-sm">
          <section>
            <h2 className="text-lg font-semibold text-foreground mb-2">1. Acceptance of Terms</h2>
            <p>By accessing or using {APP_NAME}, you agree to be bound by these Terms of Service. If you do not agree, do not use our services.</p>
          </section>
          <section>
            <h2 className="text-lg font-semibold text-foreground mb-2">2. Use of Service</h2>
            <p>You may use {APP_NAME} to build, deploy, and manage web applications. You are responsible for all activity under your account and must comply with all applicable laws.</p>
          </section>
          <section>
            <h2 className="text-lg font-semibold text-foreground mb-2">3. Your Data</h2>
            <p>You retain ownership of all data you upload to {APP_NAME}. We do not claim any intellectual property rights over your content.</p>
          </section>
          <section>
            <h2 className="text-lg font-semibold text-foreground mb-2">4. Payment Terms</h2>
            <p>Paid plans are billed according to the pricing displayed at the time of purchase. Usage-based charges are calculated and billed monthly.</p>
          </section>
          <section>
            <h2 className="text-lg font-semibold text-foreground mb-2">5. Service Availability</h2>
            <p>We strive for high availability but do not guarantee uninterrupted service. Scheduled maintenance will be communicated in advance.</p>
          </section>
          <section>
            <h2 className="text-lg font-semibold text-foreground mb-2">6. Termination</h2>
            <p>Either party may terminate the agreement at any time. Upon termination, you may export your data within 30 days.</p>
          </section>
          <section>
            <h2 className="text-lg font-semibold text-foreground mb-2">7. Contact</h2>
            <p>Questions about these terms? Contact us at {APP_SUPPORT_EMAIL}.</p>
          </section>
        </div>
      </div>
    </div>
  );
}
