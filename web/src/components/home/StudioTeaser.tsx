"use client";

import { useId, useRef } from "react";
import { gsap, useGSAP } from "@/lib/gsap";
import { about, values } from "@/lib/site";
import { PillLink } from "@/components/ui/Buttons";
import { RevealText } from "@/components/ui/RevealText";
import { ValueGlyph } from "@/components/about/ValueGlyph";

/** Who we are, with the six value marks as a doorway into the About page. */
export function StudioTeaser() {
  const titleId = useId();
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        gsap.from("[data-teaser-mark]", {
          scale: 0.6,
          opacity: 0,
          duration: 0.9,
          ease: "reveal",
          stagger: 0.05,
          scrollTrigger: { trigger: "[data-teaser-marks]", start: "top 85%", once: true },
        });
      });
      return () => mm.revert();
    },
    { scope: root },
  );

  return (
    <section ref={root} aria-labelledby={titleId} className="border-t border-line">
      <div className="shell grid gap-14 py-24 md:grid-cols-12 md:items-center md:py-36">
        <div className="md:col-span-6">
          <RevealText as="h2" id={titleId} className="t-d2 max-w-[12ch]">
            {about.title}
          </RevealText>
          <p className="mt-6 max-w-[52ch] text-pretty text-muted">{about.body}</p>
          <div className="mt-10 flex flex-wrap gap-3">
            <PillLink href="/about">Our story and values</PillLink>
            <PillLink href="/career" variant="ghost">
              Join the team
            </PillLink>
          </div>
        </div>
        <ul data-teaser-marks aria-label="Our values" className="grid grid-cols-3 gap-3 md:col-span-5 md:col-start-8">
          {values.map((v) => (
            <li key={v.id} data-teaser-mark>
              <div className="flex aspect-square flex-col items-center justify-center gap-3 rounded-[clamp(12px,1.3vw,20px)] bg-navy-900/50 p-3 text-center ring-1 ring-line">
                <ValueGlyph id={v.id} className="size-[clamp(2.25rem,4vw,3.5rem)] text-fg" />
                <span className="text-[0.8125rem] leading-snug text-muted">{v.title}</span>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
