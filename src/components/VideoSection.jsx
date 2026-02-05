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
        zIndex: 90, // Extremely high z-index to stay above everything except header
      }}
    >
      <video
        ref={videoRef}
        muted
        loop
        playsInline
        autoPlay
        className="w-full h-full object-contain"
        style={{ backgroundColor: 'black' }}
      >
        <source src={src} type="video/mp4" />
        Your browser does not support the video tag.
      </video>
    </div>
  );
};

export default VideoSection;
