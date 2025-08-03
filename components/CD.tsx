import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { useTexture } from '@react-three/drei';
import * as THREE from 'three';
import { Album } from '../types';

interface CDProps {
  album: Album;
  isPlaying: boolean;
}

const CD: React.FC<CDProps> = ({ album, isPlaying }) => {
    const cdSpinRef = useRef<THREE.Group>(null!);
    
    // Add error handling for texture loading
    const texture = useTexture(album.coverUrl, undefined, undefined, (error) => {
        console.warn('Failed to load album cover:', album.coverUrl, error);
    });

    const innerRadius = 0.22;
    const outerRadius = 1.2;
    const thickness = 0.03;

    // --- Geometry created to lie flat on the XZ plane ---

    const topRingGeo = useMemo(() => {
        const geo = new THREE.RingGeometry(innerRadius, outerRadius, 128, 1);
        // Rotate geometry to be horizontal (on the XZ plane)
        geo.rotateX(-Math.PI / 2);
        
        const pos = geo.attributes.position;
        const uv = geo.attributes.uv;
        // Recalculate UVs based on X and Z coordinates for the horizontal disc
        for (let i = 0; i < pos.count; i++) {
            const x = pos.getX(i);
            const z = pos.getZ(i);
            uv.setXY(i, x / (outerRadius * 2) + 0.5, z / (outerRadius * 2) + 0.5);
        }
        return geo;
    }, []);

    const bottomRingGeo = useMemo(() => {
        const geo = new THREE.RingGeometry(innerRadius, outerRadius, 128, 1);
        geo.rotateX(-Math.PI / 2);
        return geo;
    }, []);

    // Cylinder height is along the Y axis, which is now correct for thickness
    const edgeCylinderGeo = useMemo(() => new THREE.CylinderGeometry(outerRadius, outerRadius, thickness, 128, 1, true), []);
    const innerEdgeCylinderGeo = useMemo(() => new THREE.CylinderGeometry(innerRadius, innerRadius, thickness, 64, 1, true), []);

    useFrame((_, delta) => {
        if (cdSpinRef.current && isPlaying) {
            // Spin around the Y axis, which is the correct vertical axis for a horizontal disc
            cdSpinRef.current.rotation.y += delta * 2.5;
        }
    });
    
    const bottomMaterial = useMemo(() => new THREE.MeshStandardMaterial({
        color: '#888899',
        metalness: 0.8,
        roughness: 0.1,
    }), []);

    const sideMaterial = useMemo(() => new THREE.MeshStandardMaterial({
        color: '#666666',
        metalness: 0.4,
        roughness: 0.8,
    }), []);

    const topMaterial = useMemo(() => new THREE.MeshStandardMaterial({
        map: texture,
        roughness: 0.6,
        metalness: 0.1,
    }), [texture]);
    
    // Position the CD on top of the tray base (which is at y=0.1)
    const yPosition = 0.1;

    return (
        // Static group for positioning
        <group position={[0, yPosition, 0]}>
            {/* Inner group for the spinning animation */}
            <group ref={cdSpinRef}>
                {/* Top Surface (Label) */}
                <mesh
                    geometry={topRingGeo}
                    material={topMaterial}
                    position-y={thickness / 2}
                    castShadow={false}
                    receiveShadow={false}
                />

                {/* Bottom Surface (Data Layer) */}
                <mesh
                    geometry={bottomRingGeo}
                    material={bottomMaterial}
                    position-y={-thickness / 2}
                    rotation-x={Math.PI} // Flip to face downwards
                    castShadow={false}
                    receiveShadow
                />
                
                {/* Outer Edge */}
                <mesh 
                    geometry={edgeCylinderGeo} 
                    material={sideMaterial} 
                    castShadow={false} 
                    receiveShadow 
                />

                {/* Inner Edge */}
                <mesh 
                    geometry={innerEdgeCylinderGeo} 
                    material={sideMaterial} 
                    castShadow={false} 
                    receiveShadow 
                />
            </group>
        </group>
    );
};

export default CD;
