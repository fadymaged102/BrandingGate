"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { gsap, useGSAP } from "@/lib/gsap";
import type { CaseProject } from "@/lib/projects";
import { RevealText } from "@/components/ui/RevealText";
import { Media, PhoneFrame } from "@/components/ui/Frames";
import { useReducedMotion } from "@/hooks/useMedia";

export function CaseHero({ project }: { project: CaseProject }) {
  const root = useRef<HTMLElement>(null);
  const portrait = project.frame === "phone";
  const reduced = useReducedMotion();
  const plate = useRef<HTMLDivElement>(null);
  // Starts false so the reel never arms during hydration (when the reduced
  // motion query still reports its server value); an observer turns it on
  // only while the plate is on screen.
  const [inView, setInView] = useState(false);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    const el = plate.current;
    if (!el || !portrait) return;
    const io = new IntersectionObserver(([entry]) => setInView(entry.isIntersecting));
    io.observe(el);
    return () => io.disconnect();
  }, [portrait]);

  const reelPlaying = inView && !reduced && !paused;

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        gsap.from("[data-hero-meta] > *", {
          y: 16,
          autoAlpha: 0,
          duration: 0.8,
          ease: "reveal",
          stagger: 0.06,
          delay: 0.35,
        });
        // The picture opens from an inset card to full bleed as you scroll.
        gsap.fromTo(
          "[data-hero-plate]",
          { clipPath: "inset(6% 5% 0% 5% round 28px)" },
          {
            clipPath: "inset(0% 0% 0% 0% round 0px)",
            ease: "none",
            scrollTrigger: { trigger: "[data-hero-plate]", start: "top 85%", end: "top 15%", scrub: 0.8 },
          },
        );
        gsap.fromTo(
          "[data-hero-plate] > img",
          { scale: 1.15 },
          {
            scale: 1,
            ease: "none",
            scrollTrigger: { trigger: "[data-hero-plate]", start: "top bottom", end: "bottom top", scrub: 0.8 },
          },
        );
      });
      return () => mm.revert();
    },
    { scope: root },
  );

  return (
    <header ref={root} className="relative pt-[calc(var(--header-h)+clamp(2.5rem,8vh,6rem))]">
      <div className="shell">
        <nav aria-label="Breadcrumb" className="t-meta text-faint">
          <Link href="/portfolio#work" className="transition-colors hover:text-fg">
            Portfolio
          </Link>
          <span aria-hidden className="mx-2">/</span>
          <span aria-current="page" className="text-muted">
            {project.client}
          </span>
        </nav>

        <RevealText as="h1" trigger="mount" className="t-d1 mt-6 max-w-[16ch]">
          {project.title}
        </RevealText>

        <div data-hero-meta className="mt-10 grid gap-8 border-t border-line pt-8 md:grid-cols-12">
          <p className="t-body-l max-w-[42ch] text-muted md:col-span-6">{project.summary}</p>
          <dl className="grid grid-cols-2 gap-x-6 gap-y-5 md:col-span-6 md:grid-cols-4">
            {project.facts.map((f) => (
              <div key={f.label}>
                <dt className="t-meta text-faint">{f.label}</dt>
                <dd className="mt-1.5 text-[0.9375rem]">{f.value}</dd>
              </div>
            ))}
          </dl>
        </div>
      </div>

      <div
        ref={plate}
        data-hero-plate
        className={`relative mt-[clamp(3rem,8vh,6rem)] w-full overflow-hidden bg-navy-900 ${
          portrait ? "h-[min(110vh,72rem)]" : "aspect-[16/10] max-h-[110vh] md:aspect-video"
        }`}
      >
        {portrait ? (
          <>
            <Image
              src={project.cover.src}
              alt=""
              fill
              priority
              sizes="100vw"
              className="scale-110 object-cover opacity-45 blur-3xl"
            />
            <div className="absolute inset-0 grid place-items-center py-[6%]">
              <div className="h-full">
                <PhoneFrame>
                  <Media
                    still={project.cover}
                    loop={project.reel ?? project.loop}
                    playing={reelPlaying}
                    sizes="(min-width: 768px) 30vw, 70vw"
                    priority
                  />
                </PhoneFrame>
              </div>
            </div>
            {!reduced && (
              <button
                type="button"
                onClick={() => setPaused((p) => !p)}
                aria-pressed={paused}
                aria-label={paused ? "Play film" : "Pause film"}
                className="absolute bottom-5 right-5 grid size-11 place-items-center rounded-full bg-[rgb(5_10_36/0.6)] text-fg ring-1 ring-line-strong backdrop-blur transition-transform duration-150 ease-ui active:scale-[0.94] md:bottom-8 md:right-8"
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
          </>
        ) : (
          <Image
            src={project.cover.src}
            alt={project.cover.alt}
            fill
            priority
            sizes="100vw"
            className="object-cover"
            style={{ objectPosition: project.focus }}
          />
        )}
      </div>
    </header>
  );
}
