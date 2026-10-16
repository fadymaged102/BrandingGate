"use client";

import { useEffect, useRef } from "react";
import { ScrollTrigger, useGSAP } from "@/lib/gsap";
import { clearAccent, clearBase, setAccent, setBase } from "@/lib/atmosphere";

/**
 * Owns the page's light while a case study is open. The project's accent
 * and base are applied on mount; any section with `data-accent` inside this
 * case repaints the room as it crosses the middle of the viewport. CSS
 * transitions on the registered custom properties do the 800ms blend.
 *
 * Queries are scoped to `[data-case=slug]` because previously visited pages
 * stay mounted (hidden) under Cache Components, and cleanups only clear the
 * values this instance wrote, since the next page may already have set its own.
 */
export function CaseAtmosphere({ slug, accent, base }: { slug: string; accent: string; base?: string }) {
  const lastAccent = useRef<string | null>(null);

  useEffect(() => {
    setAccent(accent);
    lastAccent.current = accent;
    if (base) setBase(base);
    return () => {
      clearAccent(lastAccent.current);
      if (base) clearBase(base);
    };
  }, [accent, base]);

  useGSAP(
    () => {
      const lit = new Set<HTMLElement>();
      const paint = (value: string) => {
        setAccent(value);
        lastAccent.current = value;
      };
      document.querySelectorAll<HTMLElement>(`[data-case="${slug}"] [data-accent]`).forEach((el) => {
        ScrollTrigger.create({
          trigger: el,
          start: "top 55%",
          end: "bottom 20%",
          onToggle: (self) => {
            if (self.isActive) lit.add(el);
            else lit.delete(el);
            const current = [...lit].at(-1);
            paint(current?.dataset.accent ?? accent);
          },
        });
      });
    },
    { dependencies: [slug, accent] },
  );

  return null;
}
