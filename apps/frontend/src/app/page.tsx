import type { Metadata } from "next";
import { SiteHeader } from "@/components/landing/site-header";
import { Hero } from "@/components/landing/hero";
import { StatBar } from "@/components/landing/stat-bar";
import { ProblemSection } from "@/components/landing/problem-section";
import { SolutionSection } from "@/components/landing/solution-section";
import { HowItWorks } from "@/components/landing/how-it-works";
import { LivePreview } from "@/components/landing/live-preview";
import { ImpactSDG } from "@/components/landing/impact-sdg";
import { Credibility } from "@/components/landing/credibility";
import { PartnerCTA } from "@/components/landing/partner-cta";
import { SiteFooter } from "@/components/landing/site-footer";

export const metadata: Metadata = {
  title: "SAFE-NIGERIA — Solar-Powered Flood Early Warning Network",
  description: "A national flood intelligence platform protecting 36 states with solar-powered Sentinel Nodes, LoRa mesh, and edge AI — turning ₦4.2 trillion in annual losses into minutes of warning.",
  openGraph: {
    title: "SAFE-NIGERIA — Flood Intelligence for a Nation",
    description: "Ground-truth flood data from the river's edge. Solar Sentinel Nodes, LoRa mesh, and edge AI giving Nigeria minutes that save lives.",
  },
};

export default function HomePage() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <SiteHeader />
      <Hero />
      <StatBar />
      <ProblemSection />
      <SolutionSection />
      <HowItWorks />
      <LivePreview />
      <ImpactSDG />
      <Credibility />
      <PartnerCTA />
      <SiteFooter />
    </div>
  );
}
