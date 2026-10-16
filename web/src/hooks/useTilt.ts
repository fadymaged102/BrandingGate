"use client";

import { useEffect, useRef, type PointerEvent, type RefObject } from "react";
import { gsap } from "@/lib/gsap";

type Setters = Record<"rx" | "ry" | "ix" | "iy" | "is", gsap.QuickToFunc>;

/**
 * The work tiles' spatial depth, for any card: the frame tilts toward the
 * pointer while its `[data-tilt-inner]` layer drifts the other way. The rect
 * is measured on enter from the untransformed card, so the tilt never feeds
 * back into its own input. Pass `enabled` false for touch and reduced motion.
 */
export function useTilt(
  card: RefObject<HTMLElement | null>,
  enabled: boolean,
  { degrees = 5, drift = 3, zoom = 1.06 } = {},
) {
  const setters = useRef<Setters | null>(null);
  const rect = useRef<DOMRect | null>(null);

  useEffect(() => {
    const el = card.current;
    const inner = el?.querySelector<HTMLElement>("[data-tilt-inner]") ?? null;
    if (!el || !enabled) return;
    gsap.set(el, { transformPerspective: 1100 });
    const to = (target: HTMLElement, prop: string) => gsap.quickTo(target, prop, { duration: 0.6, ease: "ui" });
    const noop = (() => 0) as unknown as gsap.QuickToFunc;
    setters.current = {
      rx: to(el, "rotateX"),
      ry: to(el, "rotateY"),
      ix: inner ? to(inner, "xPercent") : noop,
      iy: inner ? to(inner, "yPercent") : noop,
      is: inner ? to(inner, "scale") : noop,
    };
    return () => {
      setters.current = null;
      const targets = inner ? [el, inner] : [el];
      gsap.killTweensOf(targets);
      gsap.set(targets, { clearProps: "transform" });
    };
  }, [card, enabled]);

  const onPointerEnter = () => {
    rect.current = card.current?.getBoundingClientRect() ?? null;
  };

  const onPointerMove = (e: PointerEvent) => {
    const s = setters.current;
    const r = rect.current;
    if (!s || !r || e.pointerType !== "mouse") return;
    const x = (e.clientX - r.left) / r.width - 0.5;
    const y = (e.clientY - r.top) / r.height - 0.5;
    s.ry(x * degrees);
    s.rx(-y * degrees);
    s.ix(-x * drift);
    s.iy(-y * drift);
    s.is(zoom);
  };

  const onPointerLeave = () => {
    const s = setters.current;
    if (!s) return;
    s.rx(0);
    s.ry(0);
    s.ix(0);
    s.iy(0);
    s.is(1);
  };

  return { onPointerEnter, onPointerMove, onPointerLeave, rect };
}
