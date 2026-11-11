"use client";

import { Suspense, useId, useCallback, useEffect, useEffectEvent, useLayoutEffect, useMemo, useRef, useState } from "react";
import { useSearchParams } from "next/navigation";
import { Flip, gsap, ScrollTrigger, useGSAP } from "@/lib/gsap";
import { DISCIPLINES, isDiscipline, projects, type Discipline, type Project } from "@/lib/projects";
import { FilterBar } from "@/components/ui/FilterBar";
import { useFinePointer, useReducedMotion } from "@/hooks/useMedia";
import { useLenis } from "@/components/SmoothScroll";
import { clearAccent, setAccent } from "@/lib/atmosphere";
import { WorkTile } from "./WorkTile";
import { Expansion } from "./Expansion";

type FilterId = Discipline | "all";

type OpenState = {
  slug: string;
  from: Flip.FlipState | null;
  trigger: HTMLElement | null;
};

export function WorkIndex() {
  const titleId = useId();
  const section = useRef<HTMLElement>(null);
  const grid = useRef<HTMLDivElement>(null);
  const chip = useRef<HTMLDivElement>(null);
  const flipState = useRef<Flip.FlipState | null>(null);
  const chipTo = useRef<{ x: gsap.QuickToFunc; y: gsap.QuickToFunc } | null>(null);

  const [filter, setFilter] = useState<FilterId>("all");
  const [hovered, setHovered] = useState<Project | null>(null);
  const [open, setOpen] = useState<OpenState | null>(null);
  const [closing, setClosing] = useState<{ target: HTMLElement | null; done: () => void } | null>(null);

  const reduced = useReducedMotion();
  const fine = useFinePointer();
  const lenis = useLenis();

  const visible = useMemo(
    () => projects.filter((p) => filter === "all" || p.disciplines.includes(filter)),
    [filter],
  );

  const counts = useMemo(() => {
    const map = new Map<FilterId, number>([["all", projects.length]]);
    for (const p of projects) for (const d of p.disciplines) map.set(d, (map.get(d) ?? 0) + 1);
    return map;
  }, []);

  /* ---------------- Filtering ---------------- */

  const applyFilter = (next: FilterId) => {
    if (next === filter) return;
    if (!reduced && grid.current) {
      flipState.current = Flip.getState(grid.current.querySelectorAll("[data-tile]"));
    }
    setFilter(next);
  };

  // Keep the address in step with the filter, so a service link that opened
  // the page on one discipline can open it on another next time.
  const chooseFilter = (next: FilterId) => {
    applyFilter(next);
    const url = new URL(window.location.href);
    if (next === "all") url.searchParams.delete("filter");
    else url.searchParams.set("filter", next);
    window.history.replaceState(null, "", url);
  };

  // Animate tiles from their old layout to the new one.
  useLayoutEffect(() => {
    const state = flipState.current;
    if (!state || !grid.current) return;
    flipState.current = null;
    Flip.from(state, {
      targets: grid.current.querySelectorAll("[data-tile]"),
      duration: 0.5,
      ease: "ui",
      absolute: true,
      nested: true,
      prune: true,
      onEnter: (els) => gsap.fromTo(els, { autoAlpha: 0, scale: 0.94 }, { autoAlpha: 1, scale: 1, duration: 0.5, ease: "ui" }),
      onLeave: (els) => gsap.to(els, { autoAlpha: 0, scale: 0.94, duration: 0.3, ease: "ui" }),
      onComplete: () => ScrollTrigger.refresh(),
    });
  }, [filter]);

  /* ---------------- Cursor chip ---------------- */

  useGSAP(
    () => {
      if (!chip.current) return;
      gsap.set(chip.current, { xPercent: 12, yPercent: 40, autoAlpha: 0, scale: 0.9 });
      const lag = reduced ? 0 : 0.45;
      chipTo.current = {
        x: gsap.quickTo(chip.current, "x", { duration: lag, ease: "power3" }),
        y: gsap.quickTo(chip.current, "y", { duration: lag, ease: "power3" }),
      };

      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        gsap.from("[data-work-head] > *", {
          y: 24,
          opacity: 0,
          duration: 0.9,
          ease: "reveal",
          stagger: 0.08,
          scrollTrigger: { trigger: "[data-work-head]", start: "top 85%", once: true },
        });
        // IntersectionObserver rather than scroll positions, so tiles still
        // reveal after jumps (anchor links, End key, restored scroll).
        // Opacity only: visibility:hidden would drop unrevealed tiles from
        // the Tab order, so keyboard users could never reach them.
        const tiles = gsap.utils.toArray<HTMLElement>("[data-tile]");
        gsap.set(tiles, { y: 60, opacity: 0 });
        const reveal = (els: Element[]) => {
          els.forEach((el) => io.unobserve(el));
          gsap.to(els, { y: 0, opacity: 1, duration: 1, ease: "reveal", stagger: 0.08, clearProps: "transform,opacity" });
        };
        const io = new IntersectionObserver(
          (entries) => {
            const entering = entries.filter((e) => e.isIntersecting).map((e) => e.target);
            if (entering.length) reveal(entering);
          },
          { rootMargin: "0px 0px -6% 0px" },
        );
        tiles.forEach((t) => io.observe(t));
        const onFocusIn = (e: FocusEvent) => {
          const tile = (e.target as HTMLElement).closest("[data-tile]");
          if (tile && gsap.getProperty(tile, "opacity") !== 1) reveal([tile]);
        };
        const gridEl = grid.current;
        gridEl?.addEventListener("focusin", onFocusIn);
        return () => {
          io.disconnect();
          gridEl?.removeEventListener("focusin", onFocusIn);
        };
      });
      return () => mm.revert();
    },
    { scope: section, dependencies: [reduced] },
  );

  const onGridMove = (e: React.PointerEvent) => {
    if (!fine || !chipTo.current) return;
    chipTo.current.x(e.clientX);
    chipTo.current.y(e.clientY);
  };

  const onHover = useCallback(
    (p: Project | null) => {
      setHovered(p);
      const el = chip.current;
      if (!el) return;
      gsap.to(el, {
        autoAlpha: p && fine ? 1 : 0,
        scale: p && fine ? 1 : 0.9,
        duration: 0.16,
        ease: "ui",
        overwrite: "auto",
      });
    },
    [fine],
  );

  // Hover repaints the room in the project's light; leaving restores gold.
  // Only clear a value this component set: on navigation the next page may
  // already have applied its own accent before this cleanup runs.
  const ownAccent = useRef<string | null>(null);
  useEffect(() => {
    if (open) return;
    if (hovered && fine) {
      setAccent(hovered.accent);
      ownAccent.current = hovered.accent;
    } else {
      clearAccent(ownAccent.current);
      ownAccent.current = null;
    }
  }, [hovered, fine, open]);

  useEffect(() => {
    return () => clearAccent(ownAccent.current);
  }, []);

  /* ---------------- Expansion ---------------- */

  const openProject = useCallback(
    (p: Project, media: HTMLElement, trigger: HTMLElement) => {
      setOpen({ slug: p.slug, from: reduced ? null : Flip.getState(media), trigger });
      onHover(null);
    },
    [reduced, onHover],
  );

  const step = useCallback(
    (dir: 1 | -1) => {
      setOpen((cur) => {
        if (!cur) return cur;
        const i = visible.findIndex((p) => p.slug === cur.slug);
        const next = visible[(i + dir + visible.length) % visible.length];
        const trigger = grid.current?.querySelector<HTMLElement>(`[data-tile="${next.slug}"] a, [data-tile="${next.slug}"] button`) ?? null;
        return { slug: next.slug, from: null, trigger };
      });
    },
    [visible],
  );

  const requestClose = useCallback(() => {
    if (!open || closing) return;
    const target = grid.current?.querySelector<HTMLElement>(`[data-tile="${open.slug}"] [data-flip-id]`) ?? null;
    // Bring the tile into view first so the media has somewhere to land.
    target?.scrollIntoView({ block: "nearest" });
    setClosing({
      target,
      done: () => {
        const trigger = open.trigger;
        setClosing(null);
        setOpen(null);
        trigger?.focus({ preventScroll: true });
      },
    });
  }, [open, closing]);

  // Freeze the page behind the dialog and take it out of the accessibility
  // tree, so neither Tab nor a screen reader's cursor can leave the dialog.
  const isOpen = open !== null;
  useEffect(() => {
    if (!isOpen) return;
    lenis?.stop();
    const prev = document.documentElement.style.overflow;
    document.documentElement.style.overflow = "hidden";
    const background = [
      document.getElementById("main"),
      document.querySelector("header[data-site-header]"),
      document.querySelector("footer"),
    ].filter((el): el is HTMLElement => !!el);
    background.forEach((el) => el.setAttribute("inert", ""));
    return () => {
      lenis?.start();
      document.documentElement.style.overflow = prev;
      background.forEach((el) => el.removeAttribute("inert"));
    };
  }, [isOpen, lenis]);

  const openProjectData = open ? projects.find((p) => p.slug === open.slug) ?? null : null;
  const openIndex = openProjectData ? visible.findIndex((p) => p.slug === openProjectData.slug) : -1;

  const activeLabel = DISCIPLINES.find((d) => d.id === filter)?.label ?? "All";

  return (
    <section
      ref={section}
      id="work"
      aria-labelledby={titleId}
      className="relative scroll-mt-24 pb-24 md:pb-36"
    >
      <div data-work-head className="shell grid gap-6 pb-10 md:grid-cols-12 md:items-end md:pb-14">
        <h2 id={titleId} className="t-d2 md:col-span-7">
          Selected work
        </h2>
        <div className="md:col-span-5 md:justify-self-end">
          <p className="max-w-[44ch] text-muted">
            Graduations, kickoffs and brand nights, plus the media, digital, exhibition stand and giveaway work around them.
          </p>
          <p className="t-meta mt-4 text-faint" aria-live="polite">
            {visible.length} {visible.length === 1 ? "project" : "projects"}
            {filter !== "all" && ` in ${activeLabel}`}
          </p>
        </div>
      </div>

      <div className="filter-sticky sticky z-30 mb-8 md:mb-10">
        <div className="shell">
          <FilterBar
            options={DISCIPLINES}
            value={filter}
            onChange={chooseFilter}
            counts={counts}
            label="Filter projects by discipline"
          />
        </div>
      </div>

      <div className="shell">
        <div
          ref={grid}
          className="work-grid"
          data-filtered={filter !== "all"}
          onPointerMove={onGridMove}
        >
          {projects.map((p, i) => (
            <WorkTile
              key={p.slug}
              project={p}
              hidden={!visible.includes(p)}
              priority={i < 2}
              depth={fine && !reduced}
              onOpen={openProject}
              onHover={onHover}
            />
          ))}
        </div>

        {visible.length === 0 && (
          <p className="py-24 text-center text-muted">
            Nothing in {activeLabel} yet.{" "}
            <button type="button" className="text-fg underline underline-offset-4" onClick={() => chooseFilter("all")}>
              Show all work
            </button>
          </p>
        )}
      </div>

      <div
        ref={chip}
        aria-hidden
        className="pointer-events-none fixed left-0 top-0 z-40 flex items-center gap-2.5 rounded-full bg-fg py-2 pl-2 pr-4 text-[0.875rem] font-medium text-ink shadow-[0_12px_40px_-12px_rgb(0_0_0/0.6)]"
      >
        <span className="size-2.5 rounded-full" style={{ backgroundColor: hovered?.accent === "#f8f8ff" ? "#0a0a0b" : hovered?.accent }} />
        <span>{hovered?.title}</span>
        <span className="text-ink/50">{hovered?.kind === "case" ? "Open" : "View"}</span>
      </div>

      {/* Service links arrive as /portfolio?filter=<discipline>. */}
      <Suspense fallback={null}>
        <FilterFromQuery onFilter={applyFilter} />
      </Suspense>

      {openProjectData && (
        <Expansion
          project={openProjectData}
          from={open?.from ?? null}
          reduced={reduced}
          index={Math.max(openIndex, 0)}
          total={visible.length}
          onPrev={() => step(-1)}
          onNext={() => step(1)}
          onRequestClose={requestClose}
          closing={closing}
        />
      )}
    </section>
  );
}

/** Applies a ?filter= discipline from the address; renders nothing. */
function FilterFromQuery({ onFilter }: { onFilter: (id: FilterId) => void }) {
  const requested = useSearchParams().get("filter");
  const apply = useEffectEvent(onFilter);
  useEffect(() => {
    if (requested && isDiscipline(requested)) apply(requested);
  }, [requested]);
  return null;
}
