import type { Metadata } from "next";
import { PageTransition } from "@/components/PageTransition";
import { CareerHero } from "@/components/career/CareerHero";
import { JobBoard } from "@/components/career/JobBoard";
import { CultureCards } from "@/components/career/CultureCards";
import { HEAD_OFFICE, openRoles } from "@/lib/careers";

export const metadata: Metadata = {
  title: "Career",
  description: `Open roles at Branding Gate (${HEAD_OFFICE}): ${openRoles.map((r) => r.title).join(", ")}.`,
  alternates: { canonical: "/career" },
};

export default function CareerPage() {
  return (
    <PageTransition>
      <CareerHero />
      <JobBoard />
      <CultureCards />
    </PageTransition>
  );
}
