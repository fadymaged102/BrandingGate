"use client";

import Link from "next/link";
import { useEffect, useRef, useState, type CSSProperties, type FocusEvent, type MouseEvent } from "react";
import { gsap } from "@/lib/gsap";
import type { Project } from "@/lib/projects";
import { FramedMedia } from "@/components/ui/Frames";

type Props = {
  project: Project;
  hidden: boolean;
  priority?: boolean;
  depth: boolean;
  onOpen: (project: Project, media: HTMLElement, trigger: HTMLElement) => void;
  onHover: (project: Project | null) => void;
};

const sizesFor = (c: number) => `(min-width: 768px) ${Math.round((c / 12) * 100)}vw, 100vw`;

export function WorkTile({ project, hidden, priority, depth, onOpen, onHover }: Props) {
  const root = useRef<HTMLElement>(null);
  const media = useRef<HTMLDivElement>(null);
  const [hovered, setHovered] = useState(false);

  // Spatial depth: the frame tilts toward the pointer while the picture
  // inside drifts the other way, so the tile reads as a window with depth.
  // Setters are created once; the rect comes from the untransformed tile,
  // measured on enter, so the tilt never feeds back into its own input.
  type Setters = { rx: gsap.QuickToFunc; ry: gsap.QuickToFunc; ix: gsap.QuickToFunc; iy: gsap.QuickToFunc; is: gsap.QuickToFunc };
  const setters = useRef<Setters | null>(null);
  const rect = useRef<DOMRect | null>(null);

  useEffect(() => {
    const el = media.current;
    const inner = el?.querySelector<HTMLElement>("[data-media-inner]");
    if (!el || !inner || !depth) return;
    gsap.set(el, { transformPerspective: 1100 });
    const to = (target: HTMLElement, prop: string) => gsap.quickTo(target, prop, { duration: 0.6, ease: "ui" });
    setters.current = {
      rx: to(el, "rotateX"),
      ry: to(el, "rotateY"),
      ix: to(inner, "xPercent"),
      iy: to(inner, "yPercent"),
      is: to(inner, "scale"),
    };
    return () => {
      setters.current = null;
      gsap.killTweensOf([el, inner]);
      gsap.set([el, inner], { clearProps: "transform" });
    };
  }, [depth]);

  const onMove = (e: MouseEvent) => {
    const s = setters.current;
    const r = rect.current;
    if (!s || !r) return;
    const x = (e.clientX - r.left) / r.width - 0.5;
    const y = (e.clientY - r.top) / r.height - 0.5;
    s.ry(x * 5);
    s.rx(-y * 5);
    s.ix(-x * 3);
    s.iy(-y * 3);
    s.is(1.06);
  };

  const reset = () => {
    const s = setters.current;
    if (!s) return;
    s.rx(0);
    s.ry(0);
    s.ix(0);
    s.iy(0);
    s.is(1);
  };

  const enter = () => {
    rect.current = root.current?.getBoundingClientRect() ?? null;
    setHovered(true);
    onHover(project);
  };
  const leave = () => {
    setHovered(false);
    onHover(null);
    reset();
  };
  // Only keyboard focus previews a tile; focus restored by script (e.g.
  // after the dialog closes) must not light it up under a mouse user.
  const focusIn = (e: FocusEvent<HTMLElement>) => {
    if ((e.target as HTMLElement).matches(":focus-visible")) enter();
  };

  const open = (e: MouseEvent<HTMLElement>) => {
    // Let modified clicks open the case study in a new tab as normal.
    if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || e.button !== 0) return;
    e.preventDefault();
    if (media.current) onOpen(project, media.current, e.currentTarget);
  };

  const label = `${project.title}, ${project.kind === "case" ? "case study" : project.discipline}`;

  const body = (
    <>
      <div
        ref={media}
        data-flip-id={`media-${project.slug}`}
        className="relative h-full w-full overflow-hidden rounded-[clamp(12px,1.3vw,20px)] bg-navy-900 will-change-transform [transform-style:preserve-3d]"
      >
        <FramedMedia
          frame={project.frame}
          still={project.cover}
          loop={project.loop}
          playing={hovered}
          focus={project.focus}
          sizes={sizesFor(project.span.c)}
          priority={priority}
        />
        <div
          aria-hidden
          className="pointer-events-none absolute inset-x-0 bottom-0 h-1/2 bg-[linear-gradient(to_top,rgb(5_10_36/0.85),transparent)]"
        />
      </div>
      <span className="pointer-events-none absolute inset-x-0 bottom-0 flex items-end justify-between gap-4 p-[clamp(1rem,1.6vw,1.5rem)]">
        <span className="min-w-0">
          <span className="block truncate font-display text-[clamp(1.0625rem,1.5vw,1.375rem)] font-medium tracking-[-0.015em]">
            {project.title}
          </span>
          <span
            className={`mt-1 truncate text-[0.875rem] text-muted ${
              project.span.r <= 2 ? "block md:hidden md:in-data-[filtered=true]:block" : "block"
            }`}
          >
            {project.kicker}
          </span>
        </span>
        <span
          className={`t-meta hidden shrink-0 text-faint ${
            project.span.c <= 4 ? "lg:inline sm:in-data-[filtered=true]:inline" : "sm:inline"
          }`}
        >
          {project.kind === "case" ? "Case study" : project.discipline}
        </span>
      </span>
    </>
  );

  const shared = {
    className:
      "relative block h-full w-full rounded-[clamp(12px,1.3vw,20px)] transition-transform duration-150 ease-ui active:scale-[0.985]",
    onClick: open,
    "aria-label": label,
  };

  return (
    <article
      ref={root}
      data-tile={project.slug}
      data-hidden={hidden}
      aria-hidden={hidden || undefined}
      inert={hidden}
      onPointerEnter={enter}
      onPointerLeave={leave}
      onPointerMove={onMove}
      onFocus={focusIn}
      onBlur={leave}
      // `hidden` utility rather than the attribute: Tailwind's [hidden] rule is
      // !important and would stop Flip fading leaving tiles out.
      className={`work-tile relative ${hidden ? "hidden" : ""}`}
      style={
        {
          "--c": project.span.c,
          "--r": project.span.r,
          "--ar": project.mobileRatio,
        } as CSSProperties
      }
    >
      {project.kind === "case" ? (
        <Link href={`/portfolio/${project.slug}`} {...shared}>
          {body}
        </Link>
      ) : (
        <button type="button" {...shared}>
          {body}
        </button>
      )}
    </article>
  );
}
