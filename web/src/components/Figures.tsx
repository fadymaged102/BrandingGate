"use client";

import { useRef } from "react";
import { gsap, useGSAP } from "@/lib/gsap";
import { studio } from "@/lib/projects";

const format = (s: { value: number; raw?: boolean }) =>
  s.raw ? String(s.value) : s.value.toLocaleString("en-US");

/** The studio in four numbers. Figures rise from behind their own mask, like the headline lines. */
export function Figures({ className = "" }: { className?: string }) {
  const root = useRef<HTMLDListElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        gsap.from("[data-figure]", {
          yPercent: 110,
          duration: 0.9,
          ease: "reveal",
          stagger: 0.06,
          scrollTrigger: { trigger: root.current, start: "top 88%", once: true },
        });
      });
      return () => mm.revert();
    },
    { scope: root },
  );

  return (
    <dl ref={root} className={`grid grid-cols-2 gap-x-6 gap-y-12 md:grid-cols-4 ${className}`}>
      {studio.stats.map((s) => (
        <div key={s.label} className="border-t border-line pt-6">
          <dt className="t-meta text-muted">{s.label}</dt>
          <dd className="mt-3 overflow-hidden pb-[0.08em] font-display text-[clamp(3rem,6vw,5.5rem)] font-medium leading-none tracking-[-0.04em] tabular-nums">
            <span data-figure className="block">
              {format(s)}
            </span>
          </dd>
        </div>
      ))}
    </dl>
  );
}
