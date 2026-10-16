"use client";

import Image from "next/image";
import { useId, useCallback, useRef, useState, type KeyboardEvent, type PointerEvent } from "react";
import { gsap, ScrollTrigger, useGSAP } from "@/lib/gsap";
import type { CaseProject } from "@/lib/projects";

type Compare = NonNullable<CaseProject["compare"]>;

const clamp = (v: number) => Math.min(100, Math.max(0, v));

export function BeforeAfter({ compare, accent }: { compare: Compare; accent?: string }) {
  const titleId = useId();
  const root = useRef<HTMLElement>(null);
  const stage = useRef<HTMLDivElement>(null);
  const handle = useRef<HTMLDivElement>(null);
  const pos = useRef({ v: 50 });
  const [value, setValue] = useState(50);
  const [dragging, setDragging] = useState(false);
  // Once the user has moved the split, the intro sweep must not override it.
  const touched = useRef(false);

  // Position is written straight to CSS for 1:1 tracking without
  // re-rendering; React state carries the settled value for assistive tech.
  // The handle rides a full-width layer moved by translateX(var(--split)), so
  // dragging never triggers layout and SSR already renders it at 50%.
  const paint = useCallback((v: number) => {
    pos.current.v = v;
    stage.current?.style.setProperty("--split", `${v}%`);
  }, []);
  const settle = useCallback(() => setValue(Math.round(pos.current.v)), []);

  const fromPointer = (clientX: number) => {
    const r = stage.current!.getBoundingClientRect();
    return clamp(((clientX - r.left) / r.width) * 100);
  };

  const onDown = (e: PointerEvent<HTMLDivElement>) => {
    // Primary button / touch / pen only; a right-click opens the menu instead.
    if (e.button !== 0) return;
    touched.current = true;
    gsap.killTweensOf(pos.current);
    e.currentTarget.setPointerCapture(e.pointerId);
    setDragging(true);
    // A tap jumps with a short glide; a drag then tracks the finger exactly.
    gsap.to(pos.current, {
      v: fromPointer(e.clientX),
      duration: 0.35,
      ease: "ui",
      onUpdate: () => paint(pos.current.v),
      onComplete: settle,
    });
  };

  const onMove = (e: PointerEvent<HTMLDivElement>) => {
    if (!dragging) return;
    gsap.killTweensOf(pos.current);
    paint(fromPointer(e.clientX));
  };

  const onUp = (e: PointerEvent<HTMLDivElement>) => {
    if (e.currentTarget.hasPointerCapture(e.pointerId)) e.currentTarget.releasePointerCapture(e.pointerId);
    setDragging(false);
    settle();
  };

  // Capture can be lost without a pointerup (context menu, window blur).
  const onLost = () => {
    setDragging(false);
    settle();
  };

  const onKey = (e: KeyboardEvent) => {
    const map: Record<string, number> = {
      ArrowLeft: -5,
      ArrowDown: -5,
      ArrowRight: 5,
      ArrowUp: 5,
      PageDown: -20,
      PageUp: 20,
    };
    if (e.key in map || e.key === "Home" || e.key === "End") {
      touched.current = true;
      gsap.killTweensOf(pos.current);
    }
    if (e.key in map) {
      e.preventDefault();
      paint(clamp(pos.current.v + map[e.key]));
    } else if (e.key === "Home") {
      e.preventDefault();
      paint(0);
    } else if (e.key === "End") {
      e.preventDefault();
      paint(100);
    }
    settle();
  };


  // A single sweep on first view shows the image is interactive.
  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        // Built inside the context (so it is reverted on unmount) and only
        // played if the user has not already moved the split.
        const sweep = gsap
          .timeline({ paused: true, onUpdate: () => paint(pos.current.v), onComplete: settle })
          .to(pos.current, { v: 30, duration: 0.9, ease: "ui" })
          .to(pos.current, { v: 50, duration: 0.9, ease: "ui" });
        ScrollTrigger.create({
          trigger: stage.current,
          start: "top 65%",
          once: true,
          onEnter: () => {
            if (!touched.current) sweep.play();
          },
        });
      });
      return () => mm.revert();
    },
    { scope: root },
  );

  return (
    <section ref={root} data-accent={accent} aria-labelledby={titleId} className="py-24 md:py-36">
      <div className="shell">
        <div className="grid gap-6 md:grid-cols-12 md:items-end">
          <h2 id={titleId} className="t-d2 md:col-span-7">
            {compare.beforeLabel} to {compare.afterLabel.toLowerCase()}
          </h2>
          <p className="max-w-[40ch] text-muted md:col-span-5 md:justify-self-end">{compare.caption}</p>
        </div>

        <div
          ref={stage}
          onPointerDown={onDown}
          onPointerMove={onMove}
          onPointerUp={onUp}
          onPointerCancel={onUp}
          onLostPointerCapture={onLost}
          className="relative mt-10 aspect-[4/3] cursor-ew-resize touch-pan-y select-none overflow-hidden rounded-[clamp(14px,1.6vw,24px)] bg-navy-900 [--split:50%] md:aspect-video"
        >
          <Image src={compare.before.src} alt={compare.before.alt} fill sizes="(min-width: 1472px) 1400px, 100vw" className="object-cover" draggable={false} />
          <div className="absolute inset-0" style={{ clipPath: "inset(0 0 0 var(--split))" }}>
            <Image src={compare.after.src} alt={compare.after.alt} fill sizes="(min-width: 1472px) 1400px, 100vw" className="object-cover" draggable={false} />
          </div>

          <span className="t-meta pointer-events-none absolute left-4 top-4 rounded-full bg-[rgb(5_10_36/0.6)] px-3 py-1.5 backdrop-blur md:left-6 md:top-6">
            {compare.beforeLabel}
          </span>
          <span className="t-meta pointer-events-none absolute right-4 top-4 rounded-full bg-[rgb(5_10_36/0.6)] px-3 py-1.5 backdrop-blur md:right-6 md:top-6">
            {compare.afterLabel}
          </span>

          <div className="pointer-events-none absolute inset-0 will-change-transform" style={{ transform: "translateX(var(--split))" }}>
          <div
            ref={handle}
            role="slider"
            tabIndex={0}
            aria-label={`Compare ${compare.beforeLabel.toLowerCase()} and ${compare.afterLabel.toLowerCase()}`}
            aria-valuemin={0}
            aria-valuemax={100}
            aria-valuenow={value}
            aria-valuetext={`${value}% ${compare.beforeLabel.toLowerCase()}, ${100 - value}% ${compare.afterLabel.toLowerCase()}`}
            onKeyDown={onKey}
            className="pointer-events-auto absolute inset-y-0 left-0 w-11 -translate-x-1/2 outline-none [&:focus-visible>span:last-child]:ring-2 [&:focus-visible>span:last-child]:ring-gold-hi"
          >
            <span aria-hidden className="absolute inset-y-0 left-1/2 w-px -translate-x-1/2 bg-fg/90 shadow-[0_0_24px_rgb(0_0_0/0.5)]" />
            <span
              aria-hidden
              className={`absolute left-1/2 top-1/2 grid size-12 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full bg-fg text-ink shadow-[0_10px_30px_-8px_rgb(0_0_0/0.6)] transition-transform duration-150 ease-ui ${dragging ? "scale-90" : ""}`}
            >
              <svg width="20" height="12" viewBox="0 0 20 12" fill="none">
                <path d="M6 1L1 6l5 5M14 1l5 5-5 5" stroke="currentColor" strokeWidth="1.5" />
              </svg>
            </span>
          </div>
          </div>
        </div>
      </div>
    </section>
  );
}
