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
// useProgressState has been removed to prevent React re-renders which cause scroll lag.
// Downstream components now read progressRef directly inside their own useFrame loops.

function Scene({ progressRef }: { progressRef: React.MutableRefObject<number> }) {
  return (
    <>
      <ambientLight intensity={0.15} />
      <directionalLight position={[5, 10, 5]} intensity={0.4} color="#c7ccd4" />
      <CameraRig progressRef={progressRef} />
      <FactoryArchitecture progressRef={progressRef} />
      <DataParticles count={150} radius={7} />
      <group position={[0, 0.5, -1]}>
        <APQRings progressRef={progressRef} />
      </group>
    </>
  );
}

export default function CinematicCanvas({ progressRef }: CinematicCanvasProps) {
  return (
    <Canvas
      dpr={[1, 1.2]}
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
