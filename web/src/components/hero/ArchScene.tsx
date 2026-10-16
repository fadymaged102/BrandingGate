"use client";

import {
  Environment,
  Lightformer,
  MeshTransmissionMaterial,
  PerformanceMonitor,
  Sparkles,
  useVideoTexture,
} from "@react-three/drei";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { easing } from "maath";
import { Suspense, useEffect, useRef, useState, type RefObject } from "react";
import * as THREE from "three";
import { smooth, useGateGeometry } from "@/components/three/gate";

export type ArchProgress = RefObject<number>;

function Backdrop({ active }: { active: boolean }) {
  const texture = useVideoTexture("/work/hero-texture.mp4", {
    muted: true,
    loop: true,
    playsInline: true,
    start: false,
  });

  // Decode only while the scene renders: off-screen, hidden routes and the
  // pause control all stop the video, not just the canvas.
  useEffect(() => {
    const video = texture.image as HTMLVideoElement;
    if (active) {
      video.play().catch(() => {
        /* Autoplay refused; the first frame stays as a still. */
      });
    } else video.pause();
  }, [active, texture]);
  const { camera, viewport } = useThree();
  const size = viewport.getCurrentViewport(camera, [0, 0, -4]);
  return (
    <mesh position={[0, 0, -4]} scale={[size.width * 1.5, size.width * 1.5 * (9 / 16), 1]}>
      <planeGeometry />
      {/* Dimmed so the footage is atmosphere behind the glass, not a second hero. */}
      <meshBasicMaterial map={texture} color="#2c3352" toneMapped={false} />
    </mesh>
  );
}

function Gate({ progress }: { progress: ArchProgress }) {
  const group = useRef<THREE.Group>(null!);
  const pointer = useRef(new THREE.Vector2());
  const { gate, filament } = useGateGeometry();
  const wide = useThree((s) => s.size.width >= 1024);

  useEffect(() => {
    const onMove = (e: PointerEvent) => {
      pointer.current.set(
        (e.clientX / window.innerWidth) * 2 - 1,
        (e.clientY / window.innerHeight) * 2 - 1,
      );
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    return () => window.removeEventListener("pointermove", onMove);
  }, []);

  useFrame((state, delta) => {
    const p = progress.current ?? 0;
    const turn = smooth(0, 0.4, p); // three-quarter view -> frontal
    const dolly = smooth(0.4, 0.88, p); // camera passes through the gate
    const tilt = 0.07; // about 4 degrees of pointer parallax

    const g = group.current;
    easing.damp(g.rotation, "y", THREE.MathUtils.lerp(-0.62, 0, turn) + pointer.current.x * tilt, 0.25, delta);
    easing.damp(g.rotation, "x", THREE.MathUtils.lerp(0.14, 0, turn) + pointer.current.y * tilt, 0.25, delta);
    easing.damp(g.position, "x", THREE.MathUtils.lerp(wide ? 1.05 : 0, 0, turn), 0.25, delta);

    state.camera.position.z = THREE.MathUtils.lerp(6.5, -2.2, dolly);
    state.camera.position.y = THREE.MathUtils.lerp(0.1, 0, dolly);
    state.camera.lookAt(0, 0, -4);
  });

  return (
    <group ref={group} scale={0.9}>
      <mesh geometry={gate}>
        <MeshTransmissionMaterial
          samples={6}
          transmission={1}
          thickness={0.3}
          roughness={0.02}
          ior={1.28}
          chromaticAberration={0.03}
          anisotropicBlur={0.04}
          distortion={0}
          distortionScale={0}
          temporalDistortion={0}
          attenuationColor="#d6deff"
          attenuationDistance={1.4}
          color="#ffffff"
          backside={false}
        />
      </mesh>
      <mesh geometry={filament}>
        <meshBasicMaterial color="#c8902a" toneMapped={false} />
      </mesh>
    </group>
  );
}

type Props = {
  progress: ArchProgress;
  active: boolean;
  /** The pause control: stops the footage and drift, not the scroll-driven camera. */
  paused?: boolean;
  onReady: () => void;
};

export default function ArchScene({ progress, active, paused = false, onReady }: Props) {
  const [dpr, setDpr] = useState(1.75);
  return (
    <Canvas
      frameloop={active ? "always" : "never"}
      dpr={[1, dpr]}
      camera={{ position: [0, 0.1, 6.5], fov: 35, near: 0.1, far: 30 }}
      gl={{ antialias: true, alpha: false, powerPreference: "high-performance" }}
      onCreated={({ gl }) => {
        gl.setClearColor("#050a24");
        onReady();
      }}
      aria-hidden
    >
      <PerformanceMonitor onDecline={() => setDpr(1)} onIncline={() => setDpr(1.75)} />
      <Suspense fallback={null}>
        <Backdrop active={active && !paused} />
      </Suspense>
      <Gate progress={progress} />
      <Sparkles count={36} scale={[7, 4, 3]} size={1.6} speed={paused ? 0 : 0.18} opacity={0.5} color="#e6b24e" />
      <Environment resolution={256} frames={1}>
        <Lightformer intensity={2.4} position={[0, 4, -2]} scale={[10, 1.4, 1]} />
        <Lightformer intensity={1.2} position={[-5, 0, 1]} rotation-y={Math.PI / 2} scale={[6, 3, 1]} />
        <Lightformer intensity={1.6} color="#e6b24e" position={[5, -1, 1]} rotation-y={-Math.PI / 2} scale={[4, 2, 1]} />
        <Lightformer intensity={0.8} color="#3a5bd9" position={[0, -3, 3]} rotation-x={-Math.PI / 2} scale={[8, 4, 1]} />
      </Environment>
    </Canvas>
  );
}
