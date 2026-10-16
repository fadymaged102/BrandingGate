"use client";

import { Environment, Float, Lightformer, PerformanceMonitor } from "@react-three/drei";
import { Canvas, useFrame } from "@react-three/fiber";
import { easing } from "maath";
import { useEffect, useMemo, useRef, useState, type ReactNode, type RefObject } from "react";
import * as THREE from "three";
import type { ValueId } from "@/lib/site";
import { GateCurve } from "@/components/three/gate";

type Props = {
  ids: ValueId[];
  /** Continuous position along the values, 0 to ids.length - 1. */
  position: RefObject<number>;
  active: boolean;
  onReady: () => void;
};

const STEP = (Math.PI * 2) / 6;
const RING = 3.4;

/**
 * One glass for all six artifacts. Built-in physical transmission shares a
 * single transmission pass, so six pieces cost one extra render, not six.
 */
function useGlass() {
  return useMemo(
    () =>
      new THREE.MeshPhysicalMaterial({
        color: "#ffffff",
        transmission: 1,
        thickness: 0.7,
        roughness: 0.06,
        ior: 1.36,
        clearcoat: 1,
        clearcoatRoughness: 0.08,
        attenuationColor: new THREE.Color("#c9d4ff"),
        attenuationDistance: 1.6,
        envMapIntensity: 1.2,
      }),
    [],
  );
}

/** Abstract forms after the original value marks. */
function Artifact({ id, glass }: { id: ValueId; glass: THREE.Material }) {
  const shapes: Record<ValueId, ReactNode> = {
    exceed: (
      <group rotation={[0, 0, -0.6]}>
        {[-0.45, 0, 0.45].map((x, i) => (
          <mesh key={x} position={[x, (i - 1) * 0.18, 0]} material={glass}>
            <boxGeometry args={[0.2, 0.9 + i * 0.35, 0.2]} />
          </mesh>
        ))}
      </group>
    ),
    part: (
      <group>
        <mesh material={glass}>
          <torusGeometry args={[0.85, 0.11, 16, 6]} />
        </mesh>
        <mesh material={glass} rotation={[0, 0, Math.PI / 6]}>
          <torusGeometry args={[0.45, 0.14, 16, 6]} />
        </mesh>
      </group>
    ),
    beyond: (
      <group rotation={[0, 0, -Math.PI / 4]}>
        {[-0.32, 0.32].map((x) => (
          <group key={x} position={[x, x * 0.4, 0]}>
            <mesh material={glass}>
              <cylinderGeometry args={[0.07, 0.07, 1.2, 24]} />
            </mesh>
            <mesh material={glass} position={[0, 0.72, 0]}>
              <coneGeometry args={[0.2, 0.36, 32]} />
            </mesh>
          </group>
        ))}
      </group>
    ),
    people: (
      <group>
        <mesh material={glass} position={[0, 0.35, 0]}>
          <sphereGeometry args={[0.32, 48, 32]} />
        </mesh>
        <mesh material={glass} position={[0, -0.55, 0]}>
          <torusGeometry args={[0.6, 0.14, 24, 64, Math.PI]} />
        </mesh>
      </group>
    ),
    thrive: (
      <group>
        <mesh material={glass} position={[-0.32, 0, 0]}>
          <torusGeometry args={[0.5, 0.13, 24, 64]} />
        </mesh>
        <mesh material={glass} position={[0.32, 0, 0]} rotation={[Math.PI / 2, 0, 0]}>
          <torusGeometry args={[0.5, 0.13, 24, 64]} />
        </mesh>
      </group>
    ),
    courage: (
      <group>
        <mesh material={glass} position={[-0.42, 0, 0]} rotation={[0, 0, Math.PI / 4]}>
          <octahedronGeometry args={[0.55, 0]} />
        </mesh>
        <mesh material={glass} position={[0.42, 0.1, 0.2]} rotation={[0.3, 0.4, Math.PI / 4]}>
          <octahedronGeometry args={[0.42, 0]} />
        </mesh>
      </group>
    ),
  };
  return <>{shapes[id]}</>;
}

/**
 * What the glass refracts: a lit disc that falls off to the page colour, and
 * the logo's gold arch standing behind the piece in front. Both are opaque so
 * the transmission pass picks them up.
 */
function Stage() {
  const { disc, arch } = useMemo(() => {
    const c = document.createElement("canvas");
    c.width = c.height = 256;
    const ctx = c.getContext("2d")!;
    const g = ctx.createRadialGradient(128, 128, 0, 128, 128, 128);
    g.addColorStop(0, "#1a2a7a");
    g.addColorStop(0.55, "#0c1b5e");
    g.addColorStop(1, "#050a24");
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, 256, 256);
    const texture = new THREE.CanvasTexture(c);
    texture.colorSpace = THREE.SRGBColorSpace;
    return { disc: texture, arch: new THREE.TubeGeometry(new GateCurve(1.25), 200, 0.012, 8, false) };
  }, []);

  useEffect(
    () => () => {
      disc.dispose();
      arch.dispose();
    },
    [disc, arch],
  );

  return (
    <>
      <mesh position={[0, 0, -3.2]}>
        <circleGeometry args={[4.2, 96]} />
        <meshBasicMaterial map={disc} toneMapped={false} />
      </mesh>
      <mesh geometry={arch} position={[0, 0.05, -1.3]}>
        <meshBasicMaterial color="#c8902a" toneMapped={false} />
      </mesh>
    </>
  );
}

function Carousel({ ids, position }: { ids: ValueId[]; position: RefObject<number> }) {
  const ring = useRef<THREE.Group>(null!);
  const items = useRef<(THREE.Group | null)[]>([]);
  const pointer = useRef(new THREE.Vector2());
  const glass = useGlass();

  useEffect(() => {
    const onMove = (e: PointerEvent) => {
      pointer.current.set((e.clientX / window.innerWidth) * 2 - 1, (e.clientY / window.innerHeight) * 2 - 1);
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    return () => window.removeEventListener("pointermove", onMove);
  }, []);

  useEffect(() => () => glass.dispose(), [glass]);

  useFrame((_, delta) => {
    const p = position.current ?? 0;
    // The ring turns so the current value faces the camera.
    easing.damp(ring.current.rotation, "y", -p * STEP, 0.3, delta);
    easing.damp(ring.current.rotation, "x", 0.12 + pointer.current.y * 0.06, 0.4, delta);
    easing.damp(ring.current.rotation, "z", -pointer.current.x * 0.04, 0.4, delta);

    items.current.forEach((g, i) => {
      if (!g) return;
      const near = 1 - Math.min(1, Math.abs(i - p));
      const k = 0.42 + near * 0.78;
      easing.damp(g.scale, "x", k, 0.25, delta);
      easing.damp(g.scale, "y", k, 0.25, delta);
      easing.damp(g.scale, "z", k, 0.25, delta);
    });
  });

  return (
    <group ref={ring} position={[0, -0.1, -RING]}>
      {ids.map((id, i) => (
        <group
          key={id}
          ref={(el) => {
            items.current[i] = el;
          }}
          position={[Math.sin(i * STEP) * RING, 0, Math.cos(i * STEP) * RING]}
          rotation={[0, i * STEP, 0]}
        >
          <Float speed={1.4} rotationIntensity={0.5} floatIntensity={0.6}>
            <Artifact id={id} glass={glass} />
          </Float>
        </group>
      ))}
    </group>
  );
}

export default function ValuesScene({ ids, position, active, onReady }: Props) {
  const [dpr, setDpr] = useState(1.75);
  return (
    <Canvas
      frameloop={active ? "always" : "never"}
      dpr={[1, dpr]}
      camera={{ position: [0, 0.2, 6], fov: 35, near: 0.1, far: 30 }}
      gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
      onCreated={() => onReady()}
      aria-hidden
    >
      <PerformanceMonitor onDecline={() => setDpr(1)} onIncline={() => setDpr(1.75)} />
      <Stage />
      <Carousel ids={ids} position={position} />
      <Environment resolution={256} frames={1}>
        <Lightformer intensity={2.4} position={[0, 4, -2]} scale={[10, 1.4, 1]} />
        <Lightformer intensity={1.2} position={[-5, 0, 1]} rotation-y={Math.PI / 2} scale={[6, 3, 1]} />
        <Lightformer intensity={1.6} color="#e6b24e" position={[5, -1, 1]} rotation-y={-Math.PI / 2} scale={[4, 2, 1]} />
        <Lightformer intensity={0.8} color="#3a5bd9" position={[0, -3, 3]} rotation-x={-Math.PI / 2} scale={[8, 4, 1]} />
      </Environment>
    </Canvas>
  );
}
