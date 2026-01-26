import React, { Suspense } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Environment, useGLTF, Html, useProgress } from '@react-three/drei';
import { bodyPartsData } from '../data/bodyParts';

function Loader() {
  const { progress } = useProgress();
  return <Html center className="text-gray-400 font-mono text-xs tracking-wider uppercase animate-pulse">{progress.toFixed(0)}% Loading</Html>;
}

// Reusable component to load detailed models
// It expects models to be named exactly as their ID (e.g. 'heart.glb')
const DetailedModel = ({ id }) => {
  // We use error handling in the parent via ErrorBoundary, but useGLTF might fail if file missing
  // Ideally we catch this. For now, we assume files exist or will exist.
  // Note: user said they will bring the meshes.
  const { scene } = useGLTF(`/models/${id}.glb`);
  return <primitive object={scene} scale={2} />;
};

export default function OrganDetail() {
  const { organId } = useParams();
  const navigate = useNavigate();
  const partData = bodyPartsData.find(p => p.id === organId);

  if (!partData) {
    return <div className="p-10 text-center">Organ not found</div>;
  }

  return (
    <div className="w-full h-full flex flex-col bg-gray-900 text-white">
      
      {/* Header */}
      <div className="flex items-center justify-between px-6 py-4 bg-gray-800 border-b border-gray-700">
        <div className="flex items-center gap-4">
            <button 
                onClick={() => navigate('/')}
                className="flex items-center gap-2 text-gray-400 hover:text-white transition"
            >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path></svg>
                Back to Atlas
            </button>
            <h1 className="text-xl font-bold border-l border-gray-600 pl-4">{partData.label} Detail</h1>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 relative flex">
        
        {/* 3D View */}
        <div className="flex-1 relative bg-gradient-to-b from-gray-800 to-gray-900">
            <Canvas camera={{ position: [0, 0, 4], fov: 50 }}>
                <ambientLight intensity={0.5} />
                <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} intensity={1} />
                <Environment preset="studio" />
                <Suspense fallback={<Loader />}>
                   <DetailedModel id={organId} />
                </Suspense>
                <OrbitControls autoRotate autoRotateSpeed={0.5} />
            </Canvas>
            
            {/* Overlay hint if file missing (handled visually by empty canvas if fails, or error boundary) */}
            <div className="absolute bottom-4 left-4 text-xs text-gray-500 font-mono">
                Model Source: /models/{organId}.glb
            </div>
        </div>

        {/* Sidebar Info */}
        <div className="w-80 bg-gray-800 border-l border-gray-700 p-6 overflow-y-auto">
            <h2 className="text-2xl font-bold mb-2">{partData.label}</h2>
            <span className="inline-block bg-blue-900 text-blue-200 text-xs px-2 py-0.5 rounded-full mb-6 uppercase tracking-wider font-semibold">
                {partData.type}
            </span>
            
            <p className="text-gray-300 leading-relaxed mb-8 text-sm">
                {partData.description}
            </p>

            <div>
                <h3 className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-4">Common Pathologies</h3>
                <ul className="space-y-2">
                    {partData.diseases.map(d => (
                        <li key={d} className="flex items-start gap-2 text-sm text-gray-300">
                            <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-red-500 flex-shrink-0"></span>
                            {d}
                        </li>
                    ))}
                </ul>
            </div>
        </div>

      </div>
    </div>
  );
}
