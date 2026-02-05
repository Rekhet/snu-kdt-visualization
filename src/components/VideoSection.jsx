import React, { useRef, useEffect, useState } from 'react';

const VideoSection = ({ progress, src, visible }) => {
  const videoRef = useRef(null);
  const [error, setError] = useState(null);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    if (visible) {
      // Try playing if it's not already playing
      if (video.paused) {
        video.play().catch(err => {
          console.error("Autoplay failed:", err);
          // Don't show error to user yet, might be transient
        });
      }
    } else {
      if (!video.paused) {
        video.pause();
      }
    }
  }, [visible]);

  // Fade out only at the very end of the phase (last 5%)
  const opacity = progress > 0.95 
    ? (1 - progress) * 20 
    : 1;

  return (
    <div 
      className="fixed top-16 inset-x-0 bottom-0 flex items-center justify-center bg-black transition-opacity duration-300 pointer-events-none"
      style={{ 
        opacity: visible ? Math.max(0, Math.min(1, opacity)) : 0,
        zIndex: 90, 
      }}
    >
      <video
        ref={videoRef}
        muted
        loop
        playsInline
        autoPlay
        onCanPlay={() => {
            console.log("Video is ready to play");
            setIsReady(true);
            setError(null);
        }}
        onError={(e) => {
            const errorMsg = `Video Error: ${videoRef.current?.error?.message || 'Unknown error'}`;
            console.error(errorMsg, e);
            setError(errorMsg);
        }}
        className="w-full h-full object-contain"
        style={{ 
            backgroundColor: '#000',
            border: '2px solid #fbbf24' 
        }}
      >
        <source src={src} type="video/mp4" />
      </video>
      
      {/* Debug Info Overlay */}
      <div className="absolute top-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 pointer-events-auto">
        {error && (
            <div className="bg-red-600 text-white px-4 py-2 rounded text-xs font-bold shadow-lg">
                {error} - Path: {src}
            </div>
        )}
        {!error && !isReady && visible && (
            <div className="bg-brand text-text-inverse px-4 py-2 rounded text-xs font-bold animate-pulse shadow-lg">
                Loading Video...
            </div>
        )}
        <div className="text-white/20 text-[10px] font-mono uppercase tracking-widest">
          {isReady ? 'Ready' : 'Not Ready'} | {src}
        </div>
      </div>
    </div>
  );
};

export default VideoSection;