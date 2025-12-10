import React, { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Instance, Instances, Float, Sparkles } from '@react-three/drei';
import * as THREE from 'three';

// Augment JSX namespace to recognize Three.js elements
declare global {
  namespace JSX {
    interface IntrinsicElements {
      group: any;
      tetrahedronGeometry: any;
      meshPhysicalMaterial: any;
      sphereGeometry: any;
      mesh: any;
      octahedronGeometry: any;
      pointLight: any;
    }
  }
}

// Augment React.JSX namespace for compatibility with newer React types
declare module 'react' {
  namespace JSX {
    interface IntrinsicElements {
      group: any;
      tetrahedronGeometry: any;
      meshPhysicalMaterial: any;
      sphereGeometry: any;
      mesh: any;
      octahedronGeometry: any;
      pointLight: any;
    }
  }
}

const EMERALD_COLOR = new THREE.Color('#025930'); // Deep luxurious green
const GOLD_COLOR = new THREE.Color('#FFD700'); // Firework Gold
const ORNAMENT_PALETTE = [
  '#FF3366', // Raspberry
  '#FFD700', // Gold
  '#00C2FF', // Blue
  '#FFFAF0', // Pearl
].map(c => new THREE.Color(c));

// Procedural spiral generation (Phyllotaxis)
const useSpiralPositions = (count: number, height: number, radius: number) => {
  return useMemo(() => {
    const temp = [];
    const phi = Math.PI * (3 - Math.sqrt(5)); // Golden angle
    
    for (let i = 0; i < count; i++) {
      const y = height - (i / (count - 1)) * height; // Top to bottom
      const progress = (height - y) / height;
      
      const r = radius * Math.pow(progress, 0.6) * (1 - Math.pow(progress, 4) * 0.2); 
      
      const theta = phi * i;
      const x = r * Math.cos(theta);
      const z = r * Math.sin(theta);
      
      const isOrnament = i % 5 === 0;

      const scale = isOrnament 
        ? 0.5 + Math.random() * 0.3 
        : 0.6 + Math.random() * 0.4;

      temp.push({ 
        position: [x, y, z] as [number, number, number], 
        originalPosition: new THREE.Vector3(x, y, z),
        scale,
        isOrnament,
        color: isOrnament ? ORNAMENT_PALETTE[i % ORNAMENT_PALETTE.length] : EMERALD_COLOR,
        rotation: [Math.random() * Math.PI, Math.random() * Math.PI, 0] as [number, number, number],
        // Pre-calculate explosion direction (outwards from y-axis)
        explosionDir: new THREE.Vector3(x, 0, z).normalize().add(new THREE.Vector3(0, (Math.random() - 0.5), 0)).normalize()
      });
    }
    return temp;
  }, [count, height, radius]);
};

interface LuxuryTreeProps {
  isExploding: boolean;
}

export const LuxuryTree: React.FC<LuxuryTreeProps> = ({ isExploding }) => {
  const groupRef = useRef<THREE.Group>(null);
  const items = useSpiralPositions(300, 6, 3.5); 
  const instanceRefs = useRef<(any)[]>([]); // Store refs to modify instances directly
  const explosionProgress = useRef(0);

  useFrame((state, delta) => {
    // 1. Group Rotation (Idle)
    if (groupRef.current) {
      const rotSpeed = isExploding ? 0.02 : 0.15; // Rotate very slowly when exploding to emphasize the stars
      groupRef.current.rotation.y += delta * rotSpeed;
      
      if (!isExploding) {
        groupRef.current.position.y = -3 + Math.sin(state.clock.getElapsedTime() * 0.5) * 0.15;
      }
    }

    // 2. Explosion Animation Logic
    const target = isExploding ? 1 : 0;
    explosionProgress.current = THREE.MathUtils.lerp(explosionProgress.current, target, delta * 1.5);

    instanceRefs.current.forEach((ref, i) => {
      if (!ref) return;
      const item = items[i];

      const expansion = Math.pow(explosionProgress.current, 0.5) * 12; // Wider explosion
      
      ref.position.x = item.originalPosition.x + item.explosionDir.x * expansion;
      ref.position.y = item.originalPosition.y + item.explosionDir.y * expansion;
      ref.position.z = item.originalPosition.z + item.explosionDir.z * expansion;

      if (explosionProgress.current > 0.1) {
         ref.rotation.x += delta * 0.5;
         ref.rotation.z += delta * 0.5;
         
         // Slower, magical pulsing rhythm
         const scalePulse = 1 + Math.sin(state.clock.getElapsedTime() * 2 + i) * 0.5; 
         ref.scale.setScalar(item.scale * scalePulse);
         
         // Force Gold Color when exploding
         if (ref.color) ref.color.set(GOLD_COLOR);
      } else {
         ref.rotation.x = item.rotation[0];
         ref.rotation.z = item.rotation[2];
         ref.scale.setScalar(item.scale);
         
         // Revert color when not exploding
         if (ref.color) ref.color.set(item.color);
      }
    });
  });

  return (
    <group ref={groupRef} position={[0, -3, 0]}>
      <Float speed={isExploding ? 0 : 2} rotationIntensity={isExploding ? 0 : 0.1} floatIntensity={isExploding ? 0 : 0.2}>
        
        {/* Layer 1: Foliage -> Turns to Gold Stars */}
        <Instances range={items.length}>
          <tetrahedronGeometry args={[0.8, 0]} />
          <meshPhysicalMaterial
            roughness={0.3}
            metalness={isExploding ? 1.0 : 0.1} // Full metal when exploding
            emissive={isExploding ? GOLD_COLOR : new THREE.Color(0,0,0)} // Glow gold
            emissiveIntensity={isExploding ? 2 : 0}
            flatShading={true}
            envMapIntensity={1}
            toneMapped={false}
          />
          {items.map((data, i) => {
            if (data.isOrnament) return null;
            return (
              <Instance 
                key={i} 
                ref={(el) => (instanceRefs.current[i] = el)}
                position={data.position} 
                scale={data.scale} 
                rotation={data.rotation}
                color={data.color}
              />
            );
          })}
        </Instances>

        {/* Layer 2: Ornaments -> Turns to Gold Stars */}
        <Instances range={items.length}>
          <sphereGeometry args={[0.6, 32, 32]} />
          <meshPhysicalMaterial
            roughness={0.1}
            metalness={0.8}
            emissive={isExploding ? GOLD_COLOR : new THREE.Color(0,0,0)}
            emissiveIntensity={isExploding ? 3 : 0}
            envMapIntensity={2.5}
            clearcoat={1}
            toneMapped={false}
          />
          {items.map((data, i) => {
            if (!data.isOrnament) return null;
            return (
              <Instance 
                key={i} 
                ref={(el) => (instanceRefs.current[i] = el)}
                position={data.position} 
                scale={data.scale} 
                color={data.color} 
              />
            );
          })}
        </Instances>

        {/* The Star Topper */}
        <mesh position={[0, 6.4, 0]} scale={isExploding ? 0 : 1}>
          <octahedronGeometry args={[0.8, 0]} />
          <meshPhysicalMaterial 
            color="#FFD700" 
            emissive="#FFD700"
            emissiveIntensity={2}
            toneMapped={false}
          />
          <Sparkles count={20} scale={2} size={4} speed={0.4} opacity={1} color="#FFF" />
        </mesh>
        
        {/* Internal Glow */}
        <pointLight 
            position={[0, 2, 0]} 
            intensity={isExploding ? 5 : 2} 
            color={isExploding ? "#FFD700" : "#F9E29C"} 
            distance={15} 
            decay={2} 
        />

      </Float>

      {/* Background Sparkles -> Turns Gold and Slow */}
      <Sparkles 
        count={isExploding ? 400 : 150} 
        scale={isExploding ? 25 : 8} 
        size={isExploding ? 6 : 3} 
        speed={isExploding ? 0.4 : 0.2} // Slower speed
        opacity={isExploding ? 0.8 : 0.4} 
        color={isExploding ? "#FFD700" : "#FFF"} // Gold color
        position={[0, 3, 0]}
      />
    </group>
  );
};