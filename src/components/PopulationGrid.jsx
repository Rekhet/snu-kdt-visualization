import React, { useMemo, useEffect, useRef } from 'react';
import { useGLTF } from '@react-three/drei';
import * as THREE from 'three';

const MODEL_URL = 'models/human.glb';

export const PopulationGrid = ({ progress }) => {
  const { scene } = useGLTF(MODEL_URL);
  const meshRef = useRef();
  
  // Extract geometry, material, and base orientation
  const { geometry, material, baseQuaternion } = useMemo(() => {
    let geom, mat, quat = new THREE.Quaternion();
    if (scene) {
        // Ensure world matrices are up to date before capturing orientation
        scene.updateMatrixWorld(true);
        scene.traverse((child) => {
        if ((child.isMesh || child.isSkinnedMesh) && !geom) {
            geom = child.geometry;
            // Capture world orientation to account for any node rotations in the GLB
            child.getWorldQuaternion(quat);
            // Use a ghost-like material for the population
            mat = new THREE.MeshStandardMaterial({ 
                color: '#64748b', // Slate-500
                roughness: 0.5,
                metalness: 0.5,
                transparent: true, 
                opacity: 0
            });
        }
        });
    }
    return { geometry: geom, material: mat, baseQuaternion: quat };
  }, [scene]);

  // Generate Positions for 10x10 Grid
  const { dummy, positions } = useMemo(() => {
    const dummy = new THREE.Object3D();
    const pos = [];
    const count = 100;
    const cols = 10;
    const spacing = 1.5; // Distance between humans (tuned for 0.5 scale)

    for (let i = 0; i < count; i++) {
        // Skip the "Hero" slot (approx center of 10x10)
        // Row 4, Col 5 => Index 45 (since 0-based: 4 * 10 + 5)
        if (i === 45) continue; 

        const row = Math.floor(i / cols);
        const col = i % cols;
        
        pos.push({
            x: (col - 4.5) * spacing,
            z: (row - 4.5) * spacing,
            y: -0.3 // Floor level (-1) + HumanModel internal offset (0.7)
        });
    }
    return { dummy, positions: pos };
  }, []);

  // Update Instances
  useEffect(() => {
    if (!meshRef.current || !geometry || !material) return;
    
    // Scale logic: 
    // The grid items grow from 0 to 0.5 (base scale)
    const baseScale = 0.5;
    const currentScale = baseScale * progress;
    
    // Update opacity based on progress
    // eslint-disable-next-line react-hooks/immutability
    material.opacity = progress; 
    
    positions.forEach((p, i) => {
        dummy.position.set(p.x, p.y, p.z);
        dummy.scale.set(currentScale, currentScale, currentScale);
        
        // Apply captured orientation
        dummy.quaternion.copy(baseQuaternion);
        
        dummy.updateMatrix();
        meshRef.current.setMatrixAt(i, dummy.matrix);
    });
    meshRef.current.instanceMatrix.needsUpdate = true;
  }, [progress, positions, dummy, geometry, material, baseQuaternion]);

  if (!geometry) return null;

  return (
    <instancedMesh 
        ref={meshRef} 
        args={[geometry, material, 99]} 
    />
  );
};
