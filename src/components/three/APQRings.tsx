"use client";

import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

interface RingProps {
  color: string;
  radius: number;
  tilt: number;
  offset: number;
  progressRef: React.MutableRefObject<number>;
  spinSpeed: number;
}

function Ring({ color, radius, tilt, offset, progressRef, spinSpeed }: RingProps) {
  const mesh = useRef<THREE.Mesh>(null);
  const materialRef = useRef<THREE.MeshStandardMaterial>(null);

  useFrame((_, delta) => {
    if (!mesh.current || !materialRef.current) return;
    const align = Math.max(0, Math.min(1, (progressRef.current - 0.2) / 0.16));
    
    mesh.current.rotation.z += delta * spinSpeed * (1 - align * 0.85);
    const targetRotX = THREE.MathUtils.lerp(tilt, 0, align);
    const targetPosZ = THREE.MathUtils.lerp(offset, 0, align);
    mesh.current.rotation.x = THREE.MathUtils.lerp(mesh.current.rotation.x, targetRotX, 0.08);
    mesh.current.position.z = THREE.MathUtils.lerp(mesh.current.position.z, targetPosZ, 0.08);
    
    materialRef.current.emissiveIntensity = 0.6 + align * 0.8;
  });

  return (
    <mesh ref={mesh}>
      <torusGeometry args={[radius, 0.12, 16, 64]} />
      <meshStandardMaterial
        ref={materialRef}
        color={color}
        emissive={color}
        metalness={0.9}
        roughness={0.25}
      />
    </mesh>
  );
}

interface APQRingsProps {
  progressRef: React.MutableRefObject<number>;
}

export default function APQRings({ progressRef }: APQRingsProps) {
  const lightRef = useRef<THREE.PointLight>(null);
  
  useFrame(() => {
    if (!lightRef.current) return;
    const align = Math.max(0, Math.min(1, (progressRef.current - 0.2) / 0.16));
    lightRef.current.intensity = 2 * align;
  });

  return (
    <group>
      <Ring color="#3ddc84" radius={2.4} tilt={0.6} offset={-2.4} progressRef={progressRef} spinSpeed={0.4} />
      <Ring color="#f5a623" radius={2.0} tilt={-0.5} offset={0} progressRef={progressRef} spinSpeed={-0.3} />
      <Ring color="#4fd1ff" radius={1.6} tilt={0.4} offset={2.4} progressRef={progressRef} spinSpeed={0.5} />
      <pointLight ref={lightRef} position={[0, 0, 4]} color="#ffffff" distance={10} />
    </group>
  );
}
