"use client";

import Image from "next/image";
import { useId, useRef, useState } from "react";
import { gsap, ScrollTrigger, useGSAP } from "@/lib/gsap";
import type { CaseProject } from "@/lib/projects";
import { PhoneFrame, ScreenFrame } from "@/components/ui/Frames";

/**
 * The frame (LED panel or phone) stays pinned while the story steps scroll
 * past it; each step swaps the picture inside. On small screens and with
 * reduced motion the steps simply stack, each with its own picture.
 */
export function PinnedStory({ project }: { project: CaseProject }) {
  const titleId = useId();
  const root = useRef<HTMLElement>(null);
  const [active, setActive] = useState(0);
  const phone = project.frame === "phone";

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add("(min-width: 1024px) and (prefers-reduced-motion: no-preference)", () => {
        const steps = gsap.utils.toArray<HTMLElement>("[data-step]");
        steps.forEach((step, i) => {
          ScrollTrigger.create({
            trigger: step,
            start: "top 60%",
            end: "bottom 60%",
            onToggle: (self) => self.isActive && setActive(i),
          });
        });
        // Hairline that fills as you move through the story.
        gsap.fromTo(
          "[data-story-progress]",
          { scaleY: 0 },
          {
            scaleY: 1,
            ease: "none",
            scrollTrigger: { trigger: "[data-steps]", start: "top 60%", end: "bottom 60%", scrub: true },
          },
        );
      });
      return () => mm.revert();
    },
    { scope: root },
  );

  const Frame = phone ? PhoneFrame : ScreenFrame;

  return (
    <section ref={root} aria-labelledby={titleId} className="shell py-24 md:py-36">
      <h2 id={titleId} className="t-meta text-muted">
        How it came together
      </h2>

      <div className="mt-10 lg:grid lg:grid-cols-12 lg:gap-12">
        {/* Pinned frame (desktop) */}
        <div className="hidden lg:col-span-7 lg:col-start-6 lg:row-start-1 lg:block motion-reduce:lg:hidden">
          <div className="sticky top-[12vh] flex h-[76vh] items-center justify-center">
            <div className={phone ? "h-full" : "aspect-video w-full"}>
              <Frame>
                {project.steps.map((s, i) => (
                  <Image
                    key={s.still.src}
                    src={s.still.src}
                    alt={i === active ? s.still.alt : ""}
                    aria-hidden={i !== active}
                    fill
                    sizes={phone ? "30vw" : "55vw"}
                    className="object-cover transition-[opacity,transform] duration-700 ease-out-expo motion-reduce:transition-none"
                    style={{
                      opacity: i === active ? 1 : 0,
                      transform: i === active ? "scale(1)" : "scale(1.04)",
                    }}
                  />
                ))}
              </Frame>
            </div>
          </div>
        </div>

        {/* Steps */}
        <ol data-steps className="relative lg:col-span-5 lg:col-start-1 lg:row-start-1">
          <span aria-hidden className="absolute bottom-0 left-0 top-0 hidden w-px bg-line lg:block" />
          <span
            data-story-progress
            aria-hidden
            className="absolute bottom-0 left-0 top-0 hidden w-px origin-top bg-gold lg:block motion-reduce:lg:hidden"
          />
          {project.steps.map((s, i) => (
            <li
              key={s.label}
              data-step
              aria-current={i === active ? "step" : undefined}
              className="group flex flex-col justify-center py-10 lg:min-h-[72vh] lg:py-0 lg:pl-10 motion-reduce:lg:min-h-0 motion-reduce:lg:py-10"
            >
              <p className="t-meta text-faint transition-colors duration-500 group-aria-[current=step]:text-gold">
                {String(i + 1).padStart(2, "0")}
              </p>
              <h3 className="t-h3 mt-3 transition-opacity duration-500 lg:opacity-55 lg:group-aria-[current=step]:opacity-100 motion-reduce:lg:opacity-100">
                {s.label}
              </h3>
              <p className="mt-3 max-w-[38ch] text-muted">
                {s.caption}
              </p>
              {/* Inline picture for stacked layouts */}
              <div className={`relative mt-6 overflow-hidden rounded-2xl bg-navy-900 lg:hidden motion-reduce:lg:block ${phone ? "mx-auto aspect-[9/16] w-[min(100%,22rem)]" : "aspect-video"}`}>
                <Image
                  src={s.still.src}
                  alt={s.still.alt}
                  fill
                  sizes={phone ? "(min-width: 768px) 22rem, 90vw" : "(min-width: 1024px) 40vw, 100vw"}
                  className="object-cover"
                />
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
