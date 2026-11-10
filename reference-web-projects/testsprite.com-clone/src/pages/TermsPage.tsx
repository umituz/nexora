import { APP_NAME } from "@/constants/app";

export default function TermsPage() {
  return (
    <div className="section-padding">
      <div className="container-narrow">
        <h1 className="text-4xl font-heading font-bold mb-8">Terms & Conditions</h1>
        <div className="space-y-6 text-sm text-muted-foreground leading-relaxed">
          <p>Last updated: March 1, 2026</p>
          <h2 className="text-lg font-heading font-semibold text-foreground">1. Acceptance of Terms</h2>
          <p>By accessing or using {APP_NAME}, you agree to be bound by these Terms of Service. If you do not agree, please do not use our service.</p>
          <h2 className="text-lg font-heading font-semibold text-foreground">2. Description of Service</h2>
          <p>{APP_NAME} provides an AI-powered autonomous testing platform for software applications. Our service includes test generation, execution, reporting, and CI/CD integration.</p>
          <h2 className="text-lg font-heading font-semibold text-foreground">3. User Accounts</h2>
          <p>You are responsible for maintaining the confidentiality of your account credentials and for all activities that occur under your account.</p>
          <h2 className="text-lg font-heading font-semibold text-foreground">4. Usage Limits</h2>
          <p>Your plan determines the number of credits, test lists, and test schedules available to you. Exceeding your plan limits may result in service restrictions.</p>
          <h2 className="text-lg font-heading font-semibold text-foreground">5. Data Privacy</h2>
          <p>We take your privacy seriously. Your source code and test data are processed securely and are never shared with third parties without your consent.</p>
          <h2 className="text-lg font-heading font-semibold text-foreground">6. Limitation of Liability</h2>
          <p>{APP_NAME} is provided "as is" without warranty of any kind. We shall not be liable for any indirect, incidental, or consequential damages.</p>
        </div>
      </div>
    </div>
  );
}
