"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { studio } from "@/lib/projects";
import { useSiteMotion } from "@/components/Constellation";
import { useReducedMotion } from "@/hooks/useMedia";

export function SiteHeader() {
  const pathname = usePathname();
  const [hidden, setHidden] = useState(false);
  const [solid, setSolid] = useState(false);
  const [open, setOpen] = useState(false);
  const lastY = useRef(0);
  const { paused, toggle } = useSiteMotion();
  const reduced = useReducedMotion();

  // Hide on scroll down, reveal on scroll up; gain a backdrop once off the top.
  useEffect(() => {
    const onScroll = () => {
      const y = window.scrollY;
      setSolid(y > 24);
      setHidden(y > 160 && y > lastY.current);
      lastY.current = y;
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Close the mobile menu when the route changes.
  const [menuPath, setMenuPath] = useState(pathname);
  if (menuPath !== pathname) {
    setMenuPath(pathname);
    setOpen(false);
  }

  // Publish visibility so sticky UI (the work filter) can sit beneath it.
  const isHidden = hidden && !open;
  useEffect(() => {
    document.documentElement.dataset.headerHidden = String(isHidden);
  }, [isHidden]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);

  return (
    <header
      data-site-header
      data-hidden={isHidden}
      data-solid={solid || open}
      // Anchored during page transitions: only the content beneath it moves.
      style={{ viewTransitionName: "site-header" }}
      className="group fixed inset-x-0 top-0 z-50 transition-[transform,background-color,backdrop-filter] duration-500 ease-ui data-[hidden=true]:-translate-y-full data-[hidden=true]:focus-within:translate-y-0 data-[solid=true]:bg-[color-mix(in_oklab,var(--ink-950)_72%,transparent)] data-[solid=true]:backdrop-blur-xl"
    >
      <div className="shell flex h-[var(--header-h)] items-center justify-between gap-6">
        <Link
          href="/"
          className="flex items-center gap-3"
          aria-label="Branding Gate, home"
        >
          <Image
            src="/brand/logo.png"
            alt=""
            width={64}
            height={54}
            priority
            className="h-12 w-auto"
            style={{ width: "auto" }}
          />
        </Link>

        <nav aria-label="Primary" className="hidden md:block">
          <ul className="flex items-center gap-1">
            {studio.nav.map((item) => {
              const active = isActive(item.href);
              return (
                <li key={item.label}>
                  <Link
                    href={item.href}
                    aria-current={active ? "page" : undefined}
                    className="relative rounded-full px-4 py-2 text-[0.9375rem] text-muted transition-colors duration-150 hover:text-fg aria-[current=page]:text-fg"
                  >
                    {item.label}
                    {active && (
                      <span
                        aria-hidden
                        className="absolute inset-x-4 -bottom-0.5 h-px bg-gold"
                      />
                    )}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        <div className="flex items-center gap-2">
          {/* The backdrop moves on every page, so every page can stop it. */}
          {!reduced && (
            <button
              type="button"
              onClick={toggle}
              aria-pressed={paused}
              aria-label={paused ? "Play background motion" : "Pause background motion"}
              className="grid size-11 place-items-center rounded-full text-muted ring-1 ring-line-strong transition-[color,box-shadow,transform] duration-150 ease-ui hover:text-fg hover:ring-gold active:scale-[0.94]"
            >
              <svg width="11" height="11" viewBox="0 0 12 12" fill="none" aria-hidden>
                {paused ? (
                  <path d="M3 1.5v9l7.5-4.5L3 1.5z" fill="currentColor" />
                ) : (
                  <path d="M3.5 1.5v9M8.5 1.5v9" stroke="currentColor" strokeWidth="1.6" />
                )}
              </svg>
            </button>
          )}
          <a
            href={`mailto:${studio.contact.email}?subject=New%20project`}
            className="hidden rounded-full px-5 py-2.5 text-[0.9375rem] font-medium text-fg ring-1 ring-line-strong transition-[background-color,box-shadow,transform] duration-150 hover:bg-fg/5 hover:ring-gold active:scale-[0.97] sm:inline-flex"
          >
            Start a project
          </a>
          <button
            type="button"
            className="inline-flex size-11 items-center justify-center rounded-full ring-1 ring-line-strong md:hidden"
            aria-expanded={open}
            aria-controls="mobile-nav"
            aria-label={open ? "Close menu" : "Open menu"}
            onClick={() => setOpen((v) => !v)}
          >
            <span className="relative block h-3 w-5" aria-hidden>
              <span
                className={`absolute left-0 h-px w-5 bg-fg transition-transform duration-300 ease-ui ${open ? "top-1.5 rotate-45" : "top-0"}`}
              />
              <span
                className={`absolute left-0 h-px w-5 bg-fg transition-transform duration-300 ease-ui ${open ? "top-1.5 -rotate-45" : "top-3"}`}
              />
            </span>
          </button>
        </div>
      </div>

      <nav
        id="mobile-nav"
        aria-label="Mobile"
        hidden={!open}
        className="shell pb-8 md:hidden"
      >
        <ul className="flex flex-col border-t border-line pt-4">
          {studio.nav.map((item) => (
            <li key={item.label}>
              <Link
                href={item.href}
                aria-current={isActive(item.href) ? "page" : undefined}
                className="block py-3 font-display text-2xl text-muted aria-[current=page]:text-fg"
              >
                {item.label}
              </Link>
            </li>
          ))}
          <li className="pt-4">
            <a
              href={`mailto:${studio.contact.email}?subject=New%20project`}
              className="inline-flex rounded-full bg-fg px-5 py-3 font-medium text-ink"
            >
              Start a project
            </a>
          </li>
        </ul>
      </nav>
    </header>
  );
}
