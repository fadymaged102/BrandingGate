"use client";

import { Environment, Lightformer, PerformanceMonitor } from "@react-three/drei";
import { Canvas, useFrame, useLoader } from "@react-three/fiber";
import { easing } from "maath";
import { Suspense, useEffect, useMemo, useRef, useState } from "react";
import * as THREE from "three";
import { SVGLoader } from "three/examples/jsm/loaders/SVGLoader.js";
import { toCreasedNormals } from "three/examples/jsm/utils/BufferGeometryUtils.js";
import { GateCurve } from "@/components/three/gate";

/**
 * Layout measured from the 1563px logo file, in units of the arch radius
 * (338px there). The arch spans -35 to 215 degrees, the site's gate sweep.
 * The SVGs are traces of that file: the monogram at 2x, the wordmark at 3x.
 */
const ARCH_RADIUS_PX = 338;
/**
 * Depths are in logo units, sized like a fabricated sign: letters a little
 * deeper than their thinnest strokes, so the thin serifs of the wordmark stay
 * legible as the mark turns.
 */
const PARTS = {
  monogram: { url: "/brand/monogram.svg", scale: 1 / (2 * ARCH_RADIUS_PX), at: [0.01, 0.041], depth: 0.055 },
  wordmark: { url: "/brand/wordmark.svg", scale: 1 / (3 * ARCH_RADIUS_PX), at: [-0.047, -0.815], depth: 0.028 },
} as const;
const ARCH_TUBE = 0.035;

/** Turns sharper than this are real corners (serifs, stems) and stay crisp. */
const CORNER = THREE.MathUtils.degToRad(28);
/** Side normals blend across edges flatter than this, so curved returns shade smoothly. */
const CREASE = THREE.MathUtils.degToRad(32);

/**
 * The SVGs are traces, so their outlines carry small kinks where one traced
 * segment meets the next. Resample each outline evenly, then relax every
 * point that is not a real corner towards its neighbours. Straight runs stay
 * straight (averaging collinear points moves nothing) and corners keep their
 * points; only the trace wobble is ironed out.
 */
function relax(outline: THREE.Vector2[], spacing: number, passes = 3): THREE.Vector2[] {
  const src = outline.slice();
  if (src.length > 2 && src[0].distanceTo(src[src.length - 1]) < 1e-6) src.pop();
  // Even spacing first, so a point beside a long straight edge is not dragged along it.
  let pts: THREE.Vector2[] = [];
  for (let i = 0; i < src.length; i++) {
    const a = src[i];
    const b = src[(i + 1) % src.length];
    const steps = Math.max(1, Math.ceil(a.distanceTo(b) / spacing));
    for (let s = 0; s < steps; s++) pts.push(a.clone().lerp(b, s / steps));
  }
  const n = pts.length;
  if (n < 4) return src;
  const isCorner = pts.map((p, i) => {
    const a = pts[(i - 1 + n) % n];
    const c = pts[(i + 1) % n];
    const v1 = p.clone().sub(a);
    const v2 = c.clone().sub(p);
    const l = v1.length() * v2.length();
    return l > 0 && Math.acos(THREE.MathUtils.clamp(v1.dot(v2) / l, -1, 1)) > CORNER;
  });
  for (let k = 0; k < passes; k++) {
    pts = pts.map((p, i) =>
      isCorner[i]
        ? p
        : new THREE.Vector2(
            0.25 * pts[(i - 1 + n) % n].x + 0.5 * p.x + 0.25 * pts[(i + 1) % n].x,
            0.25 * pts[(i - 1 + n) % n].y + 0.5 * p.y + 0.25 * pts[(i + 1) % n].y,
          ),
    );
  }
  return pts;
}

/**
 * The front and back faces (material group 0) must stay perfectly flat: every
 * vertex of a face lies on its outline, so blended normals would bleed the
 * bevel's curvature across the whole face as blotches.
 */
function flattenFaces(geo: THREE.BufferGeometry) {
  const pos = geo.attributes.position;
  const nrm = geo.attributes.normal;
  const a = new THREE.Vector3();
  const b = new THREE.Vector3();
  const c = new THREE.Vector3();
  for (const g of geo.groups) {
    if (g.materialIndex !== 0) continue;
    for (let i = g.start; i < g.start + g.count; i += 3) {
      a.fromBufferAttribute(pos, i);
      b.fromBufferAttribute(pos, i + 1);
      c.fromBufferAttribute(pos, i + 2);
      const n = c.sub(b).cross(a.sub(b)).normalize();
      for (let k = 0; k < 3; k++) nrm.setXYZ(i + k, n.x, n.y, n.z);
    }
  }
  nrm.needsUpdate = true;
}

/** Turns a traced SVG into a solid, softly bevelled piece centred on its own middle (depth included), so it spins true. */
function useSolid(url: string, scale: number, depth: number) {
  const data = useLoader(SVGLoader, url);
  const geometry = useMemo(() => {
    const unit = 1 / scale; // SVG units per logo unit
    // About 3px of the original artwork: dense enough for smooth curves,
    // sparse enough that the bevel never folds over itself on tight turns.
    const spacing = 0.009 * unit;
    const shapes = data.paths
      .flatMap((p) => SVGLoader.createShapes(p))
      .map((shape) => {
        const { shape: outline, holes } = shape.extractPoints(12);
        const smooth = new THREE.Shape(relax(outline, spacing));
        smooth.holes = holes.map((h) => new THREE.Path(relax(h, spacing)));
        return smooth;
      });
    const extruded = new THREE.ExtrudeGeometry(shapes, {
      depth: depth * unit,
      bevelEnabled: true,
      // A small rounded edge: real fabricated letters are never knife-sharp,
      // and the rounding is what catches a thin line of light.
      bevelThickness: 0.005 * unit,
      bevelSize: 0.0016 * unit,
      bevelSegments: 4,
    });
    // SVG y runs down; flip into three's y-up and scale to logo units.
    extruded.scale(scale, -scale, scale);
    extruded.center();
    // Smooth shading along curved sides, crisp where the outline turns a corner.
    const geo = toCreasedNormals(extruded, CREASE);
    flattenFaces(geo);
    return geo;
  }, [data, scale, depth]);
  useEffect(() => () => geometry.dispose(), [geometry]);
  return geometry;
}

/**
 * Built like a real sign: an off-white lacquered face with a clear coat, on
 * polished metal returns. Both are lit, so the face brightens and dims and a
 * highlight runs across it as the mark turns.
 */
function Solid({ part }: { part: (typeof PARTS)[keyof typeof PARTS] }) {
  const geometry = useSolid(part.url, part.scale, part.depth);
  return (
    <mesh geometry={geometry} position={[part.at[0], part.at[1], 0]}>
      <meshPhysicalMaterial
        attach="material-0"
        color="#ffffff"
        roughness={0.38}
        metalness={0}
        clearcoat={1}
        clearcoatRoughness={0.12}
      />
      {/* Satin rather than mirror: a mirror return only reflects the dark
          studio, which reads as a grainy black outline at this size. */}
      <meshPhysicalMaterial attach="material-1" color="#e4e7f0" metalness={1} roughness={0.3} />
    </mesh>
  );
}

function Arch() {
  const geometry = useMemo(() => new THREE.TubeGeometry(new GateCurve(1), 320, ARCH_TUBE, 40, false), []);
  const caps = useMemo(() => {
    const curve = new GateCurve(1);
    return [curve.getPoint(0), curve.getPoint(1)];
  }, []);
  useEffect(() => () => geometry.dispose(), [geometry]);
  // Polished gold: a metal's colour is its reflection, so the base sits a
  // touch above the brand gold to read as #C8902A once lit.
  const gold = <meshPhysicalMaterial color="#d9a443" metalness={1} roughness={0.2} />;
  return (
    <group>
      <mesh geometry={geometry}>{gold}</mesh>
      {caps.map((p, i) => (
        <mesh key={i} position={p}>
          <sphereGeometry args={[ARCH_TUBE, 40, 24]} />
          {gold}
        </mesh>
      ))}
    </group>
  );
}

function Logo({ spinning }: { spinning: boolean }) {
  const spin = useRef<THREE.Group>(null!);
  const lean = useRef<THREE.Group>(null!);
  const pointer = useRef(new THREE.Vector2());

  useEffect(() => {
    const onMove = (e: PointerEvent) => {
      pointer.current.set((e.clientX / window.innerWidth) * 2 - 1, (e.clientY / window.innerHeight) * 2 - 1);
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    return () => window.removeEventListener("pointermove", onMove);
  }, []);

  useFrame((_, delta) => {
    // About 20 seconds a turn: slow enough to read the monogram as it passes.
    if (spinning) spin.current.rotation.y += Math.min(delta, 0.1) * 0.31;
    easing.damp(lean.current.rotation, "x", pointer.current.y * 0.12, 0.5, delta);
    easing.damp(lean.current.rotation, "z", -pointer.current.x * 0.05, 0.5, delta);
  });

  return (
    // Lifted so the whole mark, arch top to wordmark foot, sits centred in frame.
    <group ref={lean} position={[0, -0.02, 0]}>
      <group ref={spin} rotation={[0, -0.5, 0]}>
        <Arch />
        <Suspense fallback={null}>
          <Solid part={PARTS.monogram} />
          <Solid part={PARTS.wordmark} />
        </Suspense>
      </group>
    </group>
  );
}

type Props = { active: boolean; spinning: boolean; onReady: () => void };

export default function LogoScene({ active, spinning, onReady }: Props) {
  const [dpr, setDpr] = useState(1.75);
  return (
    <Canvas
      frameloop={active ? "always" : "never"}
      dpr={[1, dpr]}
      camera={{ position: [0, 0, 5.2], fov: 30, near: 0.1, far: 20 }}
      // AgX keeps metal highlights from clipping to flat white the way a camera would.
      gl={{ antialias: true, alpha: true, powerPreference: "high-performance", toneMapping: THREE.AgXToneMapping, toneMappingExposure: 1.3 }}
      onCreated={() => onReady()}
      aria-hidden
    >
      <PerformanceMonitor onDecline={() => setDpr(1)} onIncline={() => setDpr(1.75)} />
      <Logo spinning={spinning} />
      {/* A neutral product-photography studio: overhead softbox, a broad soft
          front fill behind the camera, two strip lights for edge highlights,
          and a dim navy floor so the metal reflects the page it sits on. */}
      <Environment resolution={512} frames={1}>
        <color attach="background" args={["#1b2140"]} />
        <Lightformer form="rect" intensity={3} position={[0, 5, 1]} rotation-x={Math.PI / 2} scale={[8, 3, 1]} />
        <Lightformer form="rect" intensity={4} position={[0, 0.6, 8]} scale={[10, 6, 1]} />
        <Lightformer form="rect" intensity={2.2} position={[-6, 0.5, 1]} rotation-y={Math.PI / 2} scale={[0.6, 7, 1]} />
        <Lightformer form="rect" intensity={1.6} position={[6, 0.5, -1]} rotation-y={-Math.PI / 2} scale={[0.6, 7, 1]} />
        <Lightformer form="rect" intensity={0.5} color="#2a3778" position={[0, -4, 2]} rotation-x={-Math.PI / 2} scale={[10, 6, 1]} />
      </Environment>
    </Canvas>
  );
}
