import React, { useRef, useEffect, useState } from 'react';

const VideoSection = ({ progress, src, visible }) => {
  const videoRef = useRef(null);
  const [errorInfo, setErrorInfo] = useState(null);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    if (visible) {
      if (video.paused) {
        video.play().catch(err => {
          console.warn("Autoplay attempt failed:", err);
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
        preload="auto"
        onCanPlay={() => {
            console.log("Video can play");
            setIsReady(true);
            setErrorInfo(null);
        }}
        onError={(e) => {
            const err = videoRef.current?.error;
            let codeMsg = "Unknown";
            if (err) {
                switch(err.code) {
                    case 1: codeMsg = "Aborted"; break;
                    case 2: codeMsg = "Network Error"; break;
                    case 3: codeMsg = "Decode Error"; break;
                    case 4: codeMsg = "Source Not Supported / Not Found"; break;
                    default: codeMsg = `Error Code: ${err.code}`;
                }
            }
            const info = `${codeMsg} (${src})`;
            console.error("Video element reported error:", info, e);
            setErrorInfo(info);
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
        {errorInfo && (
            <div className="bg-red-600 text-white px-4 py-2 rounded text-xs font-bold shadow-lg">
                Video Failure: {errorInfo}
            </div>
        )}
        {!errorInfo && !isReady && visible && (
            <div className="bg-brand text-text-inverse px-4 py-2 rounded text-xs font-bold animate-pulse shadow-lg">
                Requesting Video Asset...
            </div>
        )}
        <div className="text-white/20 text-[10px] font-mono uppercase tracking-widest">
          {isReady ? 'READY' : 'WAITING'} | {src}
        </div>
      </div>
    </div>
  );
};

export default VideoSection;
