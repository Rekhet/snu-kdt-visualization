import React, { useState, useEffect, useRef, Suspense } from 'react';
import { Canvas, useThree, useFrame } from '@react-three/fiber';
import { CameraControls, Environment, ContactShadows, Html, useProgress } from '@react-three/drei';
import HumanModel from '../components/HumanModel';
import Overlay from '../components/Overlay';
import NavigationControls from '../components/NavigationControls';
import FloatingScrollButton from '../components/FloatingScrollButton';
import BarChartRace from '../components/BarChartRace';
import { PopulationGrid } from '../components/PopulationGrid';
import * as THREE from 'three';
import { useTheme } from '../context/ThemeContext';
import { SCROLL_CONFIG, getPhaseProgress } from '../config/scrollConfig';

// Fallback loader
function Loader() {
  const { progress } = useProgress();
  return <Html center className="text-text-muted font-mono text-xs tracking-wider uppercase animate-pulse">{progress.toFixed(0)}% Loading Model</Html>;
}

// Error Boundary
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }
  static getDerivedStateFromError() { return { hasError: true }; }
  componentDidCatch(error, errorInfo) { console.error("3D Error:", error, errorInfo); }
  render() {
    if (this.state.hasError) return <Html center className="text-red-500 font-medium">Failed to load 3D Model</Html>;
    return this.props.children;
  }
}

// --- Scroll & Animation Logic ---
const ScrollScene = ({ interactionMode, modelGroupRef, setGridProgress }) => {
  const { camera } = useThree();
  const vec = new THREE.Vector3();
  const targetVec = new THREE.Vector3();

  // Config Points
  const posStart = new THREE.Vector3(0, 1.5, 12);
  const posSingle = new THREE.Vector3(0, 1.5, 4);
  const posGrid = new THREE.Vector3(0, 10, 15); // High angle for grid

  // Hero migration targets (Index 45 slot: col 5, row 4)
  const heroGridPos = new THREE.Vector3(0.75, -1, -0.75);
  const heroStartPos = new THREE.Vector3(0, -1, 0);

  useFrame(() => {
    const scrollThreshold = window.innerHeight * SCROLL_CONFIG.thresholdFactor;
    const scrollY = window.scrollY;
    const progress = Math.min(scrollY / scrollThreshold, 1);
    
    // --- Phase Logic ---

    // 1. Title Fade (Handled in Home component)

    // 2. Model Reveal (0 -> 1 scale)
    const revealP = getPhaseProgress(progress, SCROLL_CONFIG.phases.modelReveal);
    const revealScale = SCROLL_CONFIG.easing.smoothOut(revealP);

    // 3. Single View Interaction Zone
    // (Handled in Home component via scroll listener to avoid R3F state loop)
    
    // 4. Grid Expansion
    const gridP = getPhaseProgress(progress, SCROLL_CONFIG.phases.gridReveal);
    const gridEase = SCROLL_CONFIG.easing.easeInOut(gridP);
    
    // Update Grid Component
    setGridProgress(gridEase);

    // --- Animations ---

    // A. Camera Movement (ONLY if NOT interacting)
    if (!interactionMode) {
        if (gridP > 0) {
            // Transition Single -> Grid
            vec.lerpVectors(posSingle, posGrid, gridEase);
            camera.position.copy(vec);
            // Look slightly down at grid center
            targetVec.set(0, 0, 0);
            camera.lookAt(targetVec);
        } else {
            // Transition Intro -> Single
            vec.lerpVectors(posStart, posSingle, revealP);
            camera.position.copy(vec);
            camera.lookAt(0, 1.0, 0);
        }
    }

    // B. Hero Model Animation (Always runs so world reflects scroll state)
    if (modelGroupRef.current) {
        if (gridP > 0) {
            // Migrating to Grid
            // Scale: 1 -> 0.5
            const s = 1 - (gridEase * 0.5);
            modelGroupRef.current.scale.set(s, s, s);
            
            // Pos: Center -> Grid Slot
            modelGroupRef.current.position.lerpVectors(heroStartPos, heroGridPos, gridEase);
            
            // Reset rotation to face forward for grid
            modelGroupRef.current.rotation.y = 0;
        } else {
            // Revealing
            modelGroupRef.current.scale.set(revealScale, revealScale, revealScale);
            modelGroupRef.current.position.copy(heroStartPos);
            // Spin in
            modelGroupRef.current.rotation.y = (1 - revealScale) * Math.PI * 0.5;
        }
    }
  });

  return null;
};

// --- Interactive Camera Handler ---
const CameraHandler = ({ isLocked, selectedId, zoomLevel, resetTrigger, onControlReady }) => {
  const controlsRef = useRef();
  const { scene, camera } = useThree();

  useEffect(() => {
    if (controlsRef.current && onControlReady) {
      onControlReady(controlsRef.current);
    }
  }, [onControlReady]);

  // Sync controls state when locking (Entering interaction mode)
  useEffect(() => {
    if (controlsRef.current) {
        if (isLocked) {
            controlsRef.current.setLookAt(
                camera.position.x, camera.position.y, camera.position.z,
                0, 1.0, 0,
                false
            );
        }
    }
  }, [isLocked, camera]);

  // Restore Zoom/Reset Logic
  useEffect(() => {
    if (!controlsRef.current || !isLocked) return;

    if (selectedId) {
      const targetObject = scene.getObjectByName(selectedId);
      if (targetObject) {
        const padding = zoomLevel === 2 ? 0.2 : 1.0; 
        controlsRef.current.fitToBox(targetObject, true, { 
          paddingTop: padding, 
          paddingLeft: padding, 
          paddingBottom: padding, 
          paddingRight: padding 
        });
      }
    } else {
      // Standard Reset
      controlsRef.current.setLookAt(0, 1.5, 4, 0, 1.0, 0, true);
    }
  }, [selectedId, zoomLevel, isLocked, scene, resetTrigger]);

  return (
    <CameraControls 
      ref={controlsRef} 
      enabled={isLocked}
      minDistance={0.5} 
      maxDistance={15}
      dollySpeed={0.8}
      smoothTime={0.4}
      minPolarAngle={0} 
      maxPolarAngle={Math.PI}
      mouseButtons={{
        left: 1, 
        middle: 2, 
        right: 0, 
        wheel: 0
      }}
      touches={{
        one: 32,
        two: 512,
        three: 0
      }}
    />
  );
};

export default function Home({ 
  selectedId, onSelect, resetTrigger, onReset, 
  zoomLevel, setZoomLevel, showWireframe 
}) {
  const [hoveredPart, setHoveredPart] = useState(null);
  const [cameraControls, setCameraControls] = useState(null);
  
  // State for modes
  const [interactionMode, setInteractionMode] = useState(false);
  const [isInScrollZone, setIsInScrollZone] = useState(false);

  const [titleOpacity, setTitleOpacity] = useState(1);
  const [gridProgress, setGridProgress] = useState(0);
  const [chartProgress, setChartProgress] = useState(0);
  
  const modelGroupRef = useRef();
  const { theme } = useTheme();

  // Handle scroll locking
  useEffect(() => {
    if (interactionMode) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [interactionMode]);

  // Toggle interaction mode
  const handleToggleInteraction = async () => {
    if (interactionMode) {
        // Turning OFF - Revert sequence
        
        // 1. Clear selection
        onReset(); 
        
        // 2. Animate camera back to standard view (matches ScrollScene target)
        if (cameraControls) {
            await cameraControls.setLookAt(0, 1.5, 4, 0, 1.0, 0, true);
        }

        // 3. Unlock interaction
        setInteractionMode(false);
    } else {
        // Turning ON
        setInteractionMode(true);
    }
  };

  // Wrapper for selection to auto-enable interaction
  const handleSelectWrapper = (id) => {
    if (!interactionMode) setInteractionMode(true);
    onSelect(id);
  };

  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      const threshold = window.innerHeight * SCROLL_CONFIG.thresholdFactor;
      const progress = Math.min(scrollY / threshold, 1);
      
      const fadeProgress = getPhaseProgress(progress, SCROLL_CONFIG.phases.title);
      setTitleOpacity(1 - fadeProgress);

      // Chart Race Progress
      const chartP = getPhaseProgress(progress, SCROLL_CONFIG.phases.chartRace);
      setChartProgress(chartP);

      // Check if we are in the Single View Zone (Moved from ScrollScene)
      const inZone = progress > SCROLL_CONFIG.phases.singleView.start && progress < SCROLL_CONFIG.phases.singleView.end;
      setIsInScrollZone(inZone);
    };
    
    window.addEventListener('scroll', handleScroll, { passive: true });
    // Initial check
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handlePartDoubleClick = (id) => {
    handleSelectWrapper(id);
    setZoomLevel(2); 
  };

  // Visibility logic: Show UI if Interacting OR if in the view zone
  const showUI = interactionMode || isInScrollZone;

  return (
      <main className="relative w-full">
         
         {/* Tall Scroll Container */}
         <div style={{ height: `${SCROLL_CONFIG.containerHeightVh}vh` }} className="relative bg-app-bg transition-colors duration-200">
            
            {/* Intro Text / Hero Layer */}
            <div 
                style={{ opacity: titleOpacity }}
                className={`fixed top-0 left-0 w-full h-screen flex flex-col items-center justify-center pointer-events-none transition-opacity duration-0 z-20`}
            >
                <h1 className="text-6xl md:text-8xl font-black text-text-main tracking-tighter mb-4 text-center">
                    SNU<span className="text-brand">KDT</span>
                </h1>
                <p className="text-xl md:text-2xl text-text-muted font-light tracking-widest uppercase">
                    Cancer Visualization
                </p>
                <div className="absolute bottom-10 animate-bounce text-text-muted">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 14l-7 7m0 0l-7-7m7 7V3"></path></svg>
                </div>
            </div>

            {/* Sticky 3D Canvas */}
            <div className={`sticky top-0 h-screen w-full overflow-hidden transition-all duration-300 ${interactionMode ? 'pointer-events-auto' : 'pointer-events-none'}`}>
                <Canvas
                  shadows
                  dpr={[1, 2]} 
                  gl={{ alpha: true }}
                  camera={{ position: [0, 1.5, 12], fov: 45 }} 
                >
                  <ambientLight intensity={0.8} />
                  <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} intensity={1} castShadow />
                  <directionalLight position={[-5, 5, 5]} intensity={0.6} />
                  <Environment preset="city" />

                  <group 
                    ref={modelGroupRef} 
                    position={[0, -1, 0]} 
                    scale={[0, 0, 0]} // Initially hidden
                  >
                    <ErrorBoundary>
                      <Suspense fallback={<Loader />}>
                          <HumanModel 
                            theme={theme}
                            onPartSelect={(id) => { if(showUI) handleSelectWrapper(id); }}
                            onPartDoubleClick={(id) => { if(showUI) handlePartDoubleClick(id); }}
                            showWireframe={showWireframe}
                            onHoverChange={setHoveredPart}
                          />
                      </Suspense>
                    </ErrorBoundary>
                    <ContactShadows opacity={0.3} scale={10} blur={2.5} far={4} resolution={256} color="#000000" />
                  </group>

                  <PopulationGrid progress={gridProgress} />

                  <ScrollScene 
                    interactionMode={interactionMode} 
                    modelGroupRef={modelGroupRef}
                    setGridProgress={setGridProgress} 
                  />
                  
                  <CameraHandler 
                    isLocked={interactionMode}
                    selectedId={selectedId} 
                    zoomLevel={zoomLevel}
                    resetTrigger={resetTrigger}
                    onControlReady={setCameraControls}
                  />
                </Canvas>

                {/* UI Elements - Fade in when locked (Single View Only) */}
                <div className={`absolute inset-0 transition-opacity duration-500 pointer-events-none ${showUI ? 'opacity-100' : 'opacity-0'}`}>
                     <Overlay 
                        selectedId={selectedId} 
                        onSelect={handleSelectWrapper} 
                        onReset={handleToggleInteraction} 
                        showWireframe={showWireframe}
                        hoveredPart={hoveredPart}
                     />
                     <NavigationControls 
                        cameraControls={cameraControls} 
                        onReset={handleToggleInteraction} 
                        isInteracting={interactionMode}
                     />
                </div>
            </div>

            {/* Floating button helps user get to the zone where interaction is possible. 
                Hide it if we are already interacting. 
                Show it if we are NOT interacting AND NOT in the zone (so we need to scroll there).
                Wait, previous logic: "visible if NOT locked". Locked meant "In Zone".
                So Floating Button appears when you are NOT in the zone.
                If interactionMode is true, we are effectively "In Zone".
                So `!isInScrollZone && !interactionMode`?
                Actually previous code: `visible = !isLocked`.
                Here `isLocked` roughly maps to `isInScrollZone`.
                If I pass `interactionMode || isInScrollZone` as `isLocked` to the button, it will hide when in zone.
            */}
            <FloatingScrollButton isLocked={interactionMode || isInScrollZone} />

            {/* Chart Race Section Overlay */}
            <div 
                className={`fixed inset-0 pointer-events-none flex items-center justify-center z-30 transition-opacity duration-500 ${chartProgress > 0 && chartProgress < 1 ? 'opacity-100' : 'opacity-0'}`}
            >
                {/* Only render if relevant to save resources, or just use opacity */}
                {/* We keep it mounted but hidden to maintain state if desired, or unmount. Unmounting resets race? 
                    Actually standard ChartRace component will re-interpolate from current props. 
                    Let's keep it mounted to allow smooth scrolling back and forth. 
                */}
                <div className="pointer-events-auto">
                    <BarChartRace progress={chartProgress} visible={chartProgress > 0 && chartProgress < 1} />
                </div>
            </div>

         </div>
      </main>
  );
}