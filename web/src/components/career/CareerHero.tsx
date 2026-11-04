"use client";

import Image from "next/image";
import { useId, useRef } from "react";
import { gsap, useGSAP } from "@/lib/gsap";
import { about } from "@/lib/site";
import { HEAD_OFFICE } from "@/lib/careers";
import { RevealText } from "@/components/ui/RevealText";
import { Eyebrow, PillLink } from "@/components/ui/Buttons";

/** Career intro (client copy, slide 15): the team photo leans in with scroll depth while the copy holds still. */
export function CareerHero() {
  const titleId = useId();
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        gsap.from("[data-career-meta] > *", { y: 16, opacity: 0, duration: 0.8, ease: "reveal", stagger: 0.06, delay: 0.4 });
        gsap.fromTo(
          "[data-career-photo]",
          { clipPath: "inset(10% 8% 10% 8% round 32px)", rotateY: -10, rotateX: 4 },
          { clipPath: "inset(0% 0% 0% 0% round 20px)", rotateY: 0, rotateX: 0, duration: 1.6, ease: "reveal", delay: 0.2 },
        );
        gsap.to("[data-career-photo] img", {
          yPercent: 8,
          scale: 1.08,
          ease: "none",
          scrollTrigger: { trigger: root.current, start: "top top", end: "bottom top", scrub: true },
        });
      });
      return () => mm.revert();
    },
    { scope: root },
  );

  return (
    <section ref={root} aria-labelledby={titleId} className="overflow-hidden">
      <div className="shell grid min-h-[min(100dvh,64rem)] items-center gap-12 pb-20 pt-[calc(var(--header-h)+3rem)] md:grid-cols-12 md:pb-24">
        <div className="md:col-span-6">
          <Eyebrow>Career. {HEAD_OFFICE}.</Eyebrow>
          <RevealText as="h1" id={titleId} trigger="mount" delay={0.1} className="t-d1 mt-8 max-w-[10ch]">
            Your Next Move Starts Here.
          </RevealText>
          <div data-career-meta>
            <p className="t-body-l mt-6 max-w-[44ch] text-pretty text-muted">
              Find the role that fits your talent, bring your ideas, and let&rsquo;s create something great together.
            </p>
            <div className="mt-10 flex flex-wrap gap-3">
              <PillLink href="#roles" direction="down">
                See open roles
              </PillLink>
              <PillLink href="/about" variant="ghost">
                Meet the studio
              </PillLink>
            </div>
          </div>
        </div>
        <div className="[perspective:1400px] md:col-span-6">
          <div
            data-career-photo
            className="relative aspect-[4/3] overflow-hidden rounded-[20px] bg-navy-900 will-change-transform md:aspect-[5/4]"
          >
            <Image
              src={about.team.src}
              alt={about.team.alt}
              fill
              priority
              sizes="(min-width: 768px) 46vw, 100vw"
              className="object-cover"
              style={{ objectPosition: about.team.focus }}
            />
          </div>
        </div>
      </div>
    </section>
  );
}
