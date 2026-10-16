import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { PageTransition } from "@/components/PageTransition";
import { Article } from "@/components/blog/Article";
import { getPost, posts } from "@/lib/posts";

const newestFirst = [...posts].sort((a, b) => b.date.localeCompare(a.date));

export function generateStaticParams() {
  return posts.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: PageProps<"/blog/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const post = getPost(slug);
  if (!post) return {};
  return {
    title: post.title,
    description: post.excerpt,
    alternates: { canonical: `/blog/${post.slug}` },
    openGraph: { type: "article", title: post.title, description: post.excerpt, publishedTime: post.date },
  };
}

export default function PostPage({ params }: PageProps<"/blog/[slug]">) {
  return (
    <PageTransition>
      <Suspense fallback={<div className="min-h-dvh" aria-busy="true" />}>
        <PostContent params={params} />
      </Suspense>
    </PageTransition>
  );
}

async function PostContent({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = getPost(slug);
  if (!post) notFound();
  const i = newestFirst.findIndex((p) => p.slug === slug);
  const next = newestFirst.length > 1 ? newestFirst[(i + 1) % newestFirst.length] : null;
  return <Article post={post} next={next} />;
}
