"use client";

import gsap from "gsap";
import { CustomEase } from "gsap/CustomEase";
import { Flip } from "gsap/Flip";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(useGSAP, ScrollTrigger, Flip, SplitText, CustomEase);
// Optional decorative targets (e.g. the SVG arch fallback) may be absent.
gsap.config({ nullTargetWarn: false });

// Named curves shared with the CSS tokens in globals.css.
CustomEase.create("reveal", "0.16, 1, 0.3, 1");
CustomEase.create("ui", "0.25, 1, 0.5, 1");
CustomEase.create("morph", "0.65, 0, 0.35, 1");

export const DURATION = {
  hover: 0.16,
  press: 0.12,
  filter: 0.5,
  expand: 0.7,
  repaint: 0.8,
  reveal: 0.9,
} as const;

export { gsap, Flip, ScrollTrigger, SplitText, useGSAP };
