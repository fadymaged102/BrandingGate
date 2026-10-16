"use client";

import { useMemo, useRef } from "react";
import { gsap, SplitText, useGSAP } from "@/lib/gsap";

type Props = {
  as?: "p" | "h1" | "h2" | "h3" | "div";
  /** Plain text only: SplitText rewrites these nodes, so React must not own them. */
  children: string;
  className?: string;
  /** Play when scrolled into view (default) or immediately on mount. */
  trigger?: "scroll" | "mount";
  delay?: number;
  id?: string;
};

/**
 * Line-masked text reveal. Lines rise from behind their own mask, 60ms
 * apart. Re-splits on resize and font load so line breaks stay true.
 */
export function RevealText({
  as = "p",
  children,
  className,
  trigger = "scroll",
  delay = 0,
  id,
}: Props) {
  const ref = useRef<HTMLDivElement>(null);
  // Typed as a div for the ref; renders whichever tag `as` names.
  const Tag = as as "div";

  useGSAP(
    () => {
      const el = ref.current;
      if (!el) return;
      // Hidden by CSS until JS takes over, so lines never flash unsplit.
      gsap.set(el, { visibility: "visible" });
      const mm = gsap.matchMedia();

      mm.add("(prefers-reduced-motion: no-preference)", () => {
        let played = false;
        const split = SplitText.create(el, {
          type: "lines",
          mask: "lines",
          linesClass: "reveal-line",
          autoSplit: true,
          onSplit(self) {
            // After the first play, re-splits (resize) must not replay.
            if (played) return;
            return gsap.from(self.lines, {
              yPercent: 110,
              duration: 0.9,
              ease: "reveal",
              stagger: 0.06,
              delay,
              scrollTrigger:
                trigger === "scroll"
                  ? { trigger: el, start: "top 88%", once: true }
                  : undefined,
              onComplete: () => {
                played = true;
              },
            });
          },
        });
        return () => split.revert();
      });

      return () => mm.revert();
    },
    { scope: ref, dependencies: [trigger, delay] },
  );

  const html = useMemo(() => ({ __html: escapeHtml(children) }), [children]);

  return <Tag ref={ref} className={className} id={id} data-reveal="" dangerouslySetInnerHTML={html} />;
}

function escapeHtml(text: string) {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}
