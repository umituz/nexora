import { Link } from "react-router-dom";
import { APP_NAME, APP_DESCRIPTION, APP_VERSION, ROUTES } from "@/constants/app";
import { PageHeader } from "@/components/common/PageHeader";

export default function AboutPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-16">
      <Link to={ROUTES.HOME} className="text-sm text-primary hover:underline mb-4 inline-block">← Back to Home</Link>
      <PageHeader title={`About ${APP_NAME}`} />
      <div className="glass-card p-6 mb-6">
        <h2 className="text-xl font-serif text-foreground mb-2">{APP_NAME}</h2>
        <p className="text-muted-foreground mb-4">{APP_DESCRIPTION}</p>
        <p className="text-sm text-muted-foreground">Version {APP_VERSION}</p>
      </div>
      <div className="glass-card p-6">
        <h3 className="font-serif text-lg text-foreground mb-3">Our Mission</h3>
        <p className="text-sm text-muted-foreground mb-4">
          We believe your music library should reflect who you are today. Over time, libraries accumulate
          duplicates, fragmented albums, and forgotten tracks. {APP_NAME} helps you reclaim your library
          with intelligent scanning and one-tap cleanup tools.
        </p>
        <h3 className="font-serif text-lg text-foreground mb-3">Built With Care</h3>
        <p className="text-sm text-muted-foreground">
          {APP_NAME} is designed with privacy at its core. All processing happens locally —
          your music data never leaves your device.
        </p>
      </div>
    </div>
  );
}
