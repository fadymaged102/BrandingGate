# Branding Gate website

A rebuild of [brandinggate.com](https://www.brandinggate.com): Home, About, Projects (portfolio and case studies), Career and Blog, sharing one dark, cinematic design system built around the logo's glass arch.

## Run

```bash
npm install
npm run dev      # http://localhost:3000
npm run build && npm start
```

Routes: `/`, `/about`, `/portfolio`, `/portfolio/[slug]`, `/career`, `/blog`, `/blog/[slug]`. All are statically generated.

## Stack

- Next.js 16 (App Router, Cache Components), React 19, TypeScript
- Tailwind CSS v4 (tokens in `src/app/globals.css`)
- GSAP 3 with ScrollTrigger, Flip, SplitText; Lenis for smooth wheel scrolling
- React Three Fiber + drei for the hero arch (`MeshTransmissionMaterial`)

## Where things are

| Path | What |
| --- | --- |
| `src/lib/projects.ts` | Projects, case copy, stills, accents, grid spans, studio info and nav |
| `src/lib/site.ts` | Home and About copy, services, values, the client wall |
| `src/lib/careers.ts` | Open roles and their Google Form links |
| `src/lib/posts.ts` | Blog posts as typed blocks |
| `src/components/Constellation.tsx` | Site-wide backdrop (Canvas 2D) and the shared pause state |
| `src/components/home/` | Hero with the 3D logo, sticky-note services board, case study stack, client marquee |
| `public/brand/monogram.svg` | The RG monogram traced from the logo file; extruded into the 3D logo on Home (`home/LogoScene.tsx`) |
| `src/components/about/` | About hero, values carousel (WebGL) with drawn-glyph fallback |
| `src/components/career/` | Career hero, filterable job board, culture cards |
| `src/components/blog/` | Blog index with spotlight, article layout, reading-progress arch |
| `src/components/three/` | Shared gate geometry and WebGL support checks |
| `src/components/PageTransition.tsx` | Route transitions (React `<ViewTransition>`), wrapped around every page |
| `src/components/hero/` | Portfolio hero (event poster, headline, gentle scroll drift) |
| `src/components/work/` | Filter bar, grid tiles, cursor chip, Flip expansion dialog |
| `src/components/case/` | Case hero, pinned story, before/after slider, gallery, film, next project |
| `src/components/ui/` | Device frames (LED panel, phone), line-mask text reveal |
| `public/work/` | Stills and muted loops extracted from Branding Gate's own footage |

## Adding a role or a post

- Role: add to `roles` in `src/lib/careers.ts` with its `team` and a `status`. Open roles (`"open"`) need a `summary` and `applyUrl`; closed (`"closed"`) or upcoming (`"soon"`) listings show only their status. Teams with no roles show a disabled filter.
- Post: add to `posts` in `src/lib/posts.ts`. The body is a list of blocks (`p`, `h2`, `h3`, `list`, `facts`, `link`). Reading time is computed. The newest post becomes the spotlight.

## Adding a project

Add an entry to `projects` in `src/lib/projects.ts`.

- `kind: "case"` gets its own page.
- `kind: "piece"` opens in the expansion view only.
- Grid size is `span: { c, r }` in whole cells on a 12-column grid where each row is one column wide, so `{ c: 8, r: 5 }` is roughly 16:10.
- `frame` picks the presentation: `"screen"` for 16:9 footage, `"phone"` for vertical video, `"plain"` for renders and finished artwork.

## Motion and accessibility

- `prefers-reduced-motion: reduce` turns off WebGL, Lenis, pinning and scrubbing. Content stays fully visible and the before/after slider still works.
- Under 768px the heroes use posters and drawn SVG arches instead of WebGL, and the Home hero does not pin. The About values carousel needs 1024px and WebGL; otherwise it is a grid of drawn glyphs.
- Moving content (hero footage, client marquee) has a pause control.
- The expansion view is a modal dialog: focus trap, `Esc` to close, arrow keys to step, and focus returns to the tile.

## GSAP and React DOM ownership

Under Cache Components, previously visited pages stay mounted (hidden) and React inserts new pages beside them. Two rules prevent DOM conflicts:

- The pinned hero section is wrapped in a React-owned `<div>`, because ScrollTrigger inserts a pin-spacer around the pinned element.
- `RevealText` takes plain strings rendered via `innerHTML`, because SplitText rewrites those text nodes.
