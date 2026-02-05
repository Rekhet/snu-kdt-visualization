import React, { Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { Environment, ContactShadows, OrbitControls } from '@react-three/drei';
import HumanModel from '../../components/HumanModel';

/**
 * Design Labs: Single Theme Implementation
 * Theme: Bio-Tech Lab (Indigo & Electric Lime)
 * This page serves as a futuristic, digital-twin aesthetic showcase.
 */
const LabsIndex = () => {
  return (
    <div className="flex-1 w-full min-h-screen bg-[#020617] flex flex-col items-center justify-center relative overflow-hidden transition-colors duration-500 text-white">
      
      {/* Background 3D Showcase */}
      <div className="absolute inset-0 z-0 opacity-80">
        <Canvas camera={{ position: [0, 1.5, 4], fov: 45 }}>
          <ambientLight intensity={0.4} />
          <pointLight position={[10, 10, 10]} intensity={2} color="#84cc16" />
          <Environment preset="night" />
          <Suspense fallback={null}>
            <group position={[0, -1, 0]} scale={[1.2, 1.2, 1.2]}>
                <HumanModel 
                    // Simulating a high-tech data state
                    prevalenceValue={40000} // 40% affected
                />
            </group>
          </Suspense>
          <ContactShadows opacity={0.4} scale={10} blur={2} far={4} color="#84cc16" />
          <OrbitControls enableZoom={false} autoRotate autoRotateSpeed={1.5} />
        </Canvas>
      </div>

      {/* Hero Content Overlay */}
      <div className="z-10 text-center space-y-4 pointer-events-none p-6">
        <header className="space-y-4">
            <div className="inline-block border border-[#84cc16]/50 px-4 py-1.5 rounded-sm text-[10px] font-mono text-[#84cc16] uppercase tracking-[0.4em] mb-6 bg-[#84cc16]/5 backdrop-blur-sm animate-pulse">
                Bio-Tech Core: Operating
            </div>
            <h1 className="text-7xl md:text-9xl font-black tracking-[0.15em] text-white drop-shadow-[0_0_20px_rgba(132,204,22,0.4)] uppercase">
              BIO<span className="text-[#84cc16]">TECH</span>
            </h1>
        </header>

        <div className="flex flex-col items-center gap-2">
            <p className="text-sm md:text-base text-slate-400 font-light tracking-[0.6em] uppercase">
                Synthetic Diagnostic Interface
            </p>
            <div className="w-32 h-px bg-gradient-to-r from-transparent via-[#84cc16] to-transparent mt-4 opacity-50"></div>
        </div>

        <div className="pt-16 flex flex-col items-center gap-6">
            <div className="flex gap-1.5">
                {Array.from({length: 8}).map((_, i) => (
                    <div 
                        key={i} 
                        className="w-1.5 h-1.5 bg-[#84cc16] shadow-[0_0_8px_#84cc16]" 
                        style={{ animation: `pulse 2s infinite ${i * 0.1}s` }}
                    ></div>
                ))}
            </div>
            <div className="px-6 py-2 border border-[#84cc16] text-[#84cc16] rounded-sm text-[10px] font-mono uppercase tracking-[0.2em] pointer-events-auto cursor-crosshair hover:bg-[#84cc16] hover:text-[#020617] transition-all duration-300">
                Data Stream: 40.0% P-Density
            </div>
        </div>
      </div>

      {/* Technical HUD Elements */}
      <div className="absolute top-24 left-12 z-10 pointer-events-none opacity-20 hidden md:block">
         <div className="font-mono text-[8px] space-y-1 text-[#84cc16]">
            <p>REL_SYS_GRID_INIT: OK</p>
            <p>MESH_VTX_COUNT: 42,891</p>
            <p>SHDR_GLOW_INT: 0.85</p>
            <p>PREV_VAL_NORMALIZED: 0.400</p>
         </div>
      </div>

      <div className="absolute bottom-12 right-12 z-10 pointer-events-none opacity-20 hidden md:block text-right">
         <div className="font-mono text-[8px] space-y-1 text-[#84cc16]">
            <p>TERM_SEC_ENCR: AES-256</p>
            <p>LATENCY_MS: 12.4</p>
            <p>LAB_ENV_V: 2.4.0-STABLE</p>
         </div>
      </div>

      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes pulse {
            0%, 100% { opacity: 0.3; transform: scale(0.8); }
            50% { opacity: 1; transform: scale(1.2); }
        }
      `}} />

    </div>
  );
};

export default LabsIndex;
