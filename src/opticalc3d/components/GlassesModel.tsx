
import React, { useMemo } from 'react';
import * as THREE from 'three';
import { useTexture } from '@react-three/drei';
import type { CalculationResult, FrameStyle } from '../types';

interface GlassesProps {
  result: CalculationResult;
  style: FrameStyle;
  eyesize: number;
  dbl: number;
}

export function GlassesModel({ result, style, eyesize, dbl }: GlassesProps) {
  // Use pal.png for reflection. useTexture will suspend.
  // The Suspense boundary in ThreeScene.tsx will handle the loading state.
  const reflectionTexture = useTexture('/opticalc3d/pal.png');
  
  if (reflectionTexture) {
    // Set as equirectangular so it "moves" like a real environment map
    reflectionTexture.mapping = THREE.EquirectangularReflectionMapping;
    
    // Zoom out the reflection by increasing repeat and adjusting offset
    reflectionTexture.repeat.set(2, 2);
    reflectionTexture.offset.set(-0.5, -0.25);
    reflectionTexture.wrapS = THREE.RepeatWrapping;
    reflectionTexture.wrapT = THREE.RepeatWrapping;
  }

  // Convert mm to scene units
  // Head width is ~2 units. A frame width of 140mm should be ~1.6 units.
  // 1.6 / 140 = 0.0114... let's use 0.014 for a snug fit.
  const scale = 0.014;
  const frameWidth = (eyesize * 2 + dbl) * scale;
  const frameHeight = (eyesize * 0.8) * scale; // Approximate B-size
  const dblScaled = dbl * scale;
  const eyesizeScaled = eyesize * scale;
  
  // Lens specific dimensions
  const centerThickness = result.centerThickness * scale;
  const maxEdgeThickness = Math.max(result.temporalEdgeThickness, result.nasalEdgeThickness) * scale;
  const frameDepth = result.frameDepth * scale;

  const frameColor = style === 'metal' ? '#a0a0a0' : style === 'plastic' ? '#202020' : '#404040';

  return (
    <group position={[0, -0.4, 0.9]} scale={[1, 1, 1]}>
      {/* Bridge */}
      <mesh position={[0, 0, 0]}>
        <boxGeometry args={[dblScaled, 2 * scale, 2 * scale]} />
        <meshStandardMaterial color={frameColor} />
      </mesh>

      {/* Lenses & Frames */}
      <LensPair 
        side="left" 
        eyesizeScaled={eyesizeScaled} 
        frameHeight={frameHeight} 
        dblScaled={dblScaled} 
        result={result}
        style={style}
        frameColor={frameColor}
        scale={scale}
        reflectionTexture={reflectionTexture}
      />
      <LensPair 
        side="right" 
        eyesizeScaled={eyesizeScaled} 
        frameHeight={frameHeight} 
        dblScaled={dblScaled} 
        result={result}
        style={style}
        frameColor={frameColor}
        scale={scale}
        reflectionTexture={reflectionTexture}
      />
    </group>
  );
}

function LensPair({ side, eyesizeScaled, frameHeight, dblScaled, result, style, frameColor, scale, reflectionTexture }: any) {
  const isLeft = side === 'left';
  const posX = (isLeft ? 1 : -1) * (dblScaled / 2 + eyesizeScaled / 2);
  
  const cT = result.centerThickness * scale;
  const tT = result.temporalEdgeThickness * scale;
  const nT = result.nasalEdgeThickness * scale;
  const fD = result.frameDepth * scale;

  // The lens should be positioned so the front surface is at the frame front
  // Any thickness beyond the frame depth shows out the back.
  
  return (
    <group position={[posX, 0, 0]}>
      {/* Frame Rim */}
      {style !== 'rimless' && (
        <mesh position={[0, 0, 0.01]}>
          <ringGeometry args={[eyesizeScaled / 2, (eyesizeScaled / 2) + (0.05 * eyesizeScaled), 32]} />
          <meshStandardMaterial color={frameColor} side={2} />
        </mesh>
      )}
      
      {/* Frame Sides (Depth) */}
      {(style === 'plastic' || style === 'metal' || style === 'semi-rimless') && (
        <mesh position={[0, 0, -fD / 2]} rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[ (eyesizeScaled / 2) + (0.01 * eyesizeScaled), (eyesizeScaled / 2) + (0.01 * eyesizeScaled), fD, 32, 1, true]} />
          <meshStandardMaterial color={frameColor} side={2} />
        </mesh>
      )}

      {/* Lens */}
      <LensBody 
        isLeft={isLeft}
        eyesize={eyesizeScaled}
        height={frameHeight}
        centerT={cT}
        temporalT={tT}
        nasalT={nT}
        frameD={fD}
        reflectionTexture={reflectionTexture}
      />
    </group>
  );
}

function LensBody({ isLeft, eyesize, height, centerT, temporalT, nasalT, frameD, reflectionTexture }: any) {
  const avgEdgeT = (temporalT + nasalT) / 2;
  const diff = temporalT - nasalT;
  
  // Calculate slant angle - temporal (outer) side is always thicker for minus decentered lenses
  // For a minus lens, decentration moves the OC towards the nose, 
  // making the temporal edge (outer) further from OC and thus THICKER.
  const angle = Math.atan(diff / eyesize) * (isLeft ? 1 : -1);

  return (
    <group position={[0, 0, 0]}>
       {/* Lens Cylinder Body */}
       <mesh 
         position={[0, 0, -avgEdgeT / 2]} 
         rotation={[Math.PI / 2, angle, 0]}
       >
        <cylinderGeometry args={[eyesize / 2, eyesize / 2, avgEdgeT, 32]} />
        
        {/* Material 1: The Side (thickness) - make it semi-opaque and slightly white like frosted glass */}
        <meshStandardMaterial 
          attach="material-0" 
          color="#ffffff" 
          transparent 
          opacity={0.85} 
          roughness={0.2} 
          metalness={0.1}
          envMapIntensity={1}
        />
        
        {/* Material 2 & 3: Front and Back - more transparent */}
        <meshStandardMaterial 
          attach="material-1" 
          color="#aaddff" 
          transparent 
          opacity={0.25} 
          roughness={0} 
          metalness={0.5}
        />
        <meshStandardMaterial 
          attach="material-2" 
          color="#aaddff" 
          transparent 
          opacity={0.25} 
          roughness={0} 
          metalness={0.5}
        />
      </mesh>
      
      {/* Highly reflective surface overlay for realism with pal.png texture */}
      <mesh position={[0, 0, 0.005]}>
        <circleGeometry args={[eyesize / 2, 32]} />
        <meshStandardMaterial 
          envMap={reflectionTexture}
          color="#ffffff" 
          transparent 
          opacity={0.35} 
          roughness={0} 
          metalness={1}
          envMapIntensity={2.5}
        />
      </mesh>
    </group>
  );
}
