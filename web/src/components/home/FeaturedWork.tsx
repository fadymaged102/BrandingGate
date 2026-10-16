"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useId, useRef } from "react";
import { gsap, ScrollTrigger, useGSAP } from "@/lib/gsap";
import { caseProjects } from "@/lib/projects";
import { clearAccent, setAccent } from "@/lib/atmosphere";
import { ArrowIcon, PillLink } from "@/components/ui/Buttons";

/**
 * The case studies as a stack of full-bleed plates. Each one holds under
 * the header while the next slides over it, settling back and dimming as
 * it is covered. The room takes on the accent of the plate in view.
 */
export function FeaturedWork() {
  const titleId = useId();
  const root = useRef<HTMLElement>(null);
  const lastAccent = useRef<string | null>(null);

  useEffect(() => () => clearAccent(lastAccent.current), []);

  useGSAP(
    () => {
      const cards = gsap.utils.toArray<HTMLElement>("[data-feature]");
      const lit = new Set<HTMLElement>();
      cards.forEach((card) => {
        ScrollTrigger.create({
          trigger: card,
          start: "top 60%",
          end: "bottom 40%",
          onToggle: (self) => {
            if (self.isActive) lit.add(card);
            else lit.delete(card);
            const current = [...lit].at(-1);
            if (current?.dataset.accent) {
              setAccent(current.dataset.accent);
              lastAccent.current = current.dataset.accent;
            } else {
              clearAccent(lastAccent.current);
              lastAccent.current = null;
            }
          },
        });
      });

      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        cards.forEach((card, i) => {
          const next = cards[i + 1];
          if (!next) return;
          gsap.to(card.querySelector("[data-feature-plate]"), {
            scale: 0.9,
            ease: "none",
            scrollTrigger: { trigger: next, start: "top bottom", end: "top 20%", scrub: true },
          });
          gsap.to(card.querySelector("[data-feature-dim]"), {
            opacity: 0.6,
            ease: "none",
            scrollTrigger: { trigger: next, start: "top bottom", end: "top 20%", scrub: true },
          });
        });
        gsap.utils.toArray<HTMLElement>("[data-feature-img]").forEach((img) => {
          gsap.fromTo(
            img,
            { scale: 1.14 },
            {
              scale: 1,
              ease: "none",
              scrollTrigger: { trigger: img, start: "top bottom", end: "top 20%", scrub: true },
            },
          );
        });
      });
      return () => mm.revert();
    },
    { scope: root },
  );

  return (
    <section ref={root} aria-labelledby={titleId} className="pb-24 md:pb-36">
      <div className="shell grid gap-6 pb-10 md:grid-cols-12 md:items-end md:pb-14">
        <h2 id={titleId} className="t-d2 md:col-span-7">
          Featured case studies
        </h2>
        <div className="md:col-span-5 md:justify-self-end">
          <PillLink href="/portfolio" variant="ghost">
            All work
          </PillLink>
        </div>
      </div>

      <ol className="shell">
        {caseProjects.map((p, i) => {
          const portrait = p.frame === "phone";
          return (
            <li
              key={p.slug}
              data-feature
              data-accent={p.accent}
              className="motion-safe:sticky mb-6 last:mb-0 md:mb-10"
              style={{ top: `calc(var(--header-h) + ${0.75 + i * 0.75}rem)` }}
            >
              <Link
                href={`/portfolio/${p.slug}`}
                aria-label={`${p.title}, case study for ${p.client}`}
                className="group block rounded-[clamp(14px,1.6vw,24px)] transition-transform duration-150 ease-ui active:scale-[0.99]"
              >
                <article
                  data-feature-plate
                  className="relative isolate h-[min(78svh,52rem)] min-h-[30rem] origin-top overflow-hidden rounded-[clamp(14px,1.6vw,24px)] bg-navy-900 ring-1 ring-line"
                >
                  <div data-feature-img className="absolute inset-0 -z-10">
                    <Image
                      src={p.cover.src}
                      alt={p.cover.alt}
                      fill
                      sizes="(min-width: 1472px) 1360px, 100vw"
                      className={`object-cover transition-[scale] duration-1000 ease-out-expo group-hover:scale-[1.03] ${portrait ? "md:object-contain md:object-right" : ""}`}
                      style={{ objectPosition: portrait ? undefined : p.focus }}
                    />
                  </div>
                  {portrait && (
                    // Vertical footage: the same frame, blurred, fills the plate behind it.
                    <Image
                      src={p.cover.src}
                      alt=""
                      fill
                      sizes="40vw"
                      className="-z-20 hidden scale-125 object-cover opacity-80 blur-3xl md:block"
                    />
                  )}
                  <div
                    aria-hidden
                    className="absolute inset-0 -z-10 bg-[linear-gradient(to_top,rgb(5_10_36/0.92),rgb(5_10_36/0.2)_55%,transparent),linear-gradient(to_right,rgb(5_10_36/0.6),transparent_60%)]"
                  />
                  <div data-feature-dim aria-hidden className="absolute inset-0 z-10 bg-ink opacity-0" />

                  <div className="flex h-full flex-col justify-between p-[clamp(1.25rem,3vw,3rem)]">
                    <p className="t-meta flex items-center gap-3 text-muted">
                      <span className="inline-block size-2 rounded-full" style={{ backgroundColor: p.accent }} aria-hidden />
                      {String(i + 1).padStart(2, "0")} / {String(caseProjects.length).padStart(2, "0")}
                    </p>
                    <div className="grid gap-6 md:grid-cols-12 md:items-end">
                      <div className="md:col-span-8">
                        <p className="t-meta text-muted">{p.client}</p>
                        <h3 className="t-d2 mt-4 max-w-[14ch]">{p.title}</h3>
                        <p className="mt-4 max-w-[46ch] text-muted">{p.kicker}</p>
                      </div>
                      <span className="inline-flex w-fit items-center gap-3 justify-self-start rounded-full bg-fg py-3 pl-6 pr-3 font-medium text-ink md:col-span-4 md:justify-self-end">
                        View case study
                        <span className="grid size-8 place-items-center rounded-full bg-ink text-fg transition-transform duration-300 ease-ui group-hover:translate-x-0.5">
                          <ArrowIcon />
                        </span>
                      </span>
                    </div>
                  </div>
                </article>
              </Link>
            </li>
          );
        })}
      </ol>
    </section>
  );
}
