"use client";

import Image from "next/image";
import { useId, useRef } from "react";
import { gsap, useGSAP } from "@/lib/gsap";
import { about } from "@/lib/site";
import { studio } from "@/lib/projects";
import { RevealText } from "@/components/ui/RevealText";
import { Eyebrow } from "@/components/ui/Buttons";

/** Who we are, then the team: the photo opens from an inset card to full bleed as you scroll. */
export function AboutHero() {
  const titleId = useId();
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        gsap.from("[data-about-meta] > *", {
          y: 16,
          opacity: 0,
          duration: 0.8,
          ease: "reveal",
          stagger: 0.06,
          delay: 0.35,
        });
        gsap.fromTo(
          "[data-about-plate]",
          { clipPath: "inset(6% 5% 0% 5% round 28px)" },
          {
            clipPath: "inset(0% 0% 0% 0% round 20px)",
            ease: "none",
            scrollTrigger: { trigger: "[data-about-plate]", start: "top 85%", end: "top 15%", scrub: 0.8 },
          },
        );
        gsap.fromTo(
          "[data-about-plate] img",
          { scale: 1.15 },
          {
            scale: 1,
            ease: "none",
            scrollTrigger: { trigger: "[data-about-plate]", start: "top bottom", end: "bottom top", scrub: true },
          },
        );
      });
      return () => mm.revert();
    },
    { scope: root },
  );

  return (
    <section ref={root} aria-labelledby={titleId}>
      <div className="shell pb-16 pt-[calc(var(--header-h)+clamp(4rem,12vh,9rem))] md:pb-24">
        <Eyebrow>
          About. {studio.city}, since {studio.founded}.
        </Eyebrow>
        <div className="mt-8 grid gap-10 md:grid-cols-12 md:items-end">
          <RevealText as="h1" id={titleId} trigger="mount" delay={0.1} className="t-d1 max-w-[12ch] md:col-span-7">
            {about.title}
          </RevealText>
          <p data-about-meta className="t-body-l max-w-[46ch] text-pretty text-muted md:col-span-5">
            <span className="block">{about.body}</span>
          </p>
        </div>
      </div>

      {/* Inside the margins: the only team photo supplied is 960px wide. */}
      <div className="shell">
        <div
          data-about-plate
          className="relative aspect-[4/3] overflow-hidden rounded-[20px] bg-navy-900 sm:aspect-[16/9] lg:mx-auto lg:max-w-[72rem]"
        >
          <Image
            src={about.team.src}
            alt={about.team.alt}
            fill
            priority
            sizes="(min-width: 1280px) 72rem, 100vw"
            className="object-cover object-[50%_32%]"
          />
        </div>
      </div>
    </section>
  );
}
