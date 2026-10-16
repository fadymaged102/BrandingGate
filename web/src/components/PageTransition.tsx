import { ViewTransition, type ReactNode } from "react";

/**
 * Route change choreography. The page leaving fades and settles back while
 * the next one rises into place; the header is anchored (see globals.css).
 * Wrap each page's content, not the layout: layouts persist across
 * navigations, so enter and exit never fire there.
 */
export function PageTransition({ children }: { children: ReactNode }) {
  return (
    <ViewTransition enter="page-enter" exit="page-exit" default="none">
      {children}
    </ViewTransition>
  );
}
