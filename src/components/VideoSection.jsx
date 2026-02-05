import React, { useRef, useEffect } from 'react';

const VideoSection = ({ progress, src, visible }) => {
  const videoRef = useRef(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    if (visible) {
      // Reload and play when coming into view
      video.load(); 
      const playPromise = video.play();
      if (playPromise !== undefined) {
        playPromise.catch(err => {
          console.warn("Video playback was interrupted or blocked:", err);
        });
      }
    } else {
      video.pause();
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
      {/* DEBUG PLACEHOLDER: Replace video with red box */}
      <div className="w-full h-full bg-red-600 flex flex-col items-center justify-center text-white p-10 text-center">
        <h2 className="text-4xl font-black mb-4">VIDEO DEBUG PLACEHOLDER</h2>
        <p className="text-xl">This red area represents the Video Section.</p>
        <p className="mt-2 font-mono bg-black/20 px-4 py-2 rounded">
            Visible: {visible ? 'TRUE' : 'FALSE'} | Progress: {progress.toFixed(2)}
        </p>
        
        {/* Hidden video element still exists for logic testing */}
        <video
            ref={videoRef}
            muted
            loop
            playsInline
            autoPlay
            className="hidden"
        >
            <source src={src} type="video/mp4" />
        </video>
      </div>
    </div>
  );
};

export default VideoSection;