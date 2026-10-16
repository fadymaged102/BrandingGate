"use client";

import { createContext, useContext, useEffect, useRef, useState, type ReactNode } from "react";
import { useReducedMotion } from "@/hooks/useMedia";

/* ------------------------------------------------------------------ */
/* Pause state, shared by the backdrop and every pause control.       */
/* ------------------------------------------------------------------ */

const MotionContext = createContext<{ paused: boolean; toggle: () => void }>({
  paused: false,
  toggle: () => {},
});

export const useSiteMotion = () => useContext(MotionContext);

export function SiteMotion({ children }: { children: ReactNode }) {
  const [paused, setPaused] = useState(false);
  return <MotionContext value={{ paused, toggle: () => setPaused((p) => !p) }}>{children}</MotionContext>;
}

/* ------------------------------------------------------------------ */
/* The backdrop                                                        */
/* ------------------------------------------------------------------ */

type Node = { x: number; y: number; vx: number; vy: number; r: number; depth: number };

const LINK = 140; // px between nodes before their thread disappears
const REACH = 180; // px around the cursor that it touches

/**
 * The site's backdrop, on every page: a slow constellation of points threaded by
 * hairlines. Near the cursor, points lean away and gold threads reach to
 * it. Canvas 2D, one pass per frame, density scaled to the screen and
 * pixel ratio capped, so it stays light. Sits behind everything at low
 * contrast; reduced motion draws a single still frame.
 */
export function Constellation() {
  const canvas = useRef<HTMLCanvasElement>(null);
  // Kept across pause and resume so the field doesn't re-scatter.
  const field = useRef<Node[]>([]);
  const reduced = useReducedMotion();
  const { paused } = useSiteMotion();

  useEffect(() => {
    const el = canvas.current;
    const ctx = el?.getContext("2d");
    if (!el || !ctx) return;

    let w = 0;
    let h = 0;
    let nodes = field.current;
    const pointer = { x: -9999, y: -9999, active: false };

    const seed = (scatter: boolean) => {
      const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
      w = window.innerWidth;
      h = window.innerHeight;
      el.width = Math.round(w * dpr);
      el.height = Math.round(h * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      if (!scatter && nodes.length) return;
      const count = Math.round(Math.min(110, Math.max(36, (w * h) / 15000)));
      nodes = Array.from({ length: count }, () => {
        const depth = 0.4 + Math.random() * 0.6;
        return {
          x: Math.random() * w,
          y: Math.random() * h,
          vx: (Math.random() - 0.5) * 0.18 * depth,
          vy: (Math.random() - 0.5) * 0.18 * depth,
          r: 0.6 + depth * 1.1,
          depth,
        };
      });
      field.current = nodes;
    };

    const draw = () => {
      ctx.clearRect(0, 0, w, h);

      for (let i = 0; i < nodes.length; i++) {
        const a = nodes[i];
        for (let j = i + 1; j < nodes.length; j++) {
          const b = nodes[j];
          const dx = a.x - b.x;
          const dy = a.y - b.y;
          const d2 = dx * dx + dy * dy;
          if (d2 > LINK * LINK) continue;
          const t = 1 - Math.sqrt(d2) / LINK;
          ctx.strokeStyle = `rgba(248,248,255,${(t * 0.16 * Math.min(a.depth, b.depth)).toFixed(3)})`;
          ctx.lineWidth = 0.6;
          ctx.beginPath();
          ctx.moveTo(a.x, a.y);
          ctx.lineTo(b.x, b.y);
          ctx.stroke();
        }
      }

      if (pointer.active) {
        for (const n of nodes) {
          const dx = n.x - pointer.x;
          const dy = n.y - pointer.y;
          const d = Math.hypot(dx, dy);
          if (d > REACH) continue;
          const t = 1 - d / REACH;
          ctx.strokeStyle = `rgba(230,178,78,${(t * 0.35).toFixed(3)})`;
          ctx.lineWidth = 0.7;
          ctx.beginPath();
          ctx.moveTo(n.x, n.y);
          ctx.lineTo(pointer.x, pointer.y);
          ctx.stroke();
        }
      }

      for (const n of nodes) {
        ctx.fillStyle = `rgba(248,248,255,${(0.25 + n.depth * 0.4).toFixed(3)})`;
        ctx.beginPath();
        ctx.arc(n.x, n.y, n.r, 0, Math.PI * 2);
        ctx.fill();
      }
    };

    const step = () => {
      for (const n of nodes) {
        if (pointer.active) {
          const dx = n.x - pointer.x;
          const dy = n.y - pointer.y;
          const d = Math.hypot(dx, dy) || 1;
          if (d < REACH) {
            // Lean away from the cursor; nearer points (deeper) move more.
            const push = (1 - d / REACH) * 0.06 * n.depth;
            n.vx += (dx / d) * push;
            n.vy += (dy / d) * push;
          }
        }
        // Damp back toward a slow drift.
        n.vx *= 0.985;
        n.vy *= 0.985;
        n.x += n.vx;
        n.y += n.vy;
        if (n.x < -20) n.x = w + 20;
        else if (n.x > w + 20) n.x = -20;
        if (n.y < -20) n.y = h + 20;
        else if (n.y > h + 20) n.y = -20;
      }
    };

    seed(false);
    draw();
    if (reduced || paused) {
      const onResize = () => {
        seed(true);
        draw();
      };
      window.addEventListener("resize", onResize);
      return () => window.removeEventListener("resize", onResize);
    }

    let frame = 0;
    const loop = () => {
      step();
      draw();
      frame = requestAnimationFrame(loop);
    };
    frame = requestAnimationFrame(loop);

    const onMove = (e: PointerEvent) => {
      if (e.pointerType !== "mouse") return;
      pointer.x = e.clientX;
      pointer.y = e.clientY;
      pointer.active = true;
    };
    const onLeave = () => {
      pointer.active = false;
    };
    let resizeTimer = 0;
    const onResize = () => {
      clearTimeout(resizeTimer);
      resizeTimer = window.setTimeout(() => seed(true), 150);
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    document.documentElement.addEventListener("pointerleave", onLeave);
    window.addEventListener("resize", onResize);

    return () => {
      cancelAnimationFrame(frame);
      clearTimeout(resizeTimer);
      window.removeEventListener("pointermove", onMove);
      document.documentElement.removeEventListener("pointerleave", onLeave);
      window.removeEventListener("resize", onResize);
    };
  }, [reduced, paused]);

  return (
    <canvas
      ref={canvas}
      aria-hidden
      // Fixed behind the content at the root stacking level, above the atmosphere layer.
      className="pointer-events-none fixed inset-0 -z-[1] size-full"
    />
  );
}
