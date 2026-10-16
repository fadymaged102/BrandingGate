import type { ReactNode } from "react";
import type { ValueId } from "@/lib/site";

/**
 * Line glyphs for the six values, drawn after the marks on the original
 * About page: rising strokes, nested hexagons, arrows, a figure, linked
 * rings and paired diamonds. Hairline off-white with one solid form each.
 */
export function ValueGlyph({ id, className = "" }: { id: ValueId; className?: string }) {
  return (
    <svg viewBox="0 0 48 48" fill="none" className={className} aria-hidden>
      <g stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        {glyphs[id]}
      </g>
    </svg>
  );
}

const glyphs: Record<ValueId, ReactNode> = {
  exceed: (
    <>
      <path d="M9 37 L19 21" />
      <path d="M17 39 L31 16" />
      <path d="M26 39 L40 11" strokeWidth="3" />
    </>
  ),
  part: (
    <>
      <path d="M24 6 L39.6 15 L39.6 33 L24 42 L8.4 33 L8.4 15 Z" />
      <path d="M24 14.5 L33 19.5 L33 29.5 L24 34.5 L15 29.5 L15 19.5 Z" transform="rotate(30 24 24.5)" strokeWidth="2.5" />
    </>
  ),
  beyond: (
    <>
      <path d="M10 26 C 14 18, 10 14, 18 9" />
      <path d="M14 9 L18 9 L18 13" />
      <path d="M12 40 L38 14" strokeWidth="2.5" />
      <path d="M28 14 L38 14 L38 24" strokeWidth="2.5" />
    </>
  ),
  people: (
    <>
      <path d="M14 10 C 16 20, 32 20, 34 10" />
      <circle cx="24" cy="25" r="5" strokeWidth="2.5" />
      <path d="M13 42 C 14 34, 34 34, 35 42" />
    </>
  ),
  thrive: (
    <>
      <circle cx="18" cy="17" r="8" />
      <circle cx="30" cy="17" r="8" fill="currentColor" fillOpacity="0.9" stroke="none" />
      <circle cx="18" cy="32" r="8" fill="currentColor" fillOpacity="0.25" stroke="none" />
      <circle cx="30" cy="32" r="8" strokeWidth="2.5" />
    </>
  ),
  courage: (
    <>
      <path d="M17 15 L27 25 L17 35 L7 25 Z" fill="currentColor" fillOpacity="0.9" stroke="none" />
      <path d="M31 15 L41 25 L31 35 L21 25 Z" />
      <path d="M24 8 L31 15" />
    </>
  ),
};
