import React, { Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { Environment, ContactShadows, OrbitControls } from '@react-three/drei';
import HumanModel from '../../components/HumanModel';

/**
 * Design Labs: Single Theme Implementation
 * Theme: Modern Clinical (Teal & Amber)
 * This page serves as a focused showcase of a professional medical aesthetic.
 */
const LabsIndex = () => {
  return (
    <div className="flex-1 w-full min-h-screen bg-[#f8fafc] flex flex-col items-center justify-center relative overflow-hidden transition-colors duration-500">
      
      {/* Background 3D Showcase */}
      <div className="absolute inset-0 z-0">
        <Canvas camera={{ position: [0, 1.5, 4], fov: 45 }}>
          <ambientLight intensity={0.8} />
          <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} intensity={1} />
          <Environment preset="city" />
          <Suspense fallback={null}>
            <group position={[0, -1, 0]} scale={[1.2, 1.2, 1.2]}>
                <HumanModel 
                    // Simulating a data-driven state for the palette demo
                    prevalenceValue={25000} 
                />
            </group>
          </Suspense>
          <ContactShadows opacity={0.2} scale={10} blur={2.5} far={4} color="#2dd4bf" />
          <OrbitControls enableZoom={false} autoRotate autoRotateSpeed={0.5} />
        </Canvas>
      </div>

      {/* Hero Content Overlay */}
      <div className="z-10 text-center space-y-6 pointer-events-none p-6">
        <header className="space-y-2">
            <div className="inline-block px-3 py-1 bg-[#2dd4bf]/10 border border-[#2dd4bf]/20 rounded-full text-[10px] font-bold text-[#2dd4bf] uppercase tracking-[0.3em] mb-4 animate-pulse">
                Design Lab: Active
            </div>
            <h1 className="text-6xl md:text-8xl font-black tracking-tighter text-[#0f172a] drop-shadow-sm">
              MODERN<span className="text-[#2dd4bf]">CLINICAL</span>
            </h1>
        </header>

        <div className="flex items-center justify-center gap-4">
            <span className="h-px w-16 bg-[#2dd4bf]"></span>
            <p className="text-lg md:text-xl text-[#64748b] font-medium tracking-[0.2em] uppercase">
                Precision Health Visualization
            </p>
            <span className="h-px w-16 bg-[#2dd4bf]"></span>
        </div>

        <div className="pt-12 flex flex-col items-center gap-4">
            <div className="px-8 py-3 bg-[#f59e0b] text-white rounded-2xl text-sm font-bold shadow-2xl shadow-amber-200/50 uppercase tracking-widest transition-transform hover:scale-105 pointer-events-auto cursor-help" title="Visualizing 25% Prevalence">
                Prevalence Density: High
            </div>
            <p className="text-[10px] text-slate-400 font-mono uppercase tracking-widest">
                Palette: Teal #2dd4bf | Amber #f59e0b | Slate #f8fafc
            </p>
        </div>
      </div>

      {/* Navigation Hint */}
      <div className="absolute bottom-12 left-1/2 -translate-x-1/2 z-10 pointer-events-none opacity-30">
         <div className="flex flex-col items-center gap-2">
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Interactive Sample</span>
            <div className="w-px h-12 bg-gradient-to-b from-slate-400 to-transparent"></div>
         </div>
      </div>

    </div>
  );
};

export default LabsIndex;