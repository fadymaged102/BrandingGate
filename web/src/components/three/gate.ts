"use client";

import { useMemo } from "react";
import * as THREE from "three";
import { mergeGeometries } from "three/examples/jsm/utils/BufferGeometryUtils.js";

/** Arc that mirrors the logo: a gate open at the bottom, 250 degrees of sweep. */
export const ARC_START = THREE.MathUtils.degToRad(-35);
export const ARC_END = THREE.MathUtils.degToRad(215);
export const RADIUS = 1.55;
export const TUBE = 0.15;

export class GateCurve extends THREE.Curve<THREE.Vector3> {
  radius: number;

  constructor(radius = RADIUS) {
    super();
    this.radius = radius;
  }

  getPoint(t: number, target = new THREE.Vector3()) {
    const a = ARC_START + t * (ARC_END - ARC_START);
    return target.set(Math.cos(a) * this.radius, Math.sin(a) * this.radius, 0);
  }
}

export const smooth = (edge0: number, edge1: number, x: number) =>
  THREE.MathUtils.smoothstep(x, edge0, edge1);

/** The glass gate with rounded ends, plus the gold filament that runs through it. */
export function useGateGeometry() {
  return useMemo(() => {
    const curve = new GateCurve();
    const tube = new THREE.TubeGeometry(curve, 240, TUBE, 48, false);
    // Round the open ends so the glass reads as one cast piece.
    const caps = [0, 1].map((t) => {
      const cap = new THREE.SphereGeometry(TUBE, 48, 24);
      const p = curve.getPoint(t);
      cap.translate(p.x, p.y, p.z);
      return cap;
    });
    const merged = mergeGeometries([tube, ...caps], false);
    tube.dispose();
    caps.forEach((c) => c.dispose());
    const filament = new THREE.TubeGeometry(curve, 320, 0.008, 8, false);
    return { gate: merged, filament };
  }, []);
}
