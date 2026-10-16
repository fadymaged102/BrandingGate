"use client";

import Image from "next/image";
import { useEffect, useRef, useState, type ReactNode } from "react";
import type { Frame, Still } from "@/lib/projects";

type MediaProps = {
  still: Still;
  loop?: string;
  /** Play the loop (hover, expansion, in view). The source loads on first play. */
  playing?: boolean;
  sizes: string;
  priority?: boolean;
  focus?: string;
  className?: string;
};

/** Still image with an optional muted loop that fades in over it. */
export function Media({ still, loop, playing = false, sizes, priority, focus, className = "" }: MediaProps) {
  const video = useRef<HTMLVideoElement>(null);
  const [armed, setArmed] = useState(false);
  const [showVideo, setShowVideo] = useState(false);

  // The loop's source is only attached once it is first asked to play.
  if (playing && loop && !armed) setArmed(true);

  useEffect(() => {
    const v = video.current;
    if (!v) return;
    if (playing) {
      v.play().catch(() => {
        /* Autoplay can be refused (data saver); the still stays visible. */
      });
    } else {
      v.pause();
    }
  }, [playing, loop, armed]);

  return (
    <div data-media-inner className={`absolute inset-0 ${className}`}>
      <Image
        src={still.src}
        alt={still.alt}
        fill
        sizes={sizes}
        priority={priority}
        className="object-cover"
        style={{ objectPosition: focus }}
      />
      {loop && armed && (
        <video
          ref={video}
          src={loop}
          muted
          loop
          playsInline
          preload="auto"
          aria-hidden
          onPlaying={() => setShowVideo(true)}
          className="absolute inset-0 h-full w-full object-cover transition-opacity duration-500 ease-ui"
          style={{ opacity: showVideo && playing ? 1 : 0, objectPosition: focus }}
        />
      )}
    </div>
  );
}

/** A stage LED panel: hairline bezel and a faint top reflection. */
export function ScreenFrame({ children, className = "" }: { children: ReactNode; className?: string }) {
  return (
    <div
      className={`relative h-full w-full rounded-[clamp(10px,1.2vw,18px)] bg-[#080b1a] p-[clamp(4px,0.45vw,7px)] shadow-[0_30px_80px_-30px_rgb(0_0_0/0.8),inset_0_0_0_1px_var(--line-strong)] ${className}`}
    >
      <div className="relative h-full w-full overflow-hidden rounded-[clamp(7px,0.85vw,12px)] bg-navy-900">
        {children}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 bg-[linear-gradient(170deg,rgb(255_255_255/0.07),transparent_32%)]"
        />
      </div>
    </div>
  );
}

/** A phone for vertical footage. Height-driven so it fits any stage. */
export function PhoneFrame({ children, className = "" }: { children: ReactNode; className?: string }) {
  return (
    <div
      className={`relative aspect-[9/19.2] h-full max-w-full rounded-[clamp(1.6rem,3.2vw,2.75rem)] bg-[#0d0d10] p-[clamp(6px,0.7vw,10px)] shadow-[0_40px_90px_-30px_rgb(0_0_0/0.9),inset_0_0_0_1px_rgb(255_255_255/0.14),inset_0_0_0_3px_#1b1b20] ${className}`}
    >
      <div className="relative h-full w-full overflow-hidden rounded-[clamp(1.2rem,2.6vw,2.2rem)] bg-black">
        {children}
        <span
          aria-hidden
          className="absolute left-1/2 top-[1.6%] z-10 h-[3.2%] w-[30%] -translate-x-1/2 rounded-full bg-black"
        />
      </div>
    </div>
  );
}

type FramedProps = MediaProps & { frame: Frame; backdrop?: boolean };

/**
 * Picks the frame that fits the asset: LED panel for 16:9 footage, phone for
 * vertical, nothing for renders and stills that are already composed.
 */
export function FramedMedia({ frame, backdrop = true, ...media }: FramedProps) {
  if (frame === "phone" && !backdrop) {
    return (
      <div className="absolute inset-0">
        <PhoneFrame className="!h-full !w-full">
          <Media {...media} />
        </PhoneFrame>
      </div>
    );
  }
  if (frame === "phone") {
    return (
      <div className="absolute inset-0 grid place-items-center overflow-hidden bg-black">
        {backdrop && (
          <Image
            src={media.still.src}
            alt=""
            fill
            sizes="40vw"
            className="scale-110 object-cover opacity-40 blur-2xl"
          />
        )}
        <div className="relative h-[92%]">
          <PhoneFrame>
            <Media {...media} />
          </PhoneFrame>
        </div>
      </div>
    );
  }
  if (frame === "screen") {
    return (
      <div className="absolute inset-0">
        <ScreenFrame>
          <Media {...media} />
        </ScreenFrame>
      </div>
    );
  }
  return <Media {...media} />;
}
