import { Link } from "react-router-dom";
import { APP_NAME, ROUTES } from "@/constants/app";
import { PageHeader } from "@/components/common/PageHeader";
import { Shield } from "lucide-react";

export default function PrivacyPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-16">
      <Link to={ROUTES.HOME} className="text-sm text-primary hover:underline mb-4 inline-block">← Back to Home</Link>
      <PageHeader title="Privacy Policy" />
      <div className="prose prose-sm text-muted-foreground space-y-4">
        <div className="glass-card p-4 flex items-center gap-3 mb-6">
          <Shield size={20} className="text-primary shrink-0" />
          <p className="text-sm text-foreground font-medium">{APP_NAME} is privacy-first. Your data stays on your device.</p>
        </div>
        <h3 className="text-foreground font-serif text-lg">Data Collection</h3>
        <p>We do not collect, store, or transmit your music library data. All processing happens locally in your browser.</p>
        <h3 className="text-foreground font-serif text-lg">Analytics</h3>
        <p>We use anonymous usage analytics to improve the app experience. No personally identifiable information is collected.</p>
        <h3 className="text-foreground font-serif text-lg">Local Storage</h3>
        <p>Your preferences and settings are stored in your browser's local storage. This data never leaves your device.</p>
        <h3 className="text-foreground font-serif text-lg">Third-Party Services</h3>
        <p>When you connect a music service, we only access the data necessary to scan and clean your library. We do not share this data.</p>
        <h3 className="text-foreground font-serif text-lg">Contact</h3>
        <p>For privacy questions, contact us at privacy@songsweeper.app</p>
      </div>
    </div>
  );
}
