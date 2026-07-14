"use client";

import { Canvas } from "@react-three/fiber";
import { PlantKind } from "@/types";
import PlantObject from "@/components/three/PlantObject";
import { useEffect, useState } from "react";

export default function PlantHero3D({ kind }: { kind: PlantKind }) {

  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  const dual = kind === "cnc-vmc";

  return (
    <Canvas
      dpr={[1, 1.2]}
      camera={{ fov: dual ? 80 : 45, position: dual ? [0, 0, 16] : [0, 0, 6] }}
      gl={{ antialias: false, powerPreference: "low-power" }}
      style={{ width: "100%", height: "100%", display: "block" }}
      onCreated={({ gl }) => gl.setClearColor("#08090b", 0)}
    >
      <ambientLight intensity={0.2} />
      <directionalLight position={[4, 6, 4]} intensity={0.5} />
      <PlantObject kind={kind} />
    </Canvas>
  );
}