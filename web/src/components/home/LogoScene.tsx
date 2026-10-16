"use client";

import { Environment, Lightformer, PerformanceMonitor } from "@react-three/drei";
import { Canvas, useFrame, useLoader } from "@react-three/fiber";
import { easing } from "maath";
import { Suspense, useEffect, useMemo, useRef, useState } from "react";
import * as THREE from "three";
import { SVGLoader } from "three/examples/jsm/loaders/SVGLoader.js";
import { GateCurve } from "@/components/three/gate";

/**
 * Layout measured from the 1563px logo file, in units of the arch radius
 * (338px there). The arch spans -35 to 215 degrees, the site's gate sweep.
 * The SVGs are traces of that file: the monogram at 2x, the wordmark at 3x.
 */
const ARCH_RADIUS_PX = 338;
const PARTS = {
  monogram: { url: "/brand/monogram.svg", scale: 1 / (2 * ARCH_RADIUS_PX), at: [0.01, 0.041], depth: 0.08 },
  wordmark: { url: "/brand/wordmark.svg", scale: 1 / (3 * ARCH_RADIUS_PX), at: [-0.047, -0.815], depth: 0.05 },
} as const;
const ARCH_TUBE = 0.035;

/** Turns a traced SVG into a solid, bevelled piece centred on its own middle (depth included), so it spins true. */
function useSolid(url: string, scale: number, depth: number) {
  const data = useLoader(SVGLoader, url);
  const geometry = useMemo(() => {
    const shapes = data.paths.flatMap((p) => SVGLoader.createShapes(p));
    const unit = 1 / scale; // SVG units per logo unit
    const geo = new THREE.ExtrudeGeometry(shapes, {
      depth: depth * unit,
      bevelEnabled: true,
      bevelThickness: 0.025 * unit,
      bevelSize: 0.006 * unit,
      bevelSegments: 4,
      curveSegments: 12,
    });
    // SVG y runs down; flip into three's y-up and scale to logo units.
    geo.scale(scale, -scale, scale);
    geo.center();
    geo.computeVertexNormals();
    return geo;
  }, [data, scale, depth]);
  useEffect(() => () => geometry.dispose(), [geometry]);
  return geometry;
}

/** Faces flat in the logo's off-white, as printed; the deep bevelled sides catch the light like polished metal. */
function Solid({ part }: { part: (typeof PARTS)[keyof typeof PARTS] }) {
  const geometry = useSolid(part.url, part.scale, part.depth);
  return (
    <mesh geometry={geometry} position={[part.at[0], part.at[1], 0]}>
      <meshBasicMaterial attach="material-0" color="#f8f8ff" toneMapped={false} />
      <meshStandardMaterial attach="material-1" color="#dfe3f5" metalness={0.85} roughness={0.25} />
    </mesh>
  );
}

function Arch() {
  const geometry = useMemo(() => new THREE.TubeGeometry(new GateCurve(1), 220, ARCH_TUBE, 24, false), []);
  const caps = useMemo(() => {
    const curve = new GateCurve(1);
    return [curve.getPoint(0), curve.getPoint(1)];
  }, []);
  useEffect(() => () => geometry.dispose(), [geometry]);
  const gold = <meshStandardMaterial color="#c8902a" metalness={1} roughness={0.22} />;
  return (
    <group>
      <mesh geometry={geometry}>{gold}</mesh>
      {caps.map((p, i) => (
        <mesh key={i} position={p}>
          <sphereGeometry args={[ARCH_TUBE, 24, 16]} />
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
      gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
      onCreated={() => onReady()}
      aria-hidden
    >
      <PerformanceMonitor onDecline={() => setDpr(1)} onIncline={() => setDpr(1.75)} />
      <Logo spinning={spinning} />
      <Environment resolution={256} frames={1}>
        <Lightformer intensity={2.6} position={[0, 4, 2]} scale={[10, 1.4, 1]} />
        <Lightformer intensity={1.4} position={[-5, 0, 1]} rotation-y={Math.PI / 2} scale={[6, 3, 1]} />
        <Lightformer intensity={1.8} color="#e6b24e" position={[5, -1, 1]} rotation-y={-Math.PI / 2} scale={[4, 2, 1]} />
        <Lightformer intensity={0.9} color="#3a5bd9" position={[0, -3, 3]} rotation-x={-Math.PI / 2} scale={[8, 4, 1]} />
      </Environment>
    </Canvas>
  );
}
