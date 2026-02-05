import React from 'react';

const NavigationControls = ({ cameraControls, onReset, isInteracting }) => {
  if (!cameraControls) return null;

  const btnClass = "bg-panel-bg-blur hover:bg-panel-bg text-text-main p-3 rounded-xl shadow-lg backdrop-blur-md transition-all active:scale-95 border border-panel-border flex items-center justify-center w-12 h-12 sm:w-14 sm:h-14 cursor-pointer pointer-events-auto";
  const iconClass = "w-6 h-6 sm:w-7 sm:h-7";

  return (
    <div className="fixed bottom-10 left-8 z-[60] pointer-events-none">
        <button 
            className={`${btnClass} ${isInteracting ? 'bg-brand text-text-inverse hover:bg-brand-dark border-brand/20' : ''}`}
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
    </div>
  );
};

export default NavigationControls;