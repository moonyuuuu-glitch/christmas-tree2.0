import React, { Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { Environment, OrbitControls, ContactShadows, Stars } from '@react-three/drei';
import { EffectComposer, Bloom, Vignette, Noise } from '@react-three/postprocessing';
import { LuxuryTree } from './Tree';

// Augment JSX namespace to recognize Three.js elements
declare global {
  namespace JSX {
    interface IntrinsicElements {
      ambientLight: any;
      spotLight: any;
      pointLight: any;
    }
  }
}

// Augment React.JSX namespace for compatibility with newer React types
declare module 'react' {
  namespace JSX {
    interface IntrinsicElements {
      ambientLight: any;
      spotLight: any;
      pointLight: any;
    }
  }
}

interface SceneProps {
  isExploding: boolean;
}

const SceneContent: React.FC<SceneProps> = ({ isExploding }) => {
  return (
    <>
      {/* Cinematic Lighting */}
      <ambientLight intensity={0.2} />
      <spotLight 
        position={[10, 10, 10]} 
        angle={0.15} 
        penumbra={1} 
        intensity={2} 
        color="#FFD700" 
      />
      <pointLight position={[-10, -10, -10]} intensity={1} color="#004020" />

      {/* Environment Map for reflections (critical for gold/glass) */}
      <Environment preset="city" />

      {/* The Star of the Show */}
      <LuxuryTree isExploding={isExploding} />
      
      {/* Background Ambience */}
      <Stars radius={100} depth={50} count={5000} factor={4} saturation={0} fade speed={1} />

      {/* Ground Shadow */}
      <ContactShadows 
        opacity={0.7} 
        scale={20} 
        blur={2} 
        far={10} 
        resolution={256} 
        color="#000000" 
        position={[0, -3.5, 0]}
      />

      {/* Camera Controls */}
      <OrbitControls 
        enablePan={false} 
        enableZoom={true} 
        minPolarAngle={Math.PI / 4} 
        maxPolarAngle={Math.PI / 2}
        autoRotate={!isExploding} // Stop rotation during explosion to emphasize the burst
        autoRotateSpeed={0.5}
      />

      {/* Post Processing for the "Cinematic" Look */}
      <EffectComposer disableNormalPass>
        {/* Intense Bloom for the Glow */}
        <Bloom 
          luminanceThreshold={0.8} 
          mipmapBlur 
          intensity={1.5} 
          radius={0.4} 
        />
        <Vignette eskil={false} offset={0.1} darkness={1.1} />
        <Noise opacity={0.02} />
      </EffectComposer>
    </>
  );
};

export const Scene: React.FC<SceneProps> = ({ isExploding }) => {
  return (
    <div className="absolute inset-0 z-0 bg-gradient-to-b from-slate-950 via-[#021810] to-slate-950">
      <Canvas
        shadows
        camera={{ position: [0, 0, 12], fov: 35 }}
        dpr={[1, 2]} // Quality scaling
        gl={{ antialias: false, toneMappingExposure: 1.5 }}
      >
        <Suspense fallback={null}>
          <SceneContent isExploding={isExploding} />
        </Suspense>
      </Canvas>
    </div>
  );
};