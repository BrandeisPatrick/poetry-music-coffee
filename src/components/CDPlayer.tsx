import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

interface CDPlayerProps {
    isTrayOpen: boolean;
    children?: React.ReactNode;
}

const CDPlayer: React.FC<CDPlayerProps> = ({ isTrayOpen, children }) => {
    const trayRef = useRef<THREE.Group>(null!);

    useFrame(() => {
        if (trayRef.current) {
            // Smoothly animate the tray's z position.
            const targetZ = isTrayOpen ? 2.2 : 0;
            trayRef.current.position.z = THREE.MathUtils.lerp(trayRef.current.position.z, targetZ, 0.1);
        }
    });

    const materials = useMemo(() => {
        const opaqueMaterial = new THREE.MeshStandardMaterial({ color: "#b0b0b0", metalness: 0.5, roughness: 0.4 });
        const transparentMaterial = new THREE.MeshStandardMaterial({
            color: new THREE.Color('#333333'),
            metalness: 0.2,
            roughness: 0.1,
            transparent: true,
            opacity: 0.3,
            depthWrite: false, // Prevents z-fighting with objects behind it
        });

        // BoxGeometry face order: right, left, top, bottom, front, back
        return [
            opaqueMaterial,      // right (+x)
            opaqueMaterial,      // left (-x)
            transparentMaterial, // top (+y)
            opaqueMaterial,      // bottom (-y)
            opaqueMaterial,      // front (+z)
            opaqueMaterial,      // back (-z)
        ];
    }, []);

    return (
        <group>
            {/* Main Body with transparent top */}
            <mesh castShadow receiveShadow material={materials}>
                <boxGeometry args={[3.5, 0.8, 3]} />
            </mesh>
            
            {/* Front Panel */}
            <mesh position={[0, 0, 1.51]}>
                 <boxGeometry args={[3.5, 0.8, 0.02]} />
                 <meshStandardMaterial color="#a0a0a0" metalness={0.6} roughness={0.3} />
            </mesh>

            {/* Tray group for independent movement */}
            <group ref={trayRef}>
                {/* Tray Base */}
                <mesh position={[0, 0.05, 0]} castShadow receiveShadow>
                    <boxGeometry args={[2.5, 0.1, 2.5]} />
                    <meshStandardMaterial color="#1a1a1a" metalness={0.2} roughness={0.7} />
                </mesh>
                {/* CD Spindle */}
                <mesh position={[0, 0.15, 0]}>
                    <cylinderGeometry args={[0.2, 0.2, 0.1, 32]} />
                     <meshStandardMaterial color="#e0e0e0" metalness={1} roughness={0.1} />
                </mesh>
                {/* The CD itself, passed as children */}
                {children}
            </group>
        </group>
    );
};

export default CDPlayer;