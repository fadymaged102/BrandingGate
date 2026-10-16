"use client";

import { useId, useRef, useState } from "react";
import { gsap, ScrollTrigger, useGSAP } from "@/lib/gsap";
import { clientWall } from "@/lib/site";
import { useReducedMotion } from "@/hooks/useMedia";

const half = Math.ceil(clientWall.length / 2);
const rows = [clientWall.slice(0, half), clientWall.slice(half)];

/**
 * The client wall as two counter-running bands laid on a tilted plane, so
 * names recede into the room. Scrolling speeds them up in the direction of
 * travel. Pausable (WCAG 2.2.2) and still under reduced motion.
 */
export function ClientMarquee() {
  const titleId = useId();
  const root = useRef<HTMLElement>(null);
  const loops = useRef<gsap.core.Tween[]>([]);
  const [paused, setPaused] = useState(false);
  const pausedRef = useRef(false);
  const reduced = useReducedMotion();

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        const tracks = gsap.utils.toArray<HTMLElement>("[data-track]");
        loops.current = tracks.map((track, i) =>
          gsap.fromTo(
            track,
            { xPercent: i % 2 ? -50 : 0 },
            // Paused until on screen; onToggle below starts them.
            { xPercent: i % 2 ? 0 : -50, duration: 70 + i * 10, ease: "none", repeat: -1, paused: true },
          ),
        );
        // Park the playheads far along so scrolling up (negative timeScale)
        // never runs a loop back to its start, where it would stop.
        loops.current.forEach((t) => t.totalTime(t.duration() * 1000));

        // Scroll velocity adds a burst of speed that eases back to cruise.
        const boost = { v: 1 };
        const apply = () => loops.current.forEach((t) => t.timeScale(boost.v));
        const st = ScrollTrigger.create({
          trigger: root.current,
          start: "top bottom",
          end: "bottom top",
          // Off screen (or on a hidden route) the bands stop ticking.
          onToggle: (self) =>
            loops.current.forEach((t) => (self.isActive && !pausedRef.current ? t.resume() : t.pause())),
          onUpdate: (self) => {
            const v = gsap.utils.clamp(-4, 4, self.getVelocity() / 600);
            const target = (1 + Math.abs(v)) * (v < 0 ? -1 : 1);
            gsap.to(boost, { v: target, duration: 0.2, overwrite: true, onUpdate: apply });
            gsap.to(boost, { v: target < 0 ? -1 : 1, duration: 1.2, delay: 0.2, ease: "ui", onUpdate: apply });
          },
        });

        gsap.from("[data-plane]", {
          rotateX: 38,
          opacity: 0,
          duration: 1.4,
          ease: "reveal",
          scrollTrigger: { trigger: root.current, start: "top 80%", once: true },
        });

        return () => {
          st.kill();
          loops.current = [];
        };
      });
      return () => mm.revert();
    },
    { scope: root },
  );

  const toggle = () => {
    const next = !paused;
    pausedRef.current = next;
    setPaused(next);
    loops.current.forEach((t) => (next ? t.pause() : t.resume()));
  };

  return (
    <section ref={root} aria-labelledby={titleId} className="overflow-hidden py-24 md:py-36">
      <div className="shell grid gap-6 md:grid-cols-12 md:items-end">
        <div className="md:col-span-8">
          <p className="t-meta text-muted">Clients</p>
          <h2 id={titleId} className="t-d2 mt-5">
            Working with the best
          </h2>
        </div>
        {!reduced && (
          <div className="md:col-span-4 md:justify-self-end">
            <button
              type="button"
              onClick={toggle}
              aria-pressed={paused}
              className="inline-flex min-h-11 items-center gap-2 rounded-full px-4 text-[0.9375rem] text-muted ring-1 ring-line-strong transition-[color,box-shadow,transform] duration-150 ease-ui hover:text-fg hover:ring-gold active:scale-[0.97]"
            >
              <svg width="10" height="10" viewBox="0 0 12 12" fill="none" aria-hidden>
                {paused ? (
                  <path d="M3 1.5v9l7.5-4.5L3 1.5z" fill="currentColor" />
                ) : (
                  <path d="M3.5 1.5v9M8.5 1.5v9" stroke="currentColor" strokeWidth="1.8" />
                )}
              </svg>
              {paused ? "Play" : "Pause"}
              <span className="sr-only"> client names</span>
            </button>
          </div>
        )}
      </div>

      {reduced ? (
        <ul className="shell mt-14 flex flex-wrap gap-x-8 gap-y-3">
          {clientWall.map((c) => (
            <li key={c} className="font-display text-[clamp(1.125rem,1.8vw,1.5rem)] font-light text-muted">
              {c}
            </li>
          ))}
        </ul>
      ) : (
        <div className="mt-14 [perspective:1200px] md:mt-20">
          <div
            data-plane
            className="origin-[50%_0%] [transform:rotateX(14deg)] [mask-image:linear-gradient(to_right,transparent,#000_12%,#000_88%,transparent)]"
          >
            <ul className="sr-only">
              {clientWall.map((c) => (
                <li key={c}>{c}</li>
              ))}
            </ul>
            {rows.map((row, i) => (
              <div key={i} aria-hidden className="overflow-hidden py-2">
                <div data-track className="flex w-max will-change-transform">
                  {[0, 1].map((copy) => (
                    <div key={copy} className="flex shrink-0">
                      {row.map((c) => (
                        <span
                          key={c}
                          className={`whitespace-nowrap px-[clamp(1rem,2.4vw,2.25rem)] font-display text-[clamp(2rem,5vw,4.5rem)] leading-[1.15] tracking-[-0.03em] ${
                            i % 2 ? "font-light text-faint" : "font-medium text-fg/85"
                          }`}
                        >
                          {c}
                          <span className="ml-[clamp(1rem,2.4vw,2.25rem)] inline-block size-[0.18em] -translate-y-[0.2em] rounded-full bg-line-strong align-middle" />
                        </span>
                      ))}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </section>
  );
}
