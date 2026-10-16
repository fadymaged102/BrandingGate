"use client";

import dynamic from "next/dynamic";
import { useEffect, useId, useRef, useState } from "react";
import { gsap, useGSAP } from "@/lib/gsap";
import { useReducedMotion } from "@/hooks/useMedia";
import { SceneBoundary, useWebGL } from "@/components/three/support";
import { RevealText } from "@/components/ui/RevealText";
import { ArrowIcon, Eyebrow, PillLink } from "@/components/ui/Buttons";
import { home } from "@/lib/site";
import { studio } from "@/lib/projects";
import { useSiteMotion } from "@/components/Constellation";

const LogoScene = dynamic(() => import("./LogoScene"), { ssr: false });

/**
 * The logo flat: the gold arch (r 77.5 of 200, as everywhere else) with the
 * traced monogram and wordmark placed by the proportions measured from the
 * logo file. Shown without WebGL and until the 3D logo is ready.
 */
function FlatLogo({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 200 200" className={className} aria-hidden fill="none">
      <path
        d="M 163.5 144.4 A 77.5 77.5 0 1 0 36.5 144.4"
        stroke="#c8902a"
        strokeWidth="2.2"
        strokeLinecap="round"
      />
      <image href="/brand/monogram.svg" x="52" y="45" width="97.7" height="103.4" />
      <image href="/brand/wordmark.svg" x="3.4" y="150" width="186" height="26.4" />
    </svg>
  );
}

/**
 * The opening statement over Home's constellation backdrop. Nothing pins:
 * the copy settles in, then the page scrolls straight on to the services.
 */
export function HomeHero() {
  const titleId = useId();
  const root = useRef<HTMLElement>(null);
  const reduced = useReducedMotion();
  const { paused, toggle } = useSiteMotion();
  const webgl = useWebGL();
  // The turning logo stays on under reduced motion (the owner's call): it is
  // small, slow and turns in place, and the pause control stops it.
  const use3D = webgl;
  const [ready, setReady] = useState(false);
  const [onScreen, setOnScreen] = useState(true);

  // Render the logo only while the hero is on screen.
  useEffect(() => {
    const el = root.current;
    if (!el) return;
    const io = new IntersectionObserver(([entry]) => setOnScreen(entry.isIntersecting));
    io.observe(el);
    return () => io.disconnect();
  }, []);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        gsap.from("[data-hero-actions] > *", { y: 16, opacity: 0, duration: 0.8, ease: "reveal", stagger: 0.06, delay: 0.55 });
        gsap.from("[data-hero-intro]", { y: 16, opacity: 0, duration: 0.9, ease: "reveal", delay: 0.45 });
        gsap.from("[data-hero-logo]", { scale: 0.85, opacity: 0, duration: 1.6, ease: "reveal", delay: 0.2 });
      });
      return () => mm.revert();
    },
    { scope: root },
  );

  return (
    <section ref={root} aria-labelledby={titleId} className="relative flex min-h-[min(100dvh,60rem)] flex-col">
      {/* Legibility: a soft pool of the page colour under the headline. */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(70%_60%_at_15%_85%,rgb(5_10_36/0.85),transparent_70%)]"
      />

      <div className="shell grid flex-1 content-end gap-y-3 pb-[clamp(2.5rem,8vh,6rem)] pt-[calc(var(--header-h)+0.25rem)] md:grid-cols-12 md:content-center md:gap-x-8 md:pt-[calc(var(--header-h)+3rem)]">
        {/* The logo, turning slowly beside the slogan; above it on phones. */}
        <div
          data-hero-logo
          className="relative aspect-square w-[min(42vw,10.5rem)] md:order-last md:col-span-5 md:w-full md:max-w-[34rem] md:justify-self-end"
        >
          <div
            className="absolute inset-0 transition-opacity duration-700 ease-ui"
            style={{ opacity: use3D && ready ? 0 : 1 }}
          >
            <FlatLogo className="size-full" />
          </div>
          {use3D && (
            <div
              className="absolute inset-0 transition-opacity duration-700 ease-ui"
              style={{ opacity: ready ? 1 : 0 }}
            >
              <SceneBoundary>
                <LogoScene active={onScreen} spinning={!paused} onReady={() => setReady(true)} />
              </SceneBoundary>
            </div>
          )}
        </div>
        <div className="md:col-span-7 md:self-end">
          <Eyebrow>
            {home.eyebrow}. {studio.city}, since {studio.founded}.
          </Eyebrow>
          <RevealText as="h1" id={titleId} trigger="mount" delay={0.15} className="t-d1 mt-6 max-w-[9ch]">
            {home.headline}
          </RevealText>
          <p data-hero-intro className="t-body-l mt-6 max-w-[38ch] text-muted">
            {home.intro}
          </p>
          <div className="mt-10 flex flex-wrap items-center justify-between gap-6">
            <div data-hero-actions className="flex flex-wrap items-center gap-3">
              <PillLink href="/portfolio">See the work</PillLink>
              <PillLink href="/about" variant="ghost">
                About the studio
              </PillLink>
            </div>
            <div className="flex items-center gap-2">
              <a
                href="#services"
                className="t-meta hidden items-center gap-2 rounded-full px-3 py-3 text-faint transition-colors duration-150 hover:text-fg lg:inline-flex"
              >
                Scroll
                <ArrowIcon direction="down" />
              </a>
              {(use3D || !reduced) && (
                <button
                  type="button"
                  onClick={toggle}
                  aria-pressed={paused}
                  aria-label={paused ? "Play motion" : "Pause motion"}
                  className="grid size-11 place-items-center rounded-full bg-[rgb(5_10_36/0.5)] text-muted ring-1 ring-line-strong backdrop-blur transition-[color,transform] duration-150 ease-ui hover:text-fg active:scale-[0.94]"
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
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
