"use client";

import Link from "next/link";
import { useEffect, useLayoutEffect, useRef, useState, type CSSProperties } from "react";
import { createPortal } from "react-dom";
import { Flip, gsap } from "@/lib/gsap";
import type { Project } from "@/lib/projects";
import { FramedMedia } from "@/components/ui/Frames";

type Props = {
  project: Project;
  /** Flip state captured from the tile before the overlay mounted. */
  from: Flip.FlipState | null;
  reduced: boolean;
  index: number;
  total: number;
  onPrev: () => void;
  onNext: () => void;
  /** Ask the parent to close; it passes back the tile to morph into. */
  onRequestClose: () => void;
  closing: { target: HTMLElement | null; done: () => void } | null;
};

export function Expansion({
  project,
  from,
  reduced,
  index,
  total,
  onPrev,
  onNext,
  onRequestClose,
  closing,
}: Props) {
  const root = useRef<HTMLDivElement>(null);
  const media = useRef<HTMLDivElement>(null);
  const closeBtn = useRef<HTMLButtonElement>(null);
  // Loops can be paused (WCAG 2.2.2); reduced motion starts paused.
  const [paused, setPaused] = useState(reduced);
  // The morph only plays for the project the overlay opened on; stepping
  // to another project clears it. (Survives StrictMode's double effect.)
  const morphSlug = useRef<string | null>(project.slug);

  // Open: morph from the tile, then bring the copy in behind it.
  useLayoutEffect(() => {
    const el = root.current;
    if (!el) return;
    const copy = el.querySelectorAll("[data-x-copy]");
    const ctx = gsap.context(() => {
      if (project.slug !== morphSlug.current) morphSlug.current = null;
      if (morphSlug.current && from && !reduced) {
        gsap.fromTo(el, { backgroundColor: "rgb(5 10 36 / 0)" }, { backgroundColor: "rgb(5 10 36 / 0.96)", duration: 0.5, ease: "ui" });
        Flip.from(from, {
          targets: media.current,
          duration: 0.7,
          ease: "morph",
          absolute: true,
          zIndex: 70,
        });
        gsap.from(copy, { y: 24, autoAlpha: 0, duration: 0.7, ease: "reveal", stagger: 0.05, delay: 0.32 });
      } else if (!reduced) {
        // Moving between projects inside the overlay: a quiet crossfade.
        gsap.from([media.current, ...copy], { autoAlpha: 0, y: 12, duration: 0.45, ease: "reveal", stagger: 0.03 });
      } else {
        gsap.from(el, { autoAlpha: 0, duration: 0.2 });
      }
    }, el);
    closeBtn.current?.focus({ preventScroll: true });
    return () => ctx.revert();
    // Re-run per project so prev/next animate; `from` is only used on first run.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [project.slug]);

  // Close: fit the media back onto its tile, fade the rest.
  useEffect(() => {
    if (!closing) return;
    const el = root.current;
    if (!el) return closing.done();
    if (reduced || !closing.target || closing.target.offsetParent === null) {
      gsap.to(el, { autoAlpha: 0, duration: 0.2, onComplete: closing.done });
      return;
    }
    const tl = gsap.timeline({ onComplete: closing.done });
    tl.to(el.querySelectorAll("[data-x-copy]"), { autoAlpha: 0, y: 12, duration: 0.25, ease: "ui" }, 0)
      .add(Flip.fit(media.current!, closing.target, { duration: 0.6, ease: "morph", absolute: true }) as gsap.core.Tween, 0.05)
      .to(el, { backgroundColor: "rgb(5 10 36 / 0)", duration: 0.45, ease: "ui" }, 0.1);
    return () => {
      tl.kill();
    };
  }, [closing, reduced]);

  // Keyboard: Escape closes, arrows step through, Tab stays inside.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (closing) return;
      if (e.key === "Escape") onRequestClose();
      else if (e.key === "ArrowRight") onNext();
      else if (e.key === "ArrowLeft") onPrev();
      else if (e.key === "Tab" && root.current) {
        const focusable = root.current.querySelectorAll<HTMLElement>(
          'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])',
        );
        const first = focusable[0];
        const last = focusable[focusable.length - 1];
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onRequestClose, onNext, onPrev, closing]);

  const isPhone = project.frame === "phone";
  const titleId = `x-title-${project.slug}`;

  return createPortal(
    <div
      ref={root}
      role="dialog"
      aria-modal="true"
      aria-labelledby={titleId}
      data-lenis-prevent
      className="fixed inset-0 z-[60] overflow-y-auto overscroll-contain bg-[rgb(5_10_36/0.96)]"
      style={{ "--accent": project.accent } as CSSProperties}
      onClick={(e) => {
        // Empty space closes: the root and the layout grid are both backdrop.
        const t = e.target as HTMLElement;
        if (t === e.currentTarget || t.hasAttribute("data-x-backdrop")) onRequestClose();
      }}
    >
      <div
        aria-hidden
        className="pointer-events-none fixed inset-0 bg-[radial-gradient(80%_60%_at_70%_0%,color-mix(in_oklab,var(--accent)_16%,transparent),transparent_65%)]"
      />

      <div data-x-backdrop className="relative mx-auto grid min-h-full max-w-[var(--maxw)] content-center gap-8 px-[var(--gutter)] py-20 lg:grid-cols-12 lg:gap-12 lg:py-16">
        <div
          className={`lg:col-span-8 ${isPhone ? "flex justify-center" : ""}`}
        >
          <div
            ref={media}
            data-flip-id={`media-${project.slug}`}
            className={`relative ${
              isPhone
                ? "aspect-[9/19.2] h-[min(80dvh,48rem)] rounded-[clamp(1.6rem,3.2vw,2.75rem)]"
                : "aspect-video w-full overflow-hidden rounded-[clamp(12px,1.3vw,20px)] bg-navy-900"
            }`}
          >
            <FramedMedia
              frame={project.frame}
              backdrop={false}
              still={project.cover}
              loop={project.loop}
              playing={!paused}
              focus={project.focus}
              sizes="(min-width: 1024px) 66vw, 100vw"
              priority
            />
          </div>
        </div>

        <div className="flex flex-col justify-center lg:col-span-4">
          <p data-x-copy className="t-meta flex items-center gap-3 text-muted">
            <span className="inline-block size-2 rounded-full bg-accent" aria-hidden />
            {project.kind === "case" ? project.client : project.discipline}
          </p>
          <h2 id={titleId} data-x-copy className="t-d2 mt-5">
            {project.title}
          </h2>
          <p data-x-copy className="t-body-l mt-6 max-w-[40ch] text-muted">
            {project.summary}
          </p>

          {project.kind === "case" && (
            <dl data-x-copy className="mt-8 grid grid-cols-2 gap-x-6 gap-y-4 border-t border-line pt-6">
              {project.facts.slice(0, 4).map((f) => (
                <div key={f.label}>
                  <dt className="t-meta text-faint">{f.label}</dt>
                  <dd className="mt-1 text-[0.9375rem]">{f.value}</dd>
                </div>
              ))}
            </dl>
          )}

          <div data-x-copy className="mt-10 flex flex-wrap items-center gap-3">
            {project.kind === "case" ? (
              <Link
                href={`/portfolio/${project.slug}`}
                className="inline-flex items-center gap-3 rounded-full bg-fg py-3 pl-6 pr-3 font-medium text-ink transition-transform duration-150 ease-ui active:scale-[0.97]"
              >
                Read the case study
                <span className="grid size-8 place-items-center rounded-full bg-ink text-fg" aria-hidden>
                  <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                    <path d="M1 6h10m0 0L6.5 1.5M11 6l-4.5 4.5" stroke="currentColor" strokeWidth="1.4" />
                  </svg>
                </span>
              </Link>
            ) : (
              <p className="text-[0.9375rem] text-faint">
                Part of our {project.discipline.toLowerCase()} work.
              </p>
            )}
          </div>
        </div>
      </div>

      <div className="pointer-events-none fixed inset-x-0 top-0 z-10">
        <div className="mx-auto flex max-w-[var(--maxw)] items-center justify-between px-[var(--gutter)] pt-5">
          <p className="t-meta text-faint" aria-live="polite">
            {index + 1} of {total}
          </p>
          <div className="pointer-events-auto flex items-center gap-2">
            {project.loop && (
              <IconButton label={paused ? "Play video" : "Pause video"} pressed={paused} onClick={() => setPaused((p) => !p)}>
                {paused ? (
                  <path d="M3 1.5v9l7.5-4.5L3 1.5z" fill="currentColor" />
                ) : (
                  <path d="M3.5 1.5v9M8.5 1.5v9" stroke="currentColor" strokeWidth="1.6" />
                )}
              </IconButton>
            )}
            <IconButton label="Previous project" onClick={onPrev} disabled={!!closing}>
              <path d="M11 6H1m0 0l4.5-4.5M1 6l4.5 4.5" stroke="currentColor" strokeWidth="1.4" />
            </IconButton>
            <IconButton label="Next project" onClick={onNext} disabled={!!closing}>
              <path d="M1 6h10m0 0L6.5 1.5M11 6l-4.5 4.5" stroke="currentColor" strokeWidth="1.4" />
            </IconButton>
            <IconButton label="Close" onClick={onRequestClose} buttonRef={closeBtn}>
              <path d="M1.5 1.5l9 9m0-9l-9 9" stroke="currentColor" strokeWidth="1.4" />
            </IconButton>
          </div>
        </div>
      </div>
    </div>,
    document.body,
  );
}

function IconButton({
  label,
  onClick,
  children,
  buttonRef,
  disabled,
  pressed,
}: {
  label: string;
  onClick: () => void;
  children: React.ReactNode;
  buttonRef?: React.Ref<HTMLButtonElement>;
  disabled?: boolean;
  pressed?: boolean;
}) {
  return (
    <button
      ref={buttonRef}
      type="button"
      aria-label={label}
      aria-pressed={pressed}
      disabled={disabled}
      onClick={onClick}
      className="grid size-11 place-items-center rounded-full bg-[rgb(248_248_255/0.06)] text-fg ring-1 ring-line-strong backdrop-blur transition-[background-color,transform] duration-150 ease-ui hover:bg-[rgb(248_248_255/0.12)] active:scale-[0.94]"
    >
      <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden>
        {children}
      </svg>
    </button>
  );
}
