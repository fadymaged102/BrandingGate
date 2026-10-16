# Branding Gate website

Rebuild of brandinggate.com, starting with the portfolio. The app lives in `web/` (Next.js 16, React 19, Tailwind v4, GSAP, Lenis, React Three Fiber). See `web/README.md` for structure and how to add projects.

Next.js 16 differs from older versions: read `web/AGENTS.md` and the docs in `web/node_modules/next/dist/docs/` before writing Next-specific code.

## Commands

Run from `web/`:

- `npm run dev`: dev server, http://localhost:3000/portfolio
- `npm run lint` and `npx tsc --noEmit`: must both be clean
- `npm run build`: must pass before calling work done (Cache Components is on, so some errors only show here)

## Content rules

- All project content lives in `web/src/lib/projects.ts`. Don't hard-code project facts in components.
- Never invent client facts: no made-up dates, locations, scope, numbers, quotes or testimonials. Use only what the client published or supplied, or describe what is visible in the footage. If something is missing, ask.
- No placeholder text, lorem ipsum or `// TODO` stubs in shipped code.
- Assets come from Branding Gate's own footage and site. Source files are in `.scrape/` (not shipped); production copies go in `web/public/work/`.

## Design rules

- Dark, cinematic, Apple-grade feel. Keep the brand palette: navy (`#050A24`, `#0B154C`), gold `#C8902A` and off-white `#F8F8FF`.
- Gold is only for interactive elements and the arch. Project accent colours only tint the background atmosphere, never text or buttons.
- Fonts: Alexandria (display), Work Sans (text), Geist Mono (small labels).
- Design tokens are in `web/src/app/globals.css`. Use them rather than new one-off values.
- Text must meet WCAG AA contrast. Everything must work by keyboard and with `prefers-reduced-motion` (no WebGL, pinning or scrubbing in that mode).

## Engineering rules

- GSAP must never move or replace DOM nodes React renders. Pin an element inside a React-owned wrapper; pass `RevealText` plain strings only (SplitText rewrites them). Breaking this crashes route changes under Cache Components.
- Previously visited pages stay mounted but hidden. Scope DOM queries to the current page, use `useId()` for IDs, and set or clear the page accent only through `web/src/lib/atmosphere.ts`.
- Animate with transforms and opacity. Don't hide focusable content with `visibility: hidden` (GSAP `autoAlpha`), because it removes it from the Tab order.
- Verify UI changes in a real browser (Playwright), including a phone-sized viewport and reduced motion, before reporting them done.
