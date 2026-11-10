import { HeroSection } from "@/components/landing/HeroSection";
import { TrustedBySection } from "@/components/landing/TrustedBySection";
import { ComparisonSection } from "@/components/landing/ComparisonSection";
import { TestimonialsSection } from "@/components/landing/TestimonialsSection";
import { UseCasesSection } from "@/components/landing/UseCasesSection";
import { CTASection } from "@/components/landing/CTASection";
import { APP_TAGLINE } from "@/constants/app";

export default function LandingPage() {
  return (
    <div>
      <div className="bg-primary/5 py-2 text-center text-sm">
        Open Beta — {APP_TAGLINE}
      </div>
      <HeroSection />
      <TrustedBySection />
      <ComparisonSection />
      <TestimonialsSection />
      <UseCasesSection />
      <CTASection />
    </div>
  );
}
