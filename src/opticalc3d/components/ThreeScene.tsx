
import React, { Suspense, Component, ReactNode } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, PerspectiveCamera, Environment, ContactShadows } from '@react-three/drei';
import * as THREE from 'three';
import { HeadModel } from './HeadModel';
import { GlassesModel } from './GlassesModel';
import type { CalculationResult, FrameStyle } from '../types';

interface ThreeSceneProps {
  result: CalculationResult;
  input: {
    style: FrameStyle;
    eyesize: number;
    dbl: number;
  };
}

class ErrorBoundary extends Component<{ children: ReactNode }, { hasError: boolean }> {
  constructor(props: { children: ReactNode }) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error: any, errorInfo: any) {
    console.error("ThreeJS Error:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex items-center justify-center h-full bg-slate-100 text-slate-500 font-bold uppercase tracking-widest text-[10px] text-center p-8">
          Simulation Error: Hardware acceleration or asset loading failure.<br/>
          Please refresh or check your internet connection.
        </div>
      );
    }
    return this.props.children;
  }
}

export default function ThreeScene({ result, input }: ThreeSceneProps) {
  return (
    <div className="w-full h-full">
      <ErrorBoundary>
        <Canvas shadows={{ type: THREE.PCFShadowMap }} gl={{ alpha: true }}>
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
      </ErrorBoundary>
    </div>
  );
}
