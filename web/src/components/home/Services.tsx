"use client";

import Link from "next/link";
import { ArrowUpRight, Box, Clapperboard, Code, Gift, Megaphone, PartyPopper, type LucideIcon } from "lucide-react";
import { useId, useRef, type CSSProperties } from "react";
import { gsap, useGSAP } from "@/lib/gsap";
import { home, services } from "@/lib/site";

/** Per-note dressing: paper colour, resting tilt, and tape or a pin. Fixed, so the board renders the same every time. */
const NOTES: Record<string, { icon: LucideIcon; paper: string; tilt: number; fix: "tape" | "pin" }> = {
  events: { icon: PartyPopper, paper: "var(--note-yellow)", tilt: -2.4, fix: "tape" },
  media: { icon: Clapperboard, paper: "var(--note-mint)", tilt: 1.8, fix: "pin" },
  digital: { icon: Megaphone, paper: "var(--note-coral)", tilt: -1.2, fix: "tape" },
  "3d": { icon: Box, paper: "var(--note-sky)", tilt: 2.6, fix: "tape" },
  giveaways: { icon: Gift, paper: "var(--note-lavender)", tilt: -3, fix: "pin" },
  web: { icon: Code, paper: "var(--note-peach)", tilt: 1.4, fix: "tape" },
};

/**
 * The six services as sticky notes pinned to a dark board. They drop in
 * one after another; on hover or focus a note straightens, lifts and
 * casts a longer shadow. Each opens the portfolio.
 */
export function Services() {
  const titleId = useId();
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        // The drop runs on the list item, so it never fights the note's own CSS transform.
        gsap.utils.toArray<HTMLElement>("[data-note-slot]").forEach((slot, i) => {
          const tilt = Number(slot.dataset.tilt ?? 0);
          gsap.from(slot, {
            y: -70,
            rotation: tilt * 4,
            scale: 0.9,
            opacity: 0,
            duration: 0.9,
            ease: "back.out(1.6)",
            delay: i * 0.08,
            clearProps: "transform,opacity",
            scrollTrigger: { trigger: "[data-board]", start: "top 78%", once: true },
          });
        });
      });
      return () => mm.revert();
    },
    { scope: root },
  );

  return (
    <section ref={root} id="services" aria-labelledby={titleId} className="shell scroll-mt-24 py-24 md:py-36">
      <div className="grid gap-6 md:grid-cols-12 md:items-end">
        <h2 id={titleId} className="t-d2 md:col-span-7">
          Services
        </h2>
        <p className="max-w-[44ch] text-muted md:col-span-5 md:justify-self-end">{home.servicesIntro}</p>
      </div>

      <div
        data-board
        className="relative mt-12 rounded-[clamp(16px,2vw,28px)] bg-navy-900/55 px-[clamp(1.25rem,4vw,4rem)] pb-[clamp(2.5rem,5vw,4.5rem)] pt-[clamp(2.75rem,5vw,4.5rem)] ring-1 ring-line [background-image:radial-gradient(rgb(248_248_255/0.07)_1px,transparent_1.2px)] [background-size:22px_22px] md:mt-16"
      >
        <ol className="mx-auto grid max-w-[30rem] grid-cols-2 gap-x-[clamp(0.875rem,2vw,1.75rem)] gap-y-10 md:max-w-[46rem] md:grid-cols-3 xl:max-w-none xl:grid-cols-6">
          {services.map((s, i) => {
            const n = NOTES[s.id];
            const Icon = n.icon;
            return (
              <li
                key={s.id}
                data-note-slot
                data-tilt={n.tilt}
                // Offset grid: alternate notes sit lower, like notes stuck up by hand.
                className={`${i % 2 === 1 ? "mt-6 md:mt-0 xl:mt-8" : ""} ${i % 3 === 1 ? "md:mt-8 xl:mt-8" : ""}`}
              >
                <Link
                  href="/portfolio#work"
                  aria-label={`${s.title}: see the work`}
                  className="note note-paper relative flex aspect-square flex-col justify-between rounded-[3px] p-[clamp(0.9rem,1.4vw,1.25rem)] text-ink"
                  style={{ "--tilt": `${n.tilt}deg`, backgroundColor: n.paper } as CSSProperties}
                >
                  {n.fix === "tape" ? (
                    <span
                      aria-hidden
                      className="absolute -top-3 left-1/2 h-6 w-20 -translate-x-1/2 rotate-[-4deg] bg-[rgb(248_248_255/0.42)] shadow-[0_1px_2px_rgb(0_0_0/0.12)] [clip-path:polygon(0_8%,4%_0,8%_10%,12%_0,16%_8%,20%_0,80%_0,84%_9%,88%_0,92%_8%,96%_0,100%_10%,100%_92%,96%_100%,92%_90%,88%_100%,84%_92%,80%_100%,20%_100%,16%_91%,12%_100%,8%_92%,4%_100%,0_90%)]"
                    />
                  ) : (
                    <span
                      aria-hidden
                      className="absolute left-1/2 top-2.5 size-4 -translate-x-1/2 rounded-full bg-[radial-gradient(circle_at_35%_30%,var(--gold-hi),var(--gold)_55%,#7a5518)] shadow-[0_3px_4px_rgb(0_0_0/0.35)]"
                    />
                  )}

                  <span className="flex items-start justify-between pt-2">
                    <span className="grid size-10 place-items-center rounded-full bg-ink/[0.07]">
                      <Icon aria-hidden className="size-5" strokeWidth={1.7} />
                    </span>
                    <span className="t-meta text-ink/60">{String(i + 1).padStart(2, "0")}</span>
                  </span>

                  <span>
                    <span className="block font-display text-[clamp(1.0625rem,1.5vw,1.375rem)] font-semibold leading-[1.1] tracking-[-0.02em]">
                      {s.title}
                    </span>
                    <span className="mt-2 flex items-center gap-1 text-[0.8125rem] font-medium text-ink/75">
                      See the work
                      <ArrowUpRight aria-hidden className="size-4" strokeWidth={1.8} />
                    </span>
                  </span>
                </Link>
              </li>
            );
          })}
        </ol>
      </div>
    </section>
  );
}
