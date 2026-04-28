
import React from 'react';

export function HeadModel() {
  return (
    <group position={[0, -0.5, 0]}>
      {/* Basic Head Shape (Egg-like) */}
      <mesh position={[0, 0, 0]} scale={[1, 1.3, 0.9]}>
        <sphereGeometry args={[1, 32, 32]} />
        <meshStandardMaterial color="#fcd4b4" roughness={0.7} />
      </mesh>

      {/* Eyebrows */}
      <group position={[0, 0.28, 0.85]}>
        <mesh position={[0.32, 0, 0]} rotation={[0, 0.1, 0]}>
          <boxGeometry args={[0.25, 0.04, 0.02]} />
          <meshStandardMaterial color="#4b3621" />
        </mesh>
        <mesh position={[-0.32, 0, 0]} rotation={[0, -0.1, 0]}>
          <boxGeometry args={[0.25, 0.04, 0.02]} />
          <meshStandardMaterial color="#4b3621" />
        </mesh>
      </group>

      {/* Eyes Section */}
      <group position={[0, 0.1, 0.78]}>
        {/* Left Eye */}
        <group position={[0.32, 0, 0]}>
          {/* Eyeball */}
          <mesh>
            <sphereGeometry args={[0.1, 16, 16]} />
            <meshStandardMaterial color="#ffffff" roughness={0.1} />
          </mesh>
          {/* Iris (Blue) */}
          <mesh position={[0, 0, 0.07]}>
            <sphereGeometry args={[0.06, 16, 16, 0, Math.PI * 2, 0, Math.PI / 3]} />
            <meshStandardMaterial color="#225588" roughness={0.2} />
          </mesh>
          {/* Pupil */}
          <mesh position={[0, 0, 0.085]}>
            <sphereGeometry args={[0.035, 16, 16]} />
            <meshStandardMaterial color="#000000" roughness={0.1} />
          </mesh>
          {/* Upper Eyelid */}
          <mesh position={[0, 0.04, 0.02]} rotation={[-0.5, 0, 0]}>
            <sphereGeometry args={[0.105, 16, 16, 0, Math.PI * 2, 0, Math.PI / 2]} />
            <meshStandardMaterial color="#fcd4b4" roughness={0.8} />
          </mesh>
        </group>

        {/* Right Eye */}
        <group position={[-0.32, 0, 0]}>
          {/* Eyeball */}
          <mesh>
            <sphereGeometry args={[0.1, 16, 16]} />
            <meshStandardMaterial color="#ffffff" roughness={0.1} />
          </mesh>
          {/* Iris (Blue) */}
          <mesh position={[0, 0, 0.07]}>
            <sphereGeometry args={[0.06, 16, 16, 0, Math.PI * 2, 0, Math.PI / 3]} />
            <meshStandardMaterial color="#225588" roughness={0.2} />
          </mesh>
          {/* Pupil */}
          <mesh position={[0, 0, 0.085]}>
            <sphereGeometry args={[0.035, 16, 16]} />
            <meshStandardMaterial color="#000000" roughness={0.1} />
          </mesh>
          {/* Upper Eyelid */}
          <mesh position={[0, 0.04, 0.02]} rotation={[-0.5, 0, 0]}>
            <sphereGeometry args={[0.105, 16, 16, 0, Math.PI * 2, 0, Math.PI / 2]} />
            <meshStandardMaterial color="#fcd4b4" roughness={0.8} />
          </mesh>
        </group>
      </group>

      {/* Mouth */}
      <mesh position={[0, -0.45, 0.75]} rotation={[0.1, 0, 0]}>
        <torusGeometry args={[0.12, 0.015, 8, 32, Math.PI / 1.5]} />
        <meshStandardMaterial color="#e0a0a0" roughness={0.5} />
      </mesh>

      {/* Ears */}
      <mesh position={[1, 0, -0.1]} rotation={[0, 0.2, 0]}>
        <sphereGeometry args={[0.15, 16, 16, 0, Math.PI * 2, 0, Math.PI / 2]} />
        <meshStandardMaterial color="#fcd4b4" />
      </mesh>
      <mesh position={[-1, 0, -0.1]} rotation={[0, -0.2, 0]}>
        <sphereGeometry args={[0.15, 16, 16, 0, Math.PI * 2, 0, Math.PI / 2]} />
        <meshStandardMaterial color="#fcd4b4" />
      </mesh>

      {/* Nose */}
      <mesh position={[0, -0.1, 0.9]}>
        <coneGeometry args={[0.15, 0.4, 4]} />
        <meshStandardMaterial color="#fcd4b4" />
      </mesh>
    </group>
  );
}
