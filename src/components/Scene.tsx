import React, { useRef } from 'react';
import { OrbitControls } from '@react-three/drei';
import * as THREE from 'three';
import { Album } from '../types';
import CDPlayer from './CDPlayer';
import CD from './CD';

interface SceneProps {
  album: Album | null;
  isTrayOpen: boolean;
  isPlaying: boolean;
}

const Scene: React.FC<SceneProps> = ({ album, isTrayOpen, isPlaying }) => {
  return (
    <>
      <ambientLight intensity={0.8} />
      <directionalLight 
        position={[5, 10, 7.5]} 
        intensity={1.2} 
        castShadow 
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
        shadow-bias={-0.0001}
      />
      
      <OrbitControls 
        enablePan={false} 
        minDistance={5} 
        maxDistance={15} 
        minPolarAngle={Math.PI / 4}
        maxPolarAngle={Math.PI / 2}
      />

      <group position={[0, -1.5, 0]}>
        <CDPlayer isTrayOpen={isTrayOpen}>
          {album && <CD album={album} isPlaying={isPlaying && !isTrayOpen} />}
        </CDPlayer>

        {/* Floor */}
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.05, 0]} receiveShadow>
          <circleGeometry args={[10, 64]} />
          <meshStandardMaterial 
            color="#e3d5c2" 
            metalness={0.1} 
            roughness={0.9}
            />
        </mesh>
      </group>

       {/* Environment effects */}
       <fog attach="fog" args={['#e3d5c2', 15, 35]} />
    </>
  );
};

export default Scene;
