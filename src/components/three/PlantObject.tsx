"use client";

import { useRef } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import { Environment } from "@react-three/drei";
import { PlantKind } from "@/types";

interface PlantObjectProps {
  kind: PlantKind;
}

const KIND_COLOR: Record<PlantKind, string> = {
  forging: "#d97706",
  cnc: "#0284c7",
  vmc: "#16a34a",
  "cnc-vmc": "#0284c7",
  integrated: "#d97706",
  "production-line": "#0284c7",
  "precision-cell": "#16a34a",
  mechanical: "#64748b",
};

const BASE_IRON_PROPS = { color: "#2d3748", metalness: 0.85, roughness: 0.55 };
const MACHINED_STEEL_PROPS = { color: "#94a3b8", metalness: 0.95, roughness: 0.25 };
const POLISHED_STEEL_PROPS = { color: "#f8fafc", metalness: 1.0, roughness: 0.08, clearcoat: 0.8, clearcoatRoughness: 0.1 };
const BRASS_MAT_PROPS = { color: "#fbbf24", metalness: 1.0, roughness: 0.2 };

function ForgingObject({ color }: { color: string }) {
  const hammerRef = useRef<THREE.Group>(null);
  
  useFrame(({ clock }) => {
    if (hammerRef.current) {
      hammerRef.current.position.y = Math.abs(Math.sin(clock.elapsedTime * 4)) * 0.8 + 0.3;
    }
  });

  return (
    <group scale={0.7} position={[0, -0.5, 0]}>
      
      <mesh castShadow receiveShadow position={[0, -1, 0]}>
        <cylinderGeometry args={[1.8, 2.0, 1, 16]} />
        <meshStandardMaterial {...BASE_IRON_PROPS} />
      </mesh>
      
      <mesh position={[0, -0.4, 0]}>
        <cylinderGeometry args={[0.8, 0.8, 0.2, 16]} />
        <meshStandardMaterial color={color} emissive={color} emissiveIntensity={2} />
      </mesh>
      
      <group ref={hammerRef}>
        <mesh castShadow>
          <cylinderGeometry args={[1.2, 1.2, 1.5, 16]} />
          <meshPhysicalMaterial color="#0a0a0a" metalness={0.9} roughness={0.15} clearcoat={1.0} clearcoatRoughness={0.1} />
        </mesh>
        <mesh castShadow position={[0, 1.55, 0]}>
          <cylinderGeometry args={[0.4, 0.4, 1.6, 12]} />
          <meshStandardMaterial {...MACHINED_STEEL_PROPS} />
        </mesh>
      </group>
      
      <mesh castShadow receiveShadow position={[-1.8, 1.0, 0]}>
        <cylinderGeometry args={[0.4, 0.4, 4.0, 12]} />
        <meshStandardMaterial {...BASE_IRON_PROPS} />
      </mesh>
      <mesh castShadow receiveShadow position={[1.8, 1.0, 0]}>
        <cylinderGeometry args={[0.4, 0.4, 4.0, 12]} />
        <meshStandardMaterial {...BASE_IRON_PROPS} />
      </mesh>

      <mesh position={[0, 3.0, 0]} castShadow>
        <boxGeometry args={[4.6, 1.2, 1.6]} />
        <meshStandardMaterial {...BASE_IRON_PROPS} />
      </mesh>
    </group>
  );
}

function CNCObject({ color }: { color: string }) {
  const spindleRef = useRef<THREE.Group>(null);
  
  useFrame(({ clock }) => {
    if (spindleRef.current) {
      spindleRef.current.rotation.x = clock.elapsedTime * 20; // Fast rotation
    }
  });

  return (
    <group>
      
      <mesh castShadow receiveShadow position={[0, -1.2, 0]}>
        <boxGeometry args={[4.2, 0.8, 2.6]} />
        <meshStandardMaterial color="#1e293b" metalness={0.6} roughness={0.7} />
      </mesh>

      <group position={[0, 0.4, -0.2]}>
        
        <mesh receiveShadow position={[0, 0, -1.1]}>
          <boxGeometry args={[4.2, 2.4, 0.2]} />
          <meshStandardMaterial color="#e2e8f0" metalness={0.3} roughness={0.4} />
        </mesh>
        
        <mesh receiveShadow position={[-2.0, 0, 0]}>
          <boxGeometry args={[0.2, 2.4, 2.0]} />
          <meshStandardMaterial color="#e2e8f0" metalness={0.3} roughness={0.4} />
        </mesh>
        
        <mesh receiveShadow position={[2.0, 0, 0]}>
          <boxGeometry args={[0.2, 2.4, 2.0]} />
          <meshStandardMaterial color="#e2e8f0" metalness={0.3} roughness={0.4} />
        </mesh>
        
        <mesh receiveShadow position={[0, 1.1, 0]}>
          <boxGeometry args={[4.2, 0.2, 2.0]} />
          <meshStandardMaterial color="#e2e8f0" metalness={0.3} roughness={0.4} />
        </mesh>
      </group>

      <group position={[0, 0, 0.2]}>
        
        <mesh receiveShadow position={[0.2, -0.4, -0.4]} rotation={[Math.PI / 4, 0, 0]}>
          <boxGeometry args={[3.0, 1.4, 0.4]} />
          <meshStandardMaterial {...BASE_IRON_PROPS} />
        </mesh>

        <mesh castShadow receiveShadow position={[-1.2, 0.1, -0.4]}>
          <boxGeometry args={[1.0, 1.2, 1.2]} />
          <meshStandardMaterial {...MACHINED_STEEL_PROPS} />
        </mesh>

        <group ref={spindleRef} position={[-0.6, 0.1, -0.4]} rotation={[0, 0, -Math.PI / 2]}>
          
          <mesh castShadow>
            <cylinderGeometry args={[0.45, 0.45, 0.3, 24]} />
            <meshPhysicalMaterial {...POLISHED_STEEL_PROPS} />
          </mesh>
          
          {[0, (Math.PI * 2) / 3, (Math.PI * 4) / 3].map((angle, i) => (
            <mesh key={i} castShadow position={[Math.cos(angle) * 0.3, 0.2, Math.sin(angle) * 0.3]} rotation={[0, -angle, 0]}>
              <boxGeometry args={[0.15, 0.2, 0.3]} />
              <meshStandardMaterial {...MACHINED_STEEL_PROPS} />
            </mesh>
          ))}
          
          <mesh castShadow position={[0, 0.6, 0]}>
            <cylinderGeometry args={[0.15, 0.15, 1.2, 16]} />
            <meshStandardMaterial color={color} metalness={1.0} roughness={0.2} emissive={color} emissiveIntensity={0.2} />
          </mesh>
        </group>

        <group position={[0.8, -0.1, 0.1]} rotation={[Math.PI / 6, 0, 0]}>
          
          <mesh castShadow position={[0, -0.3, -0.2]}>
            <boxGeometry args={[0.8, 0.2, 1.0]} />
            <meshStandardMaterial {...MACHINED_STEEL_PROPS} />
          </mesh>
          
          <mesh castShadow position={[0, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
            <cylinderGeometry args={[0.35, 0.35, 0.4, 8]} />
            <meshStandardMaterial {...MACHINED_STEEL_PROPS} />
          </mesh>
          
          <mesh castShadow position={[-0.4, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
             <cylinderGeometry args={[0.05, 0.05, 0.4, 8]} />
             <meshStandardMaterial {...BRASS_MAT_PROPS} />
          </mesh>
        </group>
      </group>

      <group position={[0, 0.3, 0.9]}>
        
        <group position={[-1.0, 0, 0]}>
          
          <mesh>
            <boxGeometry args={[1.9, 1.8, 0.05]} />
            <meshStandardMaterial color="#475569" metalness={0.6} roughness={0.5} />
          </mesh>
          
          <mesh position={[0, 0.1, 0.03]}>
            <boxGeometry args={[1.4, 1.2, 0.02]} />
            <meshPhysicalMaterial color="#020617" transmission={0.9} opacity={1} transparent metalness={0.1} roughness={0.1} />
          </mesh>
          
          <mesh position={[0.7, 0, 0.05]}>
            <boxGeometry args={[0.05, 0.4, 0.1]} />
            <meshPhysicalMaterial {...POLISHED_STEEL_PROPS} />
          </mesh>
        </group>

        <group position={[0.8, 0, 0.06]}>
          <mesh>
            <boxGeometry args={[1.9, 1.8, 0.05]} />
            <meshStandardMaterial color="#475569" metalness={0.6} roughness={0.5} />
          </mesh>
          <mesh position={[0, 0.1, 0.03]}>
            <boxGeometry args={[1.4, 1.2, 0.02]} />
            <meshPhysicalMaterial color="#020617" transmission={0.9} opacity={1} transparent metalness={0.1} roughness={0.1} />
          </mesh>
          <mesh position={[-0.7, 0, 0.05]}>
            <boxGeometry args={[0.05, 0.4, 0.1]} />
            <meshPhysicalMaterial {...POLISHED_STEEL_PROPS} />
          </mesh>
        </group>
      </group>

      <group position={[2.4, 0.5, 1.0]}>
        
        <mesh position={[-0.2, 0, -0.4]} rotation={[0, -Math.PI / 4, 0]}>
           <cylinderGeometry args={[0.06, 0.06, 0.8]} />
           <meshStandardMaterial {...MACHINED_STEEL_PROPS} />
        </mesh>

        <group rotation={[-Math.PI / 6, -Math.PI / 6, 0]}>
          <mesh castShadow>
            <boxGeometry args={[0.8, 1.0, 0.1]} />
            <meshStandardMaterial color="#1e293b" metalness={0.4} roughness={0.6} />
          </mesh>
          
          <mesh position={[0, 0.2, 0.06]}>
            <planeGeometry args={[0.6, 0.5]} />
            <meshStandardMaterial color="#0ea5e9" emissive="#0ea5e9" emissiveIntensity={0.6} />
          </mesh>
          
          <mesh position={[-0.2, -0.3, 0.06]}>
            <boxGeometry args={[0.15, 0.15, 0.02]} />
            <meshStandardMaterial color="#22c55e" />
          </mesh>
          <mesh position={[0.2, -0.3, 0.06]}>
             <boxGeometry args={[0.15, 0.15, 0.02]} />
             <meshStandardMaterial color="#ef4444" />
          </mesh>
          
          <mesh position={[0, -0.3, 0.08]} rotation={[Math.PI / 2, 0, 0]}>
             <cylinderGeometry args={[0.1, 0.1, 0.04, 16]} />
             <meshPhysicalMaterial {...POLISHED_STEEL_PROPS} />
          </mesh>
        </group>
      </group>

      <group position={[-1.7, 1.9, -0.8]}>
        <mesh position={[0, 0, 0]}>
          <cylinderGeometry args={[0.03, 0.03, 0.6, 8]} />
          <meshStandardMaterial {...MACHINED_STEEL_PROPS} />
        </mesh>
        
        {["#22c55e", "#eab308", "#ef4444"].map((c, i) => (
          <mesh key={i} position={[0, 0.3 + i * 0.15, 0]}>
            <cylinderGeometry args={[0.06, 0.06, 0.12, 16]} />
            <meshStandardMaterial color={c} emissive={c} emissiveIntensity={i === 0 ? 1.5 : 0.1} />
          </mesh>
        ))}
        
        <mesh position={[0, 0.75, 0]}>
           <cylinderGeometry args={[0.06, 0.06, 0.02, 16]} />
           <meshStandardMaterial {...MACHINED_STEEL_PROPS} />
        </mesh>
      </group>
    </group>
  );
}

function VMCObject({ color }: { color: string }) {
  const toolRef = useRef<THREE.Group>(null);
  
  useFrame(({ clock }) => {
    if (toolRef.current) {

      toolRef.current.rotation.y = clock.elapsedTime * 20;
      toolRef.current.position.x = Math.sin(clock.elapsedTime * 2) * 0.4;

      toolRef.current.position.z = Math.cos(clock.elapsedTime * 2) * 0.2;
    }
  });

  return (
    <group>
      
      <mesh castShadow receiveShadow position={[0, -1.2, 0]}>
        <boxGeometry args={[3, 0.6, 2]} />
        <meshStandardMaterial {...BASE_IRON_PROPS} />
      </mesh>

      <mesh castShadow position={[0, -0.8, 0]}>
        <boxGeometry args={[1.5, 0.4, 1.2]} />
        <meshStandardMaterial color={color} metalness={0.8} roughness={0.3} emissive={color} emissiveIntensity={0.1} />
      </mesh>

      <mesh castShadow position={[0, 0.5, -0.8]}>
        <boxGeometry args={[1.2, 3, 0.8]} />
        <meshStandardMaterial {...MACHINED_STEEL_PROPS} />
      </mesh>

      <group position={[0, 0.8, 0]}>
        <mesh castShadow position={[0, 0.5, 0]}>
          <boxGeometry args={[1, 1, 1.2]} />
          <meshStandardMaterial {...MACHINED_STEEL_PROPS} />
        </mesh>

        <group ref={toolRef} position={[0, 0, 0]}>
          <mesh castShadow position={[0, -0.2, 0]}>
            <cylinderGeometry args={[0.2, 0.1, 0.4, 12]} />
            <meshPhysicalMaterial {...POLISHED_STEEL_PROPS} />
          </mesh>
          <mesh castShadow position={[0, -0.6, 0]}>
            <cylinderGeometry args={[0.08, 0.08, 0.6, 8]} />
            <meshStandardMaterial {...BRASS_MAT_PROPS} />
          </mesh>
        </group>
      </group>
    </group>
  );
}

function GenericMechanical({ color }: { color: string }) {
  const gearRef = useRef<THREE.Group>(null);

  useFrame(({ clock }) => {
    if (gearRef.current) {
      gearRef.current.rotation.z = clock.elapsedTime;
    }
  });

  return (
    <group ref={gearRef}>
      <mesh castShadow>
        <torusGeometry args={[1.2, 0.3, 16, 32]} />
        <meshPhysicalMaterial {...POLISHED_STEEL_PROPS} />
      </mesh>
      <mesh castShadow rotation={[0, 0, Math.PI / 4]}>
        <boxGeometry args={[3, 0.4, 0.4]} />
        <meshStandardMaterial {...BASE_IRON_PROPS} />
      </mesh>
      <mesh castShadow rotation={[0, 0, -Math.PI / 4]}>
        <boxGeometry args={[3, 0.4, 0.4]} />
        <meshStandardMaterial {...BASE_IRON_PROPS} />
      </mesh>
      <mesh position={[0, 0, 0]}>
        <cylinderGeometry args={[0.5, 0.5, 0.6, 32]} />
        <meshStandardMaterial color={color} metalness={0.9} roughness={0.2} emissive={color} emissiveIntensity={0.5} />
      </mesh>
    </group>
  );
}

export default function PlantObject({ kind }: PlantObjectProps) {
  const group = useRef<THREE.Group>(null);

  useFrame(({ clock }) => {
    if (!group.current) return;

    group.current.rotation.y = Math.sin(clock.elapsedTime * 0.5) * 0.4;
  });

  const color = KIND_COLOR[kind];

  return (
    <group ref={group}>
      {kind === "forging" && <ForgingObject color={color} />}
      {kind === "cnc" && <CNCObject color={color} />}
      {kind === "vmc" && <VMCObject color={color} />}
      {kind === "cnc-vmc" && (
        <group>
          <group position={[-4.5, 0, 0]} scale={2}>
            <CNCObject color={KIND_COLOR["cnc"]} />
          </group>
          <group position={[4.5, 0, 0]} scale={2}>
            <VMCObject color={KIND_COLOR["vmc"]} />
          </group>
        </group>
      )}
      {(kind === "integrated" || kind === "production-line" || kind === "precision-cell" || kind === "mechanical") && (
        <GenericMechanical color={color} />
      )}
      <Environment preset="studio" />
      <pointLight position={[4, 5, 4]} intensity={2.5} color={"#ffffff"} />
      <pointLight position={[-4, -3, -4]} intensity={1.5} color={color} />
      <ambientLight intensity={1.2} color={"#f8fafc"} />
    </group>
  );
}
