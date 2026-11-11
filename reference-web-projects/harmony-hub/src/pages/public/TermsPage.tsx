export default function TermsPage() {
  return (
    <div className="py-20">
      <div className="container mx-auto max-w-3xl px-4">
        <h1 className="font-heading text-3xl font-bold">Terms of Service</h1>
        <p className="mt-2 text-sm text-muted-foreground">Last updated: March 2025</p>
        <div className="mt-8 space-y-6 text-sm leading-relaxed text-muted-foreground">
          <section>
            <h2 className="mb-2 font-heading text-lg font-semibold text-foreground">1. Acceptance of Terms</h2>
            <p>By using DM Champ, you agree to these terms. If you disagree, please do not use the service.</p>
          </section>
          <section>
            <h2 className="mb-2 font-heading text-lg font-semibold text-foreground">2. Service Description</h2>
            <p>DM Champ provides AI-powered sales agents for businesses. The service includes conversation management, campaign tools, and analytics.</p>
          </section>
          <section>
            <h2 className="mb-2 font-heading text-lg font-semibold text-foreground">3. User Responsibilities</h2>
            <p>You are responsible for the content generated through your AI agents and must comply with applicable laws and messaging platform policies.</p>
          </section>
          <section>
            <h2 className="mb-2 font-heading text-lg font-semibold text-foreground">4. Billing & Refunds</h2>
            <p>Subscriptions are billed monthly. You may cancel at any time. Refunds are handled on a case-by-case basis.</p>
          </section>
        </div>
      </div>
    </div>
  );
}
