import React, { useRef, useEffect } from 'react';

const VideoSection = ({ progress, src, visible }) => {
  const videoRef = useRef(null);
  const wasVisibleRef = useRef(false);

  useEffect(() => {
    if (!videoRef.current) return;

    if (visible && !wasVisibleRef.current) {
      // Reload and play when coming into view
      videoRef.current.currentTime = 0;
      videoRef.current.play().catch(err => console.log("Autoplay blocked or failed:", err));
    } else if (!visible && wasVisibleRef.current) {
      // Pause when going out of view to save resources
      videoRef.current.pause();
    }

    wasVisibleRef.current = visible;
  }, [visible]);

  if (!visible) return null;

  // Simple fade in/out based on progress
  const opacity = progress > 0 && progress < 0.1 
    ? progress * 10 
    : progress > 0.9 && progress < 1 
    ? (1 - progress) * 10 
    : 1;

  return (
    <div 
      className="fixed inset-0 z-20 flex items-center justify-center bg-black transition-opacity duration-300 pointer-events-none"
      style={{ opacity }}
    >
      <video
        ref={videoRef}
        src={src}
        muted
        loop
        playsInline
        className="w-full h-full object-contain"
      />
    </div>
  );
};

export default VideoSection;
