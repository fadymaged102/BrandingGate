"use client";

import dynamic from "next/dynamic";
import { useEffect, useId, useRef, useState } from "react";
import { gsap, ScrollTrigger, useGSAP } from "@/lib/gsap";
import { useMedia, useReducedMotion } from "@/hooks/useMedia";
import { useLenis } from "@/components/SmoothScroll";
import { SceneBoundary, useWebGL } from "@/components/three/support";
import { values } from "@/lib/site";
import { ValueGlyph } from "./ValueGlyph";

const ValuesScene = dynamic(() => import("./ValuesScene"), { ssr: false });
const ids = values.map((v) => v.id);

/**
 * Our Values. On a large screen with WebGL, the section holds while six
 * glass artifacts turn past on a ring, one per value; the list beside it
 * doubles as navigation. Everywhere else it is a grid of drawn marks.
 */
export function Values() {
  const reduced = useReducedMotion();
  const desktop = useMedia("(min-width: 1024px)", true);
  const webgl = useWebGL();
  const spatial = webgl && desktop && !reduced;
  return spatial ? <SpatialValues /> : <ValueGrid />;
}

function Heading({ id }: { id: string }) {
  return (
    <>
      <p className="t-meta text-muted">What we hold to</p>
      <h2 id={id} className="t-d2 mt-5">
        Our Values
      </h2>
    </>
  );
}

function ValueGrid() {
  const titleId = useId();
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        gsap.from("[data-value-card]", {
          y: 40,
          opacity: 0,
          duration: 0.9,
          ease: "reveal",
          stagger: 0.06,
          scrollTrigger: { trigger: "[data-value-grid]", start: "top 85%", once: true },
        });
      });
      return () => mm.revert();
    },
    { scope: root },
  );

  return (
    <section ref={root} aria-labelledby={titleId} className="shell py-24 md:py-36">
      <Heading id={titleId} />
      <ol data-value-grid className="mt-12 grid gap-3 sm:grid-cols-2 md:mt-16 lg:grid-cols-3">
        {values.map((v, i) => (
          <li
            key={v.id}
            data-value-card
            className="flex min-h-48 flex-col justify-between gap-10 rounded-[clamp(12px,1.3vw,20px)] bg-navy-900/60 p-6 ring-1 ring-line md:p-8"
          >
            <div className="flex items-start justify-between">
              <ValueGlyph id={v.id} className="size-14 text-fg" />
              <span className="t-meta text-faint">{String(i + 1).padStart(2, "0")}</span>
            </div>
            <p className="t-h3 max-w-[14ch]">{v.title}</p>
          </li>
        ))}
      </ol>
    </section>
  );
}

function SpatialValues() {
  const titleId = useId();
  const root = useRef<HTMLElement>(null);
  const outer = useRef<HTMLDivElement>(null);
  const position = useRef(0);
  const trigger = useRef<ScrollTrigger | null>(null);
  const [current, setCurrent] = useState(0);
  const [active, setActive] = useState(false);
  const [ready, setReady] = useState(false);
  const lenis = useLenis();

  useGSAP(
    () => {
      trigger.current = ScrollTrigger.create({
        trigger: root.current,
        start: "top top",
        end: `+=${(values.length - 1) * 55}%`,
        pin: true,
        scrub: true,
        onUpdate: (self) => {
          position.current = self.progress * (values.length - 1);
          const index = Math.round(position.current);
          setCurrent((c) => (c === index ? c : index));
        },
      });
      // Render whenever any part of the section (pin distance included) is on screen.
      ScrollTrigger.create({
        trigger: outer.current,
        start: "top bottom",
        end: "bottom top",
        onToggle: (self) => setActive(self.isActive),
      });
      return () => {
        trigger.current = null;
      };
    },
    { scope: root },
  );

  useEffect(() => {
    if (ready) ScrollTrigger.refresh();
  }, [ready]);

  // The list is a set of jump links into the held scroll.
  const goTo = (i: number) => {
    const st = trigger.current;
    if (!st) return;
    const y = st.start + ((st.end - st.start) * i) / (values.length - 1);
    if (lenis) lenis.scrollTo(y, { duration: 1.1 });
    else window.scrollTo({ top: y, behavior: "smooth" });
  };

  return (
    <div ref={outer}>
      <section ref={root} aria-labelledby={titleId} className="relative h-dvh min-h-[40rem] overflow-hidden">
        <div className="shell grid h-full grid-cols-12 items-center gap-8 pt-[var(--header-h)]">
          <div className="col-span-5">
            <Heading id={titleId} />
            <ol className="mt-12 border-t border-line">
              {values.map((v, i) => (
                <li key={v.id} className="border-b border-line">
                  <button
                    type="button"
                    onClick={() => goTo(i)}
                    aria-current={current === i ? "step" : undefined}
                    className="group flex w-full items-center gap-5 py-4 text-left"
                  >
                    <span className="t-meta w-6 text-faint">{String(i + 1).padStart(2, "0")}</span>
                    <span className="t-h3 flex-1 text-muted transition-colors duration-300 group-hover:text-fg group-aria-[current=step]:text-fg">
                      {v.title}
                    </span>
                    <span
                      aria-hidden
                      className="size-2 rounded-full bg-gold opacity-0 transition-[opacity,scale] duration-300 ease-ui group-aria-[current=step]:opacity-100 scale-50 group-aria-[current=step]:scale-100"
                    />
                  </button>
                </li>
              ))}
            </ol>
          </div>
          <div className="relative col-span-7 h-[min(78dvh,46rem)]">
            {/* Shown until the scene is ready, and stays if WebGL fails. */}
            <div
              aria-hidden
              className="absolute inset-0 grid place-items-center transition-opacity duration-700 ease-ui"
              style={{ opacity: ready ? 0 : 1 }}
            >
              <ValueGlyph id={ids[current]} className="size-40 text-fg" />
            </div>
            <div
              className="absolute inset-0 transition-opacity duration-1000 ease-ui [mask-image:radial-gradient(closest-side,#000_62%,transparent)]"
              style={{ opacity: ready ? 1 : 0 }}
            >
              <SceneBoundary>
                <ValuesScene ids={ids} position={position} active={active} onReady={() => setReady(true)} />
              </SceneBoundary>
            </div>
            <p className="t-meta absolute inset-x-0 bottom-0 text-center text-faint">
              <span aria-hidden>
                {String(current + 1).padStart(2, "0")} / {String(values.length).padStart(2, "0")}
              </span>
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
