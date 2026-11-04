"use client";

import Image from "next/image";
import { useId, useRef } from "react";
import { gsap, useGSAP } from "@/lib/gsap";
import { RevealText } from "@/components/ui/RevealText";
import { studio } from "@/lib/projects";

/**
 * The portfolio's opening: a dimmed event still behind the headline. Nothing
 * pins; the poster drifts a little as the page scrolls on into the work.
 */
export function Hero() {
  const titleId = useId();
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        gsap.to("[data-hero-poster]", {
          yPercent: 8,
          scale: 1.06,
          ease: "none",
          scrollTrigger: { trigger: root.current, start: "top top", end: "bottom top", scrub: true },
        });
      });
      return () => mm.revert();
    },
    { scope: root },
  );

  return (
    <section
      ref={root}
      aria-labelledby={titleId}
      className="relative isolate h-dvh min-h-[38rem] overflow-hidden"
    >
      <div data-hero-poster className="absolute inset-0 -z-20 will-change-transform">
        <Image
          src="/work/hero-poster.jpg"
          alt=""
          fill
          priority
          sizes="100vw"
          className="object-cover object-[50%_40%] opacity-40"
        />
      </div>

      {/* Legibility: darken the bottom-left where the headline sits. */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(90%_70%_at_0%_100%,rgb(5_10_36/0.92),transparent_70%),linear-gradient(to_top,rgb(5_10_36/0.9),transparent_45%)]"
      />

      <div className="shell flex h-full flex-col justify-end pb-[clamp(2.5rem,8vh,6rem)]">
        <p className="t-meta flex items-center gap-3 text-muted">
          <span className="inline-block h-px w-8 bg-gold" aria-hidden />
          Portfolio. Cairo, since {studio.founded}.
        </p>
        <RevealText as="h1" id={titleId} trigger="mount" delay={0.15} className="t-d1 mt-6 max-w-[11ch]">
          {`${studio.events.toLocaleString("en-US")} events since ${studio.founded}.`}
        </RevealText>
        <p className="t-body-l mt-5 max-w-[30ch] text-muted">These are the ones we&rsquo;d show first.</p>
        <div className="mt-10 flex flex-wrap items-center gap-x-8 gap-y-4">
          <a
            href="#work"
            className="inline-flex items-center gap-3 rounded-full bg-fg py-3 pl-6 pr-3 font-medium text-ink transition-transform duration-150 ease-ui active:scale-[0.97]"
          >
            See the projects
            <span className="grid size-8 place-items-center rounded-full bg-ink text-fg" aria-hidden>
              <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                <path d="M6 1v10m0 0L1.5 6.5M6 11l4.5-4.5" stroke="currentColor" strokeWidth="1.4" />
              </svg>
            </span>
          </a>
          <p className="max-w-[34ch] text-[0.9375rem] text-faint">
            Events, media, digital and 3D for brands across Egypt and the Gulf.
          </p>
        </div>
      </div>
    </section>
  );
}
