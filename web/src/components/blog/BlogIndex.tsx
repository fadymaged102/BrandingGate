"use client";

import Link from "next/link";
import { useId, useMemo, useRef } from "react";
import { gsap, useGSAP } from "@/lib/gsap";
import { useFlipFilter } from "@/hooks/useFlipFilter";
import { useFinePointer, useReducedMotion } from "@/hooks/useMedia";
import { useTilt } from "@/hooks/useTilt";
import { CATEGORIES, formatDate, readingMinutes, type Category, type Post } from "@/lib/posts";
import { FilterBar } from "@/components/ui/FilterBar";
import { ArrowIcon } from "@/components/ui/Buttons";

type FilterId = Category | "all";

const categoryLabel = (c: Category) => CATEGORIES.find((x) => x.id === c)?.label ?? c;

/** The latest post on a pane of glass, then every post, filterable. */
export function BlogIndex({ posts }: { posts: Post[] }) {
  const listId = useId();
  const root = useRef<HTMLDivElement>(null);
  const list = useRef<HTMLOListElement>(null);
  const [filter, setFilter] = useFlipFilter<FilterId>(list, "all");
  const fine = useFinePointer();
  const reduced = useReducedMotion();

  const [latest] = posts;
  const visible = useMemo(() => posts.filter((p) => filter === "all" || p.category === filter), [filter, posts]);
  const counts = useMemo(() => {
    const map = new Map<FilterId, number>([["all", posts.length]]);
    for (const p of posts) map.set(p.category, (map.get(p.category) ?? 0) + 1);
    return map;
  }, [posts]);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        gsap.from("[data-spotlight]", { y: 60, opacity: 0, duration: 1.2, ease: "reveal", delay: 0.3 });
        gsap.from("[data-flip-item]", {
          y: 50,
          opacity: 0,
          duration: 1,
          ease: "reveal",
          stagger: 0.08,
          clearProps: "transform,opacity",
          scrollTrigger: { trigger: list.current, start: "top 88%", once: true },
        });
      });
      return () => mm.revert();
    },
    { scope: root },
  );

  const activeLabel = CATEGORIES.find((c) => c.id === filter)?.label ?? "All posts";

  return (
    <div ref={root}>
      {latest && <Spotlight post={latest} depth={fine && !reduced} />}

      <section aria-labelledby={listId} className="pb-24 md:pb-36">
        <div className="shell grid gap-6 pb-10 md:grid-cols-12 md:items-end md:pb-14">
          <h2 id={listId} className="t-d2 md:col-span-7">
            All posts
          </h2>
          <p className="t-meta text-faint md:col-span-5 md:justify-self-end" aria-live="polite">
            {visible.length} {visible.length === 1 ? "post" : "posts"}
            {filter !== "all" && ` in ${activeLabel}`}
          </p>
        </div>

        <div className="filter-sticky sticky z-30 mb-8 md:mb-10">
          <div className="shell">
            <FilterBar options={CATEGORIES} value={filter} onChange={setFilter} counts={counts} label="Filter posts by topic" />
          </div>
        </div>

        <ol ref={list} className="shell grid gap-3 md:grid-cols-2 lg:grid-cols-3">
          {posts.map((p) => (
            <PostCard key={p.slug} post={p} hidden={!visible.includes(p)} depth={fine && !reduced} />
          ))}
        </ol>
      </section>
    </div>
  );
}

function Meta({ post }: { post: Post }) {
  return (
    <p className="t-meta flex flex-wrap items-center gap-x-3 gap-y-1 text-faint">
      <span>{categoryLabel(post.category)}</span>
      <span aria-hidden>·</span>
      <time dateTime={post.date}>{formatDate(post.date)}</time>
      <span aria-hidden>·</span>
      <span>{readingMinutes(post)} min read</span>
    </p>
  );
}

function Spotlight({ post, depth }: { post: Post; depth: boolean }) {
  const titleId = useId();
  const card = useRef<HTMLAnchorElement>(null);
  const tilt = useTilt(card, depth, { degrees: 3, drift: 2, zoom: 1 });

  return (
    <section aria-labelledby={titleId} className="shell pb-24 md:pb-36">
      <div className="relative [perspective:1600px]">
        <div
          aria-hidden
          className="pointer-events-none absolute -top-[10%] right-[10%] size-[min(50vw,28rem)] rounded-full bg-[radial-gradient(closest-side,rgb(58_91_217/0.35),transparent)] blur-2xl"
        />
        <Link
          ref={card}
          href={`/blog/${post.slug}`}
          data-spotlight
          aria-labelledby={titleId}
          {...tilt}
          className={`group relative block overflow-hidden rounded-[clamp(16px,2vw,28px)] bg-[linear-gradient(150deg,rgb(248_248_255/0.07),rgb(248_248_255/0.02)_45%,rgb(12_27_94/0.35))] p-[clamp(1.5rem,4vw,4rem)] ring-1 ring-line-strong backdrop-blur-2xl transition-shadow ${depth ? "will-change-transform" : ""} duration-300 ease-ui hover:ring-gold/60`}
        >
          <span
            aria-hidden
            className="pointer-events-none absolute inset-x-0 top-0 h-px bg-[linear-gradient(to_right,transparent,rgb(248_248_255/0.35),transparent)]"
          />
          <div data-tilt-inner className="grid gap-10 md:grid-cols-12 md:items-end">
            <div className="md:col-span-8">
              <p className="t-meta text-muted">Latest post</p>
              <h2 id={titleId} className="t-d2 mt-6 max-w-[18ch]">
                {post.title}
              </h2>
              <p className="mt-6 max-w-[56ch] text-pretty text-muted">{post.excerpt}</p>
              <div className="mt-8">
                <Meta post={post} />
              </div>
            </div>
            <span className="inline-flex w-fit items-center gap-3 rounded-full bg-fg py-3 pl-6 pr-3 font-medium text-ink md:col-span-4 md:justify-self-end">
              Read the post
              <span className="grid size-8 place-items-center rounded-full bg-ink text-fg transition-transform duration-300 ease-ui group-hover:translate-x-0.5">
                <ArrowIcon />
              </span>
            </span>
          </div>
        </Link>
      </div>
    </section>
  );
}

function PostCard({ post, hidden, depth }: { post: Post; hidden: boolean; depth: boolean }) {
  const titleId = useId();
  const card = useRef<HTMLAnchorElement>(null);
  const tilt = useTilt(card, depth, { degrees: 5, drift: 0, zoom: 1 });

  return (
    <li
      data-flip-item
      aria-hidden={hidden || undefined}
      inert={hidden}
      className={hidden ? "hidden" : "[perspective:1200px]"}
    >
      <Link
        ref={card}
        href={`/blog/${post.slug}`}
        aria-labelledby={titleId}
        {...tilt}
        className={`group flex h-full min-h-[22rem] flex-col justify-between gap-10 rounded-[clamp(12px,1.3vw,20px)] bg-[linear-gradient(160deg,rgb(12_27_94/0.55),rgb(11_21_76/0.25))] p-6 ring-1 ring-line transition-[box-shadow] duration-300 ease-ui hover:ring-gold/60 md:p-8 ${depth ? "will-change-transform" : ""}`}
      >
        <div>
          <Meta post={post} />
          <h3 id={titleId} className="t-h3 mt-6">
            {post.title}
          </h3>
          <p className="mt-4 line-clamp-3 text-[0.9375rem] text-muted">{post.excerpt}</p>
        </div>
        <span className="flex items-center justify-between border-t border-line pt-5 text-[0.9375rem]">
          <span className="text-muted">By {post.author}</span>
          <span className="grid size-10 place-items-center rounded-full text-fg ring-1 ring-line-strong transition-[transform,box-shadow] duration-300 ease-ui group-hover:translate-x-0.5 group-hover:ring-gold" aria-hidden>
            <ArrowIcon />
          </span>
        </span>
      </Link>
    </li>
  );
}
