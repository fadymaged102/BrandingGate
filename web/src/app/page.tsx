import type { Metadata } from "next";
import { PageTransition } from "@/components/PageTransition";
import { HomeHero } from "@/components/home/HomeHero";
import { Services } from "@/components/home/Services";
import { FeaturedWork } from "@/components/home/FeaturedWork";
import { ClientMarquee } from "@/components/home/ClientMarquee";
import { StudioTeaser } from "@/components/home/StudioTeaser";
import { Figures } from "@/components/Figures";
import { home } from "@/lib/site";

export const metadata: Metadata = {
  title: { absolute: `Branding Gate | ${home.headline}` },
  description: home.intro[0],
  alternates: { canonical: "/" },
};

export default function HomePage() {
  return (
    <PageTransition>
      <HomeHero />
      <Services />
      <FeaturedWork />
      <section aria-label="Branding Gate in numbers" className="shell pt-12 md:pt-20">
        <Figures />
      </section>
      <ClientMarquee />
      <StudioTeaser />
    </PageTransition>
  );
}
