"use client";

import dynamic from "next/dynamic";
import Image from "next/image";
import { useId, useEffect, useRef, useState } from "react";
import { SceneBoundary, useWebGL } from "@/components/three/support";
import { gsap, ScrollTrigger, useGSAP } from "@/lib/gsap";
import { useMedia, useReducedMotion } from "@/hooks/useMedia";
import { RevealText } from "@/components/ui/RevealText";
import { studio } from "@/lib/projects";

const ArchScene = dynamic(() => import("./ArchScene"), { ssr: false });

/** The logo's arch as a hairline; drawn on scroll where WebGL is not used. */
function ArchLine({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 200 200" className={className} aria-hidden fill="none">
      <defs>
        <linearGradient id="arch-gold" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#e6b24e" />
          <stop offset="1" stopColor="#c8902a" />
        </linearGradient>
      </defs>
      <path
        data-arch-path
        pathLength={1}
        d="M 163.5 144.4 A 77.5 77.5 0 1 0 36.5 144.4"
        stroke="url(#arch-gold)"
        strokeWidth="1.2"
        strokeLinecap="round"
      />
    </svg>
  );
}

export function Hero() {
  const titleId = useId();
  const root = useRef<HTMLElement>(null);
  const progress = useRef(0);
  const reduced = useReducedMotion();
  const desktop = useMedia("(min-width: 768px)", true);
  const webgl = useWebGL();
  const [ready, setReady] = useState(false);
  const [active, setActive] = useState(true);
  const [paused, setPaused] = useState(false);

  const use3D = webgl && desktop && !reduced;


  useGSAP(
    () => {
      const mm = gsap.matchMedia();

      mm.add("(prefers-reduced-motion: no-preference)", () => {
        const tl = gsap.timeline({
          defaults: { ease: "none" },
          scrollTrigger: {
            trigger: root.current,
            start: "top top",
            end: "+=160%",
            pin: true,
            scrub: 0.8,
            onUpdate: (self) => {
              progress.current = self.progress;
            },
            // Render (and decode the backdrop video) only while the pinned
            // hero is on stage; past the end it is fully veiled anyway.
            onToggle: (self) => setActive(self.isActive),
          },
        });

        tl.to("[data-hero-copy]", { yPercent: -14, autoAlpha: 0, duration: 0.2, ease: "power1.in" }, 0.06)
          .to("[data-hero-poster]", { scale: 1.12, duration: 1 }, 0)
          .to("[data-arch-line]", { scale: 2.6, autoAlpha: 0, duration: 0.5 }, 0.45)
          .to("[data-hero-veil]", { autoAlpha: 1, duration: 0.18 }, 0.82);

        // Fallback arch (no WebGL): draws itself in on load like the logo's line.
        gsap.fromTo("[data-arch-path]", { strokeDashoffset: 1 }, { strokeDashoffset: 0, duration: 1.8, ease: "reveal", delay: 0.3 });

        return () => {
          progress.current = 0;
        };
      });

      // Static composition for reduced motion: arch drawn, nothing pinned.
      mm.add("(prefers-reduced-motion: reduce)", () => {
        gsap.set("[data-arch-path]", { strokeDashoffset: 0 });
      });

      return () => mm.revert();
    },
    { scope: root },
  );

  useEffect(() => {
    if (ready) ScrollTrigger.refresh();
  }, [ready]);

  // ScrollTrigger wraps the pinned element in a spacer; the outer div keeps
  // React's own node stable so route transitions can insert beside it.
  return (
    <div>
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

        {use3D && (
          <div
            className="absolute inset-0 -z-10 transition-opacity duration-1000 ease-ui"
            style={{ opacity: ready ? 1 : 0 }}
          >
            <SceneBoundary>
              <ArchScene progress={progress} active={active} paused={paused} onReady={() => setReady(true)} />
            </SceneBoundary>
          </div>
        )}

        {!use3D && (
          <div data-arch-line className="pointer-events-none absolute inset-x-0 top-[11dvh] -z-10 flex justify-center md:inset-0 md:top-0 md:items-center">
            <ArchLine className="w-[min(64vw,34rem)] [&_path]:[stroke-dasharray:1]" />
          </div>
        )}

        {/* Legibility: darken the bottom-left where the headline sits. */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(90%_70%_at_0%_100%,rgb(5_10_36/0.92),transparent_70%),linear-gradient(to_top,rgb(5_10_36/0.9),transparent_45%)]"
        />

        <div data-hero-copy className="shell flex h-full flex-col justify-end pb-[clamp(2.5rem,8vh,6rem)]">
          <p className="t-meta flex items-center gap-3 text-muted">
            <span className="inline-block h-px w-8 bg-gold" aria-hidden />
            Portfolio. Cairo, since {studio.founded}.
          </p>
          <RevealText
            as="h1"
            id={titleId}
            trigger="mount"
            delay={0.15}
            className="t-d1 mt-6 max-w-[11ch]"
          >
            {`${studio.events.toLocaleString("en-US")} events since ${studio.founded}.`}
          </RevealText>
          <p className="t-body-l mt-5 max-w-[30ch] text-muted">These are the ones we&rsquo;d show first.</p>
          <div className="mt-10 flex flex-wrap items-center gap-x-8 gap-y-4">
            <a
              href="#work"
              className="inline-flex items-center gap-3 rounded-full bg-fg py-3 pl-6 pr-3 font-medium text-ink transition-transform duration-150 ease-ui active:scale-[0.97]"
            >
              See the work
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

        {use3D && (
        <button
          type="button"
          onClick={() => setPaused((p) => !p)}
          aria-pressed={paused}
          aria-label={paused ? "Play background motion" : "Pause background motion"}
          className="absolute bottom-[clamp(2.5rem,8vh,6rem)] right-[var(--gutter)] grid size-11 place-items-center rounded-full bg-[rgb(5_10_36/0.5)] text-muted ring-1 ring-line-strong backdrop-blur transition-[color,transform] duration-150 ease-ui hover:text-fg active:scale-[0.94]"
        >
          <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden>
            {paused ? (
              <path d="M3 1.5v9l7.5-4.5L3 1.5z" fill="currentColor" />
            ) : (
              <path d="M3.5 1.5v9M8.5 1.5v9" stroke="currentColor" strokeWidth="1.6" />
            )}
          </svg>
        </button>
      )}

      <div data-hero-veil aria-hidden className="pointer-events-none invisible absolute inset-0 bg-[var(--base)] opacity-0" />
      </section>
    </div>
  );
}
