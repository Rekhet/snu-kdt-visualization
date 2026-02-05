import React, { Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { Environment, ContactShadows, OrbitControls } from '@react-three/drei';
import HumanModel from '../../components/HumanModel';

// Theme 3: Deep Analytics (Porcelain & Deep Plum)
// Elegant, sophisticated, academic presentation feel.
const DeepAnalytics = () => {
  return (
    <div className="w-full h-screen bg-[#fdfcfb] flex flex-col items-center justify-center relative overflow-hidden">
      <div className="absolute inset-0 z-0">
        <Canvas camera={{ position: [0, 1.5, 4], fov: 45 }}>
          <ambientLight intensity={0.9} />
          <Environment preset="studio" />
          <Suspense fallback={null}>
            <group position={[0, -1, 0]} scale={[1.2, 1.2, 1.2]}>
                <HumanModel 
                    prevalenceValue={15000} // 15% affected
                />
            </group>
          </Suspense>
          <ContactShadows opacity={0.1} scale={10} blur={3} far={4} color="#701a75" />
          <OrbitControls enableZoom={false} autoRotate autoRotateSpeed={0.2} />
        </Canvas>
      </div>

      <div className="z-10 text-center space-y-8 pointer-events-none">
        <h1 className="text-6xl font-serif italic text-[#1e293b] border-b border-[#701a75]/20 pb-4">
          Deep <span className="text-[#701a75]">Analytics</span>
        </h1>
        <p className="text-sm text-[#94a3b8] font-medium tracking-[0.4em] uppercase max-w-xs mx-auto leading-relaxed">
            Advanced Epidemiological Research Platform
        </p>
        <div className="pt-4 flex justify-center">
            <div className="w-12 h-12 rounded-full border-2 border-[#701a75] flex items-center justify-center">
                <div className="w-2 h-2 bg-[#701a75] rounded-full"></div>
            </div>
        </div>
      </div>
    </div>
  );
};

export default DeepAnalytics;
