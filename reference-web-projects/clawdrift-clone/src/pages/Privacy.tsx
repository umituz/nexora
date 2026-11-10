import { APP_NAME } from "@/constants/app";

export default function PrivacyPage() {
  return (
    <div className="container max-w-3xl py-20">
      <h1 className="text-4xl font-bold mb-8">Privacy Policy</h1>
      <div className="space-y-6 text-muted-foreground">
        <p>Last updated: March 8, 2026</p>
        <h2 className="text-xl font-semibold text-foreground">1. Information We Collect</h2>
        <p>{APP_NAME} collects information you provide directly, such as your name, email, and usage data when you use our service.</p>
        <h2 className="text-xl font-semibold text-foreground">2. How We Use Your Information</h2>
        <p>We use collected information to provide, maintain, and improve our services, send notifications, and respond to support requests.</p>
        <h2 className="text-xl font-semibold text-foreground">3. Data Security</h2>
        <p>We implement industry-standard security measures to protect your data, including encryption in transit and at rest.</p>
        <h2 className="text-xl font-semibold text-foreground">4. Data Retention</h2>
        <p>We retain your data for as long as your account is active. You can request deletion at any time.</p>
        <h2 className="text-xl font-semibold text-foreground">5. Third-Party Services</h2>
        <p>We use third-party AI model providers (Anthropic, OpenAI, Google) to power assistants. Messages sent to bots are processed by these providers.</p>
        <h2 className="text-xl font-semibold text-foreground">6. Contact</h2>
        <p>For privacy-related questions, contact us at privacy@clawdrift.com.</p>
      </div>
    </div>
  );
}
