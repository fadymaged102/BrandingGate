import type { Metadata } from "next";
import { useId } from "react";
import { PageTransition } from "@/components/PageTransition";
import { BlogIndex } from "@/components/blog/BlogIndex";
import { Eyebrow } from "@/components/ui/Buttons";
import { RevealText } from "@/components/ui/RevealText";
import { posts } from "@/lib/posts";

export const metadata: Metadata = {
  title: "Blog",
  description: "Notes from Branding Gate on social media, digital marketing and live events.",
  alternates: { canonical: "/blog" },
};

const newestFirst = [...posts].sort((a, b) => b.date.localeCompare(a.date));

export default function BlogPage() {
  const titleId = useId();
  return (
    <PageTransition>
      <header aria-labelledby={titleId} className="shell pb-16 pt-[calc(var(--header-h)+clamp(4rem,12vh,9rem))] md:pb-24">
        <Eyebrow>Blog</Eyebrow>
        <RevealText as="h1" id={titleId} trigger="mount" delay={0.1} className="t-d1 mt-8 max-w-[13ch]">
          Notes on social, digital and live events.
        </RevealText>
      </header>
      <BlogIndex posts={newestFirst} />
    </PageTransition>
  );
}
