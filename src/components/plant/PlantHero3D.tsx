"use client";

import { Canvas } from "@react-three/fiber";
import { PlantKind } from "@/types";
import PlantObject from "@/components/three/PlantObject";

export default function PlantHero3D({ kind }: { kind: PlantKind }) {
  return (
    <Canvas
      dpr={[1, 1.5]}
      camera={{ fov: 45, position: [0, 0, 6] }}
      gl={{ antialias: true }}
      onCreated={({ gl }) => gl.setClearColor("#08090b", 0)}
    >
      <ambientLight intensity={0.2} />
      <directionalLight position={[4, 6, 4]} intensity={0.5} />
      <PlantObject kind={kind} />
    </Canvas>
  );
}
