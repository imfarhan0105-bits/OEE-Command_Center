"use client";

import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

interface RingProps {
  color: string;
  radius: number;
  tilt: number;
  offset: number;
  align: number; // 0 = scattered, 1 = fully aligned
  spinSpeed: number;
}

function Ring({ color, radius, tilt, offset, align, spinSpeed }: RingProps) {
  const mesh = useRef<THREE.Mesh>(null);

  useFrame((_, delta) => {
    if (!mesh.current) return;
    mesh.current.rotation.z += delta * spinSpeed * (1 - align * 0.85);
    const targetRotX = THREE.MathUtils.lerp(tilt, 0, align);
    const targetPosZ = THREE.MathUtils.lerp(offset, 0, align);
    mesh.current.rotation.x = THREE.MathUtils.lerp(mesh.current.rotation.x, targetRotX, 0.08);
    mesh.current.position.z = THREE.MathUtils.lerp(mesh.current.position.z, targetPosZ, 0.08);
  });

  return (
    <mesh ref={mesh}>
      <torusGeometry args={[radius, 0.12, 24, 120]} />
      <meshStandardMaterial
        color={color}
        emissive={color}
        emissiveIntensity={0.6 + align * 0.8}
        metalness={0.9}
        roughness={0.25}
      />
    </mesh>
  );
}

interface APQRingsProps {
  align: number; // 0-1 scroll driven alignment progress
}

export default function APQRings({ align }: APQRingsProps) {
  return (
    <group>
      <Ring color="#3ddc84" radius={2.4} tilt={0.6} offset={-2.4} align={align} spinSpeed={0.4} />
      <Ring color="#f5a623" radius={2.0} tilt={-0.5} offset={0} align={align} spinSpeed={-0.3} />
      <Ring color="#4fd1ff" radius={1.6} tilt={0.4} offset={2.4} align={align} spinSpeed={0.5} />
      <pointLight position={[0, 0, 4]} intensity={2 * align} color="#ffffff" distance={10} />
    </group>
  );
}
