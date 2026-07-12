"use client";

import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

/** Deterministic pseudo-random so SSR/CSR never mismatch. */
function rand(seed: number) {
  const x = Math.sin(seed) * 10000;
  return x - Math.floor(x);
}

interface BlockProps {
  position: [number, number, number];
  size: [number, number, number];
  color?: string;
  emissive?: string;
  emissiveIntensity?: number;
}

function Block({ position, size, color = "#1a1d22", emissive = "#000000", emissiveIntensity = 0 }: BlockProps) {
  return (
    <mesh position={position} castShadow receiveShadow>
      <boxGeometry args={size} />
      <meshStandardMaterial
        color={color}
        emissive={emissive}
        emissiveIntensity={emissiveIntensity}
        metalness={0.85}
        roughness={0.35}
      />
    </mesh>
  );
}

interface FactoryArchitectureProps {
  intensity?: number; // 0-1 how "lit up" the scene is (scroll driven)
}

export default function FactoryArchitecture({ intensity = 0.4 }: FactoryArchitectureProps) {
  const group = useRef<THREE.Group>(null);

  const blocks = useMemo(() => {
    const arr: BlockProps[] = [];
    for (let i = 0; i < 26; i++) {
      const s = i * 13.37;
      const w = 0.8 + rand(s) * 2.2;
      const h = 1 + rand(s + 1) * 5;
      const d = 0.8 + rand(s + 2) * 2.2;
      const x = (rand(s + 3) - 0.5) * 22;
      const z = (rand(s + 4) - 0.5) * 22 - 4;
      arr.push({
        position: [x, h / 2 - 3, z],
        size: [w, h, d],
        color: i % 5 === 0 ? "#20242b" : "#15171b",
      });
    }
    return arr;
  }, []);

  const emissiveLines = useMemo(() => {
    const arr: { position: [number, number, number]; length: number; axis: "x" | "z" }[] = [];
    for (let i = 0; i < 10; i++) {
      const s = i * 51.1;
      arr.push({
        position: [(rand(s) - 0.5) * 20, -2.98, (rand(s + 1) - 0.5) * 20],
        length: 2 + rand(s + 2) * 6,
        axis: rand(s + 3) > 0.5 ? "x" : "z",
      });
    }
    return arr;
  }, []);

  useFrame((state) => {
    if (!group.current) return;
    group.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.02) * 0.05;
  });

  return (
    <group ref={group}>
      
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -3, 0]} receiveShadow>
        <planeGeometry args={[60, 60]} />
        <meshStandardMaterial color="#0a0b0d" metalness={0.6} roughness={0.8} />
      </mesh>

      {blocks.map((b, i) => (
        <Block key={i} {...b} />
      ))}

      {emissiveLines.map((l, i) => (
        <mesh
          key={i}
          position={l.position}
          rotation={l.axis === "x" ? [0, 0, 0] : [0, Math.PI / 2, 0]}
        >
          <boxGeometry args={[l.length, 0.02, 0.02]} />
          <meshBasicMaterial color="#4fd1ff" transparent opacity={0.25 + intensity * 0.5} />
        </mesh>
      ))}

      <fog attach="fog" args={["#08090b", 8, 34]} />
    </group>
  );
}
