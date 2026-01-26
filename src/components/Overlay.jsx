import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { bodyPartsData } from '../data/bodyParts';
import { useNavigate } from 'react-router-dom';

export default function Overlay({ selectedId, onSelect, onReset, showWireframe, onToggleWireframe, hoveredPart }) {
  const selectedPart = bodyPartsData.find(p => p.id === selectedId);
  const hoveredPartData = bodyPartsData.find(p => p.id === hoveredPart);
  const navigate = useNavigate();
  
  const tooltipRef = React.useRef(null);

  React.useEffect(() => {
    const handleMouseMove = (e) => {
      if (tooltipRef.current) {
        // Offset by 15px so it doesn't block the cursor
        tooltipRef.current.style.transform = `translate(${e.clientX + 15}px, ${e.clientY + 15}px)`;
      }
    };
    
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return (
    <div className="absolute inset-0 pointer-events-none flex flex-col justify-end p-6 z-10">
       
       {/* Custom Cursor Tooltip */}
       <div 
          ref={tooltipRef}
          className={`fixed top-0 left-0 pointer-events-none z-50 transition-opacity duration-200 ${hoveredPartData ? 'opacity-100' : 'opacity-0'}`}
       >
          <div className="bg-black/75 backdrop-blur-sm text-white text-xs font-medium px-3 py-1.5 rounded-lg shadow-lg border border-white/10 whitespace-nowrap">
            {hoveredPartData?.label || hoveredPart}
          </div>
       </div>

       {/* Info Card & Controls Container */}
       <div className="flex items-end justify-between w-full">
          
          {/* Controls / Hints */}
          <div className="flex flex-col gap-3 pointer-events-auto">
             <div className="flex items-center gap-2 text-gray-600 text-xs bg-white/80 px-4 py-2 rounded-full backdrop-blur-md border border-gray-200 shadow-sm">
                <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 15l-2 5L9 9l11 4-5 2zm0 0l5 5M7.188 2.239l.777 2.897M5.136 7.965l-2.898-.777M13.95 4.05l-2.122 2.122m-5.657 5.656l-2.12 2.122"></path></svg>
                <span>Rotate & Zoom to Explore</span>
             </div>
             
             <div className="flex gap-2">
                <button 
                  onClick={onReset}
                  className="group flex items-center gap-2 bg-white hover:bg-gray-50 text-gray-700 px-4 py-2 rounded-lg border border-gray-200 transition shadow-lg w-fit font-medium"
                >
                  <svg className="w-4 h-4 text-gray-400 group-hover:text-blue-500 transition" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path></svg>
                  Reset View
                </button>
             </div>
          </div>

          {/* Info Card - Slides up when active */}
          <AnimatePresence>
            {selectedPart && (
              <motion.div 
                initial={{ opacity: 0, y: 50, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 50, scale: 0.95 }}
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
                className="w-[28rem] bg-white/95 border border-blue-100 p-0 rounded-2xl backdrop-blur-xl shadow-2xl text-gray-800 overflow-hidden pointer-events-auto"
              >
                {/* Header */}
                <div className="bg-blue-50/50 px-6 py-4 border-b border-blue-100 flex justify-between items-start">
                    <div>
                        <h2 className="text-2xl font-bold text-gray-900">{selectedPart.label}</h2>
                        <span className="text-xs font-semibold text-blue-600 bg-blue-100 px-2 py-0.5 rounded-full uppercase tracking-wider">{selectedPart.type}</span>
                    </div>
                    <button onClick={() => onSelect(null)} className="text-gray-400 hover:text-gray-600 hover:bg-white rounded-full p-1 transition">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
                    </button>
                </div>

                {/* Content */}
                <div className="p-6">
                    <p className="text-gray-600 text-sm mb-6 leading-relaxed">
                    {selectedPart.description}
                    </p>

                    {/* Detailed Views Navigation */}
                    {selectedPart.details && selectedPart.details.length > 0 && (
                      <div className="mb-6">
                        <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3 flex items-center gap-2">
                            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
                            Explore Details
                        </h3>
                        <div className="flex flex-wrap gap-2">
                          {selectedPart.details.map(detailId => {
                            const detailPart = bodyPartsData.find(d => d.id === detailId);
                            if (!detailPart) return null;
                            return (
                              <button
                                key={detailId}
                                onClick={() => navigate(`/organ/${detailId}`)}
                                className="text-xs bg-blue-600 hover:bg-blue-700 text-white px-3 py-1.5 rounded-md shadow-sm transition font-medium flex items-center gap-1"
                              >
                                View {detailPart.label}
                                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path></svg>
                              </button>
                            )
                          })}
                        </div>
                      </div>
                    )}
                    
                    <div>
                        <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3 flex items-center gap-2">
                            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path></svg>
                            Associated Conditions
                        </h3>
                        <div className="flex flex-wrap gap-2">
                        {selectedPart.diseases.map(d => (
                            <span key={d} className="text-xs bg-gray-50 text-gray-700 px-3 py-1.5 rounded-md border border-gray-200 hover:border-blue-300 hover:bg-blue-50 hover:text-blue-700 transition cursor-default font-medium">
                            {d}
                            </span>
                        ))}
                        </div>
                    </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
       </div>
    </div>
  )
}
