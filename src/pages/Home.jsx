import React, { useState, useEffect, useRef, Suspense } from 'react';
import { Canvas, useThree, useFrame } from '@react-three/fiber';
import { CameraControls, Environment, ContactShadows, Html, useProgress } from '@react-three/drei';
import HumanModel from '../components/HumanModel';
import Overlay from '../components/Overlay';
import NavigationControls from '../components/NavigationControls';
import FloatingScrollButton from '../components/FloatingScrollButton';
import BarChartRace from '../components/BarChartRace';
import { PopulationGrid } from '../components/PopulationGrid';
import { survivalTimeSeries } from '../data/survivalTimeSeries';
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
    const revealP = getPhaseProgress(progress, SCROLL_CONFIG.phases.EVENT_MODEL_REVEAL);
    const revealScale = SCROLL_CONFIG.easing.smoothOut(revealP);

    // 3. Single View Interaction Zone
    // (Handled in Home component via scroll listener to avoid R3F state loop)
    
    // 4. Grid Expansion
    const gridP = getPhaseProgress(progress, SCROLL_CONFIG.phases.EVENT_GRID_EXPAND);
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
            // Look at chest level (1.2) for better visual centering
            camera.lookAt(0, 1.2, 0);
        }
    }

    // B. Hero Model Animation (Always runs so world reflects scroll state)
    if (modelGroupRef.current) {
        // Explicitly hide if not in reveal or later phases to prevent "remote point" flicker
        modelGroupRef.current.visible = revealP > 0;

        // Apply scale (revealScale handles 0->1, stays 1.0 during grid phase)
        // Keep at 1.0 during grid to match PopulationGrid's world scale (0.5)
        modelGroupRef.current.scale.set(revealScale, revealScale, revealScale);

        if (gridP > 0) {
            // Migrating to Grid Position (Y stays at -1, X/Z lerp to slot)
            modelGroupRef.current.position.lerpVectors(heroStartPos, heroGridPos, gridEase);
            
            // Reset rotation to face forward for grid
            modelGroupRef.current.rotation.y = 0;
        } else {
            // Intro Reveal State
            modelGroupRef.current.position.copy(heroStartPos);
            // Spin in based on reveal progress
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

  // Sync controls state when locking (Entering interaction mode)
  useEffect(() => {
    if (controlsRef.current) {
        if (isLocked) {
            controlsRef.current.setLookAt(
                camera.position.x, camera.position.y, camera.position.z,
                0, 1.2, 0,
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
      // Standard Reset - Center on chest
      controlsRef.current.setLookAt(0, 1.5, 4, 0, 1.2, 0, true);
    }
  }, [selectedId, zoomLevel, isLocked, scene, resetTrigger]);

  return (
    <CameraControls 
      ref={(node) => {
        if (node) {
          controlsRef.current = node;
          if (onControlReady) onControlReady(node);
        }
      }} 
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
        wheel: isLocked ? 16 : 0 // 16 is ACTION.DOLLY in camera-controls
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
  const [progress, setProgress] = useState(0);
  
  const [selectedYear, setSelectedYear] = useState(2007);
  const [selectedCancer, setSelectedCancer] = useState('stomach');

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
            await cameraControls.setLookAt(0, 1.5, 4, 0, 1.2, 0, true);
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
      const currentProgress = Math.min(scrollY / threshold, 1);
      setProgress(currentProgress);
      
      const fadeProgress = getPhaseProgress(currentProgress, SCROLL_CONFIG.phases.EVENT_TITLE);
      setTitleOpacity(1 - fadeProgress);

      // Chart Race Progress
      const chartP = getPhaseProgress(currentProgress, SCROLL_CONFIG.phases.EVENT_CHART_RACE);
      setChartProgress(chartP);

      // Check if we are in the Single View Zone (Moved from ScrollScene)
      const inZone = currentProgress > SCROLL_CONFIG.phases.EVENT_MODEL_INTERACT.start && currentProgress < SCROLL_CONFIG.phases.EVENT_MODEL_INTERACT.end;
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

  // The floating button should be hidden during the intro and chart race
  const isButtonHidden = progress < SCROLL_CONFIG.phases.EVENT_MODEL_REVEAL.start || interactionMode || isInScrollZone;

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

            {/* Sticky 3D Canvas - Aligned below header */}
            <div className={`sticky top-16 h-[calc(100vh-4rem)] w-full overflow-hidden transition-all duration-300 ${showUI ? 'pointer-events-auto' : 'pointer-events-none'}`}>
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
                            prevalenceValue={gridProgress > 0 ? (
                                survivalTimeSeries.data[selectedCancer]?.values[survivalTimeSeries.years.indexOf(selectedYear)] || 0
                            ) : null}
                          />
                      </Suspense>
                    </ErrorBoundary>
                    <ContactShadows opacity={0.3} scale={10} blur={2.5} far={4} resolution={256} color="#000000" />
                  </group>

                  <PopulationGrid 
                    progress={gridProgress} 
                    prevalenceValue={
                        survivalTimeSeries.data[selectedCancer]?.values[survivalTimeSeries.years.indexOf(selectedYear)] || 0
                    }
                  />

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
            </div>

            {/* Floating button helps user get to the zone where interaction is possible. */}
            <FloatingScrollButton isLocked={isButtonHidden} />

            {/* Grid Visualization Controls */}
            <div className={`fixed top-1/2 -translate-y-1/2 left-8 z-50 transition-opacity duration-500 pointer-events-auto flex flex-col gap-6 bg-panel-bg/90 backdrop-blur-md p-6 rounded-2xl border border-panel-border shadow-xl w-64 ${gridProgress > 0.8 ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
                <div>
                    <h3 className="text-sm font-bold text-text-muted uppercase tracking-wider mb-3">Cancer Type</h3>
                    <div className="relative">
                        <select 
                            value={selectedCancer}
                            onChange={(e) => setSelectedCancer(e.target.value)}
                            className="w-full appearance-none bg-input-bg border border-panel-border text-text-main rounded-lg px-4 py-2 text-sm focus:outline-none focus:border-brand transition-colors"
                        >
                            {Object.entries(survivalTimeSeries.data).map(([key, data]) => (
                                <option key={key} value={key}>{data.label}</option>
                            ))}
                        </select>
                        <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none text-text-muted">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                        </div>
                    </div>
                </div>

                <div>
                    <div className="flex justify-between items-center mb-3">
                        <h3 className="text-sm font-bold text-text-muted uppercase tracking-wider">Year</h3>
                        <span className="text-brand font-mono font-bold">{selectedYear}</span>
                    </div>
                    <input 
                        type="range" 
                        min={survivalTimeSeries.years[0]} 
                        max={survivalTimeSeries.years[survivalTimeSeries.years.length - 1]} 
                        step="1"
                        value={selectedYear}
                        onChange={(e) => setSelectedYear(Number(e.target.value))}
                        className="w-full h-2 bg-input-bg rounded-lg appearance-none cursor-pointer accent-brand"
                    />
                    <div className="flex justify-between text-[10px] text-text-muted mt-1 font-mono">
                        <span>{survivalTimeSeries.years[0]}</span>
                        <span>{survivalTimeSeries.years[survivalTimeSeries.years.length - 1]}</span>
                    </div>
                </div>

                <div className="border-t border-panel-border pt-4">
                    <div className="flex justify-between items-end">
                        <div>
                            <p className="text-xs text-text-muted mb-1">5-Year Prevalence</p>
                            <p className="text-2xl font-bold text-brand">
                                {survivalTimeSeries.data[selectedCancer]?.values[survivalTimeSeries.years.indexOf(selectedYear)]}
                                <span className="text-xs font-normal text-text-muted ml-1">/100k</span>
                            </p>
                        </div>
                        <div className="text-right">
                            <p className="text-xs text-text-muted mb-1">Percentage</p>
                            <p className="text-xl font-bold text-text-main">
                                {( (survivalTimeSeries.data[selectedCancer]?.values[survivalTimeSeries.years.indexOf(selectedYear)] || 0) / 1000 ).toFixed(2)}%
                            </p>
                        </div>
                    </div>
                </div>
                <p className="text-[10px] text-text-muted italic leading-tight">
                    1 human mesh = 1% of the population affected.
                </p>
            </div>

            {/* Interaction UI Overlay (Single View only) - Aligned below header */}
            <div 
                className={`fixed top-16 h-[calc(100vh-4rem)] w-full inset-x-0 pointer-events-none transition-opacity duration-500 z-40 ${showUI ? 'opacity-100' : 'opacity-0'}`}
            >
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

            {/* Chart Race Section Overlay - Aligned below header */}
            <div 
                style={{ 
                    opacity: chartProgress > 0 && chartProgress < 0.9 
                        ? 1 
                        : chartProgress >= 0.9 && chartProgress < 1 
                        ? (1 - chartProgress) * 10 
                        : 0 
                }}
                className={`fixed top-16 h-[calc(100vh-4rem)] w-full inset-x-0 pointer-events-none flex items-center justify-center z-30 transition-opacity duration-300`}
            >
                <div className="pointer-events-auto">
                    <BarChartRace progress={chartProgress} visible={chartProgress > 0 && chartProgress < 1} />
                </div>
            </div>

         </div>
      </main>
  );
}