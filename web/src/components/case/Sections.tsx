"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useId, useRef, useState } from "react";
import { gsap, useGSAP } from "@/lib/gsap";
import type { CaseProject, Still } from "@/lib/projects";
import { RevealText } from "@/components/ui/RevealText";

/* ------------------------------------------------------------------ */
/* Brief                                                               */
/* ------------------------------------------------------------------ */

export function Brief({ project }: { project: CaseProject }) {
  const titleId = useId();
  return (
    <section aria-labelledby={titleId} className="shell py-24 md:py-36">
      <div className="grid gap-12 md:grid-cols-12">
        <RevealText as="h2" id={titleId} className="t-d2 md:col-span-7">
          {project.headline}
        </RevealText>
        <div className="space-y-6 text-muted md:col-span-5 md:pt-3">
          {project.body.map((para) => (
            <p key={para.slice(0, 32)} className="max-w-[60ch] text-pretty">
              {para}
            </p>
          ))}
        </div>
      </div>

      <div className="mt-16 grid gap-6 border-t border-line pt-8 md:mt-24 md:grid-cols-12">
        <h3 className="t-meta text-faint md:col-span-3">What we did</h3>
        <ul className="flex flex-wrap gap-2 md:col-span-9">
          {project.scope.map((s) => (
            <li key={s} className="rounded-full px-4 py-2 text-[0.9375rem] ring-1 ring-line-strong">
              {s}
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* Gallery                                                             */
/* ------------------------------------------------------------------ */

/** Layout recipe: alternate wide and narrow so the eye keeps moving. */
const LANDSCAPE_SPANS = [
  "md:col-span-7",
  "md:col-span-5 md:self-end md:aspect-[4/5]",
  "md:col-span-5 md:aspect-[4/5]",
  "md:col-span-7 md:self-start",
  "md:col-span-6",
  "md:col-span-6 md:mt-20",
];

export function Gallery({ stills, portrait }: { stills: Still[]; portrait: boolean }) {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference) and (min-width: 768px)", () => {
        gsap.utils.toArray<HTMLElement>("[data-gallery-item]").forEach((el, i) => {
          const img = el.querySelector("img");
          gsap.fromTo(
            img,
            { yPercent: -6, scale: 1.12 },
            {
              yPercent: 6,
              ease: "none",
              scrollTrigger: { trigger: el, start: "top bottom", end: "bottom top", scrub: true },
            },
          );
          gsap.from(el, {
            y: 80,
            autoAlpha: 0,
            duration: 1.1,
            ease: "reveal",
            delay: (i % 2) * 0.08,
            scrollTrigger: { trigger: el, start: "top 90%", once: true },
          });
        });
      });
      return () => mm.revert();
    },
    { scope: root },
  );

  return (
    <section ref={root} aria-label="Gallery" className="shell py-12 md:py-24">
      <ul className={`grid gap-[clamp(0.75rem,1.6vw,1.5rem)] ${portrait ? "grid-cols-2 md:grid-cols-3" : "md:grid-cols-12"}`}>
        {stills.map((s, i) => (
          <li
            key={s.src}
            data-gallery-item
            className={`relative overflow-hidden rounded-[clamp(12px,1.3vw,20px)] bg-navy-900 ${
              portrait ? `aspect-[9/16] ${i === 1 ? "md:mt-24" : ""}` : `aspect-[3/2] ${LANDSCAPE_SPANS[i % LANDSCAPE_SPANS.length]}`
            }`}
          >
            <Image
              src={s.src}
              alt={s.alt}
              fill
              sizes={portrait ? "(min-width: 768px) 30vw, 50vw" : "(min-width: 768px) 55vw, 100vw"}
              className="object-cover"
            />
          </li>
        ))}
      </ul>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* Film: YouTube, loaded only when asked for                          */
/* ------------------------------------------------------------------ */

export function Film({ youtubeId, title, poster }: { youtubeId: string; title: string; poster: Still }) {
  const [playing, setPlaying] = useState(false);
  const titleId = useId();
  const frame = useRef<HTMLIFrameElement>(null);

  // The play button unmounts on click; hand focus to the player.
  useEffect(() => {
    if (playing) frame.current?.focus();
  }, [playing]);
  return (
    <section aria-labelledby={titleId} className="shell py-24 md:py-36">
      <div className="mb-8 flex items-end justify-between gap-6">
        <h2 id={titleId} className="t-d2">
          The film
        </h2>
        <a
          href={`https://www.youtube.com/watch?v=${youtubeId}`}
          target="_blank"
          rel="noreferrer"
          className="t-meta text-muted transition-colors hover:text-fg"
        >
          Watch on YouTube
          <span className="sr-only"> (opens in a new tab)</span>
        </a>
      </div>
      <div className="relative aspect-video overflow-hidden rounded-[clamp(14px,1.6vw,24px)] bg-navy-900">
        {playing ? (
          <iframe
            ref={frame}
            src={`https://www.youtube-nocookie.com/embed/${youtubeId}?autoplay=1&rel=0&modestbranding=1&playsinline=1`}
            title={title}
            allow="autoplay; encrypted-media; picture-in-picture; fullscreen"
            allowFullScreen
            className="absolute inset-0 h-full w-full"
          />
        ) : (
          <button
            type="button"
            onClick={() => setPlaying(true)}
            className="group absolute inset-0 block h-full w-full focus-visible:outline-offset-[-6px]"
            aria-label={`Play film: ${title}`}
          >
            <Image src={poster.src} alt="" fill sizes="(min-width: 1472px) 1400px, 100vw" className="object-cover transition-transform duration-700 ease-out-expo group-hover:scale-[1.03]" />
            <span aria-hidden className="absolute inset-0 bg-[rgb(5_10_36/0.35)]" />
            <span
              aria-hidden
              className="absolute left-1/2 top-1/2 grid size-[clamp(4.5rem,8vw,6.5rem)] -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full bg-fg text-ink shadow-[0_20px_60px_-20px_rgb(0_0_0/0.8)] transition-transform duration-300 ease-ui group-hover:scale-105 group-focus-visible:ring-2 group-focus-visible:ring-gold-hi group-focus-visible:ring-offset-4 group-focus-visible:ring-offset-transparent group-active:scale-95"
            >
              <svg width="22" height="24" viewBox="0 0 22 24" fill="currentColor">
                <path d="M21 12L1 23.5V.5L21 12z" />
              </svg>
            </span>
          </button>
        )}
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* Next project                                                        */
/* ------------------------------------------------------------------ */

export function NextProject({ next }: { next: CaseProject }) {
  return (
    <section data-accent={next.accent} aria-label="Next project" className="border-t border-line">
      <Link
        href={`/portfolio/${next.slug}`}
        className="group relative block overflow-hidden"
      >
        <div className="shell relative z-10 grid gap-10 py-24 md:grid-cols-12 md:items-center md:py-36">
          <div className="md:col-span-6">
            <p className="t-meta flex items-center gap-3 text-muted">
              <span className="inline-block size-2 rounded-full" style={{ backgroundColor: next.accent }} aria-hidden />
              Next project
            </p>
            <p className="t-d1 mt-6 max-w-[12ch]">{next.title}</p>
            <p className="mt-6 max-w-[40ch] text-muted">{next.kicker}</p>
            <span className="mt-10 inline-flex items-center gap-3 rounded-full bg-fg py-3 pl-6 pr-3 font-medium text-ink transition-transform duration-150 ease-ui group-active:scale-[0.97]">
              View case study
              <span className="grid size-8 place-items-center rounded-full bg-ink text-fg transition-transform duration-300 ease-ui group-hover:translate-x-0.5" aria-hidden>
                <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                  <path d="M1 6h10m0 0L6.5 1.5M11 6l-4.5 4.5" stroke="currentColor" strokeWidth="1.4" />
                </svg>
              </span>
            </span>
          </div>
          <div
            className={`relative overflow-hidden rounded-[clamp(14px,1.6vw,24px)] bg-navy-900 md:col-span-6 ${
              next.frame === "phone" ? "mx-auto aspect-[9/16] w-[min(100%,20rem)]" : "aspect-[4/3]"
            }`}
          >
            <Image
              src={next.cover.src}
              alt={next.cover.alt}
              fill
              sizes="(min-width: 768px) 45vw, 100vw"
              className="object-cover transition-transform duration-1000 ease-out-expo group-hover:scale-[1.04]"
              style={{ objectPosition: next.focus }}
            />
          </div>
        </div>
      </Link>
    </section>
  );
}
