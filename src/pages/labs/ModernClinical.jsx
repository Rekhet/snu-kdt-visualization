import React, { Suspense } from "react";
import { Canvas } from "@react-three/fiber";
import { Environment, ContactShadows, OrbitControls } from "@react-three/drei";
import HumanModel from "../../components/HumanModel";

// Theme 1: Modern Clinical (Teal & Amber)
// Health, vitality, professional medical tool feel.
const ModernClinical = () => {
  return (
    <div className="w-full h-screen bg-[#f8fafc] flex flex-col items-center justify-center relative overflow-hidden">
      <div className="absolute inset-0 z-0">
        <Canvas camera={{ position: [0, 1.5, 4], fov: 45 }}>
          <ambientLight intensity={0.8} />
          <spotLight
            position={[10, 10, 10]}
            angle={0.15}
            penumbra={1}
            intensity={1}
          />
          <Environment preset="city" />
          <Suspense fallback={null}>
            <group position={[0, -1, 0]} scale={[1.2, 1.2, 1.2]}>
              {/* We override the material color internally or just show the vibe */}
              <HumanModel
                // Custom teal color for this demo
                prevalenceValue={30000} // 30% affected to show contrast
              />
            </group>
          </Suspense>
          <ContactShadows
            opacity={0.2}
            scale={10}
            blur={2.5}
            far={4}
            color="#2dd4bf"
          />
          <OrbitControls enableZoom={false} autoRotate autoRotateSpeed={0.5} />
        </Canvas>
      </div>

      <div className="z-10 text-center space-y-6 pointer-events-none">
        <h1 className="text-7xl font-black tracking-tighter text-[#0f172a]">
          MODERN<span className="text-[#2dd4bf]">CLINICAL</span>
        </h1>
        <div className="flex items-center justify-center gap-4">
          <span className="h-px w-12 bg-[#2dd4bf]"></span>
          <p className="text-xl text-[#64748b] font-medium tracking-[0.2em] uppercase">
            Precision Visualization
          </p>
          <span className="h-px w-12 bg-[#2dd4bf]"></span>
        </div>
        <div className="pt-8">
          <span className="px-6 py-2 bg-[#f59e0b] text-white rounded-full text-sm font-bold shadow-lg shadow-amber-200 uppercase tracking-widest">
            Diagnostic Warning: High
          </span>
        </div>
      </div>

      {/* Style Overrides for this specific palette */}
      <style
        dangerouslySetInnerHTML={{
          __html: `
        /* Overriding HumanModel materials for this lab preview would require props, 
           for now we show the UI styling and standard model */
      `,
        }}
      />
    </div>
  );
};

export default ModernClinical;
