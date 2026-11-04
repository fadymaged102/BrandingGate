"use client";

import * as THREE from "three";

/** Arc that mirrors the logo: a gate open at the bottom, 250 degrees of sweep. */
export const ARC_START = THREE.MathUtils.degToRad(-35);
export const ARC_END = THREE.MathUtils.degToRad(215);
export const RADIUS = 1.55;

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
