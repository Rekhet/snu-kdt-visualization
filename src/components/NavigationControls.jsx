import React, { useRef } from 'react';
import * as THREE from 'three';

// Scalable Configuration
const CONFIG = {
  moveSpeed: 0.5,
  rotationAngle: Math.PI / 8, // 22.5 degrees
  animationDuration: 800,
  easing: (t) => 1 - Math.pow(1 - t, 4), // EaseOutQuart
};

const NavigationControls = ({ cameraControls, onReset, isInteracting }) => {
  const animFrameRef = useRef();

  if (!cameraControls) return null;

  const handleMove = (x, y) => {
    // Truck: x (left/right), y (up/down)
    cameraControls.truck(x * CONFIG.moveSpeed, y * CONFIG.moveSpeed, true);
  };

  const handleRotate = (angleDirection) => {
    // Cancel any ongoing rotation
    if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);

    // Rotation parameters
    const targetAngle = -angleDirection * CONFIG.rotationAngle;
    const startTime = performance.now();

    // Capture start state
    const startPos = new THREE.Vector3();
    const startTarget = new THREE.Vector3();
    cameraControls.getPosition(startPos);
    cameraControls.getTarget(startTarget);

    const animate = (currentTime) => {
      const elapsed = currentTime - startTime;
      let progress = elapsed / CONFIG.animationDuration;

      if (progress >= 1) {
        progress = 1;
      } else {
        animFrameRef.current = requestAnimationFrame(animate);
      }

      const easedProgress = CONFIG.easing(progress);
      const currentAngle = targetAngle * easedProgress;

      // Rotate start vectors by currentAngle around Y axis (0,0,0)
      const cos = Math.cos(currentAngle);
      const sin = Math.sin(currentAngle);

      // Rotate Position
      const newPosX = startPos.x * cos - startPos.z * sin;
      const newPosZ = startPos.x * sin + startPos.z * cos;

      // Rotate Target
      const newTargetX = startTarget.x * cos - startTarget.z * sin;
      const newTargetZ = startTarget.x * sin + startTarget.z * cos;

      // Apply update immediately
      cameraControls.setLookAt(
        newPosX, startPos.y, newPosZ,
        newTargetX, startTarget.y, newTargetZ,
        false
      );
    };

    animFrameRef.current = requestAnimationFrame(animate);
  };

  const handleZoom = (delta) => {
    const speed = 1.0;
    cameraControls.dolly(delta * speed, true);
  };

  const btnClass = "bg-panel-bg-blur hover:bg-panel-bg text-text-main p-2 rounded-lg shadow-lg backdrop-blur-sm transition-all active:scale-95 border border-panel-border flex items-center justify-center w-10 h-10 sm:w-11 sm:h-11 cursor-pointer";
  const containerClass = "bg-nav-bg p-2 rounded-xl backdrop-blur-sm border border-panel-border shadow-sm";
  const iconClass = "w-5 h-5 sm:w-6 sm:h-6";

  return (
    <div className="fixed bottom-20 left-6 flex flex-col items-center gap-3 z-[60] pointer-events-auto">
      
      {/* Directional Pad */}
      <div className={containerClass}>
        <div className="grid grid-cols-3 gap-1">
            <div />
            <button className={btnClass} onClick={() => handleMove(0, -1)} title="Pan Up">
            <svg className={iconClass} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12 19V5"/><path d="M5 12l7-7 7 7"/></svg>
            </button>
            <div />
            
            <button className={btnClass} onClick={() => handleMove(-1, 0)} title="Pan Left">
                <svg className={iconClass} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M19 12H5"/><path d="M12 19l-7-7 7-7"/></svg>
            </button>
            
            <button 
              className={`${btnClass} ${isInteracting ? 'bg-brand text-text-inverse hover:bg-brand-dark' : ''}`}
              onClick={onReset} 
              title={isInteracting ? "Reset / Exit Interaction" : "Enable Interaction"}
            >
                {isInteracting ? (
                    <svg className={iconClass} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
                        <path d="M3 3v5h5" />
                        <rect x="10" y="10" width="4" height="4" fill="currentColor" stroke="none" />
                    </svg>
                ) : (
                    <svg className={iconClass} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M18 11V6a2 2 0 0 0-2-2v0a2 2 0 0 0-2 2v0" />
                        <path d="M14 10V4a2 2 0 0 0-2-2v0a2 2 0 0 0-2 2v5" />
                        <path d="M10 10.5V6a2 2 0 0 0-2-2v0a2 2 0 0 0-2 2v8" />
                        <path d="M18 11a4 4 0 0 1-4 4h-6a4 4 0 0 1-4-4v-5" />
                    </svg>
                )}
            </button>
            
            <button className={btnClass} onClick={() => handleMove(1, 0)} title="Pan Right">
                <svg className={iconClass} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14"/><path d="M12 5l7 7-7 7"/></svg>
            </button>

            <div />
            <button className={btnClass} onClick={() => handleMove(0, 1)} title="Pan Down">
                <svg className={iconClass} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12 5v14"/><path d="M19 12l-7 7-7-7"/></svg>
            </button>
            <div />
        </div>
      </div>

      {/* Rotation & Zoom Controls */}
      <div className={`flex gap-2 ${containerClass}`}>
        <button className={btnClass} onClick={() => handleRotate(-1)} title="Rotate Left">
             <svg className={iconClass} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/><path d="M3 3v5h5"/></svg>
        </button>
        
        <button className={btnClass} onClick={() => handleZoom(-1)} title="Zoom Out">
             <svg className={iconClass} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14"/></svg>
        </button>
        <button className={btnClass} onClick={() => handleZoom(1)} title="Zoom In">
             <svg className={iconClass} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12 5v14"/><path d="M5 12h14"/></svg>
        </button>

        <button className={btnClass} onClick={() => handleRotate(1)} title="Rotate Right">
             <svg className={iconClass} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M21 12a9 9 0 1 1-9-9 9.75 9.75 0 0 1 6.74 2.74L21 8"/><path d="M21 3v5h-5"/></svg>
        </button>
      </div>
    </div>
  );
};

export default NavigationControls;
