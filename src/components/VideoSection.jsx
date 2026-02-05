import React, { useRef, useEffect, useState } from 'react';
import ReactPlayer from 'react-player';

const VideoSection = ({ progress, src, visible }) => {
  const playerRef = useRef(null);
  const [errorInfo, setErrorInfo] = useState(null);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    if (visible && playerRef.current) {
      // Seek to beginning when becoming visible
      playerRef.current.seekTo(0);
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
      <div className="w-full h-full">
        <ReactPlayer
          ref={playerRef}
          url={src}
          playing={visible}
          loop={true}
          muted={true}
          playsinline={true}
          width="100%"
          height="100%"
          style={{ objectFit: 'contain', backgroundColor: 'black' }}
          onReady={() => {
            console.log("[VideoSection] ReactPlayer Ready");
            setIsReady(true);
            setErrorInfo(null);
          }}
          onError={(err) => {
            console.error("[VideoSection] ReactPlayer Error:", err);
            setErrorInfo("Failed to load video source");
          }}
          onStart={() => console.log("[VideoSection] ReactPlayer Started")}
        />
      </div>
      
      {/* Debug Info Overlay */}
      <div className="absolute top-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 pointer-events-auto">
        {errorInfo && (
            <div className="bg-red-600 text-white px-4 py-2 rounded text-xs font-bold shadow-lg">
                Video Failure: {errorInfo}
            </div>
        )}
        {!errorInfo && !isReady && visible && (
            <div className="bg-brand text-text-inverse px-4 py-2 rounded text-xs font-bold animate-pulse shadow-lg">
                ReactPlayer: Initializing...
            </div>
        )}
        <div className="text-white/20 text-[10px] font-mono uppercase tracking-widest">
          {isReady ? 'READY' : 'WAITING'} | {typeof src === 'string' ? src : 'Blob/Asset'}
        </div>
      </div>
    </div>
  );
};

export default VideoSection;
