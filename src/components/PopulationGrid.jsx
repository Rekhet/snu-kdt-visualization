import React, { useMemo, useEffect, useRef } from 'react';
import { useGLTF } from '@react-three/drei';
import * as THREE from 'three';
import { useTheme } from '../context/ThemeContext';

const MODEL_URL = 'models/human.glb';

export const PopulationGrid = ({ progress }) => {
  const { scene } = useGLTF(MODEL_URL);
  const { theme } = useTheme();
  const meshRef = useRef();
  
  const isDarkMode = theme === 'dark' || (theme === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches);
  const materialColor = isDarkMode ? '#e2e8f0' : '#4e4849';

  // Extract geometry, material, and base orientation/scale
  const { geometry, material, baseQuaternion, baseScale } = useMemo(() => {
    let geom, mat, quat = new THREE.Quaternion(), sca = new THREE.Vector3(1, 1, 1);
    if (scene) {
        // Ensure world matrices are up to date before capturing orientation/scale
        scene.updateMatrixWorld(true);
        scene.traverse((child) => {
        if ((child.isMesh || child.isSkinnedMesh) && !geom) {
            geom = child.geometry;
            // Capture world orientation and scale to account for any node transforms in the GLB
            child.getWorldQuaternion(quat);
            child.getWorldScale(sca);
            // Match the main mesh color but keep ghost-like transparency
            mat = new THREE.MeshStandardMaterial({ 
                color: materialColor,
                roughness: 0.3,
                metalness: 0.2,
                transparent: true, 
                opacity: 0
            });
        }
        });
    }
    return { geometry: geom, material: mat, baseQuaternion: quat, baseScale: sca };
  }, [scene, materialColor]);

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
    const baseGridScale = 0.5;
    const currentScale = baseGridScale * progress;
    
    // Update opacity based on progress
    // eslint-disable-next-line react-hooks/immutability
    material.opacity = progress * 0.6; // Slightly more transparent than hero
    
    positions.forEach((p, i) => {
        dummy.position.set(p.x, p.y, p.z);
        // Combine base grid scale with GLB native scale
        dummy.scale.set(
            currentScale * baseScale.x, 
            currentScale * baseScale.y, 
            currentScale * baseScale.z
        );
        
        // Apply captured orientation
        dummy.quaternion.copy(baseQuaternion);
        
        dummy.updateMatrix();
        meshRef.current.setMatrixAt(i, dummy.matrix);
    });
    meshRef.current.instanceMatrix.needsUpdate = true;
  }, [progress, positions, dummy, geometry, material, baseQuaternion, baseScale]);

  if (!geometry) return null;

  return (
    <instancedMesh 
        ref={meshRef} 
        args={[geometry, material, 99]} 
    />
  );
};
