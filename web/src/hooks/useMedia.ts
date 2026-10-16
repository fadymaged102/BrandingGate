"use client";

import { useCallback, useSyncExternalStore } from "react";

/**
 * Subscribes to a media query. Returns `serverValue` during SSR and the
 * first client render so hydration stays consistent.
 */
export function useMedia(query: string, serverValue = false) {
  const subscribe = useCallback(
    (onChange: () => void) => {
      const mql = window.matchMedia(query);
      mql.addEventListener("change", onChange);
      return () => mql.removeEventListener("change", onChange);
    },
    [query],
  );
  return useSyncExternalStore(
    subscribe,
    () => window.matchMedia(query).matches,
    () => serverValue,
  );
}

export const useReducedMotion = () =>
  useMedia("(prefers-reduced-motion: reduce)", false);

export const useFinePointer = () =>
  useMedia("(hover: hover) and (pointer: fine)", false);
