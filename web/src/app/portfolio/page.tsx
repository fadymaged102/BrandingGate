import type { Metadata } from "next";
import { Hero } from "@/components/hero/Hero";
import { ProofBand } from "@/components/ProofBand";
import { WorkIndex } from "@/components/work/WorkIndex";
import { PageTransition } from "@/components/PageTransition";

export const metadata: Metadata = {
  title: "Portfolio",
  description:
    "Graduations, corporate kickoffs and brand nights by Branding Gate, with the media, digital, 3D and giveaway work around them.",
  alternates: { canonical: "/portfolio" },
};

export default function PortfolioPage() {
  return (
    <PageTransition>
      <Hero />
      <WorkIndex />
      <ProofBand />
    </PageTransition>
  );
}
