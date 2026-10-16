import type { Metadata } from "next";
import { useId } from "react";
import { PageTransition } from "@/components/PageTransition";
import { AboutHero } from "@/components/about/AboutHero";
import { Values } from "@/components/about/Values";
import { Figures } from "@/components/Figures";
import { PillLink } from "@/components/ui/Buttons";
import { about, services } from "@/lib/site";

export const metadata: Metadata = {
  title: "About",
  description: about.body,
  alternates: { canonical: "/about" },
  openGraph: { images: [about.team.src] },
};

export default function AboutPage() {
  const servicesId = useId();
  const joinId = useId();
  return (
    <PageTransition>
      <AboutHero />
      <Values />

      <section aria-labelledby={servicesId} className="shell py-24 md:py-36">
        <div className="grid gap-12 md:grid-cols-12">
          <div className="md:col-span-5">
            <p className="t-meta text-muted">What we do</p>
            <h2 id={servicesId} className="t-d2 mt-5 max-w-[12ch]">
              One studio, six disciplines
            </h2>
            <div className="mt-10">
              <PillLink href="/portfolio">See the work</PillLink>
            </div>
          </div>
          <ol className="grid border-t border-line sm:grid-cols-2 md:col-span-7">
            {services.map((s, i) => (
              <li key={s.id} className="flex items-baseline gap-4 border-b border-line py-5 sm:odd:pr-6">
                <span className="t-meta w-6 text-faint">{String(i + 1).padStart(2, "0")}</span>
                <span className="font-display text-[clamp(1.25rem,1.8vw,1.625rem)] font-medium tracking-[-0.015em]">
                  {s.title}
                </span>
              </li>
            ))}
          </ol>
        </div>
        <Figures className="mt-24 md:mt-32" />
      </section>

      <section aria-labelledby={joinId} className="border-t border-line">
        <div className="shell grid gap-10 py-24 md:grid-cols-12 md:items-end md:py-32">
          <div className="md:col-span-7">
            <p className="t-meta text-muted">Career</p>
            <h2 id={joinId} className="t-d2 mt-5 max-w-[14ch]">
              Join the creative minds behind the work.
            </h2>
          </div>
          <div className="flex flex-wrap gap-3 md:col-span-5 md:justify-self-end">
            <PillLink href="/career">See open roles</PillLink>
            <PillLink href="/blog" variant="ghost">
              Read the blog
            </PillLink>
          </div>
        </div>
      </section>
    </PageTransition>
  );
}
