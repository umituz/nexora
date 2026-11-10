import { APP_NAME } from "@/lib/constants";

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-background py-20">
      <div className="container mx-auto px-4 max-w-3xl">
        <h1 className="text-3xl font-heading font-bold text-foreground mb-8">Privacy Policy</h1>
        <div className="prose prose-sm text-muted-foreground space-y-4">
          <p>This Privacy Policy describes how {APP_NAME} collects, uses, and protects your personal information.</p>
          <h2 className="text-lg font-heading font-semibold text-foreground">1. Information We Collect</h2>
          <p>We collect information you provide directly, such as account details, contact lists, and message content.</p>
          <h2 className="text-lg font-heading font-semibold text-foreground">2. How We Use Information</h2>
          <p>We use your information to provide and improve our SMS marketing services, process transactions, and communicate with you.</p>
          <h2 className="text-lg font-heading font-semibold text-foreground">3. Data Security</h2>
          <p>We implement industry-standard security measures to protect your data from unauthorized access or disclosure.</p>
        </div>
      </div>
    </div>
  );
}
