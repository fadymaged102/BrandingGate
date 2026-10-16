"use client";

import { useRef } from "react";
import { gsap, useGSAP } from "@/lib/gsap";
import { studio } from "@/lib/projects";
import { Figures } from "@/components/Figures";

export function ProofBand() {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        gsap.from("[data-client]", {
          opacity: 0,
          y: 12,
          duration: 0.6,
          ease: "reveal",
          stagger: 0.03,
          scrollTrigger: { trigger: "[data-clients]", start: "top 90%", once: true },
        });
      });
      return () => mm.revert();
    },
    { scope: root },
  );

  return (
    <section ref={root} aria-label="Branding Gate in numbers" className="shell py-24 md:py-36">
      <Figures />

      <div data-clients className="mt-24 grid gap-8 md:mt-32 md:grid-cols-12">
        <h2 className="t-meta text-muted md:col-span-3">Trusted by</h2>
        <ul className="flex flex-wrap gap-x-8 gap-y-3 md:col-span-9">
          {studio.clients.map((c) => (
            <li
              key={c}
              data-client
              className="font-display text-[clamp(1.125rem,1.8vw,1.5rem)] font-light tracking-[-0.01em] text-muted"
            >
              {c}
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
