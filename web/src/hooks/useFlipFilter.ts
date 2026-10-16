"use client";

import { useLayoutEffect, useRef, useState, type RefObject } from "react";
import { Flip, gsap, ScrollTrigger } from "@/lib/gsap";
import { useReducedMotion } from "./useMedia";

/**
 * Filter state whose changes Flip the `[data-flip-item]` children of `list`
 * from their old layout to the new one, with the portfolio grid's timing.
 * Leaving items fade out absolutely positioned; entering ones scale up.
 */
export function useFlipFilter<T extends string>(list: RefObject<HTMLElement | null>, initial: T) {
  const [value, setValue] = useState<T>(initial);
  const state = useRef<Flip.FlipState | null>(null);
  const reduced = useReducedMotion();

  const change = (next: T) => {
    if (next === value) return;
    if (!reduced && list.current) {
      state.current = Flip.getState(list.current.querySelectorAll("[data-flip-item]"));
    }
    setValue(next);
  };

  useLayoutEffect(() => {
    const from = state.current;
    if (!from || !list.current) return;
    state.current = null;
    Flip.from(from, {
      targets: list.current.querySelectorAll("[data-flip-item]"),
      duration: 0.5,
      ease: "ui",
      absolute: true,
      nested: true,
      prune: true,
      onEnter: (els) => gsap.fromTo(els, { opacity: 0, scale: 0.96 }, { opacity: 1, scale: 1, duration: 0.5, ease: "ui" }),
      onLeave: (els) => gsap.to(els, { opacity: 0, scale: 0.96, duration: 0.3, ease: "ui" }),
      onComplete: () => ScrollTrigger.refresh(),
    });
  }, [value, list]);

  return [value, change] as const;
}
