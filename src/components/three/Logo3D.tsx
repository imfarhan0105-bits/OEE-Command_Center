"use client";

import React, { useRef, useState, useEffect } from "react";
import { Canvas } from "@react-three/fiber";
import { useTexture } from "@react-three/drei";
import * as THREE from "three";

function LogoMesh() {
  const texture = useTexture("/logo.png");
  const img = texture.image as any;
  const aspect = (img && img.width && img.height) ? img.width / img.height : 3;

  return (
    <mesh rotation={[0, 0.15, 0]}>
      <planeGeometry args={[aspect * 1.5, 1.5]} />
      <meshBasicMaterial 
        map={texture} 
        transparent={true} 
        side={THREE.DoubleSide} 
      />
    </mesh>
  );
}

export default function Logo3D({ className }: { className?: string }) {
  return (
    <div className={className || "h-12 w-32 md:w-40 flex-shrink-0 flex items-center justify-start overflow-visible"}>
      <Canvas camera={{ position: [0, 0, 3], fov: 40 }} style={{ width: '100%', height: '100%' }}>
        <React.Suspense fallback={null}>
          <LogoMesh />
        </React.Suspense>
      </Canvas>
    </div>
  );
}
