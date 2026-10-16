"use client";

import Lenis from "lenis";
import { usePathname } from "next/navigation";
import {
  createContext,
  Suspense,
  useContext,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { gsap, ScrollTrigger } from "@/lib/gsap";
import { useReducedMotion } from "@/hooks/useMedia";

const LenisContext = createContext<Lenis | null>(null);

/** The active Lenis instance, or null when native scrolling is in use. */
export const useLenis = () => useContext(LenisContext);

export function SmoothScroll({ children }: { children: ReactNode }) {
  const reduced = useReducedMotion();
  const [lenis, setLenis] = useState<Lenis | null>(null);

  useEffect(() => {
    if (reduced) return;

    const instance = new Lenis({
      lerp: 0.1,
      wheelMultiplier: 1,
      touchMultiplier: 1.2,
      // Native touch scrolling feels right on phones; only smooth the wheel.
      syncTouch: false,
    });

    instance.on("scroll", ScrollTrigger.update);
    const tick = (time: number) => instance.raf(time * 1000);
    gsap.ticker.add(tick);
    gsap.ticker.lagSmoothing(0);
    // Publishing an external instance to context; this is the sync point.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setLenis(instance);

    return () => {
      gsap.ticker.remove(tick);
      instance.destroy();
      setLenis(null);
    };
  }, [reduced]);

  return (
    <LenisContext value={lenis}>
      {/* Reads the URL, so it suspends on request-time routes without holding back the page. */}
      <Suspense fallback={null}>
        <RouteScrollReset />
      </Suspense>
      {children}
    </LenisContext>
  );
}

/**
 * On a new route: honour a #hash target, leave Back/Forward to the browser's
 * scroll restoration, otherwise start at the top. Lenis is then synced to the
 * ScrollTrigger re-measures once layout settles. (Lenis follows native
 * scroll jumps on its own.)
 */
function RouteScrollReset() {
  const pathname = usePathname();
  const fromHistory = useRef(false);
  const firstPath = useRef(true);

  useEffect(() => {
    const onPop = () => {
      fromHistory.current = true;
    };
    window.addEventListener("popstate", onPop);
    return () => window.removeEventListener("popstate", onPop);
  }, []);

  // Route changes only; the Lenis instance arriving must not move the page.
  useEffect(() => {
    const isFirst = firstPath.current;
    firstPath.current = false;
    const restoring = fromHistory.current;
    fromHistory.current = false;

    const id = requestAnimationFrame(() => {
      const hash = decodeURIComponent(window.location.hash.slice(1));
      const target = hash ? document.getElementById(hash) : null;
      if (target) {
        const top = target.getBoundingClientRect().top + window.scrollY - 16;
        window.scrollTo(0, top);
      } else if (!restoring && !isFirst) {
        window.scrollTo(0, 0);
      }
      ScrollTrigger.refresh();
    });
    return () => cancelAnimationFrame(id);
  }, [pathname]);

  return null;
}
