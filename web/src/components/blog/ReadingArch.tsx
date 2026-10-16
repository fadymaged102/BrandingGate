"use client";

import { useEffect, useRef, type RefObject } from "react";

/**
 * Reading progress drawn as the logo's arch: the gold line fills as the
 * article body passes. It is a measurement, not an animation, so it tracks
 * scroll under reduced motion too. Written straight to the DOM per frame.
 */
export function ReadingArch({ article }: { article: RefObject<HTMLElement | null> }) {
  const path = useRef<SVGPathElement>(null);
  const label = useRef<HTMLSpanElement>(null);
  const root = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let frame = 0;
    const update = () => {
      frame = 0;
      const el = article.current;
      if (!el || !path.current || !label.current || !root.current) return;
      const r = el.getBoundingClientRect();
      const span = r.height - window.innerHeight * 0.6;
      const p = Math.min(1, Math.max(0, (window.innerHeight * 0.4 - r.top) / Math.max(1, span)));
      path.current.style.strokeDashoffset = String(1 - p);
      label.current.textContent = `${Math.round(p * 100)}`;
      root.current.dataset.visible = String(r.top < window.innerHeight * 0.5 && r.bottom > window.innerHeight * 0.3);
    };
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, [article]);

  return (
    <div
      ref={root}
      aria-hidden
      data-visible="false"
      className="pointer-events-none fixed bottom-[clamp(1rem,4vh,2.5rem)] right-[var(--gutter)] z-40 grid size-[clamp(4rem,6vw,5.5rem)] place-items-center rounded-full bg-[rgb(5_10_36/0.55)] ring-1 ring-line backdrop-blur-xl transition-[opacity,translate] duration-500 ease-ui data-[visible=false]:translate-y-3 data-[visible=false]:opacity-0"
    >
      <svg viewBox="0 0 200 200" className="absolute inset-0 size-full" fill="none">
        <path
          d="M 163.5 144.4 A 77.5 77.5 0 1 0 36.5 144.4"
          pathLength={1}
          stroke="rgb(248 248 255 / 0.14)"
          strokeWidth="6"
          strokeLinecap="round"
        />
        <path
          ref={path}
          d="M 163.5 144.4 A 77.5 77.5 0 1 0 36.5 144.4"
          pathLength={1}
          stroke="#c8902a"
          strokeWidth="6"
          strokeLinecap="round"
          strokeDasharray="1"
          strokeDashoffset="1"
        />
      </svg>
      <span className="t-meta text-[0.6875rem] tabular-nums text-muted">
        <span ref={label}>0</span>%
      </span>
    </div>
  );
}
