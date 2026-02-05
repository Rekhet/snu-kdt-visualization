import React, { Suspense } from "react";
import { Canvas } from "@react-three/fiber";
import { Environment, ContactShadows, OrbitControls } from "@react-three/drei";
import HumanModel from "../../components/HumanModel";

// Theme 2: Bio-Tech Lab (Slate & Electric Lime)
// Futuristic, high-tech, glowing interactive mannequin.
const BioTechLab = () => {
  return (
    <div className="w-full h-screen bg-[#020617] flex flex-col items-center justify-center relative overflow-hidden text-white">
      <div className="absolute inset-0 z-0 opacity-60">
        <Canvas camera={{ position: [0, 1.5, 4], fov: 45 }}>
          <ambientLight intensity={0.4} />
          <pointLight position={[10, 10, 10]} intensity={2} color="#84cc16" />
          <Environment preset="night" />
          <Suspense fallback={null}>
            <group position={[0, -1, 0]} scale={[1.2, 1.2, 1.2]}>
              <HumanModel
                prevalenceValue={45000} // 45% affected
              />
            </group>
          </Suspense>
          <ContactShadows
            opacity={0.5}
            scale={10}
            blur={2}
            far={4}
            color="#84cc16"
          />
          <OrbitControls enableZoom={false} autoRotate autoRotateSpeed={2} />
        </Canvas>
      </div>

      <div className="z-10 text-center space-y-4 pointer-events-none">
        <div className="inline-block border border-[#84cc16] px-3 py-1 rounded text-[10px] font-mono text-[#84cc16] uppercase tracking-[0.3em] mb-4">
          System Status: Active
        </div>
        <h1 className="text-8xl font-black tracking-widest text-white drop-shadow-[0_0_15px_rgba(132,204,22,0.3)]">
          BIO<span className="text-[#84cc16]">TECH</span>
        </h1>
        <p className="text-lg text-slate-400 font-light tracking-[0.5em] uppercase">
          Synthetic Diagnostics
        </p>
        <div className="flex justify-center gap-2 pt-10">
          {Array.from({ length: 5 }).map((_, i) => (
            <div
              key={i}
              className="w-2 h-2 bg-[#84cc16] animate-pulse"
              style={{ animationDelay: `${i * 0.2}s` }}
            ></div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default BioTechLab;
