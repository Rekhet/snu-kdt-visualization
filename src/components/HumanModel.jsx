import React, { useState, useEffect } from 'react';
import { useCursor, useGLTF } from '@react-three/drei';
import * as THREE from 'three';
import { useTheme } from '../context/ThemeContext';

// URL to local model
const MODEL_URL = 'models/human.glb';

// --- Reusable Hitbox Component ---
const Hitbox = ({ 
  id, 
  geometry, 
  position, 
  rotation = [0, 0, 0], 
  scale = [1, 1, 1], 
  onSelect,
  onDoubleClick, 
  setHovered,
  debug = false 
}) => {
  return (
    <mesh
      name={id}
      position={position}
      rotation={rotation}
      scale={scale}
      onDoubleClick={(e) => {
        e.stopPropagation();
        // Trigger the zoom-in event
        if (onDoubleClick) onDoubleClick(id);
      }}
      onClick={(e) => {
        e.stopPropagation();
        // Trigger the select (popup) event
        if (onSelect) onSelect(id);
      }}
      onPointerOver={(e) => {
        e.stopPropagation();
        setHovered(id);
      }}
      onPointerOut={() => {
        setHovered(null);
      }}
    >
      {geometry}
      {/* Mesh is always visible to stay raycastable, but opacity is 0 when not in debug/mesh mode */}
      <meshBasicMaterial 
        color="#ff0000" 
        wireframe={true} 
        visible={true} 
        transparent={true}
        opacity={debug ? 0.5 : 0}
      />
    </mesh>
  );
};

const HumanModel = ({ onPartSelect, onPartDoubleClick, showWireframe, onHoverChange, prevalenceValue = null }) => {
  const [hovered, setHovered] = useState(null);
  const { theme } = useTheme();
  
  const isDarkMode = theme === 'dark' || (theme === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches);

  useCursor(!!hovered);

  useEffect(() => {
    if (onHoverChange) {
      onHoverChange(hovered);
    }
  }, [hovered, onHoverChange]);

  // Load the external model
  const { scene } = useGLTF(MODEL_URL);
  
  // Clone the scene so we can modify materials without affecting cache
  const modelScene = React.useMemo(() => {
    if (!scene) return null;
    
    const cloned = scene.clone();
    
    // Determine color based on prevalenceValue (if in grid mode)
    // The hero mesh is index 45 in the 10x10 grid.
    // affectedCount = prevalenceValue / 1000.
    let materialColor = isDarkMode ? '#e2e8f0' : '#4e4849';
    if (prevalenceValue !== null) {
        const affectedCount = Math.round(prevalenceValue / 1000);
        if (45 < affectedCount) {
            materialColor = 'crimson'; // Match "Affected" color in grid
        }
    }

    // Apply "Glass" material to the human mesh
    cloned.traverse((child) => {
      if (child.isMesh || child.isSkinnedMesh) {
        // Adjust material for better visibility on light background
        child.material = new THREE.MeshPhysicalMaterial({
          color: materialColor, 
          transmission: 0.6,
          opacity: 0.8,
          transparent: true,
          roughness: 0.2,
          metalness: 0.1,
          thickness: 1.0,
          ior: 1.5,
          side: THREE.DoubleSide
        });
        child.castShadow = true;
        child.receiveShadow = true;
        // Disable raycasting on the visual model so it doesn't block hitboxes
        child.raycast = () => null;
      }
    });
    return cloned;
  }, [scene, isDarkMode, prevalenceValue]);

  // Shared props for hitboxes
  const boxProps = {
    onSelect: onPartSelect,
    onDoubleClick: onPartDoubleClick,
    setHovered,
    debug: showWireframe
  };

  return (
    <group dispose={null}>
      
      {/* --- MASTER GROUP --- 
          We apply the User's scale/pos/rot HERE so children move together 
      */}
      <group 
        position={[0, 0.7, 0]} 
        scale={[0.5, 0.5, 0.5]} 
        rotation={[0, 0, 0]}
      >
        
        {/* 1. The Model (Local transforms reset) */}
        {modelScene && (
          <primitive 
            object={modelScene} 
          />
        )}

        {/* 2. Hitboxes (Attached to the model's space) 
            Adjust the 'position' of these to match the model parts.
        */}
        
        {/* Example: Head */}
        <Hitbox
          id="head"
          {...boxProps}
          position={[0, 4.2, 0]}
          geometry={<sphereGeometry args={[0.32, 20, 20]} />}
        />
        
        {/* Neck (Linked to Head) */}
        <Hitbox
          id="head"
          {...boxProps}
          position={[0, 3.85, 0]}
          geometry={<cylinderGeometry args={[0.15, 0.15, 0.35, 16]} />}
        />

        {/* Example: Torso */}
        <Hitbox
          id="torso"
          {...boxProps}
          position={[0, 3.1, -0.05]}
          geometry={<cylinderGeometry args={[0.36, 0.3, 1.4, 32]} />}
        />

      </group>
    </group>
  );
};

// Preload the model
useGLTF.preload(MODEL_URL);

export default HumanModel;
