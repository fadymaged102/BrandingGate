"use client";

import { useLayoutEffect, useRef } from "react";
import { gsap } from "@/lib/gsap";
import { useReducedMotion } from "@/hooks/useMedia";

type Option<T extends string> = { id: T; label: string };

type Props<T extends string> = {
  options: Option<T>[];
  value: T;
  onChange: (id: T) => void;
  counts: Map<T, number>;
  label: string;
};

/**
 * The portfolio's filter pill bar: glass track, gold-ringed indicator that
 * slides to the active option (transform-only), counts in mono.
 */
export function FilterBar<T extends string>({ options, value, onChange, counts, label }: Props<T>) {
  const bar = useRef<HTMLDivElement>(null);
  const indicator = useRef<HTMLSpanElement>(null);
  const reduced = useReducedMotion();

  useLayoutEffect(() => {
    const el = bar.current;
    const ind = indicator.current;
    if (!el || !ind) return;
    const place = (animate: boolean) => {
      const active = el.querySelector<HTMLElement>('[aria-pressed="true"]');
      if (!active) return;
      const vars = { x: active.offsetLeft, scaleX: active.offsetWidth / 100 };
      if (animate && !reduced) gsap.to(ind, { ...vars, duration: 0.5, ease: "ui" });
      else gsap.set(ind, vars);
      if (el.scrollWidth > el.clientWidth) {
        const left = active.offsetLeft - (el.clientWidth - active.offsetWidth) / 2;
        el.scrollTo({ left, behavior: animate && !reduced ? "smooth" : "auto" });
      }
    };
    place(true);
    const ro = new ResizeObserver(() => place(false));
    ro.observe(el);
    return () => ro.disconnect();
  }, [value, reduced]);

  return (
    <div className="flex">
      <div
        ref={bar}
        role="group"
        aria-label={label}
        className="relative flex max-w-full gap-1 overflow-x-auto rounded-full bg-[rgb(11_21_76/0.55)] p-1 ring-1 ring-line backdrop-blur-xl [scrollbar-width:none] max-sm:[mask-image:linear-gradient(to_right,#000_85%,transparent)]"
      >
        <span
          ref={indicator}
          aria-hidden
          className="absolute bottom-1 left-0 top-1 w-[100px] origin-left rounded-full bg-fg/[0.08] ring-1 ring-gold/70"
        />
        {options.map((o) => {
          const count = counts.get(o.id) ?? 0;
          return (
            <button
              key={o.id}
              type="button"
              aria-pressed={value === o.id}
              disabled={count === 0}
              onClick={() => onChange(o.id)}
              className="relative z-10 min-h-11 shrink-0 rounded-full px-4 py-2.5 text-[0.9375rem] text-muted transition-colors duration-150 hover:text-fg disabled:opacity-40 aria-pressed:text-fg"
            >
              {o.label}
              <span className="sr-only">, </span>
              <span className="t-meta ml-1.5 text-[0.6875rem] text-faint">{count}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
