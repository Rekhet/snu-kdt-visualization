import React, { useRef, useEffect } from 'react';

const VideoSection = ({ progress, src, visible }) => {
  const videoRef = useRef(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    if (visible) {
      // Ensure it starts from beginning and plays
      video.currentTime = 0;
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

  // Smoother fade logic based on the 0-1 progress of this specific phase
  const opacity = progress < 0.1 
    ? progress * 10 
    : progress > 0.9 
    ? (1 - progress) * 10 
    : 1;

  return (
    <div 
      className={`fixed inset-0 flex items-center justify-center bg-black transition-opacity duration-500 pointer-events-none`}
      style={{ 
        opacity: visible ? Math.max(0, Math.min(1, opacity)) : 0,
        zIndex: 45, 
        visibility: (visible && opacity > 0.01) ? 'visible' : 'hidden'
      }}
    >
      <video
        ref={videoRef}
        src={src}
        muted
        loop
        playsInline
        autoPlay
        className="w-full h-full object-contain"
        style={{ backgroundColor: 'black' }}
      />
    </div>
  );
};

export default VideoSection;