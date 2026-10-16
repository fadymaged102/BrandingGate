"use client";

import { PillLink } from "@/components/ui/Buttons";
import { useId, useRef } from "react";
import { gsap, useGSAP } from "@/lib/gsap";
import { useFinePointer, useReducedMotion } from "@/hooks/useMedia";
import { useTilt } from "@/hooks/useTilt";
import { values, type ValueId } from "@/lib/site";
import { ValueGlyph } from "@/components/about/ValueGlyph";

/**
 * The values as physical cards. Each leans toward the pointer while its
 * mark drifts against the lean, and a sheen follows the cursor across the
 * glass. Still under touch and reduced motion.
 */
export function CultureCards() {
  const titleId = useId();
  const root = useRef<HTMLElement>(null);
  const fine = useFinePointer();
  const reduced = useReducedMotion();

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        gsap.from("[data-culture-card]", {
          y: 60,
          rotateX: -12,
          opacity: 0,
          duration: 1,
          ease: "reveal",
          stagger: 0.07,
          transformPerspective: 900,
          scrollTrigger: { trigger: "[data-culture-grid]", start: "top 85%", once: true },
        });
      });
      return () => mm.revert();
    },
    { scope: root },
  );

  return (
    <section ref={root} aria-labelledby={titleId} className="shell py-24 md:py-36">
      <div className="grid gap-6 md:grid-cols-12 md:items-end">
        <div className="md:col-span-7">
          <p className="t-meta text-muted">Culture</p>
          <h2 id={titleId} className="t-d2 mt-5 max-w-[16ch]">
            The six values behind the studio
          </h2>
        </div>
        <div className="md:col-span-5 md:justify-self-end">
          <PillLink href="/about" variant="ghost">
            More about the studio
          </PillLink>
        </div>
      </div>

      <ol data-culture-grid className="mt-12 grid gap-3 [perspective:1400px] sm:grid-cols-2 md:mt-16 lg:grid-cols-3">
        {values.map((v, i) => (
          <CultureCard key={v.id} id={v.id} title={v.title} index={i} depth={fine && !reduced} />
        ))}
      </ol>
    </section>
  );
}

function CultureCard({ id, title, index, depth }: { id: ValueId; title: string; index: number; depth: boolean }) {
  const card = useRef<HTMLLIElement>(null);
  const sheen = useRef<HTMLSpanElement>(null);
  const tilt = useTilt(card, depth, { degrees: 9, drift: 6, zoom: 1 });

  return (
    <li
      ref={card}
      data-culture-card
      onPointerEnter={tilt.onPointerEnter}
      onPointerLeave={() => {
        tilt.onPointerLeave();
        sheen.current?.style.setProperty("opacity", "0");
      }}
      onPointerMove={(e) => {
        tilt.onPointerMove(e);
        // The rect cached on enter, before any tilt, so the sheen sits under the cursor.
        const r = tilt.rect.current;
        const el = sheen.current;
        if (!r || !el || !depth) return;
        el.style.setProperty("--sx", `${e.clientX - r.left}px`);
        el.style.setProperty("--sy", `${e.clientY - r.top}px`);
        el.style.setProperty("opacity", "1");
      }}
      className={`group relative flex min-h-[15rem] flex-col justify-between gap-10 overflow-hidden rounded-[clamp(12px,1.3vw,20px)] bg-[linear-gradient(160deg,rgb(12_27_94/0.7),rgb(11_21_76/0.35))] p-6 ring-1 ring-line md:p-8 ${depth ? "will-change-transform" : ""}`}
    >
      <span
        ref={sheen}
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 ease-ui [background:radial-gradient(240px_circle_at_var(--sx)_var(--sy),rgb(248_248_255/0.1),transparent_70%)]"
      />
      <div className="flex items-start justify-between">
        <span data-tilt-inner className="block">
          <ValueGlyph id={id} className="size-16 text-fg" />
        </span>
        <span className="t-meta text-faint">{String(index + 1).padStart(2, "0")}</span>
      </div>
      <p className="t-h3 max-w-[14ch]">{title}</p>
    </li>
  );
}
