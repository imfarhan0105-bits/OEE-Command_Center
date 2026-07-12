"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { useRef, useState } from "react";
import * as THREE from "three";
import FactoryArchitecture from "./FactoryArchitecture";
import DataParticles from "./DataParticles";
import APQRings from "./APQRings";

interface CinematicCanvasProps {
  /** 0 -> 1 overall homepage scroll progress, driven by GSAP outside the canvas */
  progressRef: React.MutableRefObject<number>;
}

function CameraRig({ progressRef }: { progressRef: React.MutableRefObject<number> }) {
  useFrame(({ camera }) => {
    const p = progressRef.current;

    // Scene 1 (0 - 0.18): travel through factory architecture
    // Scene 2 (0.18 - 0.38): arrive at APQ rings
    // Scene 3+ (0.38 - 1): pull back / drift
    let targetPos = new THREE.Vector3(0, 1.4, 14);
    let targetLook = new THREE.Vector3(0, 0, 0);

    if (p < 0.18) {
      const t = p / 0.18;
      targetPos = new THREE.Vector3(0, 1.2 - t * 0.4, 14 - t * 9);
      targetLook = new THREE.Vector3(0, 0, -t * 4);
    } else if (p < 0.38) {
      const t = (p - 0.18) / 0.2;
      targetPos = new THREE.Vector3(0, 0.8, 5 - t * 3.5);
      targetLook = new THREE.Vector3(0, 0, 0);
    } else if (p < 0.62) {
      const t = (p - 0.38) / 0.24;
      targetPos = new THREE.Vector3(0, 2 + t * 3, 1.5 + t * 14);
      targetLook = new THREE.Vector3(0, 0, 0);
    } else {
      const t = Math.min((p - 0.62) / 0.38, 1);
      targetPos = new THREE.Vector3(Math.sin(t * 2) * 2, 5 + t * 2, 15 + t * 6);
      targetLook = new THREE.Vector3(0, 0, 0);
    }

    camera.position.lerp(targetPos, 0.06);
    const m = camera as THREE.PerspectiveCamera;
    m.lookAt(targetLook);
  });
  return null;
}

/** Reads the scroll-progress ref every frame and republishes it as local
 * state at a throttled cadence, so downstream 3D children can react to it
 * via normal props without ever touching `.current` inside a render body. */
function useProgressState(progressRef: React.MutableRefObject<number>) {
  const [progress, setProgress] = useState(0);
  const lastRef = useRef(0);
  useFrame(() => {
    const p = progressRef.current;
    if (Math.abs(p - lastRef.current) > 0.002) {
      lastRef.current = p;
      setProgress(p);
    }
  });
  return progress;
}

function Scene({ progressRef }: { progressRef: React.MutableRefObject<number> }) {
  const progress = useProgressState(progressRef);
  const align = Math.max(0, Math.min(1, (progress - 0.2) / 0.16));
  return (
    <>
      <ambientLight intensity={0.15} />
      <directionalLight position={[5, 10, 5]} intensity={0.4} color="#c7ccd4" />
      <CameraRig progressRef={progressRef} />
      <FactoryArchitecture intensity={progress} />
      <DataParticles count={300} radius={7} />
      <group position={[0, 0.5, -1]}>
        <APQRings align={align} />
      </group>
    </>
  );
}

export default function CinematicCanvas({ progressRef }: CinematicCanvasProps) {
  return (
    <Canvas
      dpr={[1, 1.6]}
      gl={{ antialias: true, powerPreference: "high-performance" }}
      camera={{ fov: 55, position: [0, 1.4, 14] }}
      onCreated={({ gl }) => {
        gl.setClearColor("#08090b");
      }}
    >
      <Scene progressRef={progressRef} />
    </Canvas>
  );
}
