"use client";

import { useId, useLayoutEffect, useMemo, useRef, useState } from "react";
import { Flip, gsap, ScrollTrigger, useGSAP } from "@/lib/gsap";
import { useFlipFilter } from "@/hooks/useFlipFilter";
import { useReducedMotion } from "@/hooks/useMedia";
import { roles, TEAMS, type Role, type Team } from "@/lib/careers";
import { FilterBar } from "@/components/ui/FilterBar";
import { PillLink } from "@/components/ui/Buttons";

type FilterId = Team | "all";

/**
 * Open roles. Filtering and opening a role both Flip the list, so cards
 * glide to their new places on transforms rather than snapping. Each role
 * applies through the Google Form it was published with.
 */
export function JobBoard() {
  const titleId = useId();
  const root = useRef<HTMLElement>(null);
  const list = useRef<HTMLOListElement>(null);
  const flip = useRef<Flip.FlipState | null>(null);
  const [filter, setFilter] = useFlipFilter<FilterId>(list, "all");
  const [open, setOpen] = useState<string | null>(null);
  const reduced = useReducedMotion();

  const visible = useMemo(() => roles.filter((r) => filter === "all" || r.team === filter), [filter]);
  const counts = useMemo(() => {
    const map = new Map<FilterId, number>([["all", roles.length]]);
    for (const r of roles) map.set(r.team, (map.get(r.team) ?? 0) + 1);
    return map;
  }, []);

  const toggle = (slug: string) => {
    if (!reduced && list.current) flip.current = Flip.getState(list.current.querySelectorAll("[data-flip-item]"));
    setOpen((o) => (o === slug ? null : slug));
  };

  useLayoutEffect(() => {
    const state = flip.current;
    if (!state || !list.current) return;
    flip.current = null;
    Flip.from(state, {
      targets: list.current.querySelectorAll("[data-flip-item]"),
      duration: 0.3,
      ease: "ui",
      nested: true,
      onComplete: () => ScrollTrigger.refresh(),
    });
    const panel = list.current.querySelector("[data-role-panel]:not([hidden])");
    if (panel) gsap.fromTo(panel, { opacity: 0, y: 8 }, { opacity: 1, y: 0, duration: 0.2, delay: 0.05, ease: "ui" });
  }, [open]);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        gsap.from("[data-flip-item]", {
          y: 40,
          opacity: 0,
          duration: 0.9,
          ease: "reveal",
          stagger: 0.06,
          clearProps: "transform,opacity",
          scrollTrigger: { trigger: list.current, start: "top 88%", once: true },
        });
      });
      return () => mm.revert();
    },
    { scope: root },
  );

  const activeLabel = TEAMS.find((t) => t.id === filter)?.label ?? "All roles";

  return (
    <section ref={root} id="roles" aria-labelledby={titleId} className="relative scroll-mt-24 pb-24 md:pb-36">
      <div className="shell grid gap-6 pb-10 md:grid-cols-12 md:items-end md:pb-14">
        <h2 id={titleId} className="t-d2 md:col-span-7">
          Open roles
        </h2>
        <p className="t-meta text-faint md:col-span-5 md:justify-self-end" aria-live="polite">
          {visible.length} {visible.length === 1 ? "role" : "roles"}
          {filter !== "all" && ` in ${activeLabel}`}
        </p>
      </div>

      <div className="filter-sticky sticky z-30 mb-8 md:mb-10">
        <div className="shell">
          <FilterBar
            options={TEAMS}
            value={filter}
            onChange={(id) => {
              setOpen(null);
              setFilter(id);
            }}
            counts={counts}
            label="Filter roles by team"
          />
        </div>
      </div>

      <ol ref={list} className="shell grid gap-3">
        {roles.map((r) => (
          <RoleCard
            key={r.slug}
            role={r}
            hidden={!visible.includes(r)}
            open={open === r.slug}
            onToggle={() => toggle(r.slug)}
          />
        ))}
      </ol>
    </section>
  );
}

function RoleCard({ role, hidden, open, onToggle }: { role: Role; hidden: boolean; open: boolean; onToggle: () => void }) {
  const panelId = useId();
  const headId = useId();
  const team = TEAMS.find((t) => t.id === role.team)?.label;

  return (
    <li
      data-flip-item
      aria-hidden={hidden || undefined}
      inert={hidden}
      // `hidden` utility rather than the attribute, so Flip can fade leaving cards out.
      className={`group/card rounded-[clamp(12px,1.3vw,20px)] bg-[linear-gradient(160deg,rgb(12_27_94/0.55),rgb(11_21_76/0.25))] ring-1 transition-[box-shadow,translate] duration-300 ease-ui hover:-translate-y-0.5 hover:shadow-[0_24px_60px_-28px_rgb(0_0_0/0.8)] ${
        open ? "ring-line-strong" : "ring-line hover:ring-line-strong"
      } ${hidden ? "hidden" : ""}`}
    >
      <h3 id={headId}>
        <button
          type="button"
          aria-expanded={open}
          aria-controls={panelId}
          onClick={onToggle}
          className="flex w-full items-center gap-4 rounded-[inherit] p-5 text-left transition-transform duration-150 ease-ui active:scale-[0.995] md:gap-8 md:p-8"
        >
          <span className="t-meta hidden w-36 shrink-0 text-faint md:block">{team}</span>
          <span className="min-w-0 flex-1">
            <span className="t-h3 block">{role.title}</span>
            <span className="mt-1.5 block text-[0.9375rem] text-muted">
              <span className="md:hidden">{team} · </span>
              {role.location}
            </span>
          </span>
          <span
            aria-hidden
            className={`grid size-11 shrink-0 place-items-center rounded-full ring-1 transition-[transform,box-shadow,background-color] duration-300 ease-ui ${
              open ? "rotate-45 bg-fg/5 ring-gold" : "ring-line-strong group-hover/card:ring-gold"
            }`}
          >
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
              <path d="M6 1v10M1 6h10" stroke="currentColor" strokeWidth="1.4" />
            </svg>
          </span>
        </button>
      </h3>
      <div
        id={panelId}
        role="region"
        aria-labelledby={headId}
        data-role-panel
        hidden={!open}
        className="px-5 pb-6 md:px-8 md:pb-8 md:pl-[calc(2rem+9rem+2rem)]"
      >
        <p className="max-w-[64ch] text-pretty text-muted">{role.summary}</p>
        <div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-3">
          <PillLink href={role.applyUrl} external direction="out">
            Apply now
          </PillLink>
          <p className="text-[0.875rem] text-faint">Opens the application form on Google Forms.</p>
        </div>
      </div>
    </li>
  );
}
