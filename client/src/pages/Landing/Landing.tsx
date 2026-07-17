import { useDocumentLanguage } from "../../i18n";
import LandingHeader from "./components/LandingHeader";
import LandingHero from "./components/LandingHero";
import LandingFeatures from "./components/LandingFeatures";
import LandingFlow from "./components/LandingFlow";
import LandingCta from "./components/LandingCta";
import LandingFooter from "./components/LandingFooter";

export default function Landing() {
  useDocumentLanguage();

  return (
    <div className="min-h-[100dvh] overflow-hidden bg-background selection:bg-primary/20">
      <LandingHeader />
      <main>
        <LandingHero />
        <LandingFeatures />
        <LandingFlow />
        <LandingCta />
      </main>
      <LandingFooter />
    </div>
  );
}
