
import React, { Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, PerspectiveCamera, Environment, ContactShadows } from '@react-three/drei';
import { HeadModel } from './HeadModel';
import { GlassesModel } from './GlassesModel';
import { CalculationResult, FrameStyle } from '../types';

interface ThreeSceneProps {
  result: CalculationResult;
  input: {
    style: FrameStyle;
    eyesize: number;
    dbl: number;
  };
}

export default function ThreeScene({ result, input }: ThreeSceneProps) {
  return (
    <div className="w-full h-full">
      <Canvas shadows gl={{ alpha: true }}>
        <PerspectiveCamera makeDefault position={[0, 0, 3]} fov={40} />
        <OrbitControls 
          enablePan={false} 
          minDistance={2} 
          maxDistance={10}
          minPolarAngle={Math.PI / 4}
          maxPolarAngle={Math.PI - Math.PI / 4}
        />
        
        <ambientLight intensity={0.5} />
        <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} intensity={1} castShadow />
        <pointLight position={[-10, -10, -10]} intensity={0.5} />

        <Suspense fallback={null}>
          <group position={[0, 0.2, 0]}>
            <HeadModel />
            <GlassesModel 
              result={result} 
              style={input.style} 
              eyesize={input.eyesize} 
              dbl={input.dbl} 
            />
          </group>
          <Environment preset="city" />
          <ContactShadows 
            position={[0, -1.8, 0]} 
            opacity={0.4} 
            scale={10} 
            blur={2.5} 
            far={1.8} 
          />
        </Suspense>
      </Canvas>
    </div>
  );
}
