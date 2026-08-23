import LandingNav from "@/src/components/landing/LandingNav";
import LandingHero from "@/src/components/landing/LandingHero";
import LandingCollections from "@/src/components/landing/LandingCollections";
import LandingJourney from "@/src/components/landing/LandingJourney";
import LandingFeatures from "@/src/components/landing/LandingFeatures";
import LandingFaq from "@/src/components/landing/LandingFaq";
import LandingFooter from "@/src/components/landing/LandingFooter";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-[var(--bg-base)] text-[var(--text-primary)] font-sans selection:bg-[var(--accent)] selection:text-white overflow-x-clip">
      <LandingNav />
      <LandingHero />
      <LandingCollections />
      <LandingJourney />
      <LandingFeatures />
      <LandingFaq />
      <LandingFooter />
    </div>
  );
}
