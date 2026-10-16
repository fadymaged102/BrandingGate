"use client";

import Link from "next/link";
import { useId, useRef } from "react";
import { gsap, useGSAP } from "@/lib/gsap";
import { CATEGORIES, formatDate, readingMinutes, type Block, type Post } from "@/lib/posts";
import { RevealText } from "@/components/ui/RevealText";
import { ArrowIcon, PillLink } from "@/components/ui/Buttons";
import { ReadingArch } from "./ReadingArch";

/** A post set for reading: one measure, generous leading, progress on the arch. */
export function Article({ post, next }: { post: Post; next: Post | null }) {
  const titleId = useId();
  const root = useRef<HTMLElement>(null);
  const body = useRef<HTMLDivElement>(null);
  const category = CATEGORIES.find((c) => c.id === post.category)?.label;

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        gsap.from("[data-post-meta] > *", { y: 12, opacity: 0, duration: 0.8, ease: "reveal", stagger: 0.05, delay: 0.3 });
        gsap.from("[data-post-body] > *", {
          y: 24,
          opacity: 0,
          duration: 0.9,
          ease: "reveal",
          stagger: 0.04,
          delay: 0.45,
          clearProps: "transform,opacity",
        });
      });
      return () => mm.revert();
    },
    { scope: root },
  );

  return (
    <article ref={root} aria-labelledby={titleId}>
      <header className="shell pb-14 pt-[calc(var(--header-h)+clamp(3rem,10vh,7rem))] md:pb-20">
        <div className="mx-auto max-w-[40rem]">
          <Link
            href="/blog"
            className="t-meta inline-flex min-h-11 items-center gap-2 text-muted transition-colors duration-150 hover:text-fg"
          >
            <span className="rotate-180">
              <ArrowIcon />
            </span>
            All posts
          </Link>
          <p className="t-meta mt-10 flex items-center gap-3 text-muted">
            <span className="inline-block h-px w-8 bg-gold" aria-hidden />
            {category}
          </p>
          <RevealText as="h1" id={titleId} trigger="mount" delay={0.1} className="t-d2 mt-6">
            {post.title}
          </RevealText>
          <dl data-post-meta className="mt-10 grid grid-cols-3 gap-6 border-t border-line pt-6 text-[0.9375rem]">
            <div>
              <dt className="t-meta text-faint">Author</dt>
              <dd className="mt-1.5 text-muted">{post.author}</dd>
            </div>
            <div>
              <dt className="t-meta text-faint">Published</dt>
              <dd className="mt-1.5 text-muted">
                <time dateTime={post.date}>{formatDate(post.date)}</time>
              </dd>
            </div>
            <div>
              <dt className="t-meta text-faint">Reading time</dt>
              <dd className="mt-1.5 text-muted">{readingMinutes(post)} min</dd>
            </div>
          </dl>
        </div>
      </header>

      <div className="shell pb-24 md:pb-36">
        <div ref={body} data-post-body className="mx-auto max-w-[40rem] text-[1.125rem] leading-[1.75] text-fg/85">
          {post.body.map((b, i) => (
            <BlockView key={i} block={b} />
          ))}
        </div>
      </div>

      {next && (
        <nav aria-label="Next post" className="border-t border-line">
          <Link href={`/blog/${next.slug}`} className="group block">
            <div className="shell grid gap-8 py-20 md:grid-cols-12 md:items-end md:py-28">
              <div className="md:col-span-8">
                <p className="t-meta text-muted">Next post</p>
                <p className="t-d2 mt-5 max-w-[20ch]">{next.title}</p>
              </div>
              <span className="inline-flex w-fit items-center gap-3 rounded-full bg-fg py-3 pl-6 pr-3 font-medium text-ink transition-transform duration-150 ease-ui group-active:scale-[0.97] md:col-span-4 md:justify-self-end">
                Read next
                <span className="grid size-8 place-items-center rounded-full bg-ink text-fg transition-transform duration-300 ease-ui group-hover:translate-x-0.5">
                  <ArrowIcon />
                </span>
              </span>
            </div>
          </Link>
        </nav>
      )}

      <ReadingArch article={body} />
    </article>
  );
}

function BlockView({ block }: { block: Block }) {
  switch (block.type) {
    case "p":
      return <p className="mt-6 text-pretty first:mt-0">{block.text}</p>;
    case "h2":
      return <h2 className="t-h3 mt-16 text-fg">{block.text}</h2>;
    case "h3":
      return <h3 className="mt-12 font-display text-[1.25rem] font-medium tracking-[-0.01em] text-fg">{block.text}</h3>;
    case "list":
      return (
        <ul className="mt-6 space-y-3">
          {block.items.map((item) => (
            <li key={item} className="relative pl-6 text-pretty">
              <span aria-hidden className="absolute left-0 top-[0.85em] h-px w-3 bg-line-strong" />
              {item}
            </li>
          ))}
        </ul>
      );
    case "facts":
      return (
        <dl className="mt-5 grid gap-px overflow-hidden rounded-2xl bg-line ring-1 ring-line sm:grid-cols-[9rem_1fr]">
          {block.items.map((f) => (
            <div key={f.label} className="contents">
              <dt className="t-meta bg-ink px-5 pt-4 text-faint sm:py-4">{f.label}</dt>
              <dd className="bg-ink px-5 pb-4 text-[1rem] leading-relaxed sm:py-4">{f.value}</dd>
            </div>
          ))}
        </dl>
      );
    case "link":
      return (
        <p className="mt-10">
          <PillLink href={block.href} external direction="out" variant="ghost">
            {block.label}
          </PillLink>
        </p>
      );
  }
}
