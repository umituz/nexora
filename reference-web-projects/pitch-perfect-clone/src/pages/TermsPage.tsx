import { APP_NAME } from "@/lib/constants";

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-background py-20">
      <div className="container mx-auto px-4 max-w-3xl">
        <h1 className="text-3xl font-heading font-bold text-foreground mb-8">Terms & Conditions</h1>
        <div className="prose prose-sm text-muted-foreground space-y-4">
          <p>These Terms and Conditions govern your use of {APP_NAME}. By using our service, you agree to these terms.</p>
          <h2 className="text-lg font-heading font-semibold text-foreground">1. Service Usage</h2>
          <p>You agree to use {APP_NAME} only for lawful purposes and in compliance with all applicable SMS marketing regulations including TCPA and 10DLC requirements.</p>
          <h2 className="text-lg font-heading font-semibold text-foreground">2. Account Responsibility</h2>
          <p>You are responsible for maintaining the confidentiality of your account credentials and for all activities under your account.</p>
          <h2 className="text-lg font-heading font-semibold text-foreground">3. Messaging Compliance</h2>
          <p>All SMS messages sent through {APP_NAME} must comply with applicable laws. You must maintain proper opt-in consent from all recipients.</p>
        </div>
      </div>
    </div>
  );
}
