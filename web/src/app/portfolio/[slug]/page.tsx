import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { caseProjects, getCase, getNextCase } from "@/lib/projects";
import { CaseAtmosphere } from "@/components/case/CaseAtmosphere";
import { CaseHero } from "@/components/case/CaseHero";
import { PinnedStory } from "@/components/case/PinnedStory";
import { BeforeAfter } from "@/components/case/BeforeAfter";
import { Brief, Film, Gallery, NextProject } from "@/components/case/Sections";
import { PageTransition } from "@/components/PageTransition";

export function generateStaticParams() {
  return caseProjects.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: PageProps<"/portfolio/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const project = getCase(slug);
  if (!project) return {};
  return {
    title: project.title,
    description: project.summary,
    alternates: { canonical: `/portfolio/${project.slug}` },
    openGraph: { title: project.title, description: project.summary, images: [project.cover.src] },
  };
}

export default function CasePage({ params }: PageProps<"/portfolio/[slug]">) {
  return (
    <PageTransition>
      <Suspense fallback={<div className="min-h-dvh" aria-busy="true" />}>
        <CaseContent params={params} />
      </Suspense>
    </PageTransition>
  );
}

async function CaseContent({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const project = getCase(slug);
  if (!project) notFound();
  const next = getNextCase(slug);
  const portrait = project.frame === "phone";

  return (
    <article data-case={project.slug}>
      <CaseAtmosphere slug={project.slug} accent={project.accent} base={project.base} />
      <CaseHero project={project} />
      <Brief project={project} />
      <PinnedStory project={project} />
      {project.compare && <BeforeAfter compare={project.compare} accent={project.secondaryAccent} />}
      <Gallery stills={project.gallery} portrait={portrait} />
      {project.film && <Film youtubeId={project.film.youtubeId} title={project.film.title} poster={project.cover} />}
      <NextProject next={next} />
    </article>
  );
}
