import React, { useState, useEffect, useRef, Suspense } from 'react';
import { Canvas, useThree } from '@react-three/fiber';
import { CameraControls, Environment, ContactShadows, Html, useProgress } from '@react-three/drei';
import HumanModel from '../components/HumanModel';
import Overlay from '../components/Overlay';
import * as THREE from 'three';

// Fallback loader
function Loader() {
  const { progress } = useProgress();
  return <Html center className="text-gray-400 font-mono text-xs tracking-wider uppercase animate-pulse">{progress.toFixed(0)}% Loading Model</Html>;
}

// Error Boundary for 3D content
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    console.error("3D Error:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return <Html center className="text-red-500 font-medium">Failed to load 3D Model</Html>;
    }
    return this.props.children;
  }
}

// This component handles the camera movement based on selection
const CameraHandler = ({ selectedId, resetTrigger, zoomLevel = 1 }) => {
  const { scene } = useThree();
  const controlsRef = useRef();

  useEffect(() => {
    if (!controlsRef.current) return;

    if (selectedId) {
      const targetObject = scene.getObjectByName(selectedId);
      if (targetObject) {
        // Fit camera to the object with padding
        const padding = zoomLevel === 2 ? 0.2 : 1.0; 
        controlsRef.current.fitToBox(targetObject, true, { 
          paddingTop: padding, 
          paddingLeft: padding, 
          paddingBottom: padding, 
          paddingRight: padding 
        });
      }
    } else {
      // Reset view - Explicitly set position and target to default
      controlsRef.current.setLookAt(0, 1.5, 4, 0, 1.0, 0, true);
    }
  }, [selectedId, resetTrigger, scene, zoomLevel]);

  return (
    <CameraControls 
      ref={controlsRef} 
      makeDefault
      minDistance={0.5} 
      maxDistance={6}
      dollySpeed={0.8}
      dollyToCursor={true}
      smoothTime={0.4}
      // Allow full rotation around the object
      minPolarAngle={0} 
      maxPolarAngle={Math.PI}
      minAzimuthAngle={-Infinity}
      maxAzimuthAngle={Infinity}
    />
  );
};

export default function Home({ 
  selectedId, 
  onSelect, 
  resetTrigger, 
  onReset,
  zoomLevel, 
  setZoomLevel,
  showWireframe 
}) {
  const [hoveredPart, setHoveredPart] = useState(null);

  const handlePartDoubleClick = (id) => {
    onSelect(id);
    setZoomLevel(2); // Trigger x2 zoom
  };

  return (
      <main className="flex-1 relative w-full h-full">
         <div className="absolute inset-0 bg-gray-100">
            <Canvas
              camera={{ position: [0, 1.5, 4], fov: 45 }}
              shadows
              dpr={[1, 2]} 
            >
              <color attach="background" args={['#f3f4f6']} />
              
              <ambientLight intensity={0.8} />
              <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} intensity={1} castShadow shadow-bias={-0.0001} />
              <directionalLight position={[-5, 5, 5]} intensity={0.6} />

              <Environment preset="city" />

              <group position={[0, -1, 0]}>
                <ErrorBoundary>
                  <Suspense fallback={<Loader />}>
                      <HumanModel 
                        onPartSelect={(id) => {
                            if (id !== selectedId) {
                                onSelect(id);
                                setZoomLevel(1);
                            }
                        }}
                        onPartDoubleClick={handlePartDoubleClick}
                        showWireframe={showWireframe}
                        onHoverChange={setHoveredPart}
                      />
                  </Suspense>
                </ErrorBoundary>
                <ContactShadows opacity={0.3} scale={10} blur={2.5} far={4} resolution={256} color="#000000" />
              </group>

              {/* Controls logic */}
              <CameraHandler 
                selectedId={selectedId} 
                resetTrigger={resetTrigger} 
                zoomLevel={zoomLevel}
              />

            </Canvas>
         </div>

         {/* Overlay (UI Layer on top of Canvas) */}
         <Overlay 
            selectedId={selectedId} 
            onSelect={(id) => {
                onSelect(id);
                setZoomLevel(1);
            }} 
            onReset={onReset} 
            showWireframe={showWireframe}
            hoveredPart={hoveredPart}
         />
      </main>
  );
}
