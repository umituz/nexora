import { APP_NAME } from "@/constants/app";

export default function TermsPage() {
  return (
    <div className="container max-w-3xl py-20">
      <h1 className="text-4xl font-bold mb-8">Terms of Service</h1>
      <div className="space-y-6 text-muted-foreground">
        <p>Last updated: March 8, 2026</p>
        <h2 className="text-xl font-semibold text-foreground">1. Acceptance of Terms</h2>
        <p>By using {APP_NAME}, you agree to these terms. If you don't agree, please don't use the service.</p>
        <h2 className="text-xl font-semibold text-foreground">2. Service Description</h2>
        <p>{APP_NAME} provides a platform for deploying AI assistants on messaging platforms including Telegram, Discord, and WhatsApp.</p>
        <h2 className="text-xl font-semibold text-foreground">3. Account Responsibilities</h2>
        <p>You are responsible for maintaining the security of your account and all activities under it.</p>
        <h2 className="text-xl font-semibold text-foreground">4. Acceptable Use</h2>
        <p>You agree not to use the service for illegal activities, spam, harassment, or any activity that violates platform policies.</p>
        <h2 className="text-xl font-semibold text-foreground">5. Billing & Refunds</h2>
        <p>Paid plans are billed monthly. We offer a 30-day money-back guarantee on all plans.</p>
        <h2 className="text-xl font-semibold text-foreground">6. Limitation of Liability</h2>
        <p>{APP_NAME} is provided "as is" without warranties. We are not liable for damages arising from use of the service.</p>
      </div>
    </div>
  );
}
