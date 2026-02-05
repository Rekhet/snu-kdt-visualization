import React, { useMemo, useEffect, useRef } from 'react';
import { useGLTF } from '@react-three/drei';
import * as THREE from 'three';
import { useTheme } from '../context/ThemeContext';

const MODEL_URL = 'models/human.glb';

export const PopulationGrid = ({ progress, prevalenceValue = 0 }) => {
  const { scene } = useGLTF(MODEL_URL);
  const { theme } = useTheme();
  const meshRef = useRef();
  
  const isDarkMode = theme === 'dark' || (theme === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches);
  const healthyColor = isDarkMode ? '#e2e8f0' : '#4e4849'; 

  // Extract geometry, material, and base orientation/scale
  const { geometry, material, baseQuaternion, baseScale } = useMemo(() => {
    let geom, mat, quat = new THREE.Quaternion(), sca = new THREE.Vector3(1, 1, 1);
    if (scene) {
        scene.updateMatrixWorld(true);
        scene.traverse((child) => {
        if ((child.isMesh || child.isSkinnedMesh) && !geom) {
            geom = child.geometry;
            child.getWorldQuaternion(quat);
            child.getWorldScale(sca);
            
            // Material must be white to allow instance colors to show correctly
            mat = new THREE.MeshStandardMaterial({ 
                color: '#ffffff', 
                roughness: 0.3,
                metalness: 0.2,
                transparent: true, 
                opacity: 0
            });
        }
        });
    }
    return { geometry: geom, material: mat, baseQuaternion: quat, baseScale: sca };
  }, [scene]);

  // Generate Positions for 10x10 Grid
  const { dummy, positions } = useMemo(() => {
    const dummy = new THREE.Object3D();
    const pos = [];
    const count = 100;
    const cols = 10;
    const spacing = 1.5; 

    for (let i = 0; i < count; i++) {
        if (i === 45) continue; 

        const row = Math.floor(i / cols);
        const col = i % cols;
        
        pos.push({
            x: (col - 4.5) * spacing,
            z: (row - 4.5) * spacing,
            y: -0.3 
        });
    }
    return { dummy, positions: pos };
  }, []);

  // Update Instances
  useEffect(() => {
    if (!meshRef.current || !geometry || !material) return;
    
    const baseGridScale = 0.5;
    const currentScale = baseGridScale * progress;
    
    // eslint-disable-next-line react-hooks/immutability
    material.opacity = progress * 0.6; 
    
    const normalColor = new THREE.Color(healthyColor);
    const affectedColor = new THREE.Color('crimson'); // Crimson for prevalence
    
    // 1 mesh = 1%. prevalenceValue is per 100,000.
    // So 1000 per 100k = 1%.
    const affectedCount = Math.round(prevalenceValue / 1000);

    positions.forEach((p, i) => {
        dummy.position.set(p.x, p.y, p.z);
        dummy.scale.set(
            currentScale * baseScale.x, 
            currentScale * baseScale.y, 
            currentScale * baseScale.z
        );
        dummy.quaternion.copy(baseQuaternion);
        dummy.updateMatrix();
        meshRef.current.setMatrixAt(i, dummy.matrix);

        // Color Logic: Top-down or random? 
        // Indices 0-99. Hero is at 45 (skipped in positions, but index matches loop).
        // Wait, loop index i here is from 0 to 98 (since 100 total - 1 hero).
        // We need to map i back to grid index to be consistent with hero.
        let gridIndex = i;
        if (i >= 45) gridIndex = i + 1;

        if (gridIndex < affectedCount) {
            meshRef.current.setColorAt(i, affectedColor);
        } else {
            meshRef.current.setColorAt(i, normalColor);
        }
    });
    
    meshRef.current.instanceMatrix.needsUpdate = true;
    if (meshRef.current.instanceColor) meshRef.current.instanceColor.needsUpdate = true;
    
  }, [progress, positions, dummy, geometry, material, baseQuaternion, baseScale, healthyColor, prevalenceValue]);

  if (!geometry) return null;

  return (
    <instancedMesh 
        ref={meshRef} 
        args={[geometry, material, 99]} 
    />
  );
};
